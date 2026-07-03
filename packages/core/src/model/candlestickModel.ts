import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getCandlestickDefaultConfig, type CandlestickChartConfig } from './candlestickDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { CandlestickSeries, NormalizedCandlestickRecord } from './candlestick';
import { normalizeCandlestickData } from './candlestick';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Wcandlestick';

export interface CreateCandlestickModelInput {
  data: CandlestickSeries[];
  config?: CandlestickChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * K 线图：interval mark + 自定义 shape='candlestick' + 涨跌颜色映射。
 * G2 v5 内置 candlestick mark；y 字段需要数组 [open, close, low, high]。
 */
export function createCandlestickModel(input: CreateCandlestickModelInput): ChartModel {
  const pipeline = runRuntimePipeline<CandlestickSeries[], CandlestickChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getCandlestickDefaultConfig,
    normalizeData: (data) => normalizeCandlestickData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedCandlestickRecord[];

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
      ? { ...finalConfig.tooltip, xAxisType: 'band', themeToken: theme.token }
      : { visible: finalConfig.tooltip !== false, xAxisType: 'band', themeToken: theme.token },
  );
  const legendInteractions = normalizeLegendInteractions(legendModel, {
    rawData: input.data as unknown as Array<Record<string, unknown>>,
  });
  const interactions = legendInteractions as InteractionModel[];

  const colors = Array.isArray(finalConfig.colors) ? finalConfig.colors as [string, string] : ['#ef5350', '#26a69a'];

  // G2 v5 candlestick mark：encode.y 接受 [open, close, low, high] 数组
  const candlestickMark: ChartSpec = {
    type: 'interval',
    data: finalData,
    encode: {
      x: 'x',
      y: (d: Record<string, unknown>) => [d.open, d.close, d.low, d.high],
      // 涨跌色映射：close >= open → 涨色，否则 跌色
      color: (d: Record<string, unknown>) => (Number(d.close) >= Number(d.open) ? 'rise' : 'fall'),
      shape: 'candlestick',
    },
    scale: { color: { domain: ['rise', 'fall'], range: colors } },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    theme: theme.g2Theme,
    children: [candlestickMark],
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
