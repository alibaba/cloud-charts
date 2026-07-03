import type { LegendModel, ThemeToken } from '../types';
import { deepMerge } from '../rules/merge';
import { createValueFormatter, type ValueFormatConfig } from '../format';
import { pxToNumber, toStringValue } from '../common';
import type { LegendCategorySpec } from '../../g2-types/legend';

export interface LegendBusinessConfig extends ValueFormatConfig {
  visible?: boolean;
  position?: string;
  align?: string;
  showData?: boolean;
  nameFormatter?: (...args: unknown[]) => unknown;
  valueFormatter?: (...args: unknown[]) => unknown;
  clickable?: boolean;
  hoverable?: boolean;
  allowAllCanceled?: boolean;
  useReverseChecked?: boolean;
  onHover?: (...args: unknown[]) => unknown;
  onClick?: (...args: unknown[]) => unknown;
  table?: unknown;
  foldable?: boolean;
  gradient?: unknown;
  field?: string;
  marker?: unknown;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export type LegendInput = LegendBusinessConfig | boolean | undefined;

function resolvePosition(position?: string): LegendModel['position'] {
  if (!position) {
    return 'bottom';
  }
  const base = position.split('-')[0];
  if (base === 'top' || base === 'left' || base === 'right' || base === 'bottom') {
    return base;
  }
  return 'bottom';
}

function resolveMode(config: LegendBusinessConfig): LegendModel['mode'] {
  if (config.table) {
    return 'table';
  }
  if (config.foldable) {
    return 'foldable';
  }
  if (config.gradient) {
    return 'gradient';
  }
  return 'g2';
}

export interface LegendChartDefaults {
  /** 图表特有的 marker 默认形状（line='hyphen', bar='square', pie='circle'）。 */
  marker?: string;
  /** 图表特有的 marker 尺寸（G2 v5 itemMarkerSize，含义随形状不同）。 */
  markerSize?: number;
  /** showData 时按 name 查询数值的映射。pie 用每片 y，bar/line 用每系列最后一个 y。 */
  valueMap?: Record<string, unknown>;
}

const MARKER_ALIAS: Record<string, string> = {
  square: 'rect',
  dot: 'circle',
};

/**
 * 将业务 legend 配置规范化为 LegendModel + G2 5 spec 的 legend 对象。
 * 复现旧 rectLegend 的业务语义（visible/position/showData/table/foldable/gradient/formatter），
 * 复杂模式（table/foldable/gradient）以 mode 标记，交由渲染层处理，G2 内置图例走 spec。
 */
export function normalizeLegend(
  legend: LegendInput,
  token?: ThemeToken,
  chartDefaults: LegendChartDefaults = {},
): LegendModel {
  if (legend === false || (typeof legend === 'object' && legend?.visible === false)) {
    return { visible: false, position: 'bottom', mode: 'g2', spec: false };
  }

  const config = (legend === true || legend === undefined ? {} : legend) as LegendBusinessConfig;
  const position = resolvePosition(config.position);
  const mode = resolveMode(config);
  const fontSize = pxToNumber(token?.['widgets-font-size-1'], 12);
  const legendTextColor = toStringValue(token?.['widgets-legend-text'], '#696969');
  const fontFamily = toStringValue(
    token?.['widgets-font-family-txd-m-number'],
    "'Helvetica Neue', 'Helvetica', 'PingFang SC', 'Microsoft YaHei', 'Arial', sans-serif",
  );

  const rawMarker = (config.marker as string | undefined) || chartDefaults.marker || 'hyphen';
  const itemMarker = MARKER_ALIAS[rawMarker] || rawMarker;

  const isVertical = position === 'left' || position === 'right';
  const justifyContent = config.align === 'right'
    ? 'flex-end'
    : config.align === 'center'
      ? 'center'
      : 'flex-start';
  const layout: unknown = isVertical
    ? { flexDirection: 'column', justifyContent: 'center', alignItems: justifyContent }
    : { justifyContent };

  const spec: LegendCategorySpec = {
    position,
    layout,
    padding: position === 'bottom' ? [fontSize * 2.5, 0, 0, 0] : [0, 0, fontSize * 4 / 3, 0],
    itemLabelFill: legendTextColor,
    itemLabelFontSize: fontSize,
    itemLabelFontFamily: fontFamily,
    itemMarker,
    itemMarkerSize: chartDefaults.markerSize ?? 7,
    itemMarkerFillOpacity: itemMarker === 'hyphen' ? 0 : 1,
    itemMarkerStrokeOpacity: itemMarker === 'hyphen' ? 1 : 0,
    itemMarkerLineWidth: 2,
    itemSpacing: [fontSize / 2, fontSize * 1.5],
    colPadding: fontSize * 1.5,
    rowPadding: fontSize / 2,
  };

  const itemValueFormatter = config.valueFormatter || createValueFormatter(config);
  const showData = Boolean(config.showData);

  if (config.nameFormatter) {
    spec.itemLabelText = config.nameFormatter;
  }
  if (showData && chartDefaults.valueMap) {
    const valueMap = chartDefaults.valueMap;
    spec.itemValueText = (...args: unknown[]) => {
      const datum = args[0] as { label?: string } | string | undefined;
      const name = typeof datum === 'string' ? datum : datum?.label ?? '';
      const value = valueMap[name];
      if (value === undefined || value === null) return '';
      const formatted = itemValueFormatter ? (itemValueFormatter as (v: unknown) => unknown)(value) : value;
      return String(formatted ?? '');
    };
    spec.itemValueFill = legendTextColor;
    spec.itemValueFillOpacity = 1;
    spec.itemValueFontSize = fontSize;
    spec.itemValueFontFamily = fontFamily;
  }
  if (config.clickable === false) {
    spec.itemMarkerOpacity = 1;
    spec.click = false;
  }

  const mergedSpec = config.customConfig ? deepMerge(spec, config.customConfig) : spec;

  return {
    visible: true,
    position,
    mode,
    field: config.field || 'color',
    spec: mode === 'g2' ? mergedSpec : false,
    showData,
    clickable: config.clickable !== false,
    hoverable: config.hoverable !== false,
    allowAllCanceled: Boolean(config.allowAllCanceled),
    useReverseChecked: Boolean(config.useReverseChecked),
    onHover: config.onHover,
    onClick: config.onClick,
    itemNameFormatter: config.nameFormatter,
    itemValueFormatter,
    tableConfig: mode === 'table' ? (typeof config.table === 'object' ? (config.table as Record<string, unknown>) : {}) : undefined,
    foldableConfig: mode === 'foldable' ? { defaultExpand: false } : undefined,
    gradientConfig: mode === 'gradient' ? (typeof config.gradient === 'object' ? (config.gradient as Record<string, unknown>) : {}) : undefined,
  };
}
