import * as G2 from '@antv/g2';

type G2Register = (type: string, component: unknown) => void;

type G2Scale = {
  adjustedRange?: number[];
  getBandWidth?: () => number;
  getOptions?: () => { domain?: unknown[]; range?: number[] };
  getStep?: () => number;
  invert: (value: unknown) => unknown;
  map: (value: unknown) => number;
};

type G2Coordinate = {
  invert: (point: [number, number]) => [unknown, unknown];
};

type G2View = {
  scale: Record<string, G2Scale | undefined>;
  coordinate: G2Coordinate;
};

type G2DisplayObject = {
  attributes?: Record<string, unknown>;
  childNodes?: G2DisplayObject[];
  children?: G2DisplayObject[];
  className?: string;
  id?: string;
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
  offsetX: number;
  offsetY: number;
  target?: G2DisplayObject;
  timeStamp?: number;
  nativeEvent?: boolean;
  preventDefault?: () => void;
  stopPropagation?: () => void;
};

type G2InteractionTarget = {
  container: G2DisplayObject;
  view: G2View;
  update: () => Promise<{ view: G2View }>;
  setState: (name: string, updater?: (options: Record<string, unknown>) => Record<string, unknown>) => void;
};

type G2InteractionEmitter = {
  emit: (eventName: string, event: unknown) => void;
  off?: (eventName: string, listener: (event: { nativeEvent?: boolean; data?: { selection?: unknown } }) => void) => void;
  on?: (eventName: string, listener: (event: { nativeEvent?: boolean; data?: { selection?: unknown } }) => void) => void;
};

let legacyRectZoomRegistered = false;

function isOrdinalScale(scale: G2Scale): boolean {
  return Boolean(scale.getBandWidth);
}

function constrainIndex(index: number, minIndex: number, maxIndex: number): number {
  return Math.min(maxIndex, Math.max(minIndex, index));
}

function invertScale(scale: G2Scale, value: unknown, start: boolean): unknown {
  if (!isOrdinalScale(scale)) {
    return scale.invert(value);
  }

  const adjustedRange = scale.adjustedRange || [];
  if (adjustedRange.includes(value as number)) {
    return scale.invert(value);
  }

  const domain = scale.getOptions?.().domain || [];
  const offset = start ? -1 : 0;
  const step = scale.getStep?.() || 0;
  const range = start ? adjustedRange : adjustedRange.map((rangeValue) => rangeValue + step);
  const bisectIndex = range.findIndex((rangeValue) => (value as number) <= rangeValue);
  const domainIndex = constrainIndex((bisectIndex === -1 ? range.length : bisectIndex) + offset, 0, domain.length - 1);
  return domain[domainIndex];
}

function compareDomainValue(leftValue: unknown, rightValue: unknown): number {
  if (leftValue instanceof Date && rightValue instanceof Date) {
    return leftValue.getTime() - rightValue.getTime();
  }

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return leftValue - rightValue;
  }

  return String(leftValue).localeCompare(String(rightValue));
}

function getDomainOf(scale: G2Scale, values: unknown[]): unknown[] {
  if (!isOrdinalScale(scale)) {
    return [...values].sort(compareDomainValue);
  }

  const domain = scale.getOptions?.().domain || [];
  const startIndex = domain.indexOf(values[0]);
  const endIndex = domain.indexOf(values[values.length - 1]);
  const minIndex = Math.max(0, Math.min(startIndex, endIndex));
  const maxIndex = Math.max(startIndex, endIndex);
  return domain.slice(minIndex, maxIndex + 1);
}

function getYDomain(view: G2View): unknown[] | undefined {
  const yScale = view.scale.y || view.scale.y0 || view.scale.y1;
  return yScale?.getOptions?.().domain;
}

function getXDomain(startX: number, startY: number, endX: number, endY: number, view: G2View): unknown[] {
  const xScale = view.scale.x;
  if (!xScale) {
    return [];
  }

  const [abstractStartX] = view.coordinate.invert([startX, startY]);
  const [abstractEndX] = view.coordinate.invert([endX, endY]);
  return getDomainOf(xScale, [invertScale(xScale, abstractStartX, true), invertScale(xScale, abstractEndX, false)]);
}

function isPlotArea(displayObject: G2DisplayObject): boolean {
  const className = displayObject.className || displayObject.attributes?.className || displayObject.attributes?.class;
  return className === 'plot';
}

