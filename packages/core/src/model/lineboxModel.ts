import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getLineboxDefaultConfig, type LineboxChartConfig } from './lineboxDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { LineboxSeries, NormalizedLineboxRecord } from './linebox';
import { normalizeLineboxData } from './linebox';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Linebox';

export interface CreateLineboxModelInput {
  data: LineboxSeries[];
  config?: LineboxChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 折线箱型双坐标系：line + box 双 mark；
 * box y 字段 JSON 序列化的五分位数组，需要在 encode 解包。
 */
export function createLineboxModel(input: CreateLineboxModelInput): ChartModel {
  const pipeline = runRuntimePipeline<LineboxSeries[], LineboxChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getLineboxDefaultConfig,
    normalizeData: (data) => normalizeLineboxData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedLineboxRecord[];
  const lineData = finalData.filter((d) => d.geomType === 'line');
  const boxData = finalData.filter((d) => d.geomType === 'box');

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
  if (boxData.length > 0) {
    children.push({
      type: 'box',
      data: boxData,
      encode: { x: 'x', y: (d: Record<string, unknown>) => JSON.parse(String(d.y)), color: 'type' },
      tooltip: tooltipModel.markSpec,
    } as ChartSpec);
  }
  if (lineData.length > 0) {
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
