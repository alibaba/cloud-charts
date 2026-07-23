import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createScatterModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  ScatterChartConfig,
  ScatterSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WscatterModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: ScatterSeries[];
  config?: ScatterChartConfig;
  context?: ChartRuntimeContext;
  /** 可选；不传则使用 @alicloud/cloud-charts-core 自带的 G2 5 默认渲染器。 */
  renderer?: G2SpecRenderer<TChart>;
}

export interface WscatterModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWscatterModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WscatterModelOptions<TChart>,
): WscatterModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createScatterModel({
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

export { createScatterModel, normalizeScatterData } from '@alicloud/cloud-charts-core';
export type {
  ScatterChartConfig,
  ScatterSeries,
  ChartModel,
  ChartRuntimeContext,
} from '@alicloud/cloud-charts-core';
