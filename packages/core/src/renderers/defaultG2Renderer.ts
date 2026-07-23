import * as G2 from '@antv/g2';
import { customAxisBreaksShape } from '../runtime/axis';
import type { G2SpecRenderer } from '../adapters/g2/index';
import type { ChartSpec } from '../types/spec';

const ChartCtor: any = (G2 as any).Chart;
const registerFn: ((name: string, value: unknown) => void) | undefined = (G2 as any).register;

/**
 * 模块级一次性注册自定义形状（重复 import 也只注册一次）。
 */
let shapesRegistered = false;
function ensureShapesRegistered(): void {
  if (shapesRegistered) return;
  if (registerFn) {
    registerFn('shape.break', customAxisBreaksShape);
  }
  shapesRegistered = true;
}

ensureShapesRegistered();

export interface G2ChartLike {
  options(spec: ChartSpec): unknown;
  render(): unknown;
  destroy(): unknown;
  forceFit?(): unknown;
  changeSize?(width: number, height: number): unknown;
  on?(eventName: string, handler: (...args: unknown[]) => unknown): unknown;
  off?(eventName?: string, handler?: (...args: unknown[]) => unknown): unknown;
}

/**
 * G2 5 默认 spec 渲染器：
 *   - createChart: new Chart({ container, autoFit: true })
 *   - applySpec:   chart.options(spec)
 *   - destroyChart: chart.destroy()
 *
 * 同时在模块加载时注册自定义形状（断轴），用户调用 renderWxxxModel 时不需要任何额外配置。
 *
 * 如果需要自定义（例如改 G2 主题、autoFit 关闭、padding 等），可以自己构造 G2SpecRenderer
 * 并显式传给 renderWxxxModel({ renderer })。
 */
export const defaultG2Renderer: G2SpecRenderer<G2ChartLike> = {
  createChart(container: HTMLElement) {
    return new ChartCtor({ container, autoFit: true });
  },
  applySpec(chart: G2ChartLike, spec: ChartSpec) {
    chart.options(spec);
  },
  destroyChart(chart: G2ChartLike) {
    chart.destroy();
  },
};
