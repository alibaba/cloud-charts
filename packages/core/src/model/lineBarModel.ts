import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getLineBarDefaultConfig, type LineBarChartConfig } from './lineBarDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { LineBarSeries, NormalizedLineBarRecord } from './lineBar';
import { normalizeLineBarData } from './lineBar';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2LineBar';

export interface CreateLineBarModelInput {
  data: LineBarSeries[];
  config?: LineBarChartConfig;
  context?: ChartRuntimeContext;
}

export function createLineBarModel(input: CreateLineBarModelInput): ChartModel {
  const pipeline = runRuntimePipeline<LineBarSeries[], LineBarChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getLineBarDefaultConfig,
    normalizeData: (data) => normalizeLineBarData(data) as unknown as Array<Record<string, never>>,
  });

  const { context, finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedLineBarRecord[];

  // 分离 bar 与 line 数据
  const barData = finalData.filter((d) => d.geomType === 'bar');
  const lineData = finalData.filter((d) => d.geomType === 'line');

  const xAxisSpec = normalizeAxis(finalConfig.xAxis ?? {}, {
    field: 'x',
    token: theme.token,
  });
  const yAxisSpec = normalizeYAxis((finalConfig.yAxis as never) ?? {}, {
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

  const children: ChartSpec[] = [];

  // 柱：interval mark
  if (barData.length > 0) {
    const intervalSpec: ChartSpec = {
      type: 'interval',
      data: barData,
      encode: { x: 'x', y: 'y', color: 'type' },
      transform: finalConfig.stack ? [{ type: 'stackY' }] : [{ type: 'dodgeX' }],
      tooltip: tooltipModel.markSpec,
    } as ChartSpec;
    children.push(intervalSpec);
  }

  // 线：line mark（含可选 area）
  if (lineData.length > 0) {
    if (finalConfig.area) {
      children.push({
        type: 'area',
        data: lineData,
        encode: { x: 'x', y: 'y', color: 'type' },
        style: { fillOpacity: 0.2 },
        tooltip: false,
      } as ChartSpec);
    }
    children.push({
      type: 'line',
      data: lineData,
      encode: { x: 'x', y: 'y', color: 'type' },
      style: { lineWidth: 2 },
      tooltip: tooltipModel.markSpec,
    } as ChartSpec);
  }

  const axisSpec: Record<string, unknown> = { x: xAxisSpec };
  if (yAxisSpec.y) axisSpec.y = yAxisSpec.y;
  if (yAxisSpec.y1) axisSpec.y1 = yAxisSpec.y1;

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    axis: axisSpec,
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
