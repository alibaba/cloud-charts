import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getBoxDefaultConfig, type BoxChartConfig } from './boxDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { BoxSeries, NormalizedBoxRecord } from './box';
import { normalizeBoxData } from './box';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Box';

export interface CreateBoxModelInput {
  data: BoxSeries[];
  config?: BoxChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 箱型图 model：G2 v5 'box' mark + 五分位 y 数组。
 * 旧版 src/Wbox 用 chart.schema().shape('box')；G2 v5 改用顶层 type: 'box'。
 */
export function createBoxModel(input: CreateBoxModelInput): ChartModel {
  const pipeline = runRuntimePipeline<BoxSeries[], BoxChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getBoxDefaultConfig,
    normalizeData: (data) => normalizeBoxData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedBoxRecord[];

  const xAxisSpec = normalizeAxis(finalConfig.xAxis ?? {}, {
    field: 'x',
    token: theme.token,
  });
  const yAxisSpec = normalizeYAxis(finalConfig.yAxis ?? {}, {
    grid: finalConfig.grid,
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

  // G2 v5 box mark 需要 y 字段为五分位数组。这里用 transform: parseValue 在 G2 spec 层解包 JSON。
  const boxMark: ChartSpec = {
    type: 'box',
    data: finalData,
    encode: { x: 'x', y: (d: Record<string, unknown>) => JSON.parse(String(d.y)), color: 'type' },
    transform: finalConfig.dodge ? [{ type: 'dodgeX' }] : undefined,
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: { x: xAxisSpec, y: yAxisSpec.y },
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    theme: theme.g2Theme,
    children: [boxMark],
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
