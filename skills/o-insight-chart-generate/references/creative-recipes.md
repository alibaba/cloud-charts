# Creative Recipes

Use these recipes as starting points for polished reports.

## Sales cockpit

Pattern: Overview → detail

- KPI: total revenue, growth rate, target completion.
- `Line`: monthly revenue trend.
- `Bar`: top regions or categories.
- `Pie`: channel composition.
- Insight copy: “本期收入主要由华东区域拉动，搜索渠道贡献最高。”

## Operations monitoring

Pattern: Trend + why

- KPI: current QPS, error rate, p95 latency.
- `Line`: QPS and latency trend.
- `Heatmap`: hour × service error density.
- `Bar`: top error services.
- Theme: `dark` works well for monitoring.

## Conversion diagnosis

Pattern: Funnel diagnosis

- `Funnel`: visit → signup → trial → pay.
- `Bar`: drop-off by channel.
- `Line`: conversion rate by week.
- Insight copy: “最大流失发生在试用到付费阶段，广告渠道流失更明显。”

## Quality distribution

Pattern: Distribution deep dive

- `Histogram`: score or latency distribution.
- `Box`: distribution by team/product line.
- `Scatter`: outlier relation between volume and quality.
- Insight copy: “P95 延迟集中在两个业务线，异常点与高流量时段相关。”

## Data templates

- Hourly monitoring: 24 points, values with morning/evening peaks.
- Monthly business: 12 points, mild seasonality plus one campaign spike.
- Daily operations: 30 points, weekdays higher than weekends.
- Regional comparison: 5–10 regions, sorted descending.
- Funnel: 4–6 ordered stages, monotonically decreasing.

## Visual polish

- Use one headline sentence above the charts.
- Add concise chart subtitles that state the insight, not just the metric name.
- Keep colors consistent across charts when the same categories repeat.
- Prefer one dominant chart and 2–3 supporting cards.
