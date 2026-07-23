import type { ThemeToken } from '../types';
import { getStatusColor } from '../common/color';
import { pxToNumber } from '../common';

export type GuideAxis = 'x' | 'y' | 'y0' | 'y1';
export type GuidePosition = unknown;

export interface GuideLineConfig {
  status?: string;
  axis?: GuideAxis;
  value?: number | string;
  start?: GuidePosition;
  end?: GuidePosition;
  text?: string | { title?: string | number; [key: string]: unknown };
  style?: Record<string, unknown>;
}

export interface GuideAreaConfig {
  status?: string;
  axis?: GuideAxis;
  value?: [number | string, number | string];
  start?: GuidePosition;
  end?: GuidePosition;
  style?: Record<string, unknown>;
}

export interface GuideFilterConfig extends GuideAreaConfig {
  apply?: string[];
  useGradient?: boolean;
}

export interface GuideConfig {
  visible?: boolean;
  line?: GuideLineConfig | GuideLineConfig[];
  area?: GuideAreaConfig | GuideAreaConfig[];
  filter?: GuideFilterConfig | GuideFilterConfig[];
}

export interface GuideMarkSpec {
  type: string;
  data?: Array<Record<string, unknown>>;
  encode?: Record<string, unknown>;
  style?: Record<string, unknown>;
  labels?: Array<Record<string, unknown>>;
  scale?: Record<string, unknown>;
  axis?: Record<string, unknown> | false;
  yField?: 'y' | 'y0' | 'y1';
}

export type StatusColorResolver = (status?: string) => string | undefined;

export interface GuideBuildOptions {
  themeToken?: ThemeToken;
  scales?: Record<string, unknown>;
}

const defaultStatusColorResolver: StatusColorResolver = () => undefined;

function getScaleLimit(scale: unknown, key: 'min' | 'max'): number | undefined {
  if (!scale || typeof scale !== 'object') {
    return undefined;
  }
  const value = (scale as Record<string, unknown>)[key];
  return typeof value === 'number' ? value : undefined;
}

function clampGuideValue(axis: GuideAxis | undefined, value: number | string, scales?: Record<string, unknown>): number | string {
  if (!axis || axis === 'x' || typeof value !== 'number') {
    return value;
  }

  const scale = scales?.[axis];
  const min = getScaleLimit(scale, 'min');
  const max = getScaleLimit(scale, 'max');
  if (typeof min === 'number' && value < min) {
    return min;
  }
  if (typeof max === 'number' && value > max) {
    return max;
  }
  return value;
}

function createLineLabel(line: GuideLineConfig, color: string | undefined, title: string, token?: ThemeToken): Array<Record<string, unknown>> | undefined {
  if (!title) {
    return undefined;
  }

  const rawText = typeof line.text === 'object' ? line.text : {};
  const {
    title: _title,
    position,
    align,
    style,
    offsetX,
    offsetY,
    autoRotate,
    ...restTextConfig
  } = rawText as Record<string, unknown>;
  const fontSize = pxToNumber(token?.['widgets-font-size-1'], 12);
  const isXAxis = line.axis === 'x';
  const labelPosition = position || (isXAxis ? 'end' : 'start');
  const defaultTextAlign = align || (isXAxis ? 'center' : labelPosition === 'start' ? 'start' : 'end');
  const defaultOffsetY = isXAxis ? 0 : -fontSize / 2;

  return [{
    text: title,
    position: labelPosition,
    autoRotate: autoRotate ?? !isXAxis,
    offsetX: offsetX ?? 0,
    offsetY: offsetY ?? defaultOffsetY,
    style: {
      fill: color,
      textAlign: defaultTextAlign,
      ...(typeof style === 'object' && style ? style : {}),
    },
    ...restTextConfig,
  }];
}

function resolveText(text: GuideLineConfig['text']): string {
  if (!text) {
    return '';
  }
  if (typeof text === 'string') {
    return text;
  }
  return String(text.title ?? '');
}

function resolveYField(axis: GuideAxis): 'y' | 'y0' | 'y1' {
  if (axis === 'y0' || axis === 'y1') {
    return axis;
  }
  return 'y';
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null;
}

function buildPositionLineMark(line: GuideLineConfig, color: string | undefined, title: string, options: GuideBuildOptions): GuideMarkSpec | null {
  if (!line.start || !line.end) {
    return null;
  }

  return {
    type: 'line',
    data: [{ start: line.start, end: line.end }],
    encode: { x: 'start', y: 'end' },
    style: { stroke: color, lineDash: [4, 4], ...line.style },
    labels: createLineLabel(line, color, title, options.themeToken),
    yField: line.axis ? resolveYField(line.axis) : 'y',
  };
}

