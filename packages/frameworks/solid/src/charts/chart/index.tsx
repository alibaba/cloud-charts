import { createMemo, createSignal, createEffect, Show, type JSX } from 'solid-js';
import type { ChartRuntimeContext, ChartSpec, G2RenderTarget, G2SpecRenderer, LegendItem } from '@alicloud/cloud-charts-core';
import {
  extractLegendItems,
  normalizeAxis,
  normalizeLegend,
  normalizeTooltip,
  registerLegacyInteractions,
  resolveColorRange,
  resolveTheme,
} from '@alicloud/cloud-charts-core';
import { createChartPrimitive } from '../../primitives/createChart';
import { useChartProvider } from '../../provider/index';
import { ChartStateOverlay } from '../../state/ChartStateOverlay';
import { FoldableLegend } from '../../components/legends/index';

export interface ChartProps<TChart extends G2RenderTarget = G2RenderTarget> {
  spec: ChartSpec;
  kind?: 'bar' | 'line' | 'pie';
  legendValueMap?: Record<string, unknown>;
  renderer?: G2SpecRenderer<TChart>;
  event?: Record<string, (...args: unknown[]) => unknown>;
  interaction?: Record<string, unknown>;
  getChartInstance?: (chart: TChart | null) => void;
  chartRef?: { current: TChart | null };
  context?: ChartRuntimeContext;
  height?: number | string;
  width?: number | string;
  style?: JSX.CSSProperties;
  language?: string;
  theme?: string;
  loading?: boolean;
  empty?: boolean;
  error?: boolean;
  loadingInfo?: JSX.Element;
  emptyInfo?: JSX.Element;
  errorInfo?: JSX.Element;
}

registerLegacyInteractions();

function inferSpecKind(spec: ChartSpec): ChartProps['kind'] {
  if ((spec.coordinate as { type?: unknown } | undefined)?.type === 'theta') return 'pie';
  if (spec.type === 'line') return 'line';
  if (spec.type === 'interval') return 'bar';
  const childTypes = Array.isArray(spec.children) ? spec.children.map((child) => child.type) : [];
  if (childTypes.includes('line')) return 'line';
  if (childTypes.includes('interval')) return spec.coordinate ? 'pie' : 'bar';
  return undefined;
}

function usesColorEncoding(spec: ChartSpec): boolean {
  if (spec.encode && Object.prototype.hasOwnProperty.call(spec.encode, 'color')) return true;
  return Array.isArray(spec.children) && spec.children.some(usesColorEncoding);
}

function inheritColorScale(rawScale: Record<string, unknown>, token: Parameters<typeof resolveColorRange>[1]): Record<string, unknown> {
  const rawColorScale = typeof rawScale.color === 'object' && rawScale.color
    ? rawScale.color as Record<string, unknown>
    : {};
  if (Array.isArray(rawColorScale.range)) return rawScale;
  const colorRange = resolveColorRange(undefined, token);
  if (!colorRange) return rawScale;
  return {
    ...rawScale,
    color: {
      ...rawColorScale,
      range: colorRange,
    },
  };
}

/**
 * Whether this spec should use a DOM-based FoldableLegend instead of G2 canvas legend.
 * All Cartesian charts (line/bar) default to DOM legend; pie keeps canvas legend.
 */
function shouldUseDomLegend(spec: ChartSpec, kind?: ChartProps['kind']): boolean {
  if (spec.legend === false) return false;
  const effectiveKind = kind ?? inferSpecKind(spec);
  return effectiveKind !== 'pie' && effectiveKind !== undefined;
}

