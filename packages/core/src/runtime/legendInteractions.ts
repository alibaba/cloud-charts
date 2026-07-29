/**
 * Legend interaction utilities for G2 v5 chart instances.
 *
 * These functions provide the equivalent of the old G2 v4 `filterLegend`,
 * `highlightLegend`, and `clearHighlight` from `src/common/chartRefs.ts`,
 * adapted to work with G2 v5's API.
 */

export interface LegendItem {
  name: string;
  color?: string;
  value?: unknown;
  [key: string]: unknown;
}

// ── Type helpers for duck-typing the G2 v5 chart instance ─────────────

type G2Scale = {
  getOptions?: () => Record<string, unknown>;
  invert?: (value: unknown) => unknown;
};

type G2DisplayObject = {
  __data__?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  childNodes?: G2DisplayObject[];
  children?: G2DisplayObject[];
  className?: string;
  style?: Record<string, unknown>;
};

type G2ChartLike = {
  getScaleByChannel?: (channel: string) => G2Scale | undefined;
  options?: (...args: unknown[]) => unknown;
  render?: () => unknown;
  getContext?: () => { canvas?: { getRoot?: () => G2DisplayObject } };
};

// ── DOM tree walk helpers (ported from legacyInteractions.ts) ──────────

function getClassName(displayObject: G2DisplayObject): string {
  return String(
    displayObject.className ||
    displayObject.attributes?.className ||
    displayObject.attributes?.class ||
    '',
  );
}

function hasClassName(displayObject: G2DisplayObject, className: string): boolean {
  return getClassName(displayObject).split(/\s+/).includes(className);
}

function findAllByClassName(root: G2DisplayObject, className: string): G2DisplayObject[] {
  const results: G2DisplayObject[] = [];
  const visit = (node: G2DisplayObject) => {
    if (hasClassName(node, className)) {
      results.push(node);
    }
    const children = node.childNodes || node.children || [];
    children.forEach(visit);
  };
  visit(root);
  return results;
}

// ── Data filtering helpers ────────────────────────────────────────────

/**
 * Extract the color field name from a mark node's encode.
 * Handles both spec format (encode: { color: 'metric' }) and
 * internal format (encode: { color: { field: 'metric' } }).
 */
function getColorField(node: Record<string, unknown>): string | null {
  const encode = node.encode as Record<string, unknown> | undefined;
  if (!encode?.color) return null;

  // Spec format: encode: { color: 'metric' }
  if (typeof encode.color === 'string') return encode.color;

  // Internal format: encode: { color: { field: 'metric', value: [...] } }
  if (typeof encode.color === 'object' && encode.color !== null) {
    const colorEncode = encode.color as Record<string, unknown>;
    if (typeof colorEncode.field === 'string') return colorEncode.field;
    // Sometimes the field is in the data directly
    if (Array.isArray(colorEncode.value) && colorEncode.value.length > 0) {
      // Can't determine field name from values alone
      return null;
    }
  }

  return null;
}

/**
 * Walk the spec/options tree and filter data in mark nodes that have
 * the given color encoding channel.
 *
 * @param node - The spec node (could be view, mark, or composition)
 * @param colorField - The data field used for color encoding
 * @param selectedValues - Values to KEEP (not filter out)
 * @param allValues - All original values (for preserving scale domain)
 * @param isAllSelected - Whether all values are selected (no filtering needed)
 */
