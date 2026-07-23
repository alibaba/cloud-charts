import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createSunburstModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  SunburstChartConfig,
  SunburstData,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WsunburstModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: SunburstData;
  config?: SunburstChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WsunburstModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWsunburstModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WsunburstModelOptions<TChart>,
): WsunburstModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createSunburstModel({
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

export { createSunburstModel, normalizeSunburstData } from '@alicloud/cloud-charts-core';
export type { SunburstChartConfig, SunburstData, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
