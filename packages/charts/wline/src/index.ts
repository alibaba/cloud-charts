import type { G2RenderTarget, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';
import {
  createChart,
  createLineSpec,
  createLineModel,
  renderChart,
  registerLegacyInteractions,
  defaultG2Renderer,
} from '@alicloud/cloud-charts-core';
import type {
  ChartModel,
  ChartRuntimeContext,
  LineChartConfig,
  LineSeries,
  LineSpecConfig,
  NativeChartInstance,
} from '@alicloud/cloud-charts-core';

export interface WlineOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: LineSeries[];
  config?: LineSpecConfig;
  /** 可选；不传则使用 @alicloud/cloud-charts-core 自带的 G2 5 默认渲染器（autoFit + 已注册断轴 shape）。 */
  renderer?: G2SpecRenderer<TChart>;
}

export interface WlineModelOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  data: LineSeries[];
  config?: LineChartConfig;
  context?: ChartRuntimeContext;
  /** 可选；不传则使用 @alicloud/cloud-charts-core 自带的 G2 5 默认渲染器。 */
  renderer?: G2SpecRenderer<TChart>;
}

export interface WlineModelInstance<TChart extends G2RenderTarget> {
  chart: NativeChartInstance<TChart>;
  model: ChartModel;
}

export type WlineInstance<TChart extends G2RenderTarget> = NativeChartInstance<TChart>;

function resolveRenderer<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart> | undefined,
): G2SpecRenderer<TChart> {
  return renderer ?? (defaultG2Renderer as unknown as G2SpecRenderer<TChart>);
}

export function createWline<TChart extends G2RenderTarget = G2ChartLike>(
  options: WlineOptions<TChart>,
): WlineInstance<TChart> {
  registerLegacyInteractions();

  return createChart({
    container: options.container,
    renderer: resolveRenderer(options.renderer),
    spec: createLineSpec(options.data, options.config),
  });
}

export function renderWline<TChart extends G2RenderTarget = G2ChartLike>(
  options: WlineOptions<TChart>,
): WlineInstance<TChart> {
  registerLegacyInteractions();

  return renderChart({
    container: options.container,
    renderer: resolveRenderer(options.renderer),
    spec: createLineSpec(options.data, options.config),
  });
}

/** 走完整业务运行时模型（rules/scale/theme/legend/tooltip/axis/marks/guide/zoom/slider）后渲染。 */
export function renderWlineModel<TChart extends G2RenderTarget = G2ChartLike>(
  options: WlineModelOptions<TChart>,
): WlineModelInstance<TChart> {
  registerLegacyInteractions();

  const model = createLineModel({
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

export { createLineSpec, createLineModel, normalizeLineData, registerLegacyInteractions } from '@alicloud/cloud-charts-core';
export type {
  ChartModel,
  ChartRuntimeContext,
  LineChartConfig,
  LineSeries,
  LineSpecConfig,
} from '@alicloud/cloud-charts-core';
