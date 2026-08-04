# Component Pitfalls

Use this reference when fixing chart code that compiles but renders incorrectly, looks off-theme, loses labels, or has broken interactions.

## Data shape

- Most charts expect series + tuple points: `{ name, data: [[x, y]] }[]`.
- Do not pass object points like `{ x, y }` unless the specific component documents that shape.
- Hierarchy charts use one root tree object, not a series array.
- Sankey uses `{ nodes, links }`, not a tuple series.
- Keep visual styling out of `data`; put colors, labels, legend, axis, and interactions in `config`.

## Time axis

`Line` is commonly used for time series. If x values are real dates or times, prefer numeric timestamps:

```tsx
const T0 = new Date('2026-07-01').getTime();
const D = 86_400_000;
const data = [{ name: 'QPS', data: [[T0, 120], [T0 + D, 130]] }];
<Line data={data} config={{ xAxis: { type: 'time', mask: 'auto' } }} />
```

If x values are labels such as `1月` / `Q1` / `杭州`, use a category/point axis:

```tsx
<Line data={data} config={{ xAxis: { type: 'point' } }} />
```

## Labels

- Use component `config.label`, not ad-hoc text nodes over the chart.
- Dense charts need conservative labels; prefer tooltip + highlight over showing every label.
- For stacked charts, treemaps, and sunbursts, hide overflowing labels rather than letting text overlap.
- Avoid white or near-white mark fill on light backgrounds unless it is an intentional inner label or separator.

## Axis, legend, tooltip

- `legend`, `tooltip`, `xAxis`, `yAxis`, and `label` are usually `boolean | object`.
- Use `false` to turn a feature off; use an object for detailed control.
- Dual-axis combo charts need both series assignment and axis config:

```tsx
const data = [
  { name: '销量', geomType: 'bar', yAxis: 0, data: [['1月', 100]] },
  { name: '增速', geomType: 'line', yAxis: 1, data: [['1月', 0.2]] },
];
<LineBar data={data} config={{ yAxis: [{}, {}] }} />
```

## Theme and state

- Use `<ChartProvider theme="normal" locale="zh-CN">` in React.
- Use `context: { theme, locale }` in vanilla render functions.
- Do not hardcode colors to fake a theme; use provider/context theme first, then `config.colors` only when the user asked for custom colors.
- Use `loading`, `loadingInfo`, `emptyInfo`, and `errorInfo` instead of external overlays.

## Layout and lifecycle

- Give charts a real height. React chart `height` defaults to `300`, but parent layout still needs room.
- Vanilla `container` must be an `HTMLElement`; selector strings are invalid.
- Store the returned chart instance and call `chart.destroy()` on unmount.
- Use `chart.changeData(nextData)` for data-only updates when available; recreate only when structure changes.

## Canvas margin (G2 v5 vs legacy)

- G2 v5's classic theme ships a default view `margin: 16`, which the legacy G2 v4 library never had. Both rendering paths normalize it via the shared `applyDefaultLayout` function: `composeChartModel` (data + config path) and `NativeChartController` (spec-first path) both force `margin: 0` with `marginTop: 8` (to keep the topmost y-axis tick label from clipping), matching legacy edge-to-edge visuals.
- If a chart still shows a blank ring inside its canvas, check that the app is on a core version that includes this normalization; do not compensate with negative CSS margins.
- Pass `margin` / `marginTop` explicitly in the spec only when extra breathing room is intended; user-provided values always win over the defaults.
- Marks that overflow the plot area (for example large scatter bubbles at the domain edge) are clipped at the canvas edge, same as legacy v4. Reserve space via `config.appendPadding` or axis `max` instead of relying on the old v5 margin.
- Spec-first paths (`createChart` / `renderG2Spec` / `<Chart spec={...} />`) also apply the margin normalization via `applyDefaultLayout` in `NativeChartController`, ensuring visual consistency with the data + config path. User-provided `margin` values always win.

## Palette and helper code

- Do not invent palette names. If unsure, use explicit `config.colors`.
- Do not call `d3.*` in user code; use native JavaScript helpers such as `reduce`, `map`, and `Math.max`.
- Do not add animation or decorative effects unless the user asked for them.
