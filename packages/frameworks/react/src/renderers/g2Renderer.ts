import * as G2 from '@antv/g2';
import { customAxisBreaksShape } from '@alicloud/cloud-charts-core';
import type { G2SpecRenderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec } from '@alicloud/cloud-charts-core';

const ChartCtor: any = (G2 as any).Chart || ((G2 as any).default && (G2 as any).default.Chart);
const register: ((name: string, value: unknown) => void) | undefined = (G2 as any).register;

if (register) {
  register('shape.break', customAxisBreaksShape);
}

interface G2ChartLike {
  options(spec: ChartSpec): unknown;
  render(): unknown;
  destroy(): unknown;
  forceFit?(): unknown;
  changeSize?(width: number, height: number): unknown;
  on?(eventName: string, handler: (...args: unknown[]) => unknown): unknown;
  off?(eventName?: string, handler?: (...args: unknown[]) => unknown): unknown;
}

/**
 * React 包默认 G2 5 渲染器，行为与 stories/_helpers/g2Renderer.js 一致。
 * 业务侧不应直接依赖 @antv/g2，请通过 useChart / Bar / Line 等组件使用。
 */
export const g2Renderer: G2SpecRenderer<G2ChartLike> = {
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

export type { G2ChartLike };
