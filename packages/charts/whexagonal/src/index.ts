import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createHexagonalModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  HexagonalChartConfig,
  HexagonalSeries,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WhexagonalModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: HexagonalSeries[];
  config?: HexagonalChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<TChart>;
}

export interface WhexagonalModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function renderWhexagonalModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WhexagonalModelOptions<TChart>,
): WhexagonalModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createHexagonalModel({
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

export { createHexagonalModel, normalizeHexagonalData } from '@alicloud/cloud-charts-core';
export type { HexagonalChartConfig, HexagonalSeries, ChartModel, ChartRuntimeContext } from '@alicloud/cloud-charts-core';
