import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getScatterDefaultConfig, type ScatterChartConfig } from './scatterDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { ScatterSeries, NormalizedScatterRecord } from './scatter';
import { normalizeScatterData } from './scatter';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Scatter';

export interface CreateScatterModelInput {
  data: ScatterSeries[];
  config?: ScatterChartConfig;
  context?: ChartRuntimeContext;
}

export function createScatterModel(input: CreateScatterModelInput): ChartModel {
  const pipeline = runRuntimePipeline<ScatterSeries[], ScatterChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getScatterDefaultConfig,
    normalizeData: (data) => normalizeScatterData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedScatterRecord[];

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

  // 主 mark：point；带 size 字段时自动 encode size。
  const hasSize = finalData.some((r) => r.size !== undefined && r.size !== null);
  const pointMark: ChartSpec = {
    type: 'point',
    data: finalData,
    encode: hasSize
      ? { x: 'x', y: 'y', size: 'size', color: 'type', shape: finalConfig.shape ?? 'circle' }
      : { x: 'x', y: 'y', color: 'type', shape: finalConfig.shape ?? 'circle' },
    style: { fillOpacity: 0.7 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  if (finalConfig.jitter) {
    pointMark.transform = [{ type: 'dodgeX' }];
  }

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    theme: theme.g2Theme,
    children: [pointMark],
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
