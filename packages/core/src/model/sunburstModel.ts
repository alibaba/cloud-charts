import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getSunburstDefaultConfig, type SunburstChartConfig } from './sunburstDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { SunburstData, NormalizedSunburstRecord } from './sunburst';
import { normalizeSunburstData } from './sunburst';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2MultiPie';

export interface CreateSunburstModelInput {
  data: SunburstData;
  config?: SunburstChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 旭日图（多重饼图）：G2 v5 无 'sunburst' mark，改用内置 'partition' mark + 极坐标（径向即旭日）。
 * partition 接受树结构、内部自做 layout；旧版 src/Wsunburst 用 @antv/data-set hierarchy.partition。
 */
export function createSunburstModel(input: CreateSunburstModelInput): ChartModel {
  const pipeline = runRuntimePipeline<SunburstData, SunburstChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getSunburstDefaultConfig,
    normalizeData: (data) => normalizeSunburstData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedSunburstRecord[];

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

  const coordinate: Record<string, unknown> = { type: 'polar' };
  if (finalConfig.cycle) {
    coordinate.innerRadius = finalConfig.innerRadius ?? 0.5;
  }

  // G2 v5 partition mark + 极坐标：径向布局即旭日图。
  // partition composite 会把自带的 coordinate.cartesian 合并覆盖 view 层，
  // 故必须在 mark 上显式覆写 polar，否则退化成冰柱图。
  const sunburstMark: ChartSpec = {
    type: 'partition',
    data: finalData,
    coordinate,
    axis: false,
    labels: [],
    encode: { value: 'value', color: 'name' },
    style: { stroke: '#fff', lineWidth: 1 },
    tooltip: tooltipModel.markSpec,
  } as ChartSpec;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    children: [sunburstMark],
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
