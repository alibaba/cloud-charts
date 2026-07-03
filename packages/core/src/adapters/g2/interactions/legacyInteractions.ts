import * as G2 from '@antv/g2';
import { registerLegacyRectZoomInteraction } from './legacyRectZoom';

type G2Register = (type: string, component: unknown) => void;

type G2DisplayObject = {
  __data__?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  childNodes?: G2DisplayObject[];
  children?: G2DisplayObject[];
  className?: string;
  ownerDocument?: { createElement?: (tagName: string) => G2DisplayObject };
  parentNode?: G2DisplayObject;
  style?: Record<string, unknown>;
  addEventListener?: (eventName: string, listener: (event: G2PointerEvent) => void) => void;
  appendChild?: (child: G2DisplayObject) => void;
  getBBox?: () => { width: number; height: number };
  getRenderBounds?: () => { min: [number, number]; max: [number, number] };
  querySelector?: (selector: string) => G2DisplayObject | null;
  remove?: () => void;
  removeEventListener?: (eventName: string, listener: (event: G2PointerEvent) => void) => void;
};

type G2PointerEvent = {
  ctrlKey?: boolean;
  metaKey?: boolean;
  nativeEvent?: boolean;
  offsetX?: number;
  offsetY?: number;
  stopPropagation?: () => void;
  target?: G2DisplayObject;
  timeStamp?: number;
};

type G2InteractionTarget = {
  container: G2DisplayObject;
  options: Record<string, unknown>;
  update: () => Promise<unknown>;
  setState: (name: unknown, updater?: (options: Record<string, unknown>) => Record<string, unknown>) => void;
  view: {
    scale?: Record<string, { getOptions?: () => { domain?: unknown[] }; invert?: (value: unknown) => unknown }>;
  };
};

type G2InteractionEmitter = {
  emit: (eventName: string, event: unknown) => void;
  off?: (eventName: string, listener: (event: G2EmitterEvent) => void) => void;
  on?: (eventName: string, listener: (event: G2EmitterEvent) => void) => void;
};

type G2EmitterEvent = {
  nativeEvent?: boolean;
  data?: Record<string, unknown>;
  target?: G2DisplayObject;
};

type LegendFilterOptions = {
  allowAllCanceled?: boolean;
  hiddenValues?: unknown[];
  keepLast?: boolean;
  mode?: 'reverse' | 'singleChecked';
};

let legacyInteractionsRegistered = false;

const CATEGORY_LEGEND_CLASS_NAME = 'legend-category';
const LEGEND_ITEMS_CLASS_NAME = 'items-item';
const ELEMENT_CLASS_NAME = 'element';
const LEGEND_MARK_TYPE = 'legends';
const ANNOTATION_MARK_TYPES = new Set(['axisX', 'axisY', 'legendCategory', 'legendContinuous', 'title', 'scrollbar', 'slider']);

function getRegister(): G2Register {
  return (G2 as unknown as { register: G2Register }).register;
}

