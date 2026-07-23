import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createLineboxModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  LineboxChartConfig,
  LineboxSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WlineboxModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: LineboxSeries[];
  config?: LineboxChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WlineboxModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWlineboxModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WlineboxModelOptions<TChart>,
): WlineboxModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createLineboxModel({
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

export { createLineboxModel, normalizeLineboxData } from '@alicloud/cloud-charts-core';
export type { LineboxChartConfig, LineboxSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
