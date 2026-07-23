---
name: cloud-charts-chart-usage
description: "生成和修复 cloud-charts / cloud-charts widgets 图表组件库代码。用户编写图表组件、配置数据与样式、设置主题语言、处理加载空态错误态、接入 React、Solid、Vue、Angular 或命令式单图包时必须使用；也适用于组件库研发、数据结构、配置字段、安装步骤、图例、提示框、坐标轴和生命周期问题。关键词：图表组件、组件库使用、数据配置、主题、状态、单图包、柱图、折线图、饼图、散点图、桑基图。"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# cloud-charts Chart Usage

Use this skill when the task is to write, migrate, debug, or review code that uses the cloud-charts / cloud-charts widgets chart component library. Keep the user in the component-library mental model: components, data, config, theme, state, and framework lifecycle.

## 1. Scope

This skill handles component-library usage:

- React components from `@alicloud/cloud-charts-react`.
- Solid components from `@alicloud/cloud-charts-solid` when the user's code is Solid.
- Vanilla per-chart packages such as `@alicloud/cloud-charts-bar` and `renderWbarModel`.
- Shared types, data shapes, and config contracts from `@alicloud/cloud-charts-core`.
- Runtime states: loading, empty, error, theme, locale, tooltip, legend, axis, interactions.

If the user asks which chart to use, use `cloud-charts-chart-recommend`. If they ask for a dashboard, report page, showcase, screenshot, or creative multi-chart story, use `cloud-charts-chart-generate`.

## 2. Input and output contract

Before writing code, identify the input:

- Framework: React, Solid, vanilla JS/TS, Vue, Angular, Svelte, or unknown.
- Chart component: known component name, existing code, or inferred from nearby context.
- Data shape: series tuples, tree, graph, matrix, KPI value, or unknown.
- Desired output: fix existing code, generate a snippet, explain config, or provide install steps.

Output should include only what the user needs:

- For code generation: imports, typed data, config, component/render call, and lifecycle cleanup when needed.
- For debugging: the corrected code plus 1–3 bullet points explaining why the bug happened.
- For install help: exact CLI command and the package/import expected after install.

## 3. Choose the usage mode

| User context | Write this |
|---|---|
| React / JSX / TSX / `@alicloud/cloud-charts-react` | `<Bar data={data} config={config} />` with `<ChartProvider>` |
| Solid / `@alicloud/cloud-charts-solid` | Solid chart component pattern matching the existing codebase |
| Plain JS/TS, Vue, Angular, Svelte, Web Components | `renderWxxxModel({ container, data, config, context })` from the per-chart package |
| Existing code already uses one mode | Preserve that mode; do not switch frameworks unless asked |

When the framework is unknown and the user asks for paste-ready code, ask one short question: “你是在 React 组件里用，还是在普通 JS/Vue/Angular 里命令式挂载？”

## 3. Core rules

1. Use only legal chart components: `Bar Line Pie Scatter Radar Funnel Nightingale Histogram Box Heatmap Hexagonal LineBar LineScatter Linebox Candlestick Sunburst Treemap Hierarchy Sankey Rectangle Map Miniline MultiCircle`.
2. KPI widgets are separate from chart components: `Wnumber Wcount Wcircle Wgauge Wnumbercard Wlistcontainer`.
3. Keep `data` and `config` separated. Raw values go in `data`; style, axis, legend, tooltip, stacking, grouping, colors, labels, and interactions go in `config`.
4. Most charts use series + tuples: `Array<{ name: string; data: Array<[x, y]> }>`.
5. Hierarchy charts (`Sunburst`, `Treemap`, `Hierarchy`) use one root tree object: `{ name, value?, children? }`.
6. `Sankey` uses graph data: `{ nodes: [{ name }], links: [{ source, target, value }] }`.
7. React imports components from `@alicloud/cloud-charts-react`; import data/config types from `@alicloud/cloud-charts-core`.
8. Vanilla imports render functions from per-chart packages; `container` is an `HTMLElement`, not a selector string.
9. Prefer built-in state props (`loading`, `emptyInfo`, `errorInfo`) over custom wrappers.
10. Read `references/component-pitfalls.md` before fixing rendering, label, time-axis, or theme bugs.

## 4. React pattern

```tsx
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [
  { name: '2025', data: [['一季度', 120], ['二季度', 132]] },
  { name: '2026', data: [['一季度', 90], ['二季度', 155]] },
];

const config: BarChartConfig = {
  legend: { position: 'top' },
  label: true,
};

export default function App() {
  return (
    <ChartProvider theme="normal" locale="zh-CN">
      <Bar data={data} config={config} height={320} />
    </ChartProvider>
  );
}
```

React usage notes:

- Common props: `data`, `config?`, `height?`, `width?`, `theme?`, `language?`, `context?`, `className?`, `style?`, `event?`, `loading?`, `loadingInfo?`, `emptyInfo?`, `errorInfo?`.
- `height` defaults to `300`; pass a number for px.
- Use `<ChartProvider theme locale>` for app-level theme and language.
- Use component props for state overlays instead of wrapping charts with external loading masks.