function buildLineMark(line: GuideLineConfig, resolver: StatusColorResolver, options: GuideBuildOptions): GuideMarkSpec | null {
  const color = resolver(line.status);
  const title = resolveText(line.text);
  const positionMark = buildPositionLineMark(line, color, title, options);
  if (positionMark) {
    return positionMark;
  }

  if (!line.axis || !hasValue(line.value)) {
    return null;
  }

  const markType = line.axis === 'x' ? 'lineX' : 'lineY';
  const yField = resolveYField(line.axis);
  const value = clampGuideValue(line.axis, line.value as number | string, options.scales);

  return {
    type: markType,
    data: [{ value }],
    encode: line.axis === 'x' ? { x: 'value' } : { y: 'value' },
    style: { stroke: color, lineDash: [4, 4], ...line.style },
    labels: createLineLabel(line, color, title, options.themeToken),
    yField,
  };
}

function buildPositionAreaMark(area: GuideAreaConfig, color: string | undefined): GuideMarkSpec | null {
  if (!area.start || !area.end) {
    return null;
  }

  return {
    type: 'range',
    data: [{ start: area.start, end: area.end }],
    encode: { x: 'start', y: 'end' },
    style: { fill: color, fillOpacity: 0.1, ...area.style },
    yField: area.axis ? resolveYField(area.axis) : 'y',
  };
}

function buildAreaMark(area: GuideAreaConfig, resolver: StatusColorResolver, options: GuideBuildOptions): GuideMarkSpec | null {
  const color = resolver(area.status);
  const positionMark = buildPositionAreaMark(area, color);
  if (positionMark) {
    return positionMark;
  }

  if (!area.axis || !Array.isArray(area.value) || area.value.length < 2) {
    return null;
  }

  const markType = area.axis === 'x' ? 'rangeX' : 'rangeY';
  const yField = resolveYField(area.axis);
  const start = clampGuideValue(area.axis, area.value[0], options.scales);
  const end = clampGuideValue(area.axis, area.value[1], options.scales);

  return {
    type: markType,
    data: [{ start, end }],
    encode: area.axis === 'x' ? { x: ['start', 'end'] } : { y: ['start', 'end'] },
    style: { fill: color, fillOpacity: 0.1, ...area.style },
    yField,
  };
}

function buildFilterMark(filter: GuideFilterConfig, resolver: StatusColorResolver, options: GuideBuildOptions): GuideMarkSpec | null {
  const mark = buildAreaMark(filter, resolver, options);
  if (!mark) {
    return null;
  }

  const color = resolver(filter.status);
  const filterColor = filter.useGradient && filter.axis !== 'x' ? `l(90) 0:${color} 1:${color}00` : color;
  return {
    ...mark,
    type: 'regionFilter',
    style: { fill: filterColor, ...filter.style },
  };
}

/**
 * 将业务 guide 配置规范化为 G2 5 spec 的 annotation marks。
 * 复现旧 guide.ts 的 line/area 语义：line→lineX/lineY，area→rangeX/rangeY。
 *
 * status→color 解析方式有两种：
 *   1) 函数形式（向后兼容）：传一个 (status) => color 的 resolver；
 *   2) 对象形式（推荐）：`{ themeToken }`，内部自动调用 getStatusColor(status, themeToken)。
 *      这样调用方不必再手写 resolver，避免每个 model 重复 `(status) => getStatusColor(status, theme.token)`。
 */
export function buildGuideMarks(
  guide: GuideConfig | undefined,
  statusOrOptions: StatusColorResolver | GuideBuildOptions = defaultStatusColorResolver,
): GuideMarkSpec[] {
  if (!guide || guide.visible === false) {
    return [];
  }

  const buildOptions: GuideBuildOptions = typeof statusOrOptions === 'function' ? {} : statusOrOptions;
  const statusColorResolver: StatusColorResolver = typeof statusOrOptions === 'function'
    ? statusOrOptions
    : ((status) => getStatusColor(status, buildOptions.themeToken));

  const marks: GuideMarkSpec[] = [];

  const lines = Array.isArray(guide.line) ? guide.line : guide.line ? [guide.line] : [];
  lines.forEach((line) => {
    const mark = buildLineMark(line, statusColorResolver, buildOptions);
    if (mark) {
      marks.push(mark);
    }
  });

  const areas = Array.isArray(guide.area) ? guide.area : guide.area ? [guide.area] : [];
  areas.forEach((area) => {
    const mark = buildAreaMark(area, statusColorResolver, buildOptions);
    if (mark) {
      marks.push(mark);
    }
  });

  const filters = Array.isArray(guide.filter) ? guide.filter : guide.filter ? [guide.filter] : [];
  filters.forEach((filter) => {
    const mark = buildFilterMark(filter, statusColorResolver, buildOptions);
    if (mark) {
      marks.push(mark);
    }
  });

  return marks;
}
