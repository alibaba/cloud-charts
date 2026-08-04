# Decision: which writing mode?

Run this before writing chart code. Pick one public mode for each chart instance.

## Signals → mode

### A. Wrapped data+config mode

Use when any of these appear in the user request or current code:

- JSX like `<Bar data={...} config={...} />`, `<Line ...>`, `<ChartProvider>`
- `renderWbarModel(` / `renderWlineModel(` / `createW*` calls
- imports from `@alicloud/cloud-charts-react`, `@alicloud/cloud-charts-solid`, or a per-chart package like `@alicloud/cloud-charts-bar`
- types such as `BarSeries`, `BarChartConfig`, `LineSeries`
- user says “组件 / data config / 封装 / 旧版升级 / <Bar>”

### B. Spec-first mode

Use when any of these appear:

- a `ChartSpec` object with top-level `type`, `encode`, `transform`, or `coordinate`
- `createChart(` / `renderChart(` / `renderG2Spec(` from `@alicloud/cloud-charts-core`
- `config.dataType:'g2'` already appears as an escape hatch
- user says “spec / native spec / 自定义 mark / composition / transform”

### C. No clear signal

Default to spec-first for brand-new code, but mention the choice once:

> 默认用 **O-Insight native spec**（表达力最全）；如果你的项目正在用 `<Bar data config/>` 组件，我改成 **data+config**。

## Priority & tie-breaks

- If both modes appear in a mixed file, match the block being edited; ask only if adding a new chart to the file.
- Wrapped mode framework mapping: React/Next → `@alicloud/cloud-charts-react`; Solid → `@alicloud/cloud-charts-solid`; Vue/Angular/Svelte/plain JS → per-chart packages like `@alicloud/cloud-charts-bar`.
- Spec-first mapping: Solid → `@alicloud/cloud-charts-solid` `<Chart spec={...} />`; React/vanilla without a spec component → `@alicloud/cloud-charts-core` native controller APIs.
- If native spec control and component theme/state are both needed, use wrapped mode plus `config.dataType:'g2'` and `customConfig`.

## Examples

- “帮我用 cloud-react 加个柱状图” → wrapped data+config mode with `@alicloud/cloud-charts-react`.
- “给我一段 interval spec，用你们的 createChart 渲染” → spec-first mode with `@alicloud/cloud-charts-core`.
- “画个销量柱状图” with no context → default to spec-first and mention the wrapped alternative.
- “现有 <Line data config/>，再加一条均值参考线” → keep wrapped mode and use `customConfig` if a native sub-spec is required.

## Do / Don't

- Do state the chosen mode in one sentence before coding.
- Do not mix raw `chart.options()` calls inside a data+config component.
- Do not route to old split skills; this unified skill contains both modes.
