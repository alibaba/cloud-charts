import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getBarDefaultConfig, type BarChartConfig } from './barDefaultConfig';
import { getText } from '../runtime/i18n';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { resolveColorRange } from '../runtime/common';
import {
  normalizeLegend,
  normalizeTooltip,
  normalizeZoom,
  normalizeLegendInteractions,
  normalizeSlider,
  normalizeScrollbar,
  buildGuideMarks,
} from '../runtime/features';
import type { BarSeries, NormalizedBarRecord } from './bar';
import { normalizeBarData } from './bar';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Bar';

/**
 * Bar interval mark 的 labels 规范化：与折线 LineLabelConfig 同形态。
 * 旧 src/common/drawBar.ts 调用 label() 等价路径。
 */
function buildIntervalLabels(label: unknown, yField: string): Array<Record<string, unknown>> | undefined {
  if (label === false || label === undefined || label === null) return undefined;
  const cfg = (typeof label === 'object' ? label : {}) as Record<string, unknown>;
  if (cfg.visible === false) return undefined;
  const text = (cfg.field as string) ?? yField;
  const item: Record<string, unknown> = { text };
  if (cfg.position) item.position = cfg.position;
  if (typeof cfg.offset === 'number') item.offset = cfg.offset;
  if (cfg.labelFormatter) item.formatter = cfg.labelFormatter;
  if (cfg.callback) item.formatter = cfg.callback;
  if (cfg.style) item.style = cfg.style;
  Object.entries(cfg).forEach(([k, v]) => {
    if (['visible', 'position', 'offset', 'labelFormatter', 'callback', 'field', 'style'].includes(k)) return;
    if (item[k] === undefined) item[k] = v;
  });
  return [item];
}

function normalizeGeomStyle(styleConfig: unknown): Record<string, unknown> {
  if (!styleConfig || typeof styleConfig === 'function' || typeof styleConfig !== 'object') {
    return {};
  }
  const config = styleConfig as Record<string, unknown>;
  if (config.cfg && typeof config.cfg === 'object') {
    return config.cfg as Record<string, unknown>;
  }
  if (typeof config.callback === 'function') {
    return { callback: config.callback, fields: config.fields };
  }
  const style: Record<string, unknown> = {};
  Object.entries(config).forEach(([key, value]) => {
    if (!['fields', 'callback', 'cfg'].includes(key)) {
      style[key] = value;
    }
  });
  return style;
}

export interface CreateBarModelInput {
  data: BarSeries[];
  config?: BarChartConfig;
  context?: ChartRuntimeContext;
}

const scaleAxisIgnoredKeys = new Set([
  'alias',
  'autoEllipsis',
  'autoHide',
  'autoRotate',
  'breaks',
  'customConfig',
  'grid',
  'label',
  'labelFormatter',
  'line',
  'rotate',
  'tick',
  'tickLine',
  'visible',
]);

function getScaleAxisConfig(axis: unknown): Record<string, unknown> {
  if (!axis || typeof axis !== 'object') {
    return {};
  }

  const scaleConfig: Record<string, unknown> = {};
  Object.entries(axis as Record<string, unknown>).forEach(([key, value]) => {
    if (!scaleAxisIgnoredKeys.has(key)) {
      scaleConfig[key] = value;
    }
  });
  return scaleConfig;
}

function buildScale(config: BarChartConfig): Record<string, unknown> {
  const xAxisConfig = (config.xAxis ? config.xAxis : {}) as Record<string, unknown>;
  const scale: Record<string, unknown> = {
    x: { type: 'band', ...xAxisConfig },
  };
  if (config.yAxis !== false) {
    scale.y = { type: 'linear', nice: true, ...getScaleAxisConfig(config.yAxis) };
  }
  return scale;
}

/**
 * 柱状图运行时模型组装：通用 pipeline + 柱状特有 spec 装配。
 * 通用部分（mergeDefaultConfig → normalizeData → runRules → applyRuleProcessors → resolveTheme）见 createChartModel.ts。
 */
