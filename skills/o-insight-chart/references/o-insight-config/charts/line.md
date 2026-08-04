# line — two-mode quick map

Use this quick map after the decision gate chooses a mode.

## Wrapped data+config

Use `Line` from `@alicloud/cloud-charts-react` or `@alicloud/cloud-charts-solid`, or `renderWlineModel({...})` from `@alicloud/cloud-charts-line`.

Typical data shape:

```ts
[{ name: '销售额', data: [[timestamp, 120], [timestamp + 86400000, 180]] }]
```

Use `references/frameworks/react/charts/line.md`, `references/frameworks/vanilla/functions.md`, and `references/o-insight-config/config/*` for wrapped details.

## Spec-first

Use `ChartSpec` with line marks, or the Solid `<Chart spec={...} kind="line" />` component.

Relevant native spec references:

- `references/native-api/native-api.md`
- `references/native-spec/marks/native-spec-mark-line-multi.md`
- `references/native-spec/marks/native-spec-mark-area-basic.md`
- `references/native-spec/core/native-spec-core-encode-channel.md`

Use `config.xAxis.type = 'time'` in wrapped mode for continuous time axes; category labels like `1月` should remain categorical.
