import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createMultiCircleModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  MultiCircleChartConfig,
  MultiCircleSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WmulticircleModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: MultiCircleSeries[];
  config?: MultiCircleChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WmulticircleModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWmulticircleModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WmulticircleModelOptions<TChart>,
): WmulticircleModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createMultiCircleModel({
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

export { createMultiCircleModel, normalizeMultiCircleData } from '@alicloud/cloud-charts-core';
export type { MultiCircleChartConfig, MultiCircleSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
