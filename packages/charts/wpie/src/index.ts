import type { G2RenderTarget, G2SpecRenderer } from '@alicloud/cloud-charts-core';
import { createChart, createPieSpec, createPieModel, renderChart, registerLegacyInteractions } from '@alicloud/cloud-charts-core';
import type {
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
  PieChartConfig,
  PieSeries,
  PieSpecConfig,
} from '@alicloud/cloud-charts-core';

export interface WpieOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: PieSeries[];
  config?: PieSpecConfig;
  renderer: G2SpecRenderer<TChart>;
}

export interface WpieModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: PieSeries[];
  config?: PieChartConfig;
  context?: ChartRuntimeContext;
  renderer: G2SpecRenderer<TChart>;
}

export interface WpieModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

export type WpieInstance<TChart extends G2RenderTarget> = NativeChartInstance<TChart>;

export function createWpie<TChart extends G2RenderTarget>(
  options: WpieOptions<TChart>,
): WpieInstance<TChart> {
  registerLegacyInteractions();
  return createChart({
    container: options.container,
    renderer: options.renderer,
    spec: createPieSpec(options.data, options.config),
  });
}

export function renderWpie<TChart extends G2RenderTarget>(
  options: WpieOptions<TChart>,
): WpieInstance<TChart> {
  registerLegacyInteractions();
  return renderChart({
    container: options.container,
    renderer: options.renderer,
    spec: createPieSpec(options.data, options.config),
  });
}

/** 走完整业务运行时模型（rules/theme/legend/tooltip）后渲染。 */
export function renderWpieModel<TChart extends G2RenderTarget>(
  options: WpieModelOptions<TChart>,
): WpieModelInstance<TChart> {
  registerLegacyInteractions();
  const model = createPieModel({
    data: options.data,
    config: options.config,
    context: options.context,
  });
  const chart = renderChart({
    container: options.container,
    renderer: options.renderer,
    spec: model.spec,
  });
  return { chart, model };
}

export { createPieSpec, createPieModel, normalizePieData } from '@alicloud/cloud-charts-core';
export type {
  ChartModel,
  ChartRuntimeContext,
  PieChartConfig,
  PieSeries,
  PieSpecConfig,
} from '@alicloud/cloud-charts-core';
