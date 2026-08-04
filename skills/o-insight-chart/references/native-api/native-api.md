# Native spec API — createChart / renderG2Spec / renderer

All exports come from `@alicloud/cloud-charts-core`. These APIs are O-Insight public APIs even when their internal type names still include renderer-specific identifiers.

## Types

```ts
import type { ChartSpec, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';

interface NativeChartOptions<TChart> {
  container: HTMLElement;
  spec: ChartSpec;
  renderer: G2SpecRenderer<TChart>;
  event?: Record<string, (...args: unknown[]) => unknown>;
}

interface G2SpecRenderer<TChart> {
  createChart(container: HTMLElement): TChart;
  applySpec(chart: TChart, spec: ChartSpec): void;
  destroyChart(chart: TChart): void;
}
```

## Controller — createChart / renderChart

```ts
import { createChart, renderChart, defaultG2Renderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec, G2ChartLike } from '@alicloud/cloud-charts-core';

const controller = createChart<G2ChartLike>({ container, spec, renderer: defaultG2Renderer });
controller.render();

const rendered = renderChart({ container, spec, renderer: defaultG2Renderer });
```

`NativeChartInstance` methods:

| method | effect |
|--------|--------|
| `render()` | Paint the chart. |
| `update(nextSpec)` | Reapply a full spec and render; use for structure changes. |
| `changeData(nextData)` | Replace only `spec.data` and render; prefer for streaming data. |
| `resize(w?, h?)` | Resize with explicit numbers or force-fit. |
| `localRefresh()` | Reapply the current spec and render. |
| `getChartInstance()` / `getChartRef()` / `.chart` | Access the underlying chart instance. |
| `destroy()` | Unbind events and destroy the chart. |

## Convenience — renderG2Spec

One-shot render, returns the underlying chart instance after rendering:

```ts
import { renderG2Spec, defaultG2Renderer } from '@alicloud/cloud-charts-core';

const chart = renderG2Spec(defaultG2Renderer, container, spec);
```

Use `createChart` when you need update/changeData/destroy; use `renderG2Spec` for static one-shots.

## defaultG2Renderer

```ts
// packages/core/src/renderers/defaultG2Renderer.ts
createChart:  (container) => new Chart({ container, autoFit: true })
applySpec:    (chart, spec) => chart.options(spec)
destroyChart: (chart) => chart.destroy()
```

Import `defaultG2Renderer` from `@alicloud/cloud-charts-core` and pass it to native controller APIs. Do not ask users to install the underlying renderer separately.

## Custom renderer

Use `defaultG2Renderer` for user-facing examples. `G2SpecRenderer` is an advanced extension point for O-Insight/runtime code that already has access to a concrete renderer constructor.

```ts
import type { ChartSpec, G2SpecRenderer } from '@alicloud/cloud-charts-core';

const renderer: G2SpecRenderer<MyChart> = {
  createChart: (container) => createMyChart(container),
  applySpec: (chart, spec: ChartSpec) => applyOptions(chart, spec),
  destroyChart: (chart) => destroyMyChart(chart),
};
```

Do not ask application users to install or import renderer internals just to draw a chart.

## React lifecycle wrapper

```tsx
import { useEffect, useRef } from 'react';
import { createChart, defaultG2Renderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec } from '@alicloud/cloud-charts-core';

function NativeSpecChart({ spec }: { spec: ChartSpec }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const controller = createChart({ container: ref.current, spec, renderer: defaultG2Renderer });
    controller.render();
    return () => controller.destroy();
  }, [spec]);

  return <div ref={ref} style={{ height: 320 }} />;
}
```

This raw controller path does not apply O-Insight component themes or loading/empty/error overlays. If those are required, use a wrapped component with `config.dataType='g2'` and `customConfig`.
