import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getSankeyDefaultConfig, type SankeyChartConfig } from './sankeyDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { SankeyData, NormalizedSankeyRecord } from './sankey';
import { normalizeSankeyData } from './sankey';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Sankey';

export interface CreateSankeyModelInput {
  data: SankeyData;
  config?: SankeyChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 桑基图：G2 v5 'sankey' mark 自动计算节点位置 + 流量 path。
 * 旧版 src/Wsankey 用 @antv/data-set graph/sankey transform；G2 v5 内置支持。
 */
export function createSankeyModel(input: CreateSankeyModelInput): ChartModel {
  const pipeline = runRuntimePipeline<SankeyData, SankeyChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getSankeyDefaultConfig,
    normalizeData: (data) => normalizeSankeyData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedSankeyRecord[];

  const legendModel = normalizeLegend(finalConfig.legend, theme.token, {});
  const tooltipModel = normalizeTooltip(
    typeof finalConfig.tooltip === 'object'
      ? { ...finalConfig.tooltip, xAxisType: 'band', themeToken: theme.token }
      : { visible: finalConfig.tooltip !== false, xAxisType: 'band', themeToken: theme.token },
  );
  const legendInteractions = normalizeLegendInteractions(legendModel, {
    rawData: [],
  });
  const interactions = legendInteractions as InteractionModel[];

  const sankeyMark: ChartSpec = {
    type: 'sankey',
    data: { value: finalData, transform: [{ type: 'sankeyLayout' }] } as unknown as ChartSpec['data'],
    encode: { source: 'source', target: 'target', value: 'value' },
    style: {
      labelSpacing: 3,
      labelFontWeight: 'bold',
      nodeStrokeWidth: 1.2,
      linkFillOpacity: 0.4,
    },
    layout: {
      nodeAlign: finalConfig.nodeAlign,
      nodeWidth: finalConfig.nodeWidth,
      nodePadding: finalConfig.nodePadding,
    },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    theme: theme.g2Theme,
    children: [sankeyMark],
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
