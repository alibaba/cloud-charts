import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createMapModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  MapChartConfig,
  MapSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WmapModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: MapSeries[];
  config?: MapChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WmapModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWmapModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WmapModelOptions<TChart>,
): WmapModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createMapModel({
    data: options.data,
    config: options.config,
    context: options.context,
  });
  const chart = renderChart({
    container: options.container,
    renderer: resolveRenderer(options.renderer),
    spec: model.spec,
  });
  return { chart, model };
}

export { createMapModel, normalizeMapData } from '@alicloud/cloud-charts-core';
export type { MapChartConfig, MapSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
