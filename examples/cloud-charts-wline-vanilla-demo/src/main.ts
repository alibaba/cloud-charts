import { renderWlineModel, type LineSeries } from '@alicloud/cloud-charts-line';
import { g2Renderer } from './g2Renderer';

const container = document.getElementById('chart');
const updateButton = document.getElementById('update-btn');
const destroyButton = document.getElementById('destroy-btn');

if (!container) {
  throw new Error('chart container not found');
}

const ONE_HOUR = 60 * 60 * 1000;
const BASE_TIME = new Date('2026-06-01T00:00:00').getTime();

function buildTimeSeries(scale: number): LineSeries[] {
  const pointCount = 24;
  const buildPoints = (factor: number, phase: number): Array<[number, number]> =>
    Array.from({ length: pointCount }, (_, index) => {
      const timestamp = BASE_TIME + index * ONE_HOUR;
      const wave = Math.sin((index + phase) / 3) * 8 + 20;
      return [timestamp, Math.round(wave * factor * scale)];
    });

  return [
    { name: '当日 QPS', data: buildPoints(1.2, 0) },
    { name: '昨日 QPS', data: buildPoints(1, 2) },
  ];
}

const config = {
  symbol: true,
  legend: {},
  tooltip: {},
  xAxis: { type: 'time', mask: 'auto' },
};

function render(scale: number): void {
  const { model } = renderWlineModel({
    container: container as HTMLElement,
    renderer: g2Renderer,
    data: buildTimeSeries(scale),
    config,
    context: { language: 'zh-CN' },
  });
  // 便于在控制台核对运行时模型产出（scale/axis/legend/tooltip/marks）
  console.log('[wline model]', model.spec);
}

render(1);

updateButton?.addEventListener('click', () => {
  render(1 + Math.random());
});

destroyButton?.addEventListener('click', () => {
  if (container) {
    container.innerHTML = '';
  }
});
