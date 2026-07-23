import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createNightingaleModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  NightingaleChartConfig,
  NightingaleSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WnightingaleModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: NightingaleSeries[];
  config?: NightingaleChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WnightingaleModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWnightingaleModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WnightingaleModelOptions<TChart>,
): WnightingaleModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createNightingaleModel({
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

export { createNightingaleModel, normalizeNightingaleData } from '@alicloud/cloud-charts-core';
export type { NightingaleChartConfig, NightingaleSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