function walkAndFilterData(
  node: Record<string, unknown>,
  colorField: string | null,
  selectedValues: unknown[],
  allValues: unknown[],
  isAllSelected: boolean,
): Record<string, unknown> {
  // Handle children array (spec/optionsOf format)
  if (Array.isArray(node.children)) {
    return {
      ...node,
      children: (node.children as Record<string, unknown>[]).map((child) =>
        walkAndFilterData(child, colorField, selectedValues, allValues, isAllSelected),
      ),
    };
  }

  // Handle marks array (internal format)
  if (Array.isArray(node.marks)) {
    return {
      ...node,
      marks: (node.marks as Record<string, unknown>[]).map((mark) =>
        walkAndFilterData(mark, colorField, selectedValues, allValues, isAllSelected),
      ),
    };
  }

  // Leaf mark node - filter data if it has color encoding
  const field = colorField || getColorField(node);
  if (!field) return node;

  const data = node.data;
  if (!Array.isArray(data)) return node;

  // If all selected, restore original data (no filtering)
  if (isAllSelected) {
    // Just ensure scale domain is preserved
    const scale = typeof node.scale === 'object' && node.scale
      ? node.scale as Record<string, unknown>
      : {};
    const colorScale = typeof scale.color === 'object' && scale.color
      ? scale.color as Record<string, unknown>
      : {};
    // Only set domain if scale.color already exists
    if (Object.keys(colorScale).length > 0 || scale.color !== undefined) {
      return {
        ...node,
        scale: {
          ...scale,
          color: { ...colorScale, domain: allValues },
        },
      };
    }
    return node;
  }

  // Filter data to only include rows where the color field value is selected
  const selectedSet = new Set(selectedValues.map(String));
  const filteredData = data.filter((row) => {
    if (typeof row === 'object' && row !== null) {
      const value = (row as Record<string, unknown>)[field];
      return selectedSet.has(String(value));
    }
    return true;
  });

  // Preserve color scale domain to maintain color mapping
  const scale = typeof node.scale === 'object' && node.scale
    ? node.scale as Record<string, unknown>
    : {};
  const colorScale = typeof scale.color === 'object' && scale.color
    ? scale.color as Record<string, unknown>
    : {};

  return {
    ...node,
    data: filteredData,
    scale: {
      ...scale,
      color: { ...colorScale, domain: allValues },
    },
  };
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Extract legend items from a G2 v5 chart instance.
 * Reads the color scale's domain (names) and range (colors).
 */
export function extractLegendItems(chart: unknown): LegendItem[] {
  const c = chart as G2ChartLike;
  const colorScale = c?.getScaleByChannel?.('color');
  if (!colorScale) return [];

  const opts = colorScale.getOptions?.();
  if (!opts) return [];

  const domain = (opts.domain as unknown[]) ?? [];
  const range = (opts.range as string[]) ?? [];

  return domain.map((name, i) => ({
    name: String(name),
    color: range[i] ?? range[0],
  }));
}

/**
 * Filter chart data by selected legend values.
 *
 * This function filters the data directly in the spec (rather than using
 * G2's filter transform) because chart.options() returns a serialized
 * internal format that doesn't reliably accept filter transforms when
 * passed back.
 *
 * @param chart - G2 v5 chart instance
 * @param channel - Color channel field name (typically 'color')
 * @param selectedValues - Values to KEEP (not filter out)
 * @param originalSpec - The original spec to filter from (stored by caller)
 */
export function filterChartByValues(
  chart: unknown,
  channel: string,
  selectedValues: unknown[],
  originalSpec?: Record<string, unknown>,
): void {
  const c = chart as G2ChartLike;
  if (!c?.options) return;

  // Get the color scale to find the field name and all values
  const colorScale = c?.getScaleByChannel?.(channel);
  const scaleOpts = colorScale?.getOptions?.();
  const allValues = (scaleOpts?.domain as unknown[]) ?? [];
  const colorField = (scaleOpts?.field as string) ?? null;

  if (allValues.length === 0) return;

  const isAllSelected = selectedValues.length === allValues.length;

  // Use original spec if provided, otherwise get current options
  const baseSpec = originalSpec ?? (c.options() as Record<string, unknown>);
  if (!baseSpec || typeof baseSpec !== 'object') return;

  const updated = walkAndFilterData(
    baseSpec,
    colorField,
    selectedValues,
    allValues,
    isAllSelected,
  );

  c.options(updated);
  c.render?.();
}

/**
 * Highlight chart elements by legend value.
 * Sets opacity on elements that don't match the highlighted value.
 * Pass `null` as value to clear highlight.
 */
export function highlightChartByValue(
  chart: unknown,
  channel: string,
  value: unknown | null,
): void {
  const c = chart as G2ChartLike;
  const context = c?.getContext?.();
  const root = context?.canvas?.getRoot?.();
  if (!root) return;

  const elements = findAllByClassName(root, 'element');
  const scale = c?.getScaleByChannel?.(channel);

  elements.forEach((element) => {
    const encodedValue = element.__data__?.[channel];
    const elementValue = scale?.invert?.(encodedValue) ?? encodedValue;

    if (value === null) {
      element.style = { ...(element.style || {}), opacity: 1 };
    } else {
      element.style = {
        ...(element.style || {}),
        opacity: elementValue === value ? 1 : 0.25,
      };
    }
  });
}

/**
 * Clear all highlight from chart elements.
 */
export function clearChartHighlight(chart: unknown): void {
  highlightChartByValue(chart, '', null);
}
