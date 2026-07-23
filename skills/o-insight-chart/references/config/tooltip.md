# config.tooltip — wrapped side (stub)

In the wrapped mode, `config.tooltip` is `boolean | object` (false to disable).
Full field list per chart: `cloud-charts-react/references/charts/*` and the model source
`packages/core/src/runtime/features/tooltip.ts`.

Escape hatch to raw G2 tooltip sub-spec: `config.customConfig.tooltip` (deep-merged) — see
`cloud-charts-g2-spec/references/escape-hatches.md`. For pure G2 tooltip spec semantics see
`antv-g2-chart/references/components/g2-comp-tooltip-config.md`.
