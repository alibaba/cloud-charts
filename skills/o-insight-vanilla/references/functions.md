# Vanilla per-chart package functions

Each chart ships as `@alicloud/cloud-charts-{name}` (drop the leading `w`): `wbar → @alicloud/cloud-charts-bar`.
Types come from `@alicloud/cloud-charts-core` (also re-exported by each package).

## Options objects (all functions take ONE options object)

```ts
interface WxxxModelOptions {           // Model path — ALL 23 charts
  container: HTMLElement;              // element, not selector; needs a height
  data: XxxSeries[] | XxxTreeData | SankeyData; // shape per chart
  config?: XxxChartConfig;             // full-feature config
  context?: ChartRuntimeContext;       // { theme?, locale?, ... } — theming lives here
  renderer?: G2SpecRenderer;           // defaults to defaultG2Renderer
}

interface WxxxOptions {                // Spec path — bar / line / pie ONLY
  container: HTMLElement;
  data: XxxSeries[];
  config?: XxxSpecConfig;              // slim config (no rules/theme)
  renderer?: G2SpecRenderer;
}
```

## Functions per package

| function | availability | returns | pipeline |
|----------|-------------|---------|----------|
| `renderWxxxModel(opts)` | ALL charts | `{ chart: NativeChartInstance, model: ChartModel }` | full: rules/scale/theme/legend/tooltip/axis/zoom/slider |
| `renderWxxx(opts)` | bar / line / pie only | `NativeChartInstance` | slim: `createXxxSpec` + render |
| `createWxxx(opts)` | bar / line / pie only | `NativeChartInstance` (NOT yet rendered) | slim: `createXxxSpec`; call `.render()` yourself |

Charts WITHOUT the spec path (only `renderWxxxModel`): everything except bar/line/pie —
scatter, radar, funnel, nightingale, histogram, box, heatmap, hexagonal, lineBar, lineScatter,
linebox, candlestick, sunburst, treemap, hierarchy, sankey, rectangle, map, miniline, multiCircle.

Each package also re-exports its `createXxxSpec` / `createXxxModel` / `normalizeXxxData` and types
from core, so you can build the spec yourself and hand it to the g2-spec native API if needed.

## NativeChartInstance (the `chart` you get back)

| method | effect |
|--------|--------|
| `render()` | paint |
| `changeData(nextData)` | replace only data + render (preferred for streaming) |
| `update(nextSpec)` | reapply full spec + render (rebuild axis/legend) |
| `resize(w?, h?)` | changeSize if numbers else forceFit |
| `destroy()` | tear down; call on unmount |
| `.chart` / `getChartInstance()` | underlying G2 chart |

## ChartModel (Model path only, the `model` you get back)

`{ spec, legend, tooltip, state, ... }` — use `legend`/`tooltip` models to render enhanced
React/DOM legends or free tooltips; `spec` is the assembled G2 spec actually rendered.

## Theming

- Model path: `context: { theme: 'normal' | 'dark' | 'yunxiao', locale: 'zh-CN' | 'en-US' }`.
- Spec path: no theming/context — use Model path if you need themes.
