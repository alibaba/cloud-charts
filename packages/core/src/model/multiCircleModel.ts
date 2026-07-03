import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getMultiCircleDefaultConfig, type MultiCircleChartConfig } from './multiCircleDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { MultiCircleSeries, NormalizedMultiCircleRecord } from './multiCircle';
import { normalizeMultiCircleData } from './multiCircle';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2MultiCircle';

export interface CreateMultiCircleModelInput {
  data: MultiCircleSeries[];
  config?: MultiCircleChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 多重圆环图：polar coordinate + interval mark + stackY。
 * 每个系列一条 interval（环），通过 dodgeX 并排或 stackY 堆叠呈现多环。
 */
export function createMultiCircleModel(input: CreateMultiCircleModelInput): ChartModel {
  const pipeline = runRuntimePipeline<MultiCircleSeries[], MultiCircleChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getMultiCircleDefaultConfig,
    normalizeData: (data) => normalizeMultiCircleData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedMultiCircleRecord[];

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

  const intervalMark: ChartSpec = {
    type: 'interval',
    data: finalData,
    encode: { x: 'x', y: 'y', color: 'type' },
    transform: [{ type: 'stackY' }],
    style: { stroke: '#fff', lineWidth: 2 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const coordinate: Record<string, unknown> = {
    type: 'radial',
    innerRadius: finalConfig.innerRadius ?? 0.6,
  };

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
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
