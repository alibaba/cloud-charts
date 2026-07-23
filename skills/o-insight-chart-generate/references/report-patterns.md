# Report Patterns

Use these patterns to compose 2–5 charts into one coherent visual story.

## 1. Overview → detail

Use for business summaries, sales, traffic, and operations dashboards.

- KPI row: `Wnumber` / `Wcircle` / `Wgauge` for headline metrics.
- Main chart: `Line` for trend.
- Detail chart: `Bar` for category or region breakdown.
- Optional: `Pie` for channel composition.

Story: “总体表现如何 → 变化趋势如何 → 哪些分类贡献最大”。

## 2. Trend + why

Use when the user asks not only what changed, but why.

- `Line`: metric over time.
- Stacked `Bar` or `Pie`: composition behind the change.
- `Scatter` or `Heatmap`: driver relationship or density.

Story: “指标发生变化 → 结构发生变化 → 可能的驱动因素”。

## 3. Funnel diagnosis

Use for conversion, retention, process, approval, and workflow analysis.

- `Funnel`: overall stage drop-off.
- `Bar`: drop-off by segment, channel, region, or team.
- `Line`: stage conversion over time.

Story: “损失发生在哪一层 → 哪类人/渠道更严重 → 问题是否在扩大”。

## 4. Distribution deep dive

Use for latency, price, score, quality, risk, and performance distribution.

- `Histogram`: distribution shape.
- `Box`: group comparison and outliers.
- `Scatter`: outlier drivers.

Story: “整体分布是否健康 → 哪些组波动更大 → 异常点可能来自哪里”。

## 5. Flow story

Use for traffic, user path, money flow, logistics, or dependency flow.

- `Sankey`: end-to-end flow.
- `Treemap`: final buckets or destination sizes.
- Optional `Bar`: top source/destination ranking.

Story: “流量从哪里来 → 去了哪里 → 哪些桶最大”。

## 6. Geo story

Use when location is the primary dimension.

- `Map`: regional overview.
- `Bar`: top/bottom regions.
- `Line`: regional trend over time.

Story: “空间分布如何 → 哪些区域领先/落后 → 趋势是否一致”。
