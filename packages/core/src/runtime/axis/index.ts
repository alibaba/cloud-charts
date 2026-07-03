import type { ThemeToken } from '../types';
import { deepMerge } from '../rules/merge';
import { createValueFormatter, type ValueFormatConfig } from '../format';
import { pxToNumber, toStringValue } from '../common';

function padNumber(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

function formatTimeByMask(value: unknown, mask?: string): string {
  const time = new Date(value as string | number | Date);
  if (Number.isNaN(time.getTime())) {
    return String(value ?? '');
  }

  const formatMask = mask || 'HH:mm:ss\nYYYY-MM-DD';
  return formatMask
    .replace(/YYYY/g, String(time.getFullYear()))
    .replace(/MM/g, padNumber(time.getMonth() + 1))
    .replace(/DD/g, padNumber(time.getDate()))
    .replace(/HH/g, padNumber(time.getHours()))
    .replace(/mm/g, padNumber(time.getMinutes()))
    .replace(/ss/g, padNumber(time.getSeconds()))
    .replace(/SSS/g, padNumber(time.getMilliseconds(), 3));
}

export interface BreakOptions {
  /** Start position of the break. */
  start: number;
  /** End position of the break. */
  end: number;
  /** Gap ratio of the break, default is 0.03. */
  gap?: number;
  /** Number of wave vertices, default is 50. */
  vertices?: number;
  /** Offset of each vertex, default is 3. */
  verticeOffset?: number;
  /** Compression type of the break, default is 'middle'. */
  compress?: 'start' | 'end' | 'middle';
  /** Custom styles of the break. eg: stroke、fill and so on. */
  [key: string]: any;
}

export interface AxisBusinessConfig extends ValueFormatConfig {
  visible?: boolean;
  type?: string;
  alias?: string | boolean;
  autoRotate?: boolean;
  rotate?: number;
  autoHide?: boolean | Record<string, unknown>;
  autoEllipsis?: boolean | 'head' | 'middle' | 'tail';
  label?: unknown;
  labelFormatter?: (...args: unknown[]) => unknown;
  min?: number;
  max?: number;
  tickCount?: number;
  mask?: string;
  grid?: boolean;
  breaks?: BreakOptions[];
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export type AxisInput = AxisBusinessConfig | false | undefined;

export interface NormalizeAxisOptions {
  /** 是否绘制网格线（来自顶层 grid 配置）。 */
  grid?: boolean;
  /** y 轴是否显示默认水平网格线。 */
  defaultGrid?: boolean;
  /** 轴字段名，y0/y1 为双轴。 */
  field?: 'x' | 'y' | 'y0' | 'y1';
  /** 当前主题 token，用于显式下发 G2 5 axis 样式。 */
  token?: ThemeToken;
}

function isHidden(axis: AxisInput): boolean {
  return axis === false || (typeof axis === 'object' && axis?.visible === false);
}

/**
 * 将业务 axis 配置规范化为 G2 5 spec 的 axis 对象。
 * 复现旧 rectXAxis/rectYAxis 的业务语义（隐藏、标题、label、grid、time 默认 autoHide），
 * 但产出声明式 spec，标签避让/省略交由 G2 5 内置能力处理。
 */
export { customAxisBreaksShape } from './axisBreaksShape';

export function normalizeAxis(axis: AxisInput, options: NormalizeAxisOptions = {}): Record<string, unknown> | false {
  if (isHidden(axis)) {
    return false;
  }

  const config = (axis as AxisBusinessConfig) || {};
  const { field = 'x', token } = options;
  const isTimeAxis = typeof config.type === 'string' && config.type.includes('time');
  const fontSize = pxToNumber(token?.['widgets-font-size-1'], 12);
  const fontFamily = toStringValue(
    token?.['widgets-font-family-txd-m-number'],
    "'Helvetica Neue', 'Helvetica', 'PingFang SC', 'Microsoft YaHei', 'Arial', sans-serif",
  );
  const axisLabelColor = toStringValue(token?.['widgets-axis-label'], '#808080');
  const axisLineColor = toStringValue(token?.['widgets-axis-line'], '#696969');
  const axisGridColor = toStringValue(token?.['widgets-axis-grid'], 'rgba(229, 229, 229, 0.5)');
  const axisLabelOffset = pxToNumber(token?.['widgets-axis-label-offset'], 8);

  const axisThemeStyle = {
    labelFill: axisLabelColor,
    labelOpacity: 1,
    labelFontSize: fontSize,
    labelFontFamily: fontFamily,
    labelSpacing: axisLabelOffset,
    lineStroke: axisLineColor,
    lineStrokeOpacity: 1,
    lineLineWidth: 1,
    tickStroke: axisLineColor,
    tickOpacity: 1,
    tickLength: 4,
    tickLineWidth: 1,
    gridStroke: axisGridColor,
    gridStrokeOpacity: 1,
    gridLineWidth: 1,
    gridLineDash: [0, 0],
  };

  const valueFormatter = createValueFormatter(
    field === 'x'
      ? config
      : {
          ...config,
          grouping: config.grouping ?? true,
          hideZeroUnit: config.hideZeroUnit ?? true,
        },
  );

  const isDoubleYAxis = field === 'y0' || field === 'y1';
  const result: Record<string, unknown> = {
    title: false,
    line: field === 'x' || isDoubleYAxis,
    tick: field === 'x' || isDoubleYAxis,
    label: true,
    style: axisThemeStyle,
    important: axisThemeStyle,
  };

  if (isDoubleYAxis) {
    result.lineStroke = axisLineColor;
    result.lineStrokeOpacity = 1;
    result.lineLineWidth = 1;
    result.tickStroke = axisLineColor;
    result.tickOpacity = 1;
    result.tickLineWidth = 1;
  }

  if (field === 'y1') {
    result.position = 'right';
  }

  if (config.label === undefined) {
    if (config.labelFormatter) {
      result.labelFormatter = config.labelFormatter;
    } else if (isTimeAxis) {
      result.labelFormatter = (value: unknown) => formatTimeByMask(value, config.mask);
    } else if (valueFormatter) {
      result.labelFormatter = valueFormatter;
    }
    if (config.autoRotate !== undefined) {
      result.labelAutoRotate = config.autoRotate;
    }
    if (config.rotate !== undefined) {
      result.labelTransform = `rotate(${config.rotate})`;
    }

    const autoHide = config.autoHide;
    if (autoHide !== undefined) {
      result.labelAutoHide = autoHide;
    }

    if (field === 'x' && isTimeAxis && config.autoRotate === undefined && config.autoHide === undefined) {
      result.transform = [{ type: 'rotate', optionalAngles: [0], recoverWhenFailed: false }];
      result.labelAutoRotate = false;
      result.labelAutoHide = false;
      result.size = fontSize + axisLabelOffset + 4;
    }

    // P1-9：cat/band x 轴长 label 自动 0°→45°→ellipsis（旧 rectXAxis.ts ellipsisLabels 行为）
    // 仅在用户未显式覆盖 autoRotate/autoHide 时生效，且非 time 轴
    if (field === 'x' && !isTimeAxis && config.autoRotate === undefined && config.autoHide === undefined) {
      result.transform = [
        { type: 'rotate', optionalAngles: [0, 45], recoverWhenFailed: false },
        { type: 'ellipsis' },
      ];
    }

    if (config.autoEllipsis !== undefined && !isTimeAxis) {
      result.labelAutoEllipsis = config.autoEllipsis;
    }
  } else {
    result.label = config.label;
  }

  if (options.grid || (options.defaultGrid && field === 'y')) {
    result.grid = true;
  } else if (field === 'x') {
    result.grid = false;
  }

  if (field === 'y1') {
    result.grid = false;
  }

  if (config.alias) {
    result.title = typeof config.alias === 'string' ? config.alias : undefined;
  }

  if (config.customConfig) {
    return deepMerge(result, config.customConfig);
  }

  if (config.breaks && config.breaks.length > 0) {
    result.breaks = config.breaks;
    // G2 v5：breaks 启用时必须 transform:[] + labelAutoHide:false，否则 break 边界 tick 会被 hide-overlap 隐藏
    // 参考 @antv/g2 官方示例 site/examples/general/interval/demo/bar-axis-breaks.ts
    result.transform = [];
    result.labelAutoHide = false;
  }

  return result;
}

/** 规范化双轴/单轴 yAxis 配置为 G2 5 spec 的 y/y1 axis 对象。 */
export function normalizeYAxis(
  yAxis: AxisInput | AxisInput[],
  options: { grid?: boolean; defaultGrid?: boolean; token?: ThemeToken } = {},
): { y: Record<string, unknown> | false; y1?: Record<string, unknown> | false } {
  if (Array.isArray(yAxis)) {
    return {
      y: normalizeAxis(yAxis[0], { ...options, field: 'y0' }),
      y1: yAxis[1] !== undefined ? normalizeAxis(yAxis[1], { ...options, field: 'y1' }) : undefined,
    };
  }

  return { y: normalizeAxis(yAxis, { ...options, field: 'y' }) };
}
