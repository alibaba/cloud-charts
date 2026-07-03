import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getFunnelDefaultConfig, type FunnelChartConfig } from './funnelDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { FunnelSeries, NormalizedFunnelRecord } from './funnel';
import { normalizeFunnelData } from './funnel';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Funnel';

export interface CreateFunnelModelInput {
  data: FunnelSeries[];
  config?: FunnelChartConfig;
  context?: ChartRuntimeContext;
}

export function createFunnelModel(input: CreateFunnelModelInput): ChartModel {
  const pipeline = runRuntimePipeline<FunnelSeries[], FunnelChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getFunnelDefaultConfig,
    normalizeData: (data) => normalizeFunnelData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedFunnelRecord[];

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
    style: { shape: finalConfig.shape === 'pyramid' ? 'pyramid' : 'funnel' },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;
  if (finalConfig.label) {
    intervalMark.labels = [
      {
        text: 'y',
        position: 'inside',
        style: { fill: '#fff', fontSize: 12 },
      },
    ];
  }

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate: { transform: [{ type: 'transpose' }] },
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
