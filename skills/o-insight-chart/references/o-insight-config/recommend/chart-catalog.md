# Chart Catalog

Use this catalog to choose one component and shape the first dataset.

| Component | Best for | Data shape preview |
|---|---|---|
| `Bar` | Category comparison, ranking, grouped/stacked comparison | `{ name, data: [[category, value]] }[]` |
| `Line` | Time or ordered trend | `{ name, data: [[x, value]] }[]` |
| `Miniline` | Compact trend inside KPI card | same as `Line`, usually one series |
| `Pie` | Part-to-whole with few categories | `{ name, data: [[label, value]] }[]` |
| `Nightingale` | Radial part-to-whole with emphasis on magnitude | same as `Pie` |
| `Funnel` | Ordered conversion stages | `{ name, data: [[stage, value]] }[]` |
| `Scatter` | Correlation and outliers | `{ name, data: [[x, y, size?]] }[]` |
| `Radar` | Multi-dimensional profile comparison | `{ name, data: [[dimension, value]] }[]` |
| `Histogram` | Distribution shape | `number[]` or chart-specific bins |
| `Box` | Quartiles, spread, outliers | `{ name, data: [[x, low, q1, median, q3, high]] }[]` |
| `Heatmap` | Matrix intensity | `{ name, data: [[x, y, value]] }[]` |
| `Hexagonal` | Dense scatter density | `[[x, y]]` or series wrapper by package contract |
| `LineBar` | Volume + rate dual-axis | series with `geomType: 'bar' | 'line'` |
| `LineScatter` | Volume + point/rate overlay | series with `geomType` |
| `Linebox` | Trend + distribution by group | series with `geomType` |
| `Candlestick` | OHLC finance | `{ name, data: [[x, open, close, low, high]] }[]` |
| `Sunburst` | Hierarchical part-to-whole, radial | root tree object |
| `Treemap` | Hierarchical part-to-whole, area comparison | root tree object |
| `Hierarchy` | Parent-child structure | root tree object |
| `Sankey` | Flow, transfer, path volume | `{ nodes, links }` |
| `Rectangle` | Grid/calendar-like matrix | `[[x, y, value]]` or documented wrapper |
| `Map` | Geographic distribution | region/coordinate records plus map config |
| `MultiCircle` | Multiple progress/circle indicators | KPI-style values |

## Quick decisions

- Too many pie slices? Use `Treemap` or sorted `Bar`.
- Long category labels? Use horizontal `Bar` when supported by config, or keep labels short.
- Time x values are real dates? Use timestamps and time axis config.
- Two metrics with different units? Use `LineBar` and dual-axis config.
- Need one number, not a chart? Use KPI widgets.
