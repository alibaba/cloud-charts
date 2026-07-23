---
name: cloud-charts-chart-generate
description: "生成创意型 cloud-charts / cloud-charts widgets 可视化，包括多图 dashboard、数据故事报告、可运行 Vite showcase 页面、洞察标注页、AI 逐步绘图体验和截图。用户要求可视化报告、dashboard、showcase、生成一组图表、做个数据故事、创意可视化、AI 绘图、多图组合或截图时必须使用。使用真实 @alicloud/cloud-charts-react 组件，并把单图组件细节交给 cloud-charts-chart-usage。关键词：图表生成、可视化报告、dashboard、数据故事、showcase、screenshot、创意图表、AI 绘图、多图组合。"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
---

# cloud-charts Chart Generate

Use this skill when the user wants more than one basic chart: a visual report, dashboard, showcase page, screenshot, or creative chart-building experience. Compose real cloud-charts components into a coherent visual story.

## 1. Scope

This skill generates:

- Multi-chart dashboards and visual reports.
- Runnable Vite showcase pages using `@alicloud/cloud-charts-react` components.
- KPI + chart combinations.
- Annotated insight pages with realistic sample data.
- Step-by-step “AI is drawing” chart build-up concepts.
- Screenshot-ready pages.

If the user only needs to choose one chart, use `cloud-charts-chart-recommend`. If the user already knows the chart and needs exact API code, use `cloud-charts-chart-usage`.

## 2. Input and output contract

Input can be:

- A topic, dataset, or business question.
- A requested format: report page, dashboard, showcase, screenshot, or step-by-step drawing experience.
- Audience and style constraints, if provided.
- Real data or permission to use realistic sample data.

Output should include:

1. Report pattern and selected components.
2. Data plan, stating when sample data is fabricated.
3. Runnable page plan or code skeleton.
4. Screenshot steps when requested.
5. One suggested next refinement.

## 3. Creative workflow

1. Parse the request into **topic**, **audience**, **story goal**, and **output fidelity**.
2. Pick a report pattern from `references/report-patterns.md`.
3. Choose 2–5 components that tell one story. Avoid clutter.
4. Create realistic sample data when the user has not provided data, and say that it is sample data.
5. Build either a code snippet or a runnable page. Default to a runnable page for dashboard/report requests.
6. If the user asks for screenshot, start the page and use browser automation to capture it.
7. End with one suggested refinement, such as adding segment filters or highlighting anomalies.

Ask at most one clarification only when the output target is genuinely blocked.

## 3. Recommended report patterns

| Pattern | Components | Use when |
|---|---|---|
| Overview → detail | `Wnumber` row → `Line` → `Bar` | Business summary, sales, traffic, ops overview |
| Trend + why | `Line` → stacked `Bar` or `Pie` → `Scatter` / `Heatmap` | Need trend plus drivers |
| Funnel diagnosis | `Funnel` → `Bar` → `Line` | Conversion, retention, workflow drop-off |
| Distribution deep dive | `Histogram` → `Box` → `Scatter` | Quality, latency, price, score distribution |
| Flow story | `Sankey` → `Treemap` | Traffic routing, fund flow, user paths |
| Geo story | `Map` → `Bar` → `Line` | Regional performance and ranking |

## 4. Runnable page rules

Use the bundled scaffold in `assets/showcase-template/` when the user asks for a report page or screenshot.

- Copy the scaffold to a working example directory.
- Fill the card grid with real `@alicloud/cloud-charts-react` components.
- Wrap the page with `<ChartProvider theme="normal" locale="zh-CN">`.
- Use `cloud-charts-chart-usage` rules for each chart’s data/config.
- Keep one headline chart visually dominant, then supporting charts below.
- Use realistic data density: 24 hourly points, 12 monthly points, or 30 daily points when appropriate.

## 5. Code skeleton

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChartProvider, Bar, Line, Pie, Wnumber } from '@alicloud/cloud-charts-react';
import type { BarSeries, LineSeries, PieSeries } from '@alicloud/cloud-charts-core';

const trendData: LineSeries[] = [
  { name: '销售额', data: [['1月', 120], ['2月', 168], ['3月', 156], ['4月', 210]] },
];
const cityData: BarSeries[] = [
  { name: '销售额', data: [['杭州', 120], ['上海', 180], ['北京', 156]] },
];
const channelData: PieSeries[] = [
  { name: '渠道占比', data: [['搜索', 42], ['推荐', 28], ['广告', 18], ['其他', 12]] },
];

function Report() {
  return (
    <ChartProvider theme="normal" locale="zh-CN">
      <main className="page">
        <section className="kpis">
          <Wnumber value={2680} title="总销售额" />
          <Wnumber value={18.6} title="同比增长" suffix="%" />
          <Wnumber value={92} title="目标达成" suffix="%" />
        </section>
        <section className="grid">
          <article><h3>销售趋势</h3><Line data={trendData} config={{ xAxis: { type: 'point' } }} height={320} /></article>
          <article><h3>城市对比</h3><Bar data={cityData} config={{ label: true }} height={320} /></article>
          <article><h3>渠道占比</h3><Pie data={channelData} config={{ label: true }} height={320} /></article>
        </section>
      </main>
    </ChartProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Report />);
```

## 6. “AI is drawing” pattern

Use this when the user asks to show the chart being built progressively.

Represent the drawing process as operations, then reduce them into chart state:

```ts
type DrawOp =
  | { type: 'setChart'; chart: 'Bar' | 'Line' | 'LineBar' }
  | { type: 'addSeries'; name: string }
  | { type: 'addPoint'; series: string; x: string | number; y: number }
  | { type: 'enable'; feature: 'label' | 'legend' | 'tooltip' }
  | { type: 'upgrade'; chart: 'LineBar' };
```

Narrate the operations in UI text, then render the current component state after each step. Keep the final chart as a real cloud-charts component; do not fake it with canvas drawings.

## 7. Screenshot workflow

When the user asks for a screenshot:

1. Build the runnable page first.
2. Start the dev server.
3. Use browser automation to open the URL, wait for charts to render, and capture the page.
4. Return the screenshot path and the local URL.

## 8. Quality bar

- The page should have a clear title, one-sentence insight, and chart cards with meaningful headings.
- Prefer 2–4 focused charts over many generic charts.
- Use realistic sample data and disclose it when fabricated.
- Choose a theme intentionally: `normal` for default business reports, `dark` for monitoring/ops, `yunxiao` for internal platform style.
- Do not use placeholder component names that do not exist in the library.

## 9. Validation gate

Before finalizing a generated report or page, verify:

1. Every chart component exists in the library.
2. Each chart has plausible data shape and enough data points to be meaningful.
3. The report follows one clear story pattern rather than a random chart collage.
4. Complete page examples include `<ChartProvider>` and real `@alicloud/cloud-charts-react` components.
5. Screenshot requests include build/run/open/capture steps.
6. The output does not require obsolete low-level charting paths for normal use.

If the page cannot be run because dependencies or aliases are missing, provide the exact missing setup and stop after one retry. Do not spend more than two iterations on the same scaffold failure; fall back to a paste-ready React page and list what the user must run locally.

## 10. Resources

- `references/report-patterns.md`: detailed multi-chart composition patterns.
- `references/scaffold-guide.md`: how to create and run the Vite showcase page.
- `references/creative-recipes.md`: creative report recipes and data templates.
- `references/ai-drawing-pattern.md`: progressive chart-generation pattern.
- `assets/showcase-template/`: runnable page scaffold.
