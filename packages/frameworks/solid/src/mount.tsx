import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { Bar } from './charts/bar/index';
import { Pie } from './charts/pie/index';
import { Line } from './charts/line/index';
import type { BarSeries, BarChartConfig, PieSeries, PieChartConfig, LineSeries, LineChartConfig } from '@alicloud/cloud-charts-core';

export interface MountResult {
  update(data: any, config?: any): void;
  destroy(): void;
}

export function mountBar(
  container: HTMLElement,
  data: BarSeries[],
  config: BarChartConfig = {},
): MountResult {
  const [getData, setData] = createSignal(data);
  const [getConfig, setConfig] = createSignal(config);
  const dispose = render(
    () => <Bar data={getData()} config={getConfig()} />,
    container,
  );
  return {
    update(d, c) { setData(d); if (c) setConfig(c); },
    destroy() { dispose(); },
  };
}

export function mountPie(
  container: HTMLElement,
  data: PieSeries[],
  config: PieChartConfig = {},
): MountResult {
  const [getData, setData] = createSignal(data);
  const [getConfig, setConfig] = createSignal(config);
  const dispose = render(
    () => <Pie data={getData()} config={getConfig()} />,
    container,
  );
  return {
    update(d, c) { setData(d); if (c) setConfig(c); },
    destroy() { dispose(); },
  };
}

export function mountLine(
  container: HTMLElement,
  data: LineSeries[],
  config: LineChartConfig = {},
): MountResult {
  const [getData, setData] = createSignal(data);
  const [getConfig, setConfig] = createSignal(config);
  const dispose = render(
    () => <Line data={getData()} config={getConfig()} />,
    container,
  );
  return {
    update(d, c) { setData(d); if (c) setConfig(c); },
    destroy() { dispose(); },
  };
}
