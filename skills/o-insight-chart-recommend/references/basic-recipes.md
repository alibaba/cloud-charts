# Basic Recipes

These recipes are intentionally small. For full integration details, follow `cloud-charts-chart-usage`.

## Trend line

Use when the user wants trend, growth, traffic over time, or KPI changes.

```tsx
import { ChartProvider, Line } from '@alicloud/cloud-charts-react';
import type { LineSeries, LineChartConfig } from '@alicloud/cloud-charts-core';

const T0 = new Date('2026-07-01').getTime();
const D = 86_400_000;
const data: LineSeries[] = [
  { name: '销售额', data: [[T0, 120], [T0 + D, 180], [T0 + D * 2, 156]] },
];
const config: LineChartConfig = { xAxis: { type: 'time', mask: 'auto' }, legend: false };

export default () => (
  <ChartProvider theme="normal" locale="zh-CN">
    <Line data={data} config={config} height={320} />
  </ChartProvider>
);
```

## Category comparison bar

```tsx
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [
  { name: '销售额', data: [['杭州', 120], ['上海', 180], ['北京', 156]] },
];
const config: BarChartConfig = { label: true, legend: false };

export default () => (
  <ChartProvider theme="normal" locale="zh-CN">
    <Bar data={data} config={config} height={320} />
  </ChartProvider>
);
```

## Part-to-whole pie

```tsx
import { ChartProvider, Pie } from '@alicloud/cloud-charts-react';
import type { PieSeries, PieChartConfig } from '@alicloud/cloud-charts-core';

const data: PieSeries[] = [
  { name: '渠道占比', data: [['搜索', 42], ['推荐', 28], ['广告', 18], ['其他', 12]] },
];
const config: PieChartConfig = { label: true, legend: { position: 'right' } };

export default () => (
  <ChartProvider theme="normal" locale="zh-CN">
    <Pie data={data} config={config} height={320} />
  </ChartProvider>
);
```

## Flow sankey

```tsx
import { ChartProvider, Sankey } from '@alicloud/cloud-charts-react';

const data = {
  nodes: [{ name: '首页' }, { name: '搜索' }, { name: '详情' }, { name: '支付' }],
  links: [
    { source: '首页', target: '搜索', value: 1200 },
    { source: '搜索', target: '详情', value: 760 },
    { source: '详情', target: '支付', value: 210 },
  ],
};

export default () => (
  <ChartProvider theme="normal" locale="zh-CN">
    <Sankey data={data as any} height={360} />
  </ChartProvider>
);
```
