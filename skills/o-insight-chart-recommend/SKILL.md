---
name: cloud-charts-chart-recommend
description: "根据业务场景推荐合适的 cloud-charts / cloud-charts widgets 可视化组件，并生成基础图表。用户不确定用什么图、提供数据集或分析目标、询问适合什么图、怎么可视化、趋势、对比、分布、占比、关系、流向、层级、推荐图表时必须使用。输出一个主推荐、可选备选、原因、数据形状和最小可运行组件代码。关键词：图表推荐、选图、可视化推荐、趋势、对比、分布、占比、关系、流向、基础图表。"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# cloud-charts Chart Recommend

Use this skill to turn an analysis goal or dataset into the right cloud-charts chart component. The output should make chart choice easy, then generate a basic chart through the component-library mental model.

## 1. Input and output contract

Input can be:

- A business question, such as “销售情况怎么可视化”.
- A dataset description, fields, or sample rows.
- A known goal such as trend, comparison, distribution, composition, relationship, flow, hierarchy, geo, or KPI.
- A request for advice only or for code.

Output should follow this structure:

1. Primary component recommendation.
2. One-sentence reason.
3. Expected data shape.
4. Up to two alternatives with tradeoffs.
5. Basic chart code when requested or when the user asks to “画出来”.

## 2. Workflow

1. Parse intent into three slots:
   - **Subject**: what is measured, such as revenue, QPS, conversion, error rate, traffic, cost.
   - **Goal**: compare, trend, distribution, composition, relationship, flow, hierarchy, geo, single-value.
   - **Target**: advice only, React code, vanilla code, or “unknown”.
2. Recommend one primary component and at most two alternatives.
3. Explain the primary recommendation in one sentence.
4. State the expected data shape.
5. If the user wants code or did not say “只要建议”, generate a minimal chart example.
6. When implementation details matter, follow `cloud-charts-chart-usage` rules.

Ask at most one short clarifying question only when the goal cannot be inferred from the data or wording.

## 2. Recommendation matrix

| User goal | Primary component | Alternatives | Why |
|---|---|---|---|
| Compare categories or rankings | `Bar` | `Radar`, `Nightingale` | Bars are easiest for categorical comparison. |
| Trend over ordered x or time | `Line` | `Miniline`, `LineBar` | Lines emphasize direction and change. |
| Volume + rate together | `LineBar` | `LineScatter` | Bars show volume; line/scatter shows rate. |
| Part-to-whole | `Pie` | `Nightingale`, `Treemap` | Pie is clear for ≤7 categories; treemap scales better. |
| Conversion stages | `Funnel` | `Bar`, `Sankey` | Funnel highlights ordered drop-off. |
| Relationship between two measures | `Scatter` | `Hexagonal`, `Heatmap` | Scatter shows correlation and outliers. |
| Distribution of one metric | `Histogram` | `Box` | Histogram shows shape; box shows quartiles/outliers. |
| Compare distributions | `Box` | `Linebox` | One box per group makes spread comparable. |
| Matrix or density | `Heatmap` | `Rectangle` | Color encodes value across two dimensions. |
| Flow between nodes | `Sankey` | `Hierarchy` | Width makes movement magnitude visible. |
| Hierarchy or nesting | `Treemap` | `Sunburst`, `Hierarchy` | Treemap compares size; sunburst emphasizes levels. |
| Geography | `Map` | `Scatter` with coordinates | Use when location is the primary dimension. |
| OHLC / finance | `Candlestick` | `Line` for close price | Candlestick keeps open/close/high/low. |
| Single KPI | `Wnumber`, `Wcircle`, `Wgauge` | `Miniline` | KPI widgets emphasize the current value. |

## 3. Output format

For recommendation-only requests:

```md
建议用 `Line`。
原因：你的 x 是时间，目标是看指标变化趋势。
数据形状：`{ name, data: [[timestamp, value]] }[]`。
备选：`Miniline` 适合 KPI 卡片；`LineBar` 适合同时看量和率。
```

For code requests:

1. Give the recommendation first.
2. Then provide a minimal React example by default unless the user asked for vanilla/Solid.
3. Keep the code focused: imports, data, config, component.

## 4. Basic React example pattern

```tsx
import { ChartProvider, Line } from '@alicloud/cloud-charts-react';
import type { LineSeries, LineChartConfig } from '@alicloud/cloud-charts-core';

const T0 = new Date('2026-07-01').getTime();
const D = 86_400_000;

const data: LineSeries[] = [
  { name: '成交额', data: [[T0, 120], [T0 + D, 180], [T0 + D * 2, 156]] },
];

const config: LineChartConfig = {
  xAxis: { type: 'time', mask: 'auto' },
  yAxis: { title: '成交额' },
  legend: false,
};

export default function Demo() {
  return (
    <ChartProvider theme="normal" locale="zh-CN">
      <Line data={data} config={config} height={320} />
    </ChartProvider>
  );
}
```

## 5. Basic vanilla example pattern

```ts
import { renderWbarModel } from '@alicloud/cloud-charts-bar';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [
  { name: '销售额', data: [['杭州', 120], ['上海', 180], ['北京', 156]] },
];

const config: BarChartConfig = { label: true, legend: false };

const { chart } = renderWbarModel({
  container: document.getElementById('chart')!,
  data,
  config,
  context: { theme: 'normal', locale: 'zh-CN' },
});

window.addEventListener('beforeunload', () => chart.destroy());
```

## 6. Data-shape hints

Read `references/chart-catalog.md` when the requested chart is not one of the common examples.

- `Bar`, `Line`, `Pie`, `Radar`, `Funnel`: usually `{ name, data: [[x, y]] }[]`.
- `Scatter`: `{ name, data: [[x, y, size?]] }[]`.
- `Heatmap` / `Rectangle`: `[[x, y, value]]` inside the documented wrapper.
- `Sunburst` / `Treemap` / `Hierarchy`: root tree object.
- `Sankey`: `{ nodes, links }`.
- `LineBar` / `LineScatter` / `Linebox`: series with `geomType` and optional `yAxis`.

## 7. Handoff

- If the user accepts the recommendation and asks for integration details, use `cloud-charts-chart-usage`.
- If the user wants a dashboard, visual report, screenshot, or creative multi-chart page, use `cloud-charts-chart-generate`.

## 8. Validation gate

Before finalizing a recommendation, verify:

1. The recommended component appears in the component catalog.
2. The reason matches the analytical goal, not just the metric name.
3. The stated data shape matches the component.
4. If code is generated, it follows `cloud-charts-chart-usage` component rules.
5. The answer does not require obsolete low-level charting knowledge.

If the goal is ambiguous, infer once and state the inference. If the user corrects it, revise once. Do not loop more than two recommendation rounds; after two rounds, give the best primary choice plus one alternative and ask the user to choose.

## 9. Resources

- `references/chart-catalog.md`: component chooser and data-shape quick reference.
- `references/basic-recipes.md`: copy-ready basic chart recipes.
