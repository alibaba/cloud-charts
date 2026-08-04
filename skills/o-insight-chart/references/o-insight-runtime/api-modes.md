# O-Insight API Modes

Use one public mode per chart instance.

## 1. Data+config components

Best for old aisc-widgets migration and common business charts.

React:

```tsx
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [
  { name: 'Revenue', data: [['Q1', 120], ['Q2', 180]] },
  { name: 'Cost', data: [['Q1', 80], ['Q2', 90]] },
];

<ChartProvider theme="light" locale="zh-CN">
  <Bar data={data} config={{ grid: true, group: true }} height={320} />
</ChartProvider>
```

Solid:

```tsx
import { ChartProvider, Bar } from '@alicloud/cloud-charts-solid';

<ChartProvider theme="light" locale="zh-CN">
  <Bar data={data} config={{ grid: true, group: true }} height={320} />
</ChartProvider>
```

Supported lifecycle props on React/Solid charts:

```tsx
<Bar
  data={data}
  config={config}
  interaction={{ elementHighlight: true }}
  event={{ 'element:click': (...args) => console.log(args) }}
  getChartInstance={(chart) => { chartRef.current = chart; }}
  chartRef={chartRef}
/>
```

## 2. Spec-first components

Best for custom compositions while keeping framework integration.

Solid:

```tsx
import { Chart, ChartProvider } from '@alicloud/cloud-charts-solid';
import type { ChartSpec } from '@alicloud/cloud-charts-core';

const spec: ChartSpec = {
  type: 'line',
  data: [{ day: 'Mon', value: 120 }, { day: 'Tue', value: 180 }],
  encode: { x: 'day', y: 'value' },
  scale: { x: { type: 'point' } },
};

<ChartProvider theme="light" locale="zh-CN">
  <Chart spec={spec} kind="line" height={320} />
</ChartProvider>
```

## 3. Native controller

Best for framework-agnostic code with full controller lifecycle.

```ts
import { createChart, defaultG2Renderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec } from '@alicloud/cloud-charts-core';

const controller = createChart({ container, spec, renderer: defaultG2Renderer });
controller.render();
controller.changeData(nextData);
controller.update(nextSpec);
controller.destroy();
```

## 4. Per-chart vanilla packages

Best for Vue, Angular, plain JS, or source-copy usage.

```ts
import { renderWlineModel } from '@alicloud/cloud-charts-line';

const { chart, model } = renderWlineModel({
  container,
  data,
  config: { grid: true, xAxis: { type: 'point' } },
  context: { theme: 'light', language: 'zh-CN' },
});

chart.destroy();
```

## 5. Escape hatches

Use `dataType:'g2'` for flat spec records while retaining O-Insight component theme/state:

```tsx
<Bar
  data={records as any}
  config={{
    dataType: 'g2',
    customConfig: { encode: { x: 'quarter', y: 'value', color: 'metric' } },
  }}
/>
```

Use `customConfig` for local native-spec overrides. Do not use it to replace the root `type`, `data`, or `encode` of a wrapped chart unless the chart model explicitly supports that merge point.
