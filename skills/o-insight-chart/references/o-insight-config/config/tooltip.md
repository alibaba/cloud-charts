# config.tooltip — wrapped side

In wrapped mode, `config.tooltip` is `boolean | object` and `false` disables tooltip behavior.

Authoritative implementation lives in `packages/core/src/runtime/features/tooltip.ts` and chart model source files. Use `references/o-insight-runtime/rules-adapters.md` for title formatter, sort, columns, dodge layout, and dual-axis formatter behavior.

Escape hatch to a native tooltip sub-spec:

```ts
config: {
  customConfig: {
    tooltip: { title: 'month' },
  },
}
```

For pure native spec semantics, read `references/native-spec/components/native-spec-comp-tooltip-config.md`.
