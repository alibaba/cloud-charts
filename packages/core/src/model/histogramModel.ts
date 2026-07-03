import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getHistogramDefaultConfig, type HistogramChartConfig } from './histogramDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { HistogramSeries, NormalizedHistogramRecord } from './histogram';
import { normalizeHistogramData } from './histogram';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Histogram';

export interface CreateHistogramModelInput {
  data: HistogramSeries[];
  config?: HistogramChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 直方图：interval mark + G2 v5 内置 binX transform 自动分箱。
 * 旧版 src/Whistogram 用 @antv/data-set bin.histogram 预先分箱；
 * 新版改用 G2 v5 spec.transform=[{ type: 'binX', thresholds: ... }, { type: 'groupX', y: 'count' }]。
 */
export function createHistogramModel(input: CreateHistogramModelInput): ChartModel {
  const pipeline = runRuntimePipeline<HistogramSeries[], HistogramChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getHistogramDefaultConfig,
    normalizeData: (data) => normalizeHistogramData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedHistogramRecord[];

  const xAxisSpec = normalizeAxis(finalConfig.xAxis ?? {}, {
    field: 'x',
    token: theme.token,
  });
  const yAxisSpec = normalizeYAxis(finalConfig.yAxis ?? {}, {
    defaultGrid: true,
    token: theme.token,
  });

  const legendModel = normalizeLegend(finalConfig.legend, theme.token, {});
  const tooltipModel = normalizeTooltip(
    typeof finalConfig.tooltip === 'object'
      ? { ...finalConfig.tooltip, xAxisType: 'linear', themeToken: theme.token }
      : { visible: finalConfig.tooltip !== false, xAxisType: 'linear', themeToken: theme.token },
  );
  const legendInteractions = normalizeLegendInteractions(legendModel, {
    rawData: input.data as unknown as Array<Record<string, unknown>>,
  });
  const interactions = legendInteractions as InteractionModel[];

  const bin = finalConfig.bin ?? {};
  const binTransform: Record<string, unknown> = { type: 'binX', y: 'count' };
  if (typeof bin.binWidth === 'number') binTransform.binWidth = bin.binWidth;
  else if (typeof bin.bins === 'number') binTransform.thresholds = bin.bins;

  const intervalMark: ChartSpec = {
    type: 'rect',
    data: finalData,
    encode: { x: 'value', color: 'type' },
    transform: [binTransform],
    style: { inset: 0.5 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const coordinate = finalConfig.polar ? { type: 'polar' } : undefined;
  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    coordinate,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    theme: theme.g2Theme,
    children: [intervalMark],
  };

  return composeChartModel({
    chartName: CHART_NAME,
    spec,
    pipeline,
    legend: legendModel,
    tooltip: tooltipModel,
    interactions,
  });
}
