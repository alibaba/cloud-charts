import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createSankeyModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  SankeyChartConfig,
  SankeyData,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WsankeyModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: SankeyData;
  config?: SankeyChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WsankeyModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWsankeyModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WsankeyModelOptions<TChart>,
): WsankeyModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createSankeyModel({
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

export { createSankeyModel, normalizeSankeyData } from '@alicloud/cloud-charts-core';
export type { SankeyChartConfig, SankeyData, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
