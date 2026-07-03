import { Chart } from '@antv/g2';
import type { G2SpecRenderer } from '@alicloud/cloud-charts-core';

export const g2Renderer: G2SpecRenderer<Chart> = {
  createChart(container: HTMLElement): Chart {
    return new Chart({
      container,
      autoFit: true,
    });
  },

  applySpec(chart: Chart, spec): void {
    chart.options(spec as unknown as Record<string, unknown>);
  },

  destroyChart(chart: Chart): void {
    chart.destroy();
  },
};
