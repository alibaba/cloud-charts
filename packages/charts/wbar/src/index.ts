import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createChart,
  createBarSpec,
  createBarModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  BarChartConfig,
  BarSeries,
  BarSpecConfig,
  ChartModel,
  ChartRuntimeContext,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WbarOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: BarSeries[];
  config?: BarSpecConfig;
  /** 可选；不传则使用 @alicloud/cloud-charts-core 自带的 G2 5 默认渲染器（autoFit + 已注册断轴 shape）。 */
  renderer?: G2SpecRenderer<TChart>;
}

export interface WbarModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: BarSeries[];
  config?: BarChartConfig;
  context?: ChartRuntimeContext;
  /** 可选；不传则使用 @alicloud/cloud-charts-core 自带的 G2 5 默认渲染器。 */
  renderer?: G2SpecRenderer<TChart>;
}

export interface WbarModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

export type WbarInstance<TChart extends G2RenderTarget> = NativeChartInstance<TChart>;

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function createWbar<TChart extends G2RenderTarget = G2ChartLike>(
  options: WbarOptions<TChart>,
): WbarInstance<TChart> {
  registerLegacyInteractions();

  return createChart({
    container: options.container,
    renderer: resolveRenderer(options.renderer),
    spec: createBarSpec(options.data, options.config),
  });
}

export function renderWbar<TChart extends G2RenderTarget = G2ChartLike>(
  options: WbarOptions<TChart>,
): WbarInstance<TChart> {
  registerLegacyInteractions();

  return renderChart({
    container: options.container,
    renderer: resolveRenderer(options.renderer),
    spec: createBarSpec(options.data, options.config),
  });
}

/** 走完整业务运行时模型（rules/scale/theme/legend/tooltip/axis/zoom/slider）后渲染。 */
export function renderWbarModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WbarModelOptions<TChart>,
): WbarModelInstance<TChart> {
  registerLegacyInteractions();

  const model = createBarModel({
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

export { createBarSpec, createBarModel, normalizeBarData } from '@alicloud/cloud-charts-core';
export type {
  BarChartConfig,
  BarSeries,
  BarSpecConfig,
  ChartModel,
  ChartRuntimeContext,
} from '@alicloud/cloud-charts-core';
