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
  // normalizeTreemapData 返回 [treeRoot]；treemap mark 需要树对象本身，取第一个元素。
  const treeRoot = (pipeline.finalData as unknown as NormalizedTreemapRecord[])[0];

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

  const treeSource = { type: 'inline', value: treeRoot } as unknown as ChartSpec['data'];

  const treemapMark: ChartSpec = {
    type: 'treemap',
    data: treeSource,
    encode: { value: 'value' },
    style: { stroke: '#fff', lineWidth: 1 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: treeSource,
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
