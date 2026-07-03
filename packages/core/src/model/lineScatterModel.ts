import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getLineScatterDefaultConfig, type LineScatterChartConfig } from './lineScatterDefaultConfig';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { LineScatterSeries, NormalizedLineScatterRecord } from './lineScatter';
import { normalizeLineScatterData } from './lineScatter';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2LineScatter';

export interface CreateLineScatterModelInput {
  data: LineScatterSeries[];
  config?: LineScatterChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 折线散点双坐标系：line + point 双 mark；
 * 通过 geomType 字段分流：scatter→point，line→line。
 */
export function createLineScatterModel(input: CreateLineScatterModelInput): ChartModel {
  const pipeline = runRuntimePipeline<LineScatterSeries[], LineScatterChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getLineScatterDefaultConfig,
    normalizeData: (data) => normalizeLineScatterData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedLineScatterRecord[];
  const lineData = finalData.filter((d) => d.geomType === 'line');
  const scatterData = finalData.filter((d) => d.geomType === 'scatter');

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
  if (scatterData.length > 0) {
    children.push({
      type: 'point',
      data: scatterData,
      encode: { x: 'x', y: 'y', color: 'type', shape: 'circle' },
      style: { fillOpacity: 0.7 },
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
