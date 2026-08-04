# O-Insight Runtime Rules and Adapters

O-Insight is not a thin spec renderer. Wrapped charts pass through a compatibility runtime that preserves old aisc-widgets behavior while emitting native spec.

## Pipeline

1. Public API receives `data`, `config`, `context`, and framework props.
2. Chart model converts old data shapes into flat records unless `config.dataType === 'g2'`.
3. Runtime rules normalize empty/extreme/big data and chart-specific compatibility behavior.
4. Feature builders normalize axis, legend, tooltip, guide, marks, slider, scrollbar, zoom, and interactions.
5. Adapter emits native spec and renderer applies it.
6. Framework layer handles lifecycle, resize, state overlay, custom tooltip, and ref/callback props.

Key source areas:

- `packages/core/src/model/*Model.ts`
- `packages/core/src/runtime/rules/**`
- `packages/core/src/runtime/features/**`
- `packages/core/src/adapters/g2/**`
- `packages/frameworks/react/src/hooks/useChart.ts`
- `packages/frameworks/solid/src/primitives/createChart.ts`

## Theme and color

Use O-Insight theme names and tokens, not raw renderer themes.

- React/Solid: `<ChartProvider theme="light|dark|normal|yunxiao" locale="zh-CN">`.
- Model/native packages: `context: { theme, language }`.
- `mapColors` maps token names and status colors to theme hex values.
- `resolveColorRange` uses theme palettes such as category and linear ranges.
- `getAreaColorRange` merges line colors and `areaColors`, then generates area gradients.

When spec-first and data+config should visually match, inherit the O-Insight theme defaults for:

- palette
- axis line/grid/label style
- legend marker/font/spacing
- tooltip style
- padding/append padding

## Axis

Axis normalization covers old config fields and native spec fields:

- `xAxis` / `yAxis` map to native `axis.x` / `axis.y` and `scale`.
- Default numeric y labels use grouping when legacy behavior expects it.
- `mask: 'auto'` should not be passed as a literal formatter mask.
- time units default to seconds, not picoseconds.
- dual-y axis guide and title behavior uses y/y0/y1 scale context.
- `tickLine`, grid, title, labelFormatter, min/max, nice, tickCount must flow through.

## Legend

Legend normalization preserves old visual and interaction behavior:

- Position-specific padding: bottom/top/left/right differ.
- Marker differs by chart type: line uses hyphen, bar uses square, pie uses circle.
- `nameFormatter` receives legacy-compatible arguments `(text, datum, index)`.
- `visible:false` initializes hidden legend values/filter state.
- Table/foldable/gradient custom legends are framework components.
- Ellipsis behavior is handled by legacy interaction when required.

## Tooltip

Tooltip normalization preserves old formatter signatures and custom tooltip behavior:

- `titleFormatter`, `nameFormatter`, `valueFormatter` follow legacy argument expectations.
- Dual-y charts inherit y-axis formatting into tooltip values.
- Sort strings such as `asce`/`desc` map to native sort functions/config.
- `undefined-name-` prefixes should be stripped from display names.
- `customItems` for time axes should dedupe close points.
- React custom tooltip uses `useCustomTooltip`; Solid currently relies on native tooltip path unless custom implementation exists.

## State overlays

Wrapped framework charts expose model state:

- `normal`
- `loading`
- `empty`
- `error`

React/Solid overlay components render `loadingInfo`, `emptyInfo`, `errorInfo` above the chart container. Native controller mode does not render these overlays.

## Guide and marks

Guide config converts into native marks:

- guide line -> `lineX` / `lineY`
- guide area/filter -> `rangeX` / `rangeY` / region filter marks
- y/y0/y1 values clamp to scale min/max
- guide text defaults include offset and autoRotate behavior
- filter gradients support y/y0/y1 axes

Mark normalization covers legacy style:

- line `geomStyle`, `lineWidth`, spline/step mapping
- area `areaColors`, area `geomStyle`, stack gradient behavior
- point/symbol `shape`, `size`, `geomStyle`
- bar `geomStyle`, width ratios, stack/dodge/percentage config

## Interactions

Wrapped charts merge interactions into native `spec.interaction`.

Supported public props:

```tsx
<Bar
  interaction={{ elementHighlight: true }}
  event={{ 'element:click': handler }}
  getChartInstance={(chart) => {}}
  chartRef={chartRef}
/>
```

Compatibility interactions include:

- legacy legend filter/highlight
- legacy ellipsis text
- legacy rect zoom
- tooltip guard for reset button hover
- slider/scrollbar filter

Do not call old chain APIs like `chart.interaction(name, config)` in user-facing code unless working inside legacy internals. Public O-Insight code should pass `interaction` props or spec interaction.

## Slider, scrollbar, zoom

- `slider` and `scrollbar` normalize old config to native spec.
- Slider styles use theme tokens for track, handler, sparkline, and labels.
- Large data may use sampling config for slider trend.
- Rect zoom emits a reset button with O-Insight token styling and suppresses tooltip hover on the button.

## Escape hatches

### `dataType:'g2'`

Use when data is already flat native-spec records. This bypasses old highcharts-style data conversion.

```tsx
<Bar
  data={records as any}
  config={{
    dataType: 'g2',
    customConfig: { encode: { x: 'quarter', y: 'value', color: 'metric' } },
  }}
/>
```

### `customConfig`

Use for native spec sub-config injection. It is a merge escape hatch, not a total replacement for the chart model.

## Framework lifecycle

React hook: `packages/frameworks/react/src/hooks/useChart.ts`.

Solid primitive: `packages/frameworks/solid/src/primitives/createChart.ts`.

Both should support:

- create/update/destroy
- resize observer
- `event` rebinding
- `interaction` merge into spec
- `getChartInstance(chart|null)`
- `chartRef.current = chart|null`

When verifying lifecycle changes, use the public component boundary rather than importing internals.

## Validation gates

For source changes, prefer the repo gates relevant to the touched layer:

- core runtime/model changes: `packages/core` build, typecheck, release gate
- React changes: `packages/frameworks/react` build
- Solid changes: `packages/frameworks/solid` build plus `examples/solid-demo` runtime observation
- skill-only changes: validate skill frontmatter and ensure CLI vendor publish path includes skill files

For user-facing UI claims, run a browser and capture the actual rendered chart.
