# config.axis — wrapped side (stub)

In the wrapped mode, `config.axis` is `boolean | object` (false to disable).
Full field list per chart: `cloud-charts-react/references/charts/*` and the model source
`packages/core/src/runtime/features/axis.ts`.

Escape hatch to raw G2 axis sub-spec: `config.customConfig.axis` (deep-merged) — see
`cloud-charts-g2-spec/references/escape-hatches.md`. For pure G2 axis spec semantics see
`antv-g2-chart/references/components/g2-comp-axis-config.md`.
