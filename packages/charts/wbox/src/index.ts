import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createBoxModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  BoxChartConfig,
  BoxSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WboxModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: BoxSeries[];
  config?: BoxChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WboxModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWboxModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WboxModelOptions<TChart>,
): WboxModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createBoxModel({
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

export { createBoxModel, normalizeBoxData } from '@alicloud/cloud-charts-core';
export type { BoxChartConfig, BoxSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
