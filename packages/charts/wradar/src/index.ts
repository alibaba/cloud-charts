import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createRadarModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  RadarChartConfig,
  RadarSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WradarModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: RadarSeries[];
  config?: RadarChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WradarModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWradarModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WradarModelOptions<TChart>,
): WradarModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createRadarModel({
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

export { createRadarModel, normalizeRadarData } from '@alicloud/cloud-charts-core';
export type {
  RadarChartConfig,
  RadarSeries,
  ChartModel,
  ChartRuntimeContext,
} from '@alicloud/cloud-charts-core';
