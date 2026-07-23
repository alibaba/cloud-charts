import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createFunnelModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  FunnelChartConfig,
  FunnelSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WfunnelModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: FunnelSeries[];
  config?: FunnelChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WfunnelModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWfunnelModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WfunnelModelOptions<TChart>,
): WfunnelModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createFunnelModel({
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

export { createFunnelModel, normalizeFunnelData } from '@alicloud/cloud-charts-core';
export type {
  FunnelChartConfig,
  FunnelSeries,
  ChartModel,
  ChartRuntimeContext,
} from '@alicloud/cloud-charts-core';
