import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getRadarDefaultConfig, type RadarChartConfig } from './radarDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { RadarSeries, NormalizedRadarRecord } from './radar';
import { normalizeRadarData } from './radar';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Radar';

export interface CreateRadarModelInput {
  data: RadarSeries[];
  config?: RadarChartConfig;
  context?: ChartRuntimeContext;
}

export function createRadarModel(input: CreateRadarModelInput): ChartModel {
  const pipeline = runRuntimePipeline<RadarSeries[], RadarChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getRadarDefaultConfig,
    normalizeData: (data) => normalizeRadarData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedRadarRecord[];

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

  const children: ChartSpec[] = [
    {
      type: 'line',
      data: finalData,
      encode: { x: 'x', y: 'y', color: 'type' },
      style: { lineWidth: 2 },
      tooltip: tooltipModel.markSpec,
    } as ChartSpec,
  ];

  if (finalConfig.area) {
    children.unshift({
      type: 'area',
      data: finalData,
      encode: { x: 'x', y: 'y', color: 'type' },
      style: { fillOpacity: 0.3 },
      tooltip: false,
    } as ChartSpec);
  }

  if (finalConfig.symbol) {
    children.push({
      type: 'point',
      data: finalData,
      encode: { x: 'x', y: 'y', color: 'type', shape: 'circle' },
      style: { fillOpacity: 1 },
      tooltip: false,
    } as ChartSpec);
  }

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate: { type: 'polar' },
    scale: {
      x: { padding: 0.5, align: 0 },
      y: { nice: true },
    },
    axis: {
      x: { grid: true, gridLineDash: null, tick: false },
      y: { gridLineDash: null, label: false },
    },
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    theme: theme.g2Theme,
    children,
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
