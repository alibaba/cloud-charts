import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createLineScatterModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  LineScatterChartConfig,
  LineScatterSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WlinescatterModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: LineScatterSeries[];
  config?: LineScatterChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WlinescatterModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWlinescatterModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WlinescatterModelOptions<TChart>,
): WlinescatterModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createLineScatterModel({
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

export { createLineScatterModel, normalizeLineScatterData } from '@alicloud/cloud-charts-core';
export type { LineScatterChartConfig, LineScatterSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
