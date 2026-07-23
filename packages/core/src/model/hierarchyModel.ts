import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getHierarchyDefaultConfig, type HierarchyChartConfig } from './hierarchyDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { HierarchyData, NormalizedHierarchyRecord } from './hierarchy';
import { normalizeHierarchyData } from './hierarchy';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Hierarchy';

export interface CreateHierarchyModelInput {
  data: HierarchyData;
  config?: HierarchyChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 层次相邻图：G2 v5 内置 'partition' mark。笛卡尔坐标为冰柱图，极坐标为旭日样式。
 * 旧版 src/Whierarchy 用 @antv/data-set hierarchy.partition + polygon geom。
 */
export function createHierarchyModel(input: CreateHierarchyModelInput): ChartModel {
  const pipeline = runRuntimePipeline<HierarchyData, HierarchyChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getHierarchyDefaultConfig,
    normalizeData: (data) => normalizeHierarchyData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedHierarchyRecord[];

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

  const mark: ChartSpec = {
    type: 'partition',
    data: finalData,
    axis: false,
    encode: { value: 'value', color: 'name' },
    style: { stroke: '#fff', lineWidth: 1 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;
  mark.labels = finalConfig.label
    ? [{ text: 'name', position: 'inside', style: { fill: '#fff', fontSize: 11 } }]
    : [];

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate: finalConfig.polar ? { type: 'polar' } : undefined,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    children: [mark],
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
