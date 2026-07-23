import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createHistogramModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  HistogramChartConfig,
  HistogramSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WhistogramModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: HistogramSeries[];
  config?: HistogramChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WhistogramModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWhistogramModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WhistogramModelOptions<TChart>,
): WhistogramModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createHistogramModel({
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

export { createHistogramModel, normalizeHistogramData } from '@alicloud/cloud-charts-core';
export type { HistogramChartConfig, HistogramSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
