import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createHeatmapModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  HeatmapChartConfig,
  HeatmapSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WheatmapModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: HeatmapSeries[];
  config?: HeatmapChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WheatmapModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWheatmapModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WheatmapModelOptions<TChart>,
): WheatmapModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createHeatmapModel({
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

export { createHeatmapModel, normalizeHeatmapData } from '@alicloud/cloud-charts-core';
export type { HeatmapChartConfig, HeatmapSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
