import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createRectangleModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  RectangleChartConfig,
  RectangleSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WrectangleModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: RectangleSeries[];
  config?: RectangleChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WrectangleModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWrectangleModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WrectangleModelOptions<TChart>,
): WrectangleModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createRectangleModel({
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

export { createRectangleModel, normalizeRectangleData } from '@alicloud/cloud-charts-core';
export type { RectangleChartConfig, RectangleSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
