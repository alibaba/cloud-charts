---
name: o-insight-chart
description: Generate O-Insight chart code and visualizations using @alicloud/cloud-charts-core, @alicloud/cloud-charts-react, @alicloud/cloud-charts-solid, per-chart @alicloud/cloud-charts-* packages, or spec-first/native spec mode. Use for any O-Insight/cloud chart request in React, Solid, vanilla JS, Vue, Angular, CLI source-copy, data+config components, spec-first charts, chart selection, theme/legend/tooltip/axis/adapter/rules behavior, migration from old aisc-widgets, or troubleshooting chart rendering. This is the single O-Insight chart skill; do not route to split native spec-branded skills.
---

# O-Insight Chart Skill

Use this skill as the **single source of truth** for O-Insight chart generation. It replaces the previous split chart skills and folds in:

- Complete native spec chart knowledge from the benchmark chart skill, debranded for O-Insight.
- O-Insight data+config component APIs for React, Solid, vanilla, and per-chart packages.
- Runtime rules, adapters, theme, legend, tooltip, axis, state, lifecycle, and escape-hatch behavior.

Do not tell users to install or use a native spec-branded package directly. O-Insight owns the public API. If the underlying spec grammar matters, call it **O-Insight native spec**.

## Decision gate

Pick exactly one public mode per chart instance:

1. **Spec-first mode (default for new charts)**
   - Use when the user wants maximum expressiveness, a hand-written spec, complex marks/compositions/transforms, or says “spec”.
   - Solid: `<Chart spec={spec} kind="bar|line|pie" />` from `@alicloud/cloud-charts-solid`.
   - React/native package boundary: `createChart({ container, spec, renderer: defaultG2Renderer })` from `@alicloud/cloud-charts-core`.
   - Use native spec references under `references/native-spec/**`.

2. **Data+config component mode**
   - Use when code already imports `Bar`, `Line`, `Pie`, etc., or user says “组件 / data config / 旧版升级”.
   - React: `@alicloud/cloud-charts-react` components.
   - Solid: `@alicloud/cloud-charts-solid` components.
   - Vanilla/Vue/Angular: per-chart render functions from `@alicloud/cloud-charts-bar`, `@alicloud/cloud-charts-line`, etc.
   - Use chart/config references under `references/frameworks/**` and `references/o-insight-config/**`.

3. **Escape-hatch mode**
   - Use when the user wants component theme/state plus native spec control.
   - `config.dataType = 'g2'` means input data is already flat spec records.
   - `config.customConfig` merges native spec fragments into generated spec.
   - Use `references/native-api/escape-hatches.md`.

When mode is unclear, default to spec-first for brand-new code and mention that data+config is better for old component migration.

## Public imports

Prefer these imports:

```ts
import { ChartProvider, Bar, Line, Pie, Chart } from '@alicloud/cloud-charts-react';
import { ChartProvider, Bar, Line, Pie, Chart } from '@alicloud/cloud-charts-solid';
import { createChart, defaultG2Renderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec, BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';
```

For non-React/Solid apps:

```ts
import { renderWbarModel } from '@alicloud/cloud-charts-bar';
```

Never require the user to install the underlying renderer directly.

## Supported chart catalog

Use only implemented O-Insight chart names:

`Bar`, `Line`, `Pie`, `Scatter`, `Radar`, `Funnel`, `Nightingale`, `Histogram`, `Box`, `Heatmap`, `Hexagonal`, `LineBar`, `LineScatter`, `Linebox`, `Candlestick`, `Sunburst`, `Treemap`, `Hierarchy`, `Sankey`, `Rectangle`, `Map`, `Miniline`, `MultiCircle`.

KPI/UI components: `Wnumber`, `Wcount`, `Wcircle`, `Wgauge`, `Wnumbercard`, `Wlistcontainer`, `Wplaceholder`, legacy container/icon components.

Do not invent names like `Column`, `Area`, `Donut`, `Rose`, `WordCloud`, or `GaugeChart`. Map them to implemented components/specs.

## Hard constraints

1. Keep data and config separate in data+config mode: data is values; visual behavior is config.
2. Use series+tuple data for most wrapped charts: `[{ name, data: [[x, y], ...] }]`.
3. Use flat records for spec-first mode: `[{ x, y, type }]`.
4. Use `ChartProvider` for framework theme/locale.
5. Wire lifecycle when requested: `getChartInstance`, `chartRef`, `event`, `interaction` are supported in React/Solid chart components.
6. For native controller mode, save the returned controller and call `destroy()` on unmount.
7. Do not expose implementation branding or ask users to install renderer internals.
8. If outputting runnable code, include container sizing; chart containers must have height.