function inheritSpecDefaults(
  rawSpec: ChartSpec,
  themeName?: string,
  kind?: ChartProps['kind'],
  legendValueMap?: Record<string, unknown>,
): ChartSpec {
  const theme = resolveTheme(themeName);
  const effectiveKind = kind ?? inferSpecKind(rawSpec);
  const useDom = shouldUseDomLegend(rawSpec, kind);
  const next: ChartSpec = {
    ...rawSpec,
    theme: rawSpec.theme ?? theme.g2Theme,
  };

  const rawScale = typeof rawSpec.scale === 'object' && rawSpec.scale ? rawSpec.scale as Record<string, unknown> : {};
  const scaleWithThemeColor = usesColorEncoding(rawSpec) ? inheritColorScale(rawScale, theme.token) : rawScale;

  if (effectiveKind !== 'pie') {
    const rawYScale = typeof scaleWithThemeColor.y === 'object' && scaleWithThemeColor.y ? scaleWithThemeColor.y as Record<string, unknown> : {};
    next.scale = {
      ...scaleWithThemeColor,
      y: { type: 'linear', nice: true, ...rawYScale },
    };
  } else if (scaleWithThemeColor !== rawScale) {
    next.scale = scaleWithThemeColor;
  }

  if (rawSpec.axis !== false) {
    const axis = typeof rawSpec.axis === 'object' && rawSpec.axis ? (rawSpec.axis as Record<string, unknown>) : {};
    const rawX = axis.x as Record<string, unknown> | false | undefined;
    const rawY = axis.y as Record<string, unknown> | false | undefined;
    next.axis = {
      ...axis,
      x: rawX === false
        ? false
        : {
            ...normalizeAxis(rawX, { field: 'x', token: theme.token }),
            ...(typeof rawX === 'object' && rawX ? rawX : {}),
          },
      y: rawY === false
        ? false
        : {
            ...normalizeAxis(rawY, { field: 'y', defaultGrid: true, token: theme.token }),
            ...(typeof rawY === 'object' && rawY ? rawY : {}),
          },
    };
  }

  if (useDom) {
    // Cartesian charts: disable G2 canvas legend, use DOM FoldableLegend
    next.legend = false;

    // For single-series Cartesian charts without color encoding,
    // add a synthetic color encoding so the legend shows with proper theme color.
    // This also ensures the chart line/bar uses the theme's first color.
    if (!usesColorEncoding(rawSpec)) {
      const colorRange = resolveColorRange(undefined, theme.token);
      const firstColor = Array.isArray(colorRange) ? colorRange[0] : '#5B8FF9';
      const yField = typeof rawSpec.encode?.y === 'string' ? rawSpec.encode.y : '系列1';
      next.encode = { ...next.encode, color: () => yField };
      const rawColorScale = typeof (next.scale as Record<string, unknown>)?.color === 'object'
        ? (next.scale as Record<string, unknown>).color as Record<string, unknown>
        : {};
      next.scale = {
        ...(next.scale as Record<string, unknown> || {}),
        color: { ...rawColorScale, range: [firstColor] },
      };
    }
  } else if (rawSpec.legend !== false) {
    // Pie or unknown: keep G2 canvas legend
    const rawLegend = typeof rawSpec.legend === 'object' && rawSpec.legend ? rawSpec.legend as Record<string, unknown> : undefined;
    const defaultLegend = effectiveKind === 'pie'
      ? { position: 'right', align: '', showData: true, ...(rawLegend || {}) }
      : { align: 'left', ...(rawLegend || {}) };
    const legend = normalizeLegend(defaultLegend, theme.token, {
      marker: effectiveKind === 'pie' ? 'circle' : effectiveKind === 'bar' ? 'square' : 'hyphen',
      valueMap: legendValueMap,
    });
    const colorLegend = rawLegend && typeof rawLegend.color === 'object' && rawLegend.color
      ? { ...(legend.spec as Record<string, unknown>), ...(rawLegend.color as Record<string, unknown>) }
      : legend.spec;
    next.legend = legend.spec === false ? false : { ...(rawLegend || {}), color: colorLegend };
  }

  if (rawSpec.tooltip !== false) {
    const rawTooltip = typeof rawSpec.tooltip === 'object' && rawSpec.tooltip ? rawSpec.tooltip as Record<string, unknown> : undefined;
    const tooltip = normalizeTooltip(rawTooltip ? { ...rawTooltip, themeToken: theme.token } : { themeToken: theme.token });
    const tooltipSpec = (rawTooltip
      ? { ...(tooltip.spec as Record<string, unknown>), ...rawTooltip }
      : tooltip.spec) as Record<string, unknown>;
    // Ensure `items` is present so G2 v5 treats this as a full tooltip config
    // (isFullTooltip requires title or items). Without it, G2 wraps the entire
    // object as a single tooltip item, losing name/value rendering.
    // Empty items triggers MaybeTooltip to auto-generate from encode channels.
    if (tooltipSpec !== false && !Object.prototype.hasOwnProperty.call(tooltipSpec, 'items')) {
      tooltipSpec.items = [];
    }
    next.tooltip = tooltipSpec;
  }

  return next;
}

