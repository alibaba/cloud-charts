import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createMinilineModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  MinilineChartConfig,
  LineSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WminilineModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: LineSeries[];
  config?: MinilineChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WminilineModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWminilineModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WminilineModelOptions<TChart>,
): WminilineModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createMinilineModel({
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

export { createMinilineModel, normalizeLineData } from '@alicloud/cloud-charts-core';
export type { MinilineChartConfig, LineSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
