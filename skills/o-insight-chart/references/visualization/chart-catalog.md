# Chart Catalog

All charts import from `@alicloud/cloud-charts-react`; types from `@alicloud/cloud-charts-core`.
Common props on every component: `data`, `config?`, `height?`, `width?`,
`theme?`, `loading?`, `emptyInfo?`. Wrap the tree in `<ChartProvider theme locale>`.

Data uses tuple arrays. A "series" is `{ name, data }`. Config is flat.

---

## Trend over time / continuous X

### Line — `<Line data={LineSeries[]} config={LineSpecConfig} />`
```ts
type LineSeries = { name: string; data: Array<[x, y]>; yAxis?: number; visible?: boolean };
type LineSpecConfig = { area?: boolean; stack?: boolean; spline?: boolean; symbol?: boolean;
  legend?: object|boolean; tooltip?: object|boolean;
  xAxis?: object|false; yAxis?: object|object[]|false; style?: object };
```
- **Time series:** numeric timestamps as x + `config.xAxis={ type:'time', mask:'auto' }`.
- **Categorical x:** `config.xAxis={ type:'cat' }` (e.g. month labels).
- Dual y-axis: give some series `yAxis:1`, pass `config.yAxis=[{}, {}]`.
- `area:true` → area chart; `stack:true` → stacked; `spline:true` → smooth.

### Miniline — `<Miniline data={LineSeries[]} />`
Sparkline: same shape as Line, no axes/legend/tooltip. For KPI cards.

### LineBar — `<LineBar data={LineBarSeries[]} config />`  (bar + line, dual-y)
```ts
type LineBarSeries = { name: string; data: Array<[x, y]>;
  geomType?: 'bar'|'line'; yAxis?: 0|1; visible?: boolean };
// config: legend, tooltip, xAxis, yAxis (object|object[]|false), stack?, area?
```
Best for "volume (bars) + rate (line)" combos on two y-axes.

### LineScatter — per-series `geomType: 'line'|'scatter'`, dual-y. Trend + raw points.
### Linebox — per-series `geomType: 'line'|'box'`, dual-y. Trend + distribution band.

---

## Comparison across categories

### Bar — `<Bar data={BarSeries[]} config />`
```ts
type BarSeries = { name: string; data: Array<[category, value]>; visible?: boolean };
// config: stack?, dodge?, legend, tooltip, xAxis, yAxis, style
```
Vertical columns. Multiple series → grouped (dodge) or `stack:true`.

### Radar — `<Radar data config={{ area? }} />`
`data: [{ name, data: Array<[dimension, value]> }]`. Multi-dimension compare (3–8 axes).

### MultiCircle — `<MultiCircle data />`
`data: [{ name, value, color?, max? }]`. Concentric progress rings. Good for % KPIs.

---

## Distribution

### Histogram — `<Histogram data config={{ bin? }} />`
`data: number[]` (auto-binned) or `Array<[x, count]>`. `bin: { binWidth?, bins?, offset? }`.
Frequency distribution of one variable.

### Box — `<Box data config={{ dodge? }} />`
`data: [{ name, data: Array<[x, low, q1, median, q3, high]> }]`. Statistical spread / outliers.

### Scatter — `<Scatter data config={{ jitter?, shape? }} />`
`data: [{ name, data: Array<[x, y, size?]> }]`. Correlation between two variables; size = 3rd dim.

### Heatmap — `<Heatmap data config />`
`data: [{ name, data: Array<[x, y, value]> }]`. Density/matrix; value → color intensity.

### Hexagonal — `<Hexagonal data />`
`data: Array<[number, number]>`. Hex-bin density for dense point clouds.

---

## Composition / part-of-whole

### Pie — `<Pie data config={{ cycle?, innerRadius?, outerRadius?, startAngle?, endAngle?, autoSort?, filterNegativeNumbers? }} />`
`data: [{ name, data: Array<[label, value]> }]`. `cycle:true` → donut. ≤7 slices ideal.

### Nightingale — `<Nightingale data config={{ cycle? }} />`
`data: [{ name, data: Array<[label, value]> }]`. Rose chart; radius encodes value. Cyclical categories.

### Funnel — `<Funnel data config={{ shape?: 'column'|'pyramid' }} />`
`data: [{ name, data: Array<[stage, value]> }]`. Conversion / stage drop-off.

### Sunburst — `<Sunburst data />`  (a.k.a. multi-level pie)
`data: { name, value?, children?: SunburstNode[] }`. Single-root hierarchy, radial.

### Treemap — `<Treemap data />`
Same tree shape as Sunburst; nested rectangles. Good for many leaves with size.

### Hierarchy — `<Hierarchy data />`
Same tree shape; node-link tree layout. Org charts, taxonomies.

---

## Flow / relationship

### Sankey — `<Sankey data />`
```ts
type SankeyData = { nodes: Array<{ name }>; links|edges: Array<{ source; target; value }> };
```
Flow between stages/nodes; width = magnitude.

### Rectangle — `<Rectangle data />`
`data: Array<[x, y, value]>`. Calendar/grid cell chart.

---

## Finance

### Candlestick — `<Candlestick data />`
`data: [{ name, data: Array<[x, open, close, low, high]> }]`. OHLC price.

---

## Geo

### Map — `<Map data config={{ projection? }} geoData={GeoJSON} />`
`data: Array<{ name, value, lng?, lat? }>`, per-series `type?: 'area'|'point'|'heatmap'`.
Requires a `geoData` GeoJSON. Choropleth / bubble / geo-heatmap.

---

## Non-chart helpers
- `AiLoadingIcon` — AI-generating placeholder (`text` prop).
- `Wnumber`/`Wcount`/`Wcircle`/`Wgauge`/`Wnumbercard` — big-number / gauge KPI widgets.
- `TableLegend`/`FoldableLegend`/`GradientLegend`, `FreeTooltip` — legend/tooltip variants.

## Known rendering caveats
- Line/time: string x collapses to one point — use timestamps + `type:'time'`, or `type:'cat'`.
- Nightingale/Histogram/Candlestick had empty-render bugs in the showcase branch; verify
  output in-browser and fall back to a simpler chart if a given one renders blank.
