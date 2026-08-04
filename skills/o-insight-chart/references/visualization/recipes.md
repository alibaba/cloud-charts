# Recipes — copy-ready snippets, theme recipes, pitfalls FAQ

Execution-layer thickness: paste-and-tweak building blocks so intent turns into
working code without guessing config keys.

## Theme recipes (set on `<ChartProvider theme>`)

| Theme | When to use |
|---|---|
| `normal` | Default light UI, dashboards, docs, product screenshots. Purple/teal AISC palette. |
| `dark` | Dark-mode apps, monitoring walls, TVs, night viewing. High contrast on black. |
| `yunxiao` | Cloud/DevOps ("云效") console context, to match that product's visual language. |

```tsx
// Whole subtree follows one theme + locale.
<ChartProvider theme="dark" locale="zh-CN">
  <App />
</ChartProvider>

// Per-chart override without changing the provider:
<Line data={data} config={config} theme="yunxiao" height={320} />
```

Themes flow through real components automatically — never hardcode colors to fake
a theme. If colors look like native spec default blue/cyan, a chart is bypassing `<ChartProvider>`.

## Copy-ready chart snippets (with realistic data)

Each block is self-contained: typed data + component call. Swap the data, keep
the config shape.

### Trend over time — Line (timestamps + time axis)
```tsx
import { Line } from '@alicloud/cloud-charts-react';
import type { LineSeries } from '@alicloud/cloud-charts-core';

const H = 3600_000, T0 = new Date('2026-07-01T00:00:00').getTime();
const qps: LineSeries[] = [
  { name: '今日', data: Array.from({ length: 24 }, (_, i) => [T0 + i * H, Math.round(Math.sin(i / 3) * 30 + 120)]) },
  { name: '昨日', data: Array.from({ length: 24 }, (_, i) => [T0 + i * H, Math.round(Math.sin((i + 2) / 3) * 26 + 110)]) },
];
<Line data={qps} config={{ symbol: true, legend: {}, tooltip: {}, xAxis: { type: 'time', mask: 'auto' } }} height={320} />
```

### Category comparison — Bar (categorical x)
```tsx
import { Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries } from '@alicloud/cloud-charts-core';

const sales: BarSeries[] = [
  { name: '北京', data: [['Q1', 320], ['Q2', 402], ['Q3', 511], ['Q4', 634]] },
  { name: '上海', data: [['Q1', 280], ['Q2', 388], ['Q3', 470], ['Q4', 590]] },
];
<Bar data={sales} config={{ legend: {}, tooltip: {} }} height={320} />
// stacked: config={{ stack: true, legend: {}, tooltip: {} }}
```

### Composition — Pie / donut
```tsx
import { Pie } from '@alicloud/cloud-charts-react';
import type { PieSeries } from '@alicloud/cloud-charts-core';

const source: PieSeries[] = [
  { name: '来源', data: [['直接访问', 42], ['搜索引擎', 30], ['社交媒体', 18], ['其它', 10]] },
];
<Pie data={source} config={{ cycle: true, legend: {}, tooltip: {} }} height={320} />
```

### Volume + rate — LineBar (dual y-axis)
```tsx
import { LineBar } from '@alicloud/cloud-charts-react';
import type { LineBarSeries } from '@alicloud/cloud-charts-core';

const mix: LineBarSeries[] = [
  { name: '订单量', geomType: 'bar', yAxis: 0, data: [['Mon', 820], ['Tue', 932], ['Wed', 901], ['Thu', 1034], ['Fri', 1290]] },
  { name: '转化率', geomType: 'line', yAxis: 1, data: [['Mon', 0.21], ['Tue', 0.24], ['Wed', 0.22], ['Thu', 0.26], ['Fri', 0.31]] },
];
<LineBar data={mix} config={{ legend: {}, tooltip: {}, yAxis: [{}, {}] }} height={320} />
```

### Distribution — Histogram
```tsx
import { Histogram } from '@alicloud/cloud-charts-react';
const latency = Array.from({ length: 200 }, () => Math.round(80 + Math.abs(Math.sin(Math.random() * 6)) * 220));
<Histogram data={latency} config={{ bin: { bins: 20 }, tooltip: {} }} height={320} />
```

### Correlation — Scatter
```tsx
import { Scatter } from '@alicloud/cloud-charts-react';
const pts = [{ name: '实例', data: Array.from({ length: 60 }, () => [Math.round(Math.random() * 100), Math.round(Math.random() * 100), Math.round(Math.random() * 40 + 4)]) }];
<Scatter data={pts} config={{ legend: {}, tooltip: {} }} height={320} />
```

### KPI number (no full chart)
```tsx
import { Wnumber } from '@alicloud/cloud-charts-react';
<Wnumber value={1289} unit="单/日" />
```

## Common-pitfalls FAQ

**Q: Line renders one vertical line / all points stacked at x=0.**
String x values with the default `type:'time'`. Use numeric timestamps +
`xAxis:{ type:'time', mask:'auto' }`, or switch to `xAxis:{ type:'cat' }` for labels.

**Q: Colors are native spec blue/cyan, not AISC purple/teal.**
The chart is rendering outside `<ChartProvider>` or via native spec native API. Wrap in
`<ChartProvider>` and use real `@alicloud/cloud-charts-react` components only.

**Q: A chart renders blank (Nightingale / Histogram / Candlestick).**
Known model bugs on some branches. Fall back to the nearest equivalent
(Pie / Bar / Line), render it, and tell the user you substituted.

**Q: Dual y-axis series share one scale.**
Give each series a `yAxis: 0|1` and pass `config.yAxis = [{}, {}]` (array of two).

**Q: Legend/tooltip missing.**
They are off unless requested: pass `legend: {}` and `tooltip: {}` (empty object
= enabled with defaults) in config.

**Q: Chart doesn't fill its container.**
Set `height`/`width` to `"100%"` and give the parent an explicit pixel height.

**Q: Theme won't switch at runtime.**
Change the `theme` prop on `<ChartProvider>`; it re-injects CSS variables. Don't
cache colors in your own state.

**Q: Vite "module not found @alicloud/cloud-charts-*".**
The alias paths in `vite.config.ts` don't point at the monorepo `packages/*/src`
entry files. Re-derive them relative to where the app lives (see scaffold-guide).
