# config.legend — wrapped side

In wrapped mode, `config.legend` is `boolean | object` and `false` disables the legend.

Authoritative implementation lives in `packages/core/src/runtime/features/legend.ts` and chart model source files. Use `references/o-insight-runtime/rules-adapters.md` for theme, spacing, formatter, and custom legend behavior.

Escape hatch to a native legend sub-spec:

```ts
config: {
  customConfig: {
    legend: { color: { position: 'bottom' } },
  },
}
```

For pure native spec semantics, read `references/native-spec/components/native-spec-comp-legend-config.md`.