function findPlotArea(container: G2DisplayObject): G2DisplayObject | undefined {
  const queriedPlotArea = container.querySelector?.('.plot');
  if (queriedPlotArea) {
    return queriedPlotArea;
  }

  if (isPlotArea(container)) {
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

function getBrushPoint(plotArea: G2DisplayObject, event: G2PointerEvent): [number, number] {
  const bounds = plotArea.getRenderBounds?.();
  if (!bounds) {
    return [event.offsetX, event.offsetY];
  }

  const [minX, minY] = bounds.min;
  const [maxX, maxY] = bounds.max;
  const x = Math.min(maxX, Math.max(minX, event.offsetX)) - minX;
  const y = Math.min(maxY, Math.max(minY, event.offsetY)) - minY;
  return [x, y];
}

function getBrushRegion(plotArea: G2DisplayObject, start: [number, number], end: [number, number]): [number, number, number, number] {
  const bounds = plotArea.getBBox?.() || { width: 0, height: 0 };
  const minX = Math.max(0, Math.min(start[0], end[0]));
  const maxX = Math.min(bounds.width, Math.max(start[0], end[0]));
  return [minX, 0, maxX, bounds.height];
}

function createBrushMask(plotArea: G2DisplayObject): G2DisplayObject | undefined {
  const mask = plotArea.ownerDocument?.createElement?.('rect');
  if (!mask) {
    return undefined;
  }

  mask.style = {
    ...(mask.style || {}),
    fill: '#777',
    fillOpacity: 0.3,
    stroke: '#fff',
    pointerEvents: 'none',
  };
  plotArea.appendChild?.(mask);
  return mask;
}

function getObjectOption(options: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = options[key];
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function createResetButton(
  plotArea: G2DisplayObject,
  options: Record<string, unknown>,
  onReset: (event: G2PointerEvent) => void,
): G2DisplayObject | undefined {
  const document = plotArea.ownerDocument;
  const group = document?.createElement?.('g');
  const rect = document?.createElement?.('rect');
  const text = document?.createElement?.('text');
  if (!group || !rect || !text) {
    return undefined;
  }

  const resetText = String(options.resetText ?? 'Reset');
  const buttonStyle = getObjectOption(options, 'style');
  const textStyle = getObjectOption(options, 'textStyle');
  const activeStyle = getObjectOption(options, 'activeStyle');
  const width = Math.max(48, resetText.length * 12 + 20);
  const height = 24;
  const bounds = plotArea.getBBox?.() || { width, height };
  const x = Math.max(0, bounds.width - width - 8);
  const y = 8;

  group.className = 'reset-button';
  group.attributes = { ...(group.attributes || {}), className: 'reset-button', name: 'reset-button' };
  group.style = { ...(group.style || {}), cursor: 'pointer', pointerEvents: 'auto' };
  rect.attributes = { ...(rect.attributes || {}), name: 'button-rect' };
  rect.style = {
    ...(rect.style || {}),
    x,
    y,
    width,
    height,
    radius: 2,
    fill: '#ffffff',
    stroke: '#aaaaaa',
    lineWidth: 0.5,
    pointerEvents: 'none',
    ...buttonStyle,
  };
  text.attributes = { ...(text.attributes || {}), name: 'button-text' };
  text.style = {
    ...(text.style || {}),
    x: x + width / 2,
    y: y + height / 2,
    text: resetText,
    textAlign: 'center',
    textBaseline: 'middle',
    fontSize: 12,
    fill: '#6250f9',
    pointerEvents: 'none',
    ...textStyle,
  };

  group.appendChild?.(rect);
  group.appendChild?.(text);
  plotArea.appendChild?.(group);

  const resetFromButton = (event: G2PointerEvent) => {
    event.preventDefault?.();
    event.stopPropagation?.();
    onReset(event);
  };
  const activate = () => {
    rect.style = { ...(rect.style || {}), ...activeStyle };
  };
  const deactivate = () => {
    rect.style = { ...(rect.style || {}), ...buttonStyle };
  };

  group.addEventListener?.('click', resetFromButton);
  group.addEventListener?.('pointerenter', activate as unknown as (event: G2PointerEvent) => void);
  group.addEventListener?.('pointerleave', deactivate as unknown as (event: G2PointerEvent) => void);

  const remove = group.remove?.bind(group);
  group.remove = () => {
    group.removeEventListener?.('click', resetFromButton);
    group.removeEventListener?.('pointerenter', activate as unknown as (event: G2PointerEvent) => void);
    group.removeEventListener?.('pointerleave', deactivate as unknown as (event: G2PointerEvent) => void);
    remove?.();
  };

  return group;
}

function updateBrushMask(mask: G2DisplayObject | undefined, region: [number, number, number, number]): void {
  if (!mask) {
    return;
  }

  const [x, y, x1, y1] = region;
  mask.style = {
    ...(mask.style || {}),
    x,
    y,
    width: x1 - x,
    height: y1 - y,
  };
}

function mergeBrushState(options: Record<string, unknown>, domainX: unknown[]): Record<string, unknown> {
  const marks = Array.isArray(options.marks) ? options.marks : [];
  return {
    ...options,
    marks: marks.map((mark) => ({
      ...(mark as Record<string, unknown>),
      scale: {
        ...((mark as Record<string, unknown>).scale as Record<string, unknown> | undefined),
        x: { domain: domainX, nice: false },
      },
    })),
    clip: true,
  };
}

function isDoubleClick(event: G2PointerEvent, lastClickTime: number | undefined): boolean {
  return lastClickTime !== undefined && event.timeStamp !== undefined && event.timeStamp - lastClickTime < 300;
}

function isResetButtonTarget(target: G2DisplayObject | undefined): boolean {
  let current = target;
  while (current) {
    const className = current.className || current.attributes?.className || current.attributes?.class;
    const name = current.attributes?.name || current.attributes?.id;
    if (String(className || '').includes('reset-button') || name === 'button-rect' || name === 'button-text') {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}

function LegacyRectZoom(options: Record<string, unknown>) {
  return (target: G2InteractionTarget, _viewInstances: unknown, emitter: G2InteractionEmitter) => {
    const plotArea = findPlotArea(target.container);
    if (!plotArea?.addEventListener) {
      return () => undefined;
    }

    const originalView = target.view;
    const originalYDomain = getYDomain(originalView);
    let currentView = originalView;
    let filtered = false;
    let filtering = false;
    let lastClickTime: number | undefined;
    let brushStart: [number, number] | undefined;
    let brushMask: G2DisplayObject | undefined;
    let resetButton: G2DisplayObject | undefined;

    const hideResetButton = () => {
      resetButton?.remove?.();
      resetButton = undefined;
    };

    const showResetButton = () => {
      hideResetButton();
      resetButton = createResetButton(plotArea, options, reset);
    };

    const filter = async (domainX: unknown[], event: G2PointerEvent) => {
      if (filtering || domainX.length === 0) {
        return;
      }

      filtering = true;
      target.setState('brushFilter', (stateOptions) => mergeBrushState(stateOptions, domainX));
      emitter.emit('brush:filter', {
        ...event,
        nativeEvent: true,
        data: { selection: [domainX, originalYDomain || []] },
      });

      const nextState = await target.update();
      currentView = nextState.view;
      filtering = false;
      filtered = true;
      showResetButton();
    };

    const reset = (event: G2PointerEvent) => {
      if (filtering || !filtered) {
        return;
      }

      const domainX = originalView.scale.x?.getOptions?.().domain;
      const domainY = originalYDomain || getYDomain(originalView);
      emitter.emit('brush:filter', {
        ...event,
        nativeEvent: true,
        data: { selection: [domainX, domainY] },
      });
      filtered = false;
      currentView = originalView;
      hideResetButton();
      target.setState('brushFilter');
      target.update();
    };

    const onDragStart = (event: G2PointerEvent) => {
      if (isResetButtonTarget(event.target)) {
        return;
      }
      brushStart = getBrushPoint(plotArea, event);
      brushMask?.remove?.();
      brushMask = createBrushMask(plotArea);
    };

    const onDrag = (event: G2PointerEvent) => {
      if (!brushStart) {
        return;
      }

      updateBrushMask(brushMask, getBrushRegion(plotArea, brushStart, getBrushPoint(plotArea, event)));
    };

    const onDragEnd = (event: G2PointerEvent) => {
      if (!brushStart) {
        return;
      }

      const brushEnd = getBrushPoint(plotArea, event);
      const [startX, startY, endX, endY] = getBrushRegion(plotArea, brushStart, brushEnd);
      brushStart = undefined;
      brushMask?.remove?.();
      brushMask = undefined;

      if (startX === endX) {
        return;
      }

      filter(getXDomain(startX, startY, endX, endY, currentView), event);
    };

    const onClick = (event: G2PointerEvent) => {
      if (isResetButtonTarget(event.target)) {
        return;
      }
      if (isDoubleClick(event, lastClickTime)) {
        reset(event);
        lastClickTime = undefined;
        return;
      }

      lastClickTime = event.timeStamp;
    };

    const onExternalFilter = ({ nativeEvent, data }: { nativeEvent?: boolean; data?: { selection?: unknown } }) => {
      const selection = data?.selection;
      if (nativeEvent || !Array.isArray(selection)) {
        return;
      }

      const [domainX] = selection;
      if (!Array.isArray(domainX)) {
        return;
      }

      filter(domainX, { offsetX: 0, offsetY: 0, nativeEvent: false });
    };

    plotArea.style = { ...(plotArea.style || {}), cursor: 'crosshair', draggable: true };
    plotArea.addEventListener('dragstart', onDragStart);
    plotArea.addEventListener('drag', onDrag);
    plotArea.addEventListener('dragend', onDragEnd);
    plotArea.addEventListener('click', onClick);
    emitter.on?.('brush:filter', onExternalFilter);

    return () => {
      brushMask?.remove?.();
      hideResetButton();
      plotArea.removeEventListener?.('dragstart', onDragStart);
      plotArea.removeEventListener?.('drag', onDrag);
      plotArea.removeEventListener?.('dragend', onDragEnd);
      plotArea.removeEventListener?.('click', onClick);
      emitter.off?.('brush:filter', onExternalFilter);
    };
  };
}

/**
 * 注册 Wline 旧版 rectZoom 在 G2 5 下的适配交互。
 *
 * G2 5 内置 brushXFilter 会同时改写 x/y scale domain，导致 Y 轴刻度和布局重算；
 * 旧版 rectZoom 业务语义只按 X 方向缩放，Y 轴应保持框选前 domain。
 */
export function registerLegacyRectZoomInteraction(): void {
  if (legacyRectZoomRegistered) {
    return;
  }

  const registerG2Component = (G2 as unknown as { register: G2Register }).register;
  registerG2Component('interaction.legacyRectZoom', LegacyRectZoom);
  legacyRectZoomRegistered = true;
}