## 5. Vanilla / framework-agnostic pattern

```ts
import { renderWbarModel } from '@alicloud/cloud-charts-bar';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [
  { name: '2026', data: [['1月', 120], ['2月', 200]] },
];

const config: BarChartConfig = { label: true };

const { chart, model } = renderWbarModel({
  container: document.getElementById('chart')!,
  data,
  config,
  context: { theme: 'normal', locale: 'zh-CN' },
});

chart.changeData([{ name: '2026', data: [['1月', 150]] }]);
chart.destroy();
```

Vanilla usage notes:

- Prefer `renderWxxxModel` for full runtime behavior.
- Always pass an options object, never positional arguments.
- Always save the returned instance and call `chart.destroy()` on unmount.
- In Vue/Angular/Svelte, render in the framework mount hook and destroy in the unmount hook.

## 6. Component index

| Goal | Component | Data shape |
|---|---|---|
| Category comparison | `Bar` | `{ name, data: [[category, value]] }[]` |
| Trend | `Line` / `Miniline` | `{ name, data: [[x, value]] }[]` |
| Part-to-whole | `Pie` | `{ name, data: [[label, value]] }[]` |
| Rose / radial part-to-whole | `Nightingale` | same as Pie |
| Conversion funnel | `Funnel` | `{ name, data: [[stage, value]] }[]` |
| Correlation / bubble | `Scatter` | `{ name, data: [[x, y, size?]] }[]` |
| Distribution | `Histogram` / `Box` | numbers or statistical tuples |
| Matrix density | `Heatmap` / `Rectangle` | `[[x, y, value]]` or series wrapper |
| Hierarchy | `Sunburst` / `Treemap` / `Hierarchy` | root tree object |
| Flow | `Sankey` | `{ nodes, links }` |
| Combo | `LineBar` / `LineScatter` / `Linebox` | series with `geomType` and `yAxis` |
| Finance | `Candlestick` | `{ name, data: [[x, open, close, low, high]] }[]` |
| Geographic | `Map` | region value records plus map data/config |

For richer chart-selection guidance, use `cloud-charts-chart-recommend`.

## 7. Common forbidden patterns

```tsx
// Wrong: object points for wrapped series data
const badData = [{ name: 'A', data: [{ x: '1月', y: 100 }] }];

// Right: tuple points
const data = [{ name: 'A', data: [['1月', 100]] }];

// Wrong: style in data
const badStyledData = [{ name: 'A', data: [['1月', 100]], color: '#5B8FF9' }];

// Right: style in config
<Bar data={data} config={{ colors: ['#5B8FF9'] }} />

// Wrong: data types from cloud-react
import { Bar, BarSeries } from '@alicloud/cloud-charts-react';

// Right: component from cloud-react, types from cloud-core
import { Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries } from '@alicloud/cloud-charts-core';

// Wrong: selector string as container
renderWbarModel({ container: '#chart', data });

// Right: HTMLElement container
renderWbarModel({ container: document.getElementById('chart')!, data });
```

Avoid hallucinated components: use `Bar`, not `Column`; `Pie config={{ cycle: true }}`, not `Donut`; `Nightingale`, not `Rose`; `Line config={{ area: true }}`, not `Area`.

## 8. Install guidance

When code requires packages that may not exist in the project, suggest the cloud-charts CLI instead of inventing local paths.

```bash
# React components
npx @alicloud/cloud-charts-cli@alpha add wbar wline wpie --react --as-dep
npm install

# Vanilla packages
npx @alicloud/cloud-charts-cli@alpha add wbar wline wpie --vanilla --as-dep
npm install
```

Do not publish, bump package versions, or change release metadata from this skill.

## 9. Validation gate

Before finalizing code, verify these checkpoints:

1. Component name is in the legal component list.
2. Imports match the framework: React components from `@alicloud/cloud-charts-react`, shared types from `@alicloud/cloud-charts-core`, vanilla renderers from per-chart packages.
3. Data shape matches the component: tuple series, tree, graph, matrix, or KPI value.
4. Style and behavior live in `config`, not in `data`.
5. React output is wrapped in `<ChartProvider>` when providing a complete example.
6. Vanilla output uses an `HTMLElement` container and includes `chart.destroy()` cleanup.
7. No obsolete low-level charting path is required for normal component usage.

If a checkpoint fails, revise the answer once. If it still cannot be satisfied because the component API is unknown, inspect the repository source or ask one concise clarifying question. Do not retry more than two times; after two failed attempts, provide the safest minimal component example and list the missing fact.

## 10. Resources

- `references/chart-selection.md`: compact component/data-shape table retained for quick lookup.
- `references/component-pitfalls.md`: rendering pitfalls, time axes, label rules, palette safety, theme/state gotchas.
