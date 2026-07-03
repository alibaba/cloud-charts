import type { ThemeToken, TooltipModel } from '../types';
import { deepMerge } from '../rules/merge';
import { createValueFormatter, type ValueFormatConfig } from '../format';
import { pxToNumber, toNumber, toStringValue } from '../common';

function applyColorOpacity(color: string, opacity: number): string {
  if (opacity >= 1 || color.startsWith('rgba') || !/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  const red = parseInt(color.slice(1, 3), 16);
  const green = parseInt(color.slice(3, 5), 16);
  const blue = parseInt(color.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function padNumber(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

function formatTimeByMask(value: unknown, mask?: string): string {
  const time = new Date(value as string | number | Date);
  if (Number.isNaN(time.getTime())) {
    return String(value ?? '');
  }

  const formatMask = !mask || mask === 'auto' ? 'HH:mm:ss\nYYYY-MM-DD' : mask;
  return formatMask
    .replace(/YYYY/g, String(time.getFullYear()))
    .replace(/MM/g, padNumber(time.getMonth() + 1))
    .replace(/DD/g, padNumber(time.getDate()))
    .replace(/HH/g, padNumber(time.getHours()))
    .replace(/mm/g, padNumber(time.getMinutes()))
    .replace(/ss/g, padNumber(time.getSeconds()))
    .replace(/SSS/g, padNumber(time.getMilliseconds(), 3));
}

export interface TooltipBusinessConfig extends ValueFormatConfig {
  visible?: boolean;
  sort?: 'asce' | 'desc' | ((left: unknown, right: unknown) => number);
  showTitle?: boolean;
  showColon?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  titleFormatter?: (...args: unknown[]) => unknown;
  nameFormatter?: (...args: unknown[]) => unknown;
  valueFormatter?: (...args: unknown[]) => unknown;
  columns?: number | false;
  lockable?: boolean;
  customContent?: unknown;
  reactContent?: unknown;
  customTooltip?: unknown;
  dodge?: boolean;
  customConfig?: Record<string, unknown>;
  xAxisType?: string;
  xAxisMask?: string;
  themeToken?: ThemeToken;
  yAxisFormatConfig?: ValueFormatConfig;
  [key: string]: unknown;
}

export type TooltipInput = TooltipBusinessConfig | boolean | undefined;

/**
 * 将业务 tooltip 配置规范化为 TooltipModel + G2 5 spec 的 tooltip 对象。
 * 复现旧 rectTooltip 的业务语义（visible/shared/crosshairs/title/formatter/time 轴去重）。
 * G2 5 默认 shared tooltip + crosshairs，formatter 走 spec 字段。
 */
export function normalizeTooltip(tooltip: TooltipInput): TooltipModel {
  if (tooltip === false || (typeof tooltip === 'object' && tooltip?.visible === false)) {
    return { visible: false, spec: false };
  }

  const config = (tooltip === true || tooltip === undefined ? {} : tooltip) as TooltipBusinessConfig;
  const token = config.themeToken;
  const fontSize = pxToNumber(token?.['widgets-font-size-1'], 12);
  const fontFamily = toStringValue(
    token?.['widgets-font-family-txd-m-number'],
    "'Helvetica Neue', 'Helvetica', 'PingFang SC', 'Microsoft YaHei', 'Arial', sans-serif",
  );
  const tooltipBackground = toStringValue(token?.['widgets-tooltip-background'], '#ffffff');
  const tooltipBackgroundOpacity = toNumber(token?.['widgets-tooltip-background-opacity'], 1);
  const tooltipBackgroundBlur = toNumber(token?.['widgets-tooltip-background-blur'], 0);
  const tooltipTextColor = toStringValue(token?.['widgets-tooltip-text'], '#333333');
  const tooltipTitleColor = toStringValue(token?.['widgets-tooltip-title'], '#808080');
  const tooltipMarkerFill = toStringValue(token?.['widgets-tooltip-marker-fill'], tooltipBackground);
  const tooltipRadius = pxToNumber(token?.['widgets-tooltip-corner-radius'], 4);
  const tooltipShadow = toStringValue(token?.['widgets-tooltip-shadow'], '0 3px 8px 0 rgba(0, 0, 0, 0.18)');
  const tooltipPadding = toStringValue(token?.['widgets-tooltip-padding'], '12px');

  const spec: Record<string, unknown> = {
    shared: true,
    css: {
      '.g2-tooltip': {
        background: applyColorOpacity(tooltipBackground, tooltipBackgroundOpacity),
        color: tooltipTextColor,
        padding: tooltipPadding,
        'border-radius': `${tooltipRadius}px`,
        'box-shadow': tooltipShadow,
        'font-size': `${fontSize}px`,
        'font-family': fontFamily,
        'backdrop-filter': `blur(${tooltipBackgroundBlur}px)`,
        '-webkit-backdrop-filter': `blur(${tooltipBackgroundBlur}px)`,
      },
      '.g2-tooltip-title': {
        color: tooltipTitleColor,
      },
      '.g2-tooltip-list-item': {
        color: tooltipTextColor,
      },
      '.g2-tooltip-value': {
        color: tooltipTextColor,
      },
      '.g2-tooltip-marker': {
        width: `${fontSize / 2}px`,
        height: `${fontSize / 2}px`,
        'border-radius': '50%',
        border: `1px solid ${tooltipMarkerFill}`,
        'margin-right': `${fontSize / 3}px`,
      },
    },
  };

  const isTimeAxis = config.xAxisType === 'time' || config.xAxisType === 'timeCat';
  const valueFormatter = createValueFormatter({
    ...config.yAxisFormatConfig,
    ...config,
    grouping: config.grouping ?? config.yAxisFormatConfig?.grouping ?? true,
    decimal: config.decimal ?? config.yAxisFormatConfig?.decimal ?? 1,
  });
  const markSpec: Record<string, unknown> = {};

  if (config.showTitle === false) {
    markSpec.title = false;
  } else if (config.titleFormatter) {
    markSpec.title = (datum: Record<string, unknown>) => config.titleFormatter?.(datum.x, datum);
  } else if (isTimeAxis) {
    markSpec.title = (datum: Record<string, unknown>) => formatTimeByMask(datum.x, config.xAxisMask);
  }

  markSpec.items = [
    (datum: Record<string, unknown>, index: number, data: Array<Record<string, unknown>>) => {
      const rawName = datum.type;
      const rawValue = datum.y;
      const name = config.nameFormatter ? config.nameFormatter(rawName, datum, index, data) : rawName;
      const value = config.valueFormatter
        ? config.valueFormatter(rawValue, datum, index, data)
        : valueFormatter
          ? valueFormatter(rawValue, datum, index, data)
          : rawValue;

      return { name, value };
    },
  ];

  // G2 v5：shared/crosshairs/activeRegion 配置走 spec.interaction.tooltip，由 caller 合并
  // 旧版 rectTooltip 行为：crosshair 永远启用；只是 cat/band 轴上语义化为 rect 高亮整列，time 轴为竖线。
  const isCatAxis = config.xAxisType === 'cat' || config.xAxisType === 'band';
  const interactionTooltip: Record<string, unknown> = isCatAxis
    ? { crosshairs: { type: 'rect' }, marker: false }
    : { crosshairs: { type: 'x' } };
  if (config.shared !== false) {
    interactionTooltip.shared = true;
  }

  if (config.lockable) {
    spec.lockable = true;
  }
  if (config.showColon !== undefined) {
    spec.showColon = config.showColon;
  }
  if (config.position) {
    spec.position = config.position;
  }
  if (config.offset !== undefined) {
    spec.offset = config.offset;
  }
  if (config.columns !== undefined) {
    spec.columns = config.columns;
  }
  if (config.customContent) {
    spec.customContent = config.customContent;
  }
  if (config.customTooltip) {
    spec.customTooltip = config.customTooltip;
  }
  if (config.reactContent) {
    spec.reactContent = config.reactContent;
  }
  if (config.dodge) {
    spec.dodge = true;
  }
  if (config.sort) {
    spec.sort = config.sort;
  }

  const mergedSpec = config.customConfig ? deepMerge(spec, config.customConfig) : spec;

  return {
    visible: true,
    spec: mergedSpec,
    markSpec,
    lockable: Boolean(config.lockable),
    showColon: Boolean(config.showColon),
    columns: config.columns,
    customContent: config.customContent,
    reactContent: config.reactContent,
    customTooltip: config.customTooltip,
    interactionTooltip,
  };
}
