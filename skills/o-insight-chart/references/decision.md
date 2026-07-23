# Decision: which writing mode? (context detection)

Run this BEFORE writing any chart code. Pick the first rule that matches.

## Signals → mode

### A. Wrapped data+config  (route: React→cloud-charts-react, else→cloud-charts-vanilla)
Any of these in the user message or current file/codebase:
- JSX like `<Bar data={...} config={...} />`, `<Line ...>`, `<ChartProvider>`
- `renderWbarModel(` / `renderWlineModel(` / `createW*` calls
- imports from `@alicloud/cloud-charts-react` or a single-chart pkg `@alicloud/cloud-charts-bar` etc.
- types `BarSeries`, `BarChartConfig`, `LineSeries`, … used for data/config
- user says "用组件 / 用 data/config / 用封装 / <Bar>"

### B. G2-native spec  (route: cloud-charts-g2-spec)
Any of these:
- `chart.options(`, top-level `type:`/`encode:`/`transform:`/`coordinate:` in a spec object
- `createChart(` / `renderChart(` / `renderG2Spec(` from core, or `ChartSpec` type
- `config.dataType:'g2'` already present
- user says "用 G2 spec / 原生 G2 / 自定义 mark / composition"

### C. No clear signal (greenfield / ambiguous)  → DEFAULT = G2-native spec
But ask ONE short confirming line first, then obey the answer:
> 「默认用 **G2 原生 spec**（表达力最全）；若你项目用我们的 `<Bar data config/>` 组件，我改 **data+config**。哪种？」

## Priority & tie-breaks
- A and B both present (mixed file): match the block you are editing; if adding a NEW chart, ask.
- Framework detection for A: React/Next → cloud-charts-react; Vue/Angular/Svelte/plain JS → cloud-charts-vanilla; Solid data+config → `@alicloud/cloud-charts-solid` 23 chart components.
- Framework detection for B: Solid → `@alicloud/cloud-charts-solid` `<Chart spec={...} />` (default Solid route); React/vanilla without a spec component → `@alicloud/cloud-charts-core` native `createChart`.
- "Need G2 power but also our theme/state" → still route to cloud-charts-g2-spec, but use the wrapped component + `config.dataType:'g2'` bridge (documented there).

## Examples
- "帮我用 cloud-react 加个柱状图" → A (React) → cloud-charts-react.
- "给我一段 G2 的 interval spec，用你们的 createChart 渲染" → B → cloud-charts-g2-spec.
- "画个销量柱状图"（无上下文）→ C → default G2-native, ask the one-liner first.
- "现有 <Line data config/>，再加一条均值参考线" → A, but the ref line needs G2 → use `customConfig`/`dataType:'g2'` bridge (cloud-charts-g2-spec), keep the component.

## Do / Don't
- DO state the chosen mode in one sentence before coding.
- DON'T mix raw `chart.options()` inside a data+config component.
- DON'T ask more than once; infer from context whenever possible.
