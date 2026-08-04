# Vanilla per-chart package functions

Each chart ships as `@alicloud/cloud-charts-{name}` (drop the leading `w`): `wbar → @alicloud/cloud-charts-bar`.
Types come from `@alicloud/cloud-charts-core` and are also re-exported by each package.

## Options objects

All functions take one options object.

```ts
import type { G2SpecRenderer } from '@alicloud/cloud-charts-core';

interface WxxxModelOptions {
  container: HTMLElement;
  data: XxxSeries[] | XxxTreeData | SankeyData;
  config?: XxxChartConfig;
  context?: ChartRuntimeContext;
  renderer?: G2SpecRenderer<unknown>;
}

interface WxxxOptions {
  container: HTMLElement;
  data: XxxSeries[];
  config?: XxxSpecConfig;
  renderer?: G2SpecRenderer<unknown>;
}
```

## Functions per package

| function | availability | returns | pipeline |
|----------|-------------|---------|----------|
| `renderWxxxModel(opts)` | All charts | `{ chart: NativeChartInstance, model: ChartModel }` | Full model/rules/theme/legend/tooltip/axis/zoom/slider pipeline. |
| `renderWxxx(opts)` | Bar / Line / Pie only | `NativeChartInstance` | Slim spec path; use model path for theme parity. |
| `createWxxx(opts)` | Bar / Line / Pie only | `NativeChartInstance` before render | Call `.render()` yourself. |

Charts without the slim spec path, and therefore using `renderWxxxModel`, include Scatter, Radar, Funnel, Nightingale, Histogram, Box, Heatmap, Hexagonal, LineBar, LineScatter, Linebox, Candlestick, Sunburst, Treemap, Hierarchy, Sankey, Rectangle, Map, Miniline, and MultiCircle.

Each package also re-exports `createXxxSpec`, `createXxxModel`, `normalizeXxxData`, and types from core.

## NativeChartInstance

| method | effect |
|--------|--------|
| `render()` | Paint the chart. |
| `changeData(nextData)` | Replace only data and render; prefer for streaming data. |
| `update(nextSpec)` | Reapply full spec and render. |
| `resize(w?, h?)` | Resize with explicit numbers or force-fit. |
| `destroy()` | Tear down; call on unmount. |
| `.chart` / `getChartInstance()` | Access the underlying chart instance. |

## ChartModel

`{ spec, legend, tooltip, state, ... }` contains the assembled native spec and companion UI models.

## Theming

- Model path: pass `context: { theme: 'normal' | 'dark' | 'yunxiao', locale: 'zh-CN' | 'en-US' }`.
- Slim spec path: no runtime context; use model path if you need theme/legend/tooltip parity with wrapped components.
