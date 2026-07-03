import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getHeatmapDefaultConfig, type HeatmapChartConfig } from './heatmapDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { HeatmapSeries, NormalizedHeatmapRecord } from './heatmap';
import { normalizeHeatmapData } from './heatmap';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Heatmap';

export interface CreateHeatmapModelInput {
  data: HeatmapSeries[];
  config?: HeatmapChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 热力图：G2 v5 'cell' mark + value 字段映射到 color。
 * 旧版 src/Wheatmap 用 chart.polygon()，G2 v5 推荐 cell（自动 binning）。
 */
export function createHeatmapModel(input: CreateHeatmapModelInput): ChartModel {
  const pipeline = runRuntimePipeline<HeatmapSeries[], HeatmapChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getHeatmapDefaultConfig,
    normalizeData: (data) => normalizeHeatmapData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedHeatmapRecord[];

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
      ? { ...finalConfig.tooltip, xAxisType: 'band', themeToken: theme.token }
      : { visible: finalConfig.tooltip !== false, xAxisType: 'band', themeToken: theme.token },
  );
  const legendInteractions = normalizeLegendInteractions(legendModel, {
    rawData: input.data as unknown as Array<Record<string, unknown>>,
  });
  const interactions = legendInteractions as InteractionModel[];

  const cellMark: ChartSpec = {
    type: 'cell',
    data: finalData,
    encode: { x: 'x', y: 'y', color: 'value' },
    style: { stroke: '#fff', lineWidth: 1 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    // 热力图通常 legend 用色阶 mode（gradient），mode 在 legend.ts 已识别
    legend: legendModel.mode === 'g2' && legendModel.spec !== false ? { color: legendModel.spec } : false,
    theme: theme.g2Theme,
    children: [cellMark],
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
