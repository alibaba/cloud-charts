# Chart Selection Reference

Use this reference when the user has data or an analysis goal but has not chosen a chart. Recommend one primary chart and, when helpful, one alternative. Then generate code through the unified `o-insight-chart` modes.

## Selection rules

| User goal | Prefer | Alternative | Notes |
|---|---|---|---|
| Compare categories or rankings | `Bar` | `Rectangle` for grid-like categories | Use horizontal bar when labels are long. Use `stack:true` for part-to-whole by category. |
| Show trend over time or ordered x | `Line` | `Miniline` for compact KPI cards | Use timestamp x values for real time axes; use point/category axis for labels like `1月`. |
| Show part-to-whole | `Pie` | `Nightingale` | Use `Pie config.cycle` for donut. Avoid pie for too many categories. |
| Show stage conversion | `Funnel` | `Bar` | Good for ordered funnel stages like visit → signup → pay. |
| Show relationship between two measures | `Scatter` | `Hexagonal` for dense points | Add third tuple value for bubble size. |
| Show distribution | `Histogram` | `Box` | Histogram for frequency, Box for quartiles/outliers. |
| Show matrix intensity | `Heatmap` | `Rectangle` | Data requires x, y, and value. |
| Show hierarchy and size | `Treemap` | `Sunburst` | Use tree root object. Treemap is easier to compare area; Sunburst emphasizes levels. |
| Show hierarchy structure | `Hierarchy` | `Sunburst` | Use when parent-child relationship matters more than exact area. |
| Show flow or transfer | `Sankey` | `LineBar` for time-series inflow/outflow | Requires nodes and links. |
| Show geo distribution | `Map` | `Scatter` with lng/lat | Requires geo data or coordinates. |
| Show price OHLC | `Candlestick` | `Line` for close price only | Data tuple is x, open, close, low, high. |
| Show mixed metric types | `LineBar` / `LineScatter` / `Linebox` | Split into multiple coordinated component charts when it becomes too complex | Use `geomType` and `yAxis` per series. |
| Show single KPI | `Wnumber` / `Wcount` / `Wcircle` / `Wgauge` / `Wnumbercard` | `Miniline` with KPI trend | KPI widgets are not regular chart components. |

## Data-shape quick table

| Component | Wrapped data shape |
|---|---|
| `Bar` | `{ name: string, data: Array<[string | number, number]> }[]` |
| `Line` / `Miniline` | `{ name: string, data: Array<[string | number, number]>, yAxis?: number }[]` |
| `Pie` / `Nightingale` | `{ name: string, data: Array<[string, number]> }[]` |
| `Scatter` | `{ name: string, data: Array<[number, number, number?]> }[]` |
| `Radar` | `{ name: string, data: Array<[string, number]> }[]` |
| `Funnel` | `{ name: string, data: Array<[string, number]> }[]` |
| `Histogram` | `number[]` or `[x, count][]`, depending on config |
| `Box` | `{ name: string, data: Array<[x, low, q1, median, q3, high]> }[]` |
| `Heatmap` / `Rectangle` | `{ name: string, data: Array<[x, y, value]> }[]` or chart-specific tuple array |
| `Sunburst` / `Treemap` / `Hierarchy` | `{ name: string, value?: number, children?: TreeNode[] }` |
| `Sankey` | `{ nodes: Array<{ name: string }>, links: Array<{ source: string, target: string, value: number }> }` |
| `Candlestick` | `{ name: string, data: Array<[x, open, close, low, high]> }[]` |
| `LineBar` / `LineScatter` / `Linebox` | series array with `geomType`, `data`, and optional `yAxis` index |

## Recommendation response format

When recommending before coding, keep the answer short:

1. State the recommended chart.
2. Explain why in one sentence.
3. Mention the expected data shape.
4. Ask whether to generate React, vanilla, or Solid component-library code if the framework is unknown.

Example:

> 建议用 `Line`：你的 x 是连续时间，目标是看趋势。数据建议整理成 `{ name, data: [[timestamp, value]] }[]`；如果你要在 React 里用，我可以直接生成 `@alicloud/cloud-charts-react` 示例。
