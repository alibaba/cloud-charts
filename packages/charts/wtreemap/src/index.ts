import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createTreemapModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  TreemapChartConfig,
  TreemapData,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WtreemapModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: TreemapData;
  config?: TreemapChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WtreemapModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWtreemapModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WtreemapModelOptions<TChart>,
): WtreemapModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createTreemapModel({
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

export { createTreemapModel, normalizeTreemapData } from '@alicloud/cloud-charts-core';
export type { TreemapChartConfig, TreemapData, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
