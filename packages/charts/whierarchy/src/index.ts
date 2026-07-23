import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createHierarchyModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  HierarchyChartConfig,
  HierarchyData,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WhierarchyModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: HierarchyData;
  config?: HierarchyChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WhierarchyModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWhierarchyModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WhierarchyModelOptions<TChart>,
): WhierarchyModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createHierarchyModel({
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

export { createHierarchyModel, normalizeHierarchyData } from '@alicloud/cloud-charts-core';
export type { HierarchyChartConfig, HierarchyData, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
