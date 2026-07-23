# Inspiration Guide

Use this to run the exploration step: translate a goal into chart candidates,
then compose multi-chart reports. Lead with a recommendation; offer alternatives.

## Goal → chart chooser

| The user wants to show… | First pick | Alternatives | Note |
|---|---|---|---|
| Trend over time | Line | Area (`area:true`), LineBar | Timestamps + `type:'time'`. |
| Volume + rate together | LineBar (dual-y) | LineScatter | Bars=volume, line=rate. |
| Compare categories | Bar | Radar (multi-dim), Nightingale | ≤12 categories for bars. |
| Part-of-whole | Pie / donut | Nightingale, Treemap | ≤7 slices; else Treemap. |
| Ranking | Bar (sorted) | Funnel (if stages) | Sort descending. |
| Distribution of one var | Histogram | Box | Box adds quartiles/outliers. |
| Compare distributions | Box (grouped) | Linebox | One box per group. |
| Correlation (2 vars) | Scatter | Heatmap (binned), Hexagonal | size = 3rd dim. |
| Matrix / density | Heatmap | Rectangle (calendar) | value → color. |
| Conversion funnel | Funnel | Sankey | Stage drop-off. |
| Flow between nodes | Sankey | Hierarchy | width = magnitude. |
| Hierarchy / nesting | Treemap | Sunburst, Hierarchy | size vs radial vs tree. |
| Geographic | Map | Heatmap (grid) | needs GeoJSON. |
| Single KPI number | Wnumber / Wcircle / Wgauge | MultiCircle | big-number widgets. |
| Sparkline in a card | Miniline | — | no axes. |
| Stock / OHLC | Candlestick | — | [open,close,low,high]. |

## Report composition patterns

A good visual report tells a story in 3–5 charts. Pick a pattern:

- **Overview → detail:** KPI row (Wnumber×3) → trend Line → breakdown Bar.
- **Trend + why:** Line (what changed) → stacked Bar or Pie (composition) →
  Scatter/Heatmap (driver correlation).
- **Funnel diagnosis:** Funnel (conversion) → Bar (drop-off by segment) →
  Line (trend per stage over time).
- **Distribution deep-dive:** Histogram (shape) → Box by group (spread) →
  Scatter (outlier drivers).
- **Flow story:** Sankey (where volume goes) → Treemap (size of each bucket).

Layout: put the headline chart largest/top; supporting charts in a grid below.
The scaffold gallery is a responsive card grid — one chart per card with a title.

## Streaming / "AI is drawing" angle

For a live, narrated build-up (natural-language → chart forming step by step),
reference the `AIChart` DrawOp pattern in
`examples/react-demo/src/main.tsx`: a flat op stream (`setChartType`, `setAxis`,
`addSeries`, `addDataPoint`, `enable`, `upgradeTo`) reduced into one `<LineBar>`
instance so bar→line upgrades animate continuously. Reuse this when the user
wants the *process* of visualization to be visible, not just the result.

## Making it compelling

- Realistic sample data: plausible magnitudes, real-sounding series names,
  enough points (24 hourly, 12 monthly, 30 daily).
- Annotate the insight in your report text ("peaked at 14:00, then dropped 30%").
- Prefer 2–3 focused charts over one cluttered chart.
- Offer one "did you consider…" alternative angle per interaction.
