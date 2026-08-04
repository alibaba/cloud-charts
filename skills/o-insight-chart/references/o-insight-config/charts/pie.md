# pie — two-mode quick map

Use this quick map after the decision gate chooses a mode.

## Wrapped data+config

Use `Pie` from `@alicloud/cloud-charts-react` or `@alicloud/cloud-charts-solid`, or `renderWpieModel({...})` from `@alicloud/cloud-charts-pie`.

Typical data shape:

```ts
[{ name: '渠道占比', data: [['搜索', 42], ['推荐', 28], ['广告', 18]] }]
```

Use `references/frameworks/react/charts/pie.md`, `references/frameworks/vanilla/functions.md`, and `references/o-insight-config/config/*` for wrapped details.

## Spec-first

Use `ChartSpec` with interval + theta coordinate, or the Solid `<Chart spec={...} kind="pie" />` component.

Relevant native spec references:

- `references/native-api/native-api.md`
- `references/native-spec/marks/native-spec-mark-arc-pie.md`
- `references/native-spec/marks/native-spec-mark-arc-donut.md`

When matching old UI matters, wrapped mode usually gives better default legend/label/theme parity.
