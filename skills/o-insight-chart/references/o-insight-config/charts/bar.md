# bar — two-mode quick map

Use this quick map after the decision gate chooses a mode.

## Wrapped data+config

Use `Bar` from `@alicloud/cloud-charts-react` or `@alicloud/cloud-charts-solid`, or `renderWbarModel({...})` from `@alicloud/cloud-charts-bar`.

Typical data shape:

```ts
[{ name: '销售额', data: [['杭州', 120], ['上海', 180]] }]
```

Use `references/frameworks/react/charts/bar.md`, `references/frameworks/vanilla/functions.md`, and `references/o-insight-config/config/*` for wrapped details.

## Spec-first

Use `ChartSpec` with interval marks, or the Solid `<Chart spec={...} kind="bar" />` component.

Relevant native spec references:

- `references/native-api/native-api.md`
- `references/native-spec/marks/native-spec-mark-interval-basic.md`
- `references/native-spec/marks/native-spec-mark-interval-grouped.md`
- `references/native-spec/marks/native-spec-mark-interval-stacked.md`

When theme/state parity with wrapped components matters, prefer wrapped mode or use `config.dataType:'g2'` plus `customConfig`.
