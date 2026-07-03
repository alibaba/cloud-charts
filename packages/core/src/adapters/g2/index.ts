import type { ChartSpec } from '../../types/spec';

export interface G2RenderTarget {
  render(): unknown;
}

export interface G2SpecRenderer<TChart extends G2RenderTarget> {
  createChart(container: HTMLElement): TChart;
  applySpec(chart: TChart, spec: ChartSpec): void;
  destroyChart(chart: TChart): void;
}

export function renderG2Spec<TChart extends G2RenderTarget>(
  renderer: G2SpecRenderer<TChart>,
  container: HTMLElement,
  spec: ChartSpec,
): TChart {
  const chart = renderer.createChart(container);
  renderer.applySpec(chart, spec);
  chart.render();
  return chart;
}
