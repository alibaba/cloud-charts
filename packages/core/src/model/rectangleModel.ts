import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getRectangleDefaultConfig, type RectangleChartConfig } from './rectangleDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { RectangleSeries, NormalizedRectangleRecord } from './rectangle';
import { normalizeRectangleData } from './rectangle';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Rectangle';

export interface CreateRectangleModelInput {
  data: RectangleSeries[];
  config?: RectangleChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 矩形分箱图：G2 v5 'rect' mark + value→color encode。
 * 与 Heatmap 不同：rectangle 通常包含连续坐标值（散点密度），而 heatmap 是分类矩阵。
 */
export function createRectangleModel(input: CreateRectangleModelInput): ChartModel {
  const pipeline = runRuntimePipeline<RectangleSeries[], RectangleChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getRectangleDefaultConfig,
    normalizeData: (data) => normalizeRectangleData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedRectangleRecord[];

  const xAxisSpec = normalizeAxis(finalConfig.xAxis ?? {}, {
    field: 'x',
    token: theme.token,
  });
  const yAxisSpec = normalizeYAxis(finalConfig.yAxis ?? {}, {
    defaultGrid: false,
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

  const rectMark: ChartSpec = {
    type: 'rect',
    data: finalData,
    encode: { x: 'x', y: 'y', color: 'value' },
    style: { stroke: '#fff', lineWidth: 0.5 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    legend: legendModel.mode === 'g2' && legendModel.spec !== false ? { color: legendModel.spec } : false,
    children: [rectMark],
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
