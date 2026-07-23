---
name: cloud-charts-viz
title: O-insight Viz 智能可视化技能
version: 0.0.2
description: "O-insight Viz — turn any idea, dataset, or question into a visual expression using the cloud-charts widgets chart library (@alicloud/cloud-charts-react, 23 chart types). Use when the user wants to visualize data, asks 今天想可视化什么, needs to chart or plot data, build a data dashboard or visual report, wants a chart-type recommendation, a runnable showcase page, or a screenshot of a chart. Handles three output forms — a runnable Vite/HTML page with real components, a rendered PNG screenshot, and inspiration or exploration advice. Keywords: 可视化, 图表, 数据可视化, 可视化报告, visualization, chart, dashboard, insight."
---

# O-insight Viz

## Overview

Start from the prompt **"今天想要可视化什么？"** and turn a raw idea, dataset, or
question into a concrete visual expression — a single chart, a multi-chart
visual report, or a screenshot — built on the cloud-charts widgets library
(`@alicloud/cloud-charts-react`, 23 chart types, spec-flat API, themeable). Along the way,
explore inspiration: suggest chart types and narrative angles the user may not
have considered.

## Skill collection & routing（技能合集与路由）

This skill is the **dispatcher** of the cloud-charts chart skill collection (the refactored
`@alicloud/cloud-charts-*` repo). After you've decided *what to visualize* here, hand off to the skill
that matches the user's target environment:

| target | skill | when |
|--------|-------|------|
| pick chart / build a showcase / screenshot | **cloud-charts-viz** (this) | intent unclear, exploration, runnable page |
| React code | **cloud-charts-react** | `<Bar data config />` components, ChartProvider, props |
| plain JS/TS · Vue · Angular · Svelte | **cloud-charts-vanilla** | per-chart packages, `renderWxxxModel` imperative mount |
| raw G2 v5 spec / full G2 power | **cloud-charts-g2-spec** | custom marks/composition, `createChart`+spec, `dataType:'g2'`, `customConfig` |

> Same components, two fidelities: **wrapped** (data series + flat config, default) vs
> **G2-native** (raw spec or `dataType:'g2'`/`customConfig` escape hatches). If the user asks for
> G2 spec control, route to `cloud-charts-g2-spec` rather than forcing the flat config.

## Intent-driven, not tool-driven

The core idea: the user should NOT have to know chart types, config keys, or the
API. They express an **intent** in plain language; this skill parses it into a
visual. Traditional tools go *chart → data → tweak*; O-insight Viz goes
*intent → visual → refine*.

Parse every request into three intent slots before doing anything:

1. **Subject** — what is being measured (QPS, revenue, conversion, error rate…).
2. **Analytical goal** — the *verb* behind the request. Map loose phrasing to one
   of: **compare · trend · distribution · composition · relationship · flow ·
   hierarchy · geo · single-value**. This verb, not the noun, decides the chart.
3. **Fidelity** — how far to go: just *advice*, a *runnable page*, or a *screenshot*.

If the user's words are vague ("看看销售情况"), infer the most likely goal, state
your inference in one line, and proceed — do not stall on questions. The chart
type is an *output* of intent parsing, never an input the user must supply.

## The Flow

Follow these four steps. Do not skip step 1.

### 1. Parse intent (infer first, ask at most once)

Fill the three intent slots (Subject / Analytical goal / Fidelity) from what the
user already said. Only ask a question when a slot is genuinely blocking and
un-inferable — at most one short round, never an interrogation.

- **Data source:** real numbers/file, or just a topic? If only a topic, fabricate
  realistic sample data and say so explicitly.
- **Analytical goal:** if unstated, infer it from the subject and phrasing, then
  state your inference ("我理解你想看**趋势**变化") so the user can redirect in one word.
- **Fidelity:** default to a runnable page unless they asked for advice or a shot.

Do not ask the user which chart type they want — that is your job to derive.

### 2. Explore inspiration & pick chart type(s)

Map the goal to chart candidates using `references/inspiration-guide.md`. Present
**2–3 options** with a one-line tradeoff each, lead with a recommendation, and
let the user redirect. For a report, propose a small set of charts that tell a
story together (e.g. trend + breakdown + outlier).

Do NOT over-produce. If the user only wanted advice, stop here.

### 3. Build the visual

Look up exact data shape and config for each chosen chart in
`references/chart-catalog.md`. Then produce the chosen output form:

- **Runnable page** (default): scaffold a Vite app from
  `assets/showcase-template/`. See `references/scaffold-guide.md` for the exact
  steps (locate the monorepo, wire aliases, drop charts into the gallery grid,
  start the dev server). Every chart must render through real
  `@alicloud/cloud-charts-react` components wrapped in `<ChartProvider>` — never G2 native
  API, or the theme will not apply.
- **Code snippet**: emit `<Line data={...} config={...} />`-style JSX plus the
  typed data, ready to paste into an existing project.
- **Screenshot / static image**: build the runnable page first, start the dev
  server, then use the `agent-browser` skill to open the URL and capture a PNG.

### 4. Report & iterate

Give the URL (or file path), a one-line description of what's shown, and one
suggested next step ("want me to add a breakdown bar chart?"). Iterate on the
user's feedback.

## Key rules

- **Real components only.** Import from `@alicloud/cloud-charts-react` and wrap in
  `<ChartProvider theme="normal" locale="zh-CN">`. Using G2's native API bypasses
  the cloud-charts theme — a known past mistake.
- **Spec-flat API.** These charts take `data` (typed series array) + `config`
  (flat options), not deeply-nested config objects. Get shapes from the catalog.
- **Time x-axis gotcha.** `Line` defaults `xAxis.type = 'time'`. For time series,
  pass **numeric timestamps** in data and `config.xAxis = { type: 'time', mask: 'auto' }`.
  For categorical x (e.g. month names), set `config.xAxis = { type: 'point' }`.
- **Themes:** `normal` (light), `dark`, `yunxiao`. Set on `<ChartProvider>`.
- **Sample data must be realistic** — plausible ranges, sensible series names,
  and enough points to make the chart meaningful. State clearly when it's fake.

## Resources

- `references/chart-catalog.md` — all 23 chart types: data shape, config
  options, and when to use each. **Read the relevant entries before writing chart code.**
- `references/inspiration-guide.md` — goal→chart chooser and report-composition
  patterns for the exploration step.
- `references/scaffold-guide.md` — step-by-step for standing up the runnable
  showcase page and (optionally) screenshotting it.
- `references/recipes.md` — copy-ready chart snippets with real data, the three
  theme recipes (normal/dark/yunxiao) with when-to-use, and a common-pitfalls FAQ.
- `assets/showcase-template/` — copy-ready Vite scaffold (package.json,
  vite.config.ts, index.html, src/main.tsx gallery skeleton).
