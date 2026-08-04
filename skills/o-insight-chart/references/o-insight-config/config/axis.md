# config.axis — wrapped side

In wrapped mode, `config.axis` is `boolean | object` and `false` disables the axis.

Authoritative implementation lives in `packages/core/src/runtime/features/axis.ts` and chart model source files. Use `references/o-insight-config/charts/*` for chart-specific data shapes.

Escape hatch to a native axis sub-spec:

```ts
config: {
  customConfig: {
    axis: { y: { labelFormatter: (value: number) => `${value}%` } },
  },
}
```

For pure native spec semantics, read `references/native-spec/components/native-spec-comp-axis-config.md`.
