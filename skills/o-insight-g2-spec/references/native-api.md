# Native G2 API — createChart / renderG2Spec / renderer

All exports from `@alicloud/cloud-charts-core`.

## Types

```ts
// ChartSpec = G2 v5 spec object (the thing chart.options(...) accepts)
import type { ChartSpec, G2SpecRenderer, G2ChartLike } from '@alicloud/cloud-charts-core';

interface NativeChartOptions<TChart> {
  container: HTMLElement;          // NOT a selector string
  spec: ChartSpec;
  renderer: G2SpecRenderer<TChart>; // required — library does not bundle G2
  event?: Record<string, (...args: unknown[]) => unknown>; // bound via chart.on
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

const controller = createChart({ container, spec, renderer: defaultG2Renderer });
controller.render();       // create + applySpec happen in ctor; call render() to paint
// renderChart(...) === createChart(...) then .render() in one call
```

`NativeChartInstance` methods:

| method | effect |
|--------|--------|
| `render()` | `chart.render()` |
| `update(nextSpec)` | reapply full spec + render (rebuilds axis/legend) |
| `changeData(nextData)` | replace only `spec.data` + render (keeps structure) — preferred for streaming |
| `resize(w?, h?)` | `changeSize(w,h)` if both numbers else `forceFit()` |
| `localRefresh()` | reapply current spec + render |
| `getChartInstance()` / `getChartRef()` / `.chart` | underlying G2 chart |
| `destroy()` | unbind events + `destroyChart` |

## Convenience — renderG2Spec

One-shot render, returns the raw G2 chart (already rendered), no controller:

```ts
import { renderG2Spec, defaultG2Renderer } from '@alicloud/cloud-charts-core';
const chart = renderG2Spec(defaultG2Renderer, container, spec);
// internally: createChart(container) → applySpec(chart, spec) → chart.render()
```

Use `createChart` when you need update/changeData/destroy; use `renderG2Spec` for static one-shots.

## defaultG2Renderer

```ts
// packages/core/src/renderers/defaultG2Renderer.ts
createChart:  (c) => new Chart({ container: c, autoFit: true })
applySpec:    (chart, spec) => chart.options(spec)
destroyChart: (chart) => chart.destroy()
```

Also registers the custom `shape.break` (axis-break) once at module load. Import it and pass along;
no extra setup needed for standard cases.

## Custom renderer (change G2 theme / disable autoFit / fixed size)

```ts
import { Chart } from '@antv/g2';
import type { G2SpecRenderer, ChartSpec } from '@alicloud/cloud-charts-core';

const renderer: G2SpecRenderer<Chart> = {
  createChart: (c) => new Chart({ container: c, autoFit: false, width: 640, height: 360, theme: 'classicDark' }),
  applySpec:   (chart, spec: ChartSpec) => chart.options(spec),
  destroyChart:(chart) => chart.destroy(),
};
```

## React lifecycle wrapper (raw spec inside a component)

```tsx
import { useEffect, useRef } from 'react';
import { createChart, defaultG2Renderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec } from '@alicloud/cloud-charts-core';

function G2Spec({ spec }: { spec: ChartSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const c = createChart({ container: ref.current, spec, renderer: defaultG2Renderer });
    c.render();
    return () => c.destroy();      // clean up on unmount
  }, [spec]);
  return <div ref={ref} style={{ height: 320 }} />; // container needs a height
}
```

> Note: this path is raw G2 — it does NOT apply cloud-charts themes or loading/empty/error overlays.
> If you need those, use the wrapped component with `config.dataType='g2'` (see escape-hatches.md).