export function Chart<TChart extends G2RenderTarget = G2RenderTarget>(props: ChartProps<TChart>): JSX.Element {
  const provider = useChartProvider();
  let ref: HTMLDivElement | undefined;

  const fullContext = createMemo<ChartRuntimeContext>(() => {
    const language = props.language ?? props.context?.language ?? provider.locale;
    const themeName = props.theme ?? props.context?.theme ?? provider.theme;
    return {
      ...props.context,
      language,
      theme: themeName,
    };
  });

  const useDom = createMemo(() => shouldUseDomLegend(props.spec, props.kind));

  const spec = createMemo(() => inheritSpecDefaults(props.spec, fullContext().theme, props.kind, props.legendValueMap));
  const chartInstance = createChartPrimitive(() => ref, spec, {
    renderer: props.renderer,
    event: props.event,
    interaction: props.interaction,
    getChartInstance: props.getChartInstance,
    chartRef: props.chartRef,
  });

  // Extract legend items from chart instance after render
  const [legendItems, setLegendItems] = createSignal<LegendItem[]>([]);

  createEffect(() => {
    const instance = chartInstance();
    const s = spec();
    const isDom = useDom();
    // Track spec data reference to re-extract when data changes
    const _dataRef = s?.data;
    if (!instance || !s || !isDom) {
      setLegendItems([]);
      return;
    }

    const chart = instance.getChartInstance();
    if (!chart) return;

    // Use rAF to ensure chart has finished rendering
    requestAnimationFrame(() => {
      const items = extractLegendItems(chart);
      if (items.length === 0) {
        // Single-series without color encoding: create synthetic legend item
        const theme = resolveTheme(fullContext().theme);
        const colorRange = resolveColorRange(undefined, theme.token);
        const synthColor = Array.isArray(colorRange) ? colorRange[0] : '#5B8FF9';
        const yField = typeof s.encode?.y === 'string' ? s.encode.y : '系列1';
        setLegendItems([{ name: yField, color: synthColor }]);
      } else {
        setLegendItems(items);
      }
    });
  });

  const state = () => {
    if (props.loading) return 'loading' as const;
    if (props.error) return 'error' as const;
    if (props.empty) return 'empty' as const;
    return 'normal' as const;
  };

  const wrapperHeight = (): number => {
    if (typeof props.height === 'number') return props.height;
    return 300;
  };

  const wrapperWidth = (): number => {
    if (typeof props.width === 'number') return props.width;
    return ref?.clientWidth ?? 400;
  };

  const wrapperStyle = (): JSX.CSSProperties => ({
    position: 'relative',
    width: typeof props.width === 'number' ? `${props.width}px` : (props.width ?? '100%'),
    height: typeof props.height === 'number' ? `${props.height}px` : (props.height ?? '300px'),
    display: 'flex',
    'flex-direction': 'column',
    ...props.style,
  });

  const effectiveKind = () => props.kind ?? inferSpecKind(props.spec);
  const markerType = (): 'hyphen' | 'square' | 'circle' => {
    const k = effectiveKind();
    if (k === 'bar') return 'square';
    if (k === 'pie') return 'circle';
    return 'hyphen';
  };

  return (
    <div style={wrapperStyle()}>
      <div ref={ref} style={{ width: '100%', flex: '1', 'min-height': '0' }} />
      <ChartStateOverlay
        state={state()}
        loadingInfo={props.loadingInfo}
        emptyInfo={props.emptyInfo}
        errorInfo={props.errorInfo}
        context={fullContext()}
      />
      <Show when={useDom() && legendItems().length > 0 && state() === 'normal'}>
        <FoldableLegend
          items={legendItems()}
          chart={chartInstance()?.getChartInstance()}
          originalSpec={spec() as Record<string, unknown>}
          containerWidth={wrapperWidth()}
          containerHeight={wrapperHeight()}
          legendField="color"
          clickable={true}
          hoverable={true}
          markerType={markerType()}
        />
      </Show>
    </div>
  );
}