export function createBarModel(input: CreateBarModelInput): ChartModel {
  const pipeline = runRuntimePipeline<BarSeries[], BarChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getBarDefaultConfig,
    normalizeData: (data) => normalizeBarData(data) as unknown as Array<Record<string, never>>,
  });

  const { context, finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedBarRecord[];
  const scale = buildScale(finalConfig);

  const legendValueMap: Record<string, unknown> = {};
  (input.data || []).forEach((series) => {
    const arr = series?.data;
    if (Array.isArray(arr) && arr.length > 0) {
      const last = arr[arr.length - 1];
      legendValueMap[series.name] = Array.isArray(last) ? last[1] : undefined;
    }
  });
  const legendModel = normalizeLegend(finalConfig.legend, theme.token, {
    marker: 'square',
    valueMap: legendValueMap,
  });
  const tooltipModel = normalizeTooltip(
    typeof finalConfig.tooltip === 'object'
      ? {
          ...(typeof finalConfig.yAxis === 'object' ? finalConfig.yAxis : {}),
          ...finalConfig.tooltip,
          yAxisFormatConfig: typeof finalConfig.yAxis === 'object' ? finalConfig.yAxis : undefined,
          xAxisType: 'band',
          themeToken: theme.token,
        }
      : finalConfig.tooltip,
  );

  const xAxisSpec = normalizeAxis(
    finalConfig.xAxis === false ? false : { ...(scale.x as Record<string, unknown>), type: 'band' },
    { grid: finalConfig.grid, field: 'x', token: theme.token },
  );
  const yAxisSpec = normalizeYAxis(finalConfig.yAxis, {
    grid: finalConfig.grid,
    defaultGrid: true,
    token: theme.token,
  });

  const colorRange = resolveColorRange(finalConfig.colors, theme.token);

  const zoomInteraction = normalizeZoom(
    finalConfig,
    getText('reset', { language: context.language, locale: context.locale }),
    theme.token,
  );
  const legendInteractions = normalizeLegendInteractions(legendModel, {
    showStackSum: Boolean(finalConfig.showStackSum),
    rawData: input.data as unknown as Array<Record<string, unknown>>,
  });
  const sliderSpec = normalizeSlider(finalConfig, { token: theme.token, data: finalData, width: context.size?.[0] });
  const scrollbarSpec = normalizeScrollbar(finalConfig);
  // 条形图（column===false）滚动改纵向
  if (scrollbarSpec && (finalConfig as { column?: boolean }).column === false && !((finalConfig.scrollbar as { type?: string })?.type)) {
    (scrollbarSpec as Record<string, unknown>).type = 'vertical';
  }
  const interactions = [zoomInteraction, ...legendInteractions].filter(Boolean) as InteractionModel[];

  const transforms: Array<Record<string, unknown>> = [];
  if (finalConfig.percentage) {
    transforms.push({ type: 'stackY' });
    transforms.push({ type: 'normalizeY' });
  } else if (finalConfig.stack) {
    transforms.push({ type: 'stackY' });
  } else if (finalConfig.dodge !== false) {
    transforms.push({ type: 'dodgeX' });
  }

  const intervalLabels = buildIntervalLabels((finalConfig as { label?: unknown }).label, 'y');
  const intervalSpec: ChartSpec = {
    type: 'interval',
    data: finalData,
    encode: { x: 'x', y: 'y', color: 'type' },
    transform: transforms.length > 0 ? transforms : undefined,
    style: {
      ...(typeof finalConfig.columnWidthRatio === 'number' ? { columnWidthRatio: finalConfig.columnWidthRatio } : {}),
      ...normalizeGeomStyle(finalConfig.geomStyle),
    },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;
  if (intervalLabels) {
    intervalSpec.labels = intervalLabels;
  }

  // guide marks (annotations): line / area 辅助线辅助区，statusColor 由 themeToken 自动解析
  const guideMarks = buildGuideMarks(
    finalConfig.guide as Parameters<typeof buildGuideMarks>[0],
    { themeToken: theme.token, scales: scale },
  );

  const childrenSpecs: ChartSpec[] = [intervalSpec];
  guideMarks.forEach((mark) => {
    childrenSpecs.push({
      type: mark.type,
      data: mark.data,
      encode: mark.encode,
      style: mark.style,
      labels: mark.labels,
      scale: mark.scale,
      axis: mark.axis,
    } as ChartSpec);
  });

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    scale,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    tooltip: tooltipModel.spec,
    theme: theme.g2Theme,
    children: childrenSpecs,
  };

  if (colorRange) {
    spec.scale = { ...(spec.scale as Record<string, unknown>), color: { range: colorRange } };
  }
  if (sliderSpec) {
    spec.slider = sliderSpec;
  }
  if (scrollbarSpec) {
    spec.scrollbar = scrollbarSpec;
  }

  return composeChartModel({
    chartName: CHART_NAME,
    spec,
    pipeline,
    legend: legendModel,
    tooltip: tooltipModel,
    interactions,
  });
}
