import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getMapDefaultConfig, type MapChartConfig } from './mapDefaultConfig';
import { normalizeLegend, normalizeLegendInteractions, normalizeTooltip } from '../runtime/features';
import type { MapSeries, NormalizedMapRecord } from './map';
import { normalizeMapData } from './map';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Map';

export interface CreateMapModelInput {
  data: MapSeries[];
  config?: MapChartConfig;
  context?: ChartRuntimeContext;
}

/**
 * 地图：G2 v5 'geoPath' mark + geoData（GeoJSON）。
 * 旧版 src/Wmap 依赖 @antv/data-set geo 投影；
 * 新版通过 G2 v5 内置 geo coordinate + geoPath mark 实现，geoData 由 caller 传入。
 *
 * 注意：本 model 不内置中国地图 GeoJSON（体积太大），需要 caller 传 config.geoData。
 */
export function createMapModel(input: CreateMapModelInput): ChartModel {
  const pipeline = runRuntimePipeline<MapSeries[], MapChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getMapDefaultConfig,
    normalizeData: (data) => normalizeMapData(data) as unknown as Array<Record<string, never>>,
  });

  const { finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedMapRecord[];

  const legendModel = normalizeLegend(finalConfig.legend, theme.token, {});
  const tooltipModel = normalizeTooltip(
    typeof finalConfig.tooltip === 'object'
      ? { ...finalConfig.tooltip, xAxisType: 'band', themeToken: theme.token }
      : { visible: finalConfig.tooltip !== false, xAxisType: 'band', themeToken: theme.token },
  );
  const legendInteractions = normalizeLegendInteractions(legendModel, { rawData: [] });
  const interactions = legendInteractions as InteractionModel[];

  const children: ChartSpec[] = [];

  // geoPath mark（填色区域）
  if (finalConfig.geoData) {
    children.push({
      type: 'geoPath',
      data: { type: 'inline', value: finalConfig.geoData } as unknown as ChartSpec['data'],
      encode: { color: 'name' },
      style: { stroke: '#fff', lineWidth: 0.5, fillOpacity: 0.85 },
      tooltip: tooltipModel.markSpec,
    } as ChartSpec);
  }

  // point mark（散点层）
  const pointData = finalData.filter((d) => d.lng !== undefined && d.lat !== undefined);
  if (pointData.length > 0) {
    children.push({
      type: 'point',
      data: pointData,
      encode: { x: 'lng', y: 'lat', size: 'value', color: 'type' },
      style: { fillOpacity: 0.7 },
      tooltip: tooltipModel.markSpec,
    } as ChartSpec);
  }

  const coordinate: Record<string, unknown> = {
    type: finalConfig.projection ?? 'geoMercator',
  };

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    coordinate,
    axis: false,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
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
