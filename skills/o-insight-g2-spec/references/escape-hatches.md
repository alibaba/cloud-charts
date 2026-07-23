# Escape hatches inside wrapped components — dataType:'g2' and customConfig

These keep the cloud-charts pipeline (theme, legend, loading/empty/error) while letting you drop to
raw G2 for data and/or specific sub-specs. Both live on `config` of any wrapped chart
(`<Bar>`, `<Line>`, … in React; `renderWxxxModel(..., config)` in vanilla).

## config.dataType: 'g2' — bypass data normalization

Source: `packages/core/src/model/createChartModel.ts:47-52`.

Default (no `dataType`): the library runs `normalizeData(data)` which turns the
"series + tuple" shape (`[{ name, data: [[x,y]] }]`) into flat G2 records.

With `dataType: 'g2'`: normalization is **skipped**; your `data` is passed to G2 **as-is**.
So `data` must already be **flat G2 records**:

```ts
// what you pass when dataType:'g2'
data = [
  { type: '线上', month: '1月', value: 120 },
  { type: '线下', month: '1月', value: 80 },
];
```

Important:
- **TS type does not change.** The prop is still typed `BarSeries[]` etc. Passing G2 records
  will NOT raise a type error (known loose spot). Cast with `as any` if the compiler complains,
  and trust the runtime semantics.
- The rest of the pipeline still runs: theme resolution, legend model, tooltip, empty/error rules.
- You usually pair it with `customConfig.encode` so G2 knows which fields map to x/y/color.

```tsx
<Bar
  data={g2Records as any}
  config={{ dataType: 'g2', customConfig: { encode: { x: 'month', y: 'value', color: 'type' } } }}
/>
```

## config.customConfig — deep-merge raw G2 into sub-specs

`customConfig` is deep-merged (`deepMerge`) into specific **sub-structures** of the assembled
spec — NOT the root spec. Confirmed merge sites:

| sub-spec | source |
|----------|--------|
| axis | `packages/core/src/model/index.ts` (axis assembly) |
| legend | `packages/core/src/runtime/features/legend.ts` |
| tooltip | `packages/core/src/runtime/features/tooltip.ts` |

So you CAN override native G2 axis/legend/tooltip details:

```tsx
config={{
  customConfig: {
    axis:    { y: { tickCount: 5, labelFormatter: (v:number)=>`${v}%` } },
    legend:  { color: { itemLabelFontSize: 12 } },
    tooltip: { items: [{ channel: 'y', valueFormatter: (v:number)=>v.toFixed(1) }] },
  },
}}
```

You CANNOT use `customConfig` to swap the whole chart:

```tsx
// ❌ has no effect on root — type/data/encode are not root-merged from customConfig
config={{ customConfig: { type: 'line', data: [...] } }}
```

To change the root structure (mark type, top-level encode, whole data), use the native path
(`createChart` + `ChartSpec`) from native-api.md, or `dataType:'g2'` for data + `encode`.

## Decision

- Need library theme/state but data is already G2 records → `dataType:'g2'` (+ `customConfig.encode`).
- Need to tweak only axis/legend/tooltip in native G2 terms → `customConfig`.
- Need full G2 control (marks, composition, coordinate, transform) → native `createChart` path.
