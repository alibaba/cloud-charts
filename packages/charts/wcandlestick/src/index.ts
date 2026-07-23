import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createCandlestickModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  CandlestickChartConfig,
  CandlestickSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WcandlestickModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: CandlestickSeries[];
  config?: CandlestickChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WcandlestickModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWcandlestickModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WcandlestickModelOptions<TChart>,
): WcandlestickModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createCandlestickModel({
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

export { createCandlestickModel, normalizeCandlestickData } from '@alicloud/cloud-charts-core';
export type { CandlestickChartConfig, CandlestickSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
