import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getNightingaleDefaultConfig, type NightingaleChartConfig } from './nightingaleDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { NightingaleSeries, NormalizedNightingaleRecord } from './nightingale';
import { normalizeNightingaleData } from './nightingale';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Nightingale';

export interface CreateNightingaleModelInput {
  data: NightingaleSeries[];
  config?: NightingaleChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 南丁格尔玫瑰图：polar coordinate + interval mark。
 * 旧版 src/Wnightingale 用 chart.coordinate('polar') + chart.interval()；
 * G2 v5 通过 spec.coordinate.type='polar' + type:'interval' 一致。
 */
export function createNightingaleModel(input: CreateNightingaleModelInput): ChartModel {
  const pipeline = runRuntimePipeline<NightingaleSeries[], NightingaleChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getNightingaleDefaultConfig,
    normalizeData: (data) => normalizeNightingaleData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedNightingaleRecord[];

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
    encode: { x: 'x', y: 'y', color: 'x' },
    style: { stroke: '#fff', lineWidth: 1 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;
  if (finalConfig.label) {
    intervalMark.labels = [{ text: 'x', position: 'outside' }];
  }

  const coordinate: Record<string, unknown> = { type: 'polar' };
  if (finalConfig.cycle && typeof finalConfig.innerRadius === 'number') {
    coordinate.innerRadius = finalConfig.innerRadius;
  } else if (finalConfig.cycle) {
    coordinate.innerRadius = 0.5;
  }

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate,
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