## Native spec constraints

Native spec follows O-Insight's v5 spec grammar. Before writing uncommon marks/transforms/interactions, read the matching reference under `references/native-spec/**`.

Treat `references/native-spec/**` as a **spec grammar corpus**: extract the `ChartSpec` options object, but do not copy any direct `new Chart(...)`, `chart.options(...)`, or `chart.render()` scaffolding into user-facing output. Translate examples to O-Insight public APIs: Solid `<Chart spec={...} />`, or `createChart({ container, spec, renderer: defaultG2Renderer })` from `@alicloud/cloud-charts-core`.

Always follow these rules:

- One chart spec object per chart instance.
- Use `type`, `data`, `encode`, `scale`, `axis`, `legend`, `tooltip`, `transform`, `coordinate`, `children`.
- Multi-mark charts use `type: 'view'` with `children`.
- `transform` is always an array.
- `labels` is plural.
- Range encodings use `y`/`y1`, not `y: [start, end]`.
- Avoid decorative styles unless requested.
- Do not put hex colors in data and map them through `encode.color`; use `scale.color.range` or identity scale.

## Runtime rules and adapters

O-Insight wraps native spec with a runtime pipeline. Use it when matching old aisc-widgets behavior matters.

Read `references/o-insight-runtime/rules-adapters.md` before changing or explaining:

- empty/loading/error state behavior
- theme tokens and palette mapping
- axis/legend/tooltip normalization
- guide/mark conversion
- slider/scrollbar/zoom/legacy interactions
- `dataType:'g2'` and `customConfig`
- React/Solid lifecycle props

## Reference map

Load references only as needed:

- `references/o-insight-runtime/api-modes.md` — public API modes and examples.
- `references/o-insight-runtime/rules-adapters.md` — model/rules/adapter pipeline.
- `references/o-insight-config/charts/*.md` — wrapped chart data+config shape.
- `references/o-insight-config/config/*.md` — axis, legend, tooltip config mapping.
- `references/frameworks/react/**` — React component patterns.
- `references/frameworks/vanilla/functions.md` — per-chart package functions for Vue/Angular/plain JS.
- `references/native-api/**` — controller, renderer, dataType, customConfig escape hatches.
- `references/native-spec/marks/**` — native spec marks and chart recipes.
- `references/native-spec/components/**` — axis, legend, tooltip, label, slider, scrollbar.
- `references/native-spec/interactions/**` — interaction specs.
- `references/native-spec/transforms/**` and `references/native-spec/data/**` — data transforms.
- `references/visualization/**` — chart selection and visualization recipes.

## Output patterns

For React/Solid components, output complete snippets with imports, typed data, provider, and height:

```tsx
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [{ name: 'Revenue', data: [['Q1', 120], ['Q2', 180]] }];

export function Demo() {
  return (
    <ChartProvider theme="light" locale="zh-CN">
      <Bar data={data} config={{ grid: true }} height={320} />
    </ChartProvider>
  );
}
```

For spec-first Solid:

```tsx
import { Chart, ChartProvider } from '@alicloud/cloud-charts-solid';
import type { ChartSpec } from '@alicloud/cloud-charts-core';

const spec: ChartSpec = {
  type: 'interval',
  data: [{ quarter: 'Q1', value: 120 }],
  encode: { x: 'quarter', y: 'value' },
};

<ChartProvider theme="light" locale="zh-CN">
  <Chart spec={spec} kind="bar" height={320} />
</ChartProvider>
```

For vanilla/Vue/Angular:

```ts
import { renderWbarModel } from '@alicloud/cloud-charts-bar';

const { chart } = renderWbarModel({
  container: el,
  data,
  config: { grid: true },
  context: { theme: 'light', language: 'zh-CN' },
});

// unmount
chart.destroy();
```

## Validation checklist

Before finalizing chart code:

- Confirm the chosen mode matches existing code or user intent.
- Confirm imports come from O-Insight packages.
- Confirm data shape matches the chosen mode.
- Confirm chart name exists in the supported catalog.
- Confirm container height is present.
- Confirm no direct renderer installation instruction is added.
- For migration/compat tasks, confirm lifecycle props and old config behavior are preserved.
