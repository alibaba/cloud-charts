import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getHexagonalDefaultConfig, type HexagonalChartConfig } from './hexagonalDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { HexagonalSeries, NormalizedHexagonalRecord } from './hexagonal';
import { normalizeHexagonalData } from './hexagonal';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Hexagonal';

export interface CreateHexagonalModelInput {
  data: HexagonalSeries[];
  config?: HexagonalChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 六边形分箱图：G2 v5 'point' mark + hexbin transform（替代旧 @antv/data-set bin.hexagon）。
 * G2 v5 暂无原生 hexbin transform，降级为 rect binX+binY；
 * 后续 G2 升级支持 hexbin 后可切换 mark type 为 'hexagon'。
 */
export function createHexagonalModel(input: CreateHexagonalModelInput): ChartModel {
  const pipeline = runRuntimePipeline<HexagonalSeries[], HexagonalChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getHexagonalDefaultConfig,
    normalizeData: (data) => normalizeHexagonalData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedHexagonalRecord[];

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

  // 降级方案：rect mark + binX + binY（G2 v5 暂无原生 hexbin）
  const hexMark: ChartSpec = {
    type: 'rect',
    data: finalData,
    encode: { x: 'x', y: 'y' },
    transform: [{ type: 'bin', color: 'count', thresholdsX: finalConfig.binSize ?? 20, thresholdsY: finalConfig.binSize ?? 20 }],
    style: { inset: 0.5 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    legend: legendModel.mode === 'g2' && legendModel.spec !== false ? { color: legendModel.spec } : false,
    children: [hexMark],
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
