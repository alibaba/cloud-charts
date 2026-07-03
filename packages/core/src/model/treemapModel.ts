import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getTreemapDefaultConfig, type TreemapChartConfig } from './treemapDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { TreemapData, NormalizedTreemapRecord } from './treemap';
import { normalizeTreemapData } from './treemap';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Treemap';

export interface CreateTreemapModelInput {
  data: TreemapData;
  config?: TreemapChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 矩阵树图：G2 v5 'treemap' mark。
 * 旧版 src/Wtreemap 用 @antv/data-set hierarchy.treemap；G2 v5 内置 mark + 自动 partition。
 */
export function createTreemapModel(input: CreateTreemapModelInput): ChartModel {
  const pipeline = runRuntimePipeline<TreemapData, TreemapChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getTreemapDefaultConfig,
    normalizeData: (data) => normalizeTreemapData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedTreemapRecord[];

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

  const treemapMark: ChartSpec = {
    type: 'treemap',
    data: finalData,
    encode: { value: 'value', color: 'name' },
    style: { stroke: '#fff', lineWidth: 1 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;
  if (finalConfig.label) {
    treemapMark.labels = [{ text: 'name', position: 'inside', style: { fill: '#fff', fontSize: 11 } }];
  }

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate: finalConfig.polar ? { type: 'polar' } : undefined,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    children: [treemapMark],
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