function getClassName(displayObject: G2DisplayObject): string {
  return String(displayObject.className || displayObject.attributes?.className || displayObject.attributes?.class || '');
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

function getLegendData(legend: G2DisplayObject): Record<string, unknown> {
  let current: G2DisplayObject | undefined = legend;
  while (current && !current.__data__) {
    current = current.parentNode;
  }
  return current?.__data__ || {};
}

function getLegendScale(legend: G2DisplayObject): { name: string; domain: unknown[] } | undefined {
  const legendData = getLegendData(legend);
  const scales = legendData.scales;
  if (!Array.isArray(scales)) {
    return undefined;
  }
  return scales[0] as { name: string; domain: unknown[] } | undefined;
}

function getLegendItemValue(legend: G2DisplayObject, item: G2DisplayObject): unknown {
  const itemIndex = Number((item.__data__ as { index?: number } | undefined)?.index);
  const legendScale = getLegendScale(legend);
  if (legendScale?.domain && Number.isFinite(itemIndex)) {
    return legendScale.domain[itemIndex];
  }

  const legendData = legend.attributes?.data;
  if (Array.isArray(legendData) && Number.isFinite(itemIndex)) {
    return legendData[itemIndex]?.label;
  }

  return undefined;
}

function getLegendValues(legend: G2DisplayObject, items: G2DisplayObject[]): unknown[] {
  const domain = getLegendScale(legend)?.domain;
  if (Array.isArray(domain)) {
    return [...domain];
  }
  return items.map((item) => getLegendItemValue(legend, item)).filter((value) => value !== undefined);
}

function setLegendItemSelected(item: G2DisplayObject, selected: boolean): void {
  item.style = {
    ...(item.style || {}),
    opacity: selected ? 1 : 0.4,
    cursor: 'pointer',
  };
}

function getSelectedValuesAfterClick(
  clickedValue: unknown,
  allValues: unknown[],
  selectedValues: unknown[],
  event: G2PointerEvent,
  options: LegendFilterOptions,
): unknown[] {
  const hasControl = Boolean(event.ctrlKey || event.metaKey);
  const currentSelected = selectedValues.includes(clickedValue);
  const keepLast = options.keepLast !== false && !options.allowAllCanceled;

  if (options.mode === 'singleChecked') {
    if (!hasControl) {
      return currentSelected && selectedValues.length === 1 ? [...allValues] : [clickedValue];
    }

    if (currentSelected) {
      return keepLast && selectedValues.length === 1
        ? selectedValues
        : selectedValues.filter((value) => value !== clickedValue);
    }
    return [...selectedValues, clickedValue];
  }

  if (hasControl) {
    return currentSelected && selectedValues.length === 1 ? [...allValues] : [clickedValue];
  }

  if (currentSelected) {
    return keepLast && selectedValues.length === 1
      ? selectedValues
      : selectedValues.filter((value) => value !== clickedValue);
  }
  return [...selectedValues, clickedValue];
}

function mergeLegendFilterState(
  options: Record<string, unknown>,
  channel: string,
  selectedValues: unknown[],
): Record<string, unknown> {
  const marks = Array.isArray(options.marks) ? options.marks : [];
  return {
    ...options,
    marks: marks.map((mark) => {
      const markOptions = mark as Record<string, unknown>;
      const markScale = markOptions.scale as Record<string, unknown> | undefined;
      if (markOptions.type === LEGEND_MARK_TYPE || ANNOTATION_MARK_TYPES.has(String(markOptions.type)) || !markScale?.[channel]) {
        return markOptions;
      }

      const transform = Array.isArray(markOptions.transform) ? [...markOptions.transform] : [];
      const aggregateIndex = transform.findIndex((item) => {
        const type = String((item as Record<string, unknown>).type || '');
        return type.startsWith('group') || type.startsWith('bin');
      });
      const filterIndex = transform.findIndex((item) => (item as Record<string, unknown>).type === 'filter' && (item as Record<string, unknown>)[channel]);
      const filterTransform = {
        type: 'filter',
        [channel]: {
          value: selectedValues,
          ordinal: true,
        },
      };

      if (filterIndex >= 0) {
        transform[filterIndex] = filterTransform;
      } else {
        transform.splice(aggregateIndex + 1, 0, filterTransform);
      }

      return {
        ...markOptions,
        transform,
        legend: {
          ...(markOptions.legend as Record<string, unknown> | undefined),
          [channel]: { preserve: true },
        },
      };
    }),
  };
}

function LegacyLegendFilter(options: LegendFilterOptions = {}) {
  return (target: G2InteractionTarget, _viewInstances: unknown, emitter: G2InteractionEmitter) => {
    const legends = findAllByClassName(target.container, CATEGORY_LEGEND_CLASS_NAME);
    const cleanupCallbacks: Array<() => void> = [];

    legends.forEach((legend) => {
      const legendScale = getLegendScale(legend);
      if (!legendScale) {
        return;
      }

      const items = findAllByClassName(legend, LEGEND_ITEMS_CLASS_NAME);
      const allValues = getLegendValues(legend, items);
      const hiddenValues = Array.isArray(options.hiddenValues) ? options.hiddenValues : [];
      let selectedValues = allValues.filter((value) => !hiddenValues.includes(value));
      if (selectedValues.length === 0 && allValues.length > 0 && options.keepLast !== false) {
        selectedValues = [allValues[0]];
      }

      const updateState = async (event?: G2PointerEvent) => {
        items.forEach((item) => setLegendItemSelected(item, selectedValues.includes(getLegendItemValue(legend, item))));
        target.setState(legend, (viewOptions) => mergeLegendFilterState(viewOptions, legendScale.name, selectedValues));
        await target.update();

        const nativeEvent = event?.nativeEvent ?? true;
        if (selectedValues.length === allValues.length) {
          emitter.emit('legend:reset', { nativeEvent });
        } else {
          emitter.emit('legend:filter', {
            ...(event || {}),
            nativeEvent,
            data: { channel: legendScale.name, values: selectedValues },
          });
        }
      };

      const onExternalFilter = (event: G2EmitterEvent) => {
        if (event.nativeEvent || event.data?.channel !== legendScale.name || !Array.isArray(event.data.values)) {
          return;
        }
        selectedValues = event.data.values;
        updateState({ nativeEvent: false });
      };

      const onExternalReset = (event: G2EmitterEvent) => {
        if (event.nativeEvent) {
          return;
        }
        selectedValues = [...allValues];
        updateState({ nativeEvent: false });
      };

      items.forEach((item) => {
        const click = (event: G2PointerEvent) => {
          const clickedValue = getLegendItemValue(legend, item);
          if (clickedValue === undefined) {
            return;
          }
          selectedValues = getSelectedValuesAfterClick(clickedValue, allValues, selectedValues, event, options);
          updateState(event);
        };
        const pointerEnter = () => {
          item.style = { ...(item.style || {}), cursor: 'pointer' };
        };
        item.addEventListener?.('click', click);
        item.addEventListener?.('pointerenter', pointerEnter);
        cleanupCallbacks.push(() => {
          item.removeEventListener?.('click', click);
          item.removeEventListener?.('pointerenter', pointerEnter);
        });
      });

      emitter.on?.('legend:filter', onExternalFilter);
      emitter.on?.('legend:reset', onExternalReset);
      cleanupCallbacks.push(() => {
        emitter.off?.('legend:filter', onExternalFilter);
        emitter.off?.('legend:reset', onExternalReset);
      });

      if (hiddenValues.length > 0) {
        updateState({ nativeEvent: false });
      } else {
        items.forEach((item) => setLegendItemSelected(item, selectedValues.includes(getLegendItemValue(legend, item))));
      }
    });

    return () => cleanupCallbacks.forEach((cleanup) => cleanup());
  };
}

function getElementValue(target: G2InteractionTarget, channel: string, element: G2DisplayObject): unknown {
  const encodedValue = element.__data__?.[channel];
  return target.view.scale?.[channel]?.invert?.(encodedValue) ?? encodedValue;
}

function setElementHighlighted(element: G2DisplayObject, active: boolean): void {
  element.style = {
    ...(element.style || {}),
    opacity: active ? 1 : 0.25,
  };
}

function clearElementHighlight(element: G2DisplayObject): void {
  element.style = {
    ...(element.style || {}),
    opacity: 1,
  };
}

function LegacyLegendHighlight() {
  return (target: G2InteractionTarget, _viewInstances: unknown, emitter: G2InteractionEmitter) => {
    const legends = findAllByClassName(target.container, CATEGORY_LEGEND_CLASS_NAME);
    const elements = findAllByClassName(target.container, ELEMENT_CLASS_NAME);
    const cleanupCallbacks: Array<() => void> = [];

    legends.forEach((legend) => {
      const legendScale = getLegendScale(legend);
      if (!legendScale) {
        return;
      }
      const items = findAllByClassName(legend, LEGEND_ITEMS_CLASS_NAME);
      const clearHighlight = (event?: G2PointerEvent) => {
        elements.forEach(clearElementHighlight);
        items.forEach((item) => setLegendItemSelected(item, true));
        emitter.emit('legend:unhighlight', { ...(event || {}), nativeEvent: event?.nativeEvent ?? true });
      };

      items.forEach((item) => {
        const pointerOver = (event: G2PointerEvent) => {
          const value = getLegendItemValue(legend, item);
          elements.forEach((element) => setElementHighlighted(element, getElementValue(target, legendScale.name, element) === value));
          items.forEach((legendItem) => setLegendItemSelected(legendItem, legendItem === item));
          emitter.emit('legend:highlight', {
            ...event,
            nativeEvent: event.nativeEvent ?? true,
            data: { channel: legendScale.name, value },
          });
        };
        item.addEventListener?.('pointerover', pointerOver);
        item.addEventListener?.('click', clearHighlight);
        cleanupCallbacks.push(() => {
          item.removeEventListener?.('pointerover', pointerOver);
          item.removeEventListener?.('click', clearHighlight);
        });
      });

      legend.addEventListener?.('pointerleave', clearHighlight);
      cleanupCallbacks.push(() => legend.removeEventListener?.('pointerleave', clearHighlight));
    });

    return () => cleanupCallbacks.forEach((cleanup) => cleanup());
  };
}

function LegacyEllipsisText() {
  return (target: G2InteractionTarget) => {
    const legendItems = findAllByClassName(target.container, LEGEND_ITEMS_CLASS_NAME);
    const axisLabels = findAllByClassName(target.container, 'axis-label');
    const cleanups: Array<() => void> = [];

    let tipEl: HTMLDivElement | null = null;
    const showTip = (text: string, event: { clientX: number; clientY: number }) => {
      if (!tipEl && typeof document !== 'undefined') {
        tipEl = document.createElement('div');
        Object.assign(tipEl.style, {
          position: 'fixed', zIndex: '99999', padding: '4px 8px', fontSize: '12px',
          background: 'rgba(0,0,0,0.75)', color: '#fff', borderRadius: '4px',
          pointerEvents: 'none', whiteSpace: 'nowrap', maxWidth: '300px',
        });
        document.body.appendChild(tipEl);
      }
      if (tipEl) {
        tipEl.textContent = text;
        tipEl.style.left = `${event.clientX + 10}px`;
        tipEl.style.top = `${event.clientY - 28}px`;
        tipEl.style.display = 'block';
      }
    };
    const hideTip = () => { if (tipEl) tipEl.style.display = 'none'; };

    [...legendItems, ...axisLabels].forEach((item) => {
      const fullText = item.attributes?.text || item.attributes?.label || item.__data__?.label;
      if (fullText !== undefined) {
        item.attributes = { ...(item.attributes || {}), title: String(fullText) };
        const onEnter = (e: G2PointerEvent) => {
          const displayText = String(item.attributes?.text || item.style?.text || '');
          if (displayText.includes('...') || displayText.includes('…')) {
            const native = (e as unknown as { nativeEvent?: MouseEvent }).nativeEvent;
            showTip(String(fullText), { clientX: native?.clientX ?? 0, clientY: native?.clientY ?? 0 });
          }
        };
        const onLeave = () => hideTip();
        item.addEventListener?.('mouseenter', onEnter);
        item.addEventListener?.('mouseleave', onLeave);
        cleanups.push(() => {
          item.removeEventListener?.('mouseenter', onEnter);
          item.removeEventListener?.('mouseleave', onLeave);
        });
      }
    });

    return () => {
      cleanups.forEach((fn) => fn());
      if (tipEl) { tipEl.remove(); tipEl = null; }
    };
  };
}

function isResetButtonShape(displayObject: G2DisplayObject | undefined): boolean {
  if (!displayObject) {
    return false;
  }
  const className = getClassName(displayObject);
  const name = String(displayObject.attributes?.name || displayObject.attributes?.id || '');
  return className.includes('reset-button') || name === 'button-rect' || name === 'button-text';
}

function isInResetButton(displayObject: G2DisplayObject | undefined): boolean {
  let current = displayObject;
  while (current) {
    if (isResetButtonShape(current)) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}

function LegacyTooltipGuard() {
  return (target: G2InteractionTarget, _viewInstances: unknown, emitter: G2InteractionEmitter) => {
    const hideTooltipOnResetButton = (event: G2PointerEvent) => {
      if (!isInResetButton(event.target)) {
        return;
      }
      event.stopPropagation?.();
      emitter.emit('tooltip:hide', { ...event, nativeEvent: true });
    };

    target.container.addEventListener?.('pointermove', hideTooltipOnResetButton);
    target.container.addEventListener?.('touchmove', hideTooltipOnResetButton);
    return () => {
      target.container.removeEventListener?.('pointermove', hideTooltipOnResetButton);
      target.container.removeEventListener?.('touchmove', hideTooltipOnResetButton);
    };
  };
}

function findPlotArea(container: G2DisplayObject): G2DisplayObject | undefined {
  const queriedPlotArea = container.querySelector?.('.plot');
  if (queriedPlotArea) {
    return queriedPlotArea;
  }
  if (hasClassName(container, 'plot')) {
    return container;
  }
  const children = container.childNodes || container.children || [];
  for (const child of children) {
    const plotArea = findPlotArea(child);
    if (plotArea) {
      return plotArea;
    }
  }
  return undefined;
}

function createActiveRegionMask(plotArea: G2DisplayObject): G2DisplayObject | undefined {
  const mask = plotArea.ownerDocument?.createElement?.('rect');
  if (!mask) {
    return undefined;
  }
  mask.style = {
    ...(mask.style || {}),
    fill: 'rgba(0, 0, 0, 0.04)',
    pointerEvents: 'none',
  };
  plotArea.appendChild?.(mask);
  return mask;
}

function LegacyActiveRegion() {
  return (target: G2InteractionTarget) => {
    const plotArea = findPlotArea(target.container);
    if (!plotArea) {
      return () => undefined;
    }

    let activeRegionMask: G2DisplayObject | undefined;
    const showActiveRegion = (event: G2PointerEvent) => {
      const bounds = plotArea.getBBox?.();
      if (!bounds) {
        return;
      }
      activeRegionMask = activeRegionMask || createActiveRegionMask(plotArea);
      if (!activeRegionMask) {
        return;
      }
      const offsetX = event.offsetX ?? 0;
      const regionWidth = Math.max(1, bounds.width / 40);
      activeRegionMask.style = {
        ...(activeRegionMask.style || {}),
        x: Math.max(0, Math.min(bounds.width - regionWidth, offsetX - regionWidth / 2)),
        y: 0,
        width: regionWidth,
        height: bounds.height,
      };
    };
    const hideActiveRegion = () => {
      activeRegionMask?.remove?.();
      activeRegionMask = undefined;
    };

    plotArea.addEventListener?.('pointermove', showActiveRegion);
    plotArea.addEventListener?.('pointerleave', hideActiveRegion);
    return () => {
      hideActiveRegion();
      plotArea.removeEventListener?.('pointermove', showActiveRegion);
      plotArea.removeEventListener?.('pointerleave', hideActiveRegion);
    };
  };
}

function getDrillDatum(displayObject: G2DisplayObject | undefined): Record<string, unknown> | undefined {
  let current = displayObject;
  while (current) {
    const datum = current.__data__?.data || current.__data__;
    if (datum && typeof datum === 'object') {
      return datum as Record<string, unknown>;
    }
    current = current.parentNode;
  }
  return undefined;
}

function LegacyDrillDown() {
  return (target: G2InteractionTarget, _viewInstances: unknown, emitter: G2InteractionEmitter) => {
    const elements = findAllByClassName(target.container, ELEMENT_CLASS_NAME);
    const cleanupCallbacks: Array<() => void> = [];

    elements.forEach((element) => {
      const click = (event: G2PointerEvent) => {
        const datum = getDrillDatum(event.target || element);
        const children = datum?.children;
        if (!Array.isArray(children) || children.length === 0) {
          return;
        }
        emitter.emit('drill-down:click', { ...event, nativeEvent: true, data: { datum, children } });
      };
      const pointerEnter = () => {
        const datum = getDrillDatum(element);
        const children = datum?.children;
        if (Array.isArray(children) && children.length > 0) {
          element.style = { ...(element.style || {}), cursor: 'pointer' };
        }
      };
      const pointerLeave = () => {
        element.style = { ...(element.style || {}), cursor: 'default' };
      };
      element.addEventListener?.('click', click);
      element.addEventListener?.('pointerenter', pointerEnter);
      element.addEventListener?.('pointerleave', pointerLeave);
      cleanupCallbacks.push(() => {
        element.removeEventListener?.('click', click);
        element.removeEventListener?.('pointerenter', pointerEnter);
        element.removeEventListener?.('pointerleave', pointerLeave);
      });
    });

    return () => cleanupCallbacks.forEach((cleanup) => cleanup());
  };
}

export function registerLegacyInteractions(): void {
  if (legacyInteractionsRegistered) {
    return;
  }

  registerLegacyRectZoomInteraction();
  const registerG2Component = getRegister();
  registerG2Component('interaction.legacyLegendFilter', LegacyLegendFilter);
  registerG2Component('interaction.legacyLegendHighlight', LegacyLegendHighlight);
  registerG2Component('interaction.legacyEllipsisText', LegacyEllipsisText);
  registerG2Component('interaction.legacyTooltipGuard', LegacyTooltipGuard);
  registerG2Component('interaction.legacyActiveRegion', LegacyActiveRegion);
  registerG2Component('interaction.legacyDrillDown', LegacyDrillDown);
  legacyInteractionsRegistered = true;
}
