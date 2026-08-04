# Scaffold Guide

How to stand up a runnable showcase page that renders real `@alicloud/cloud-charts-react`
components, and optionally screenshot it.

## 1. Locate the monorepo

The charts live in the `cloud-charts` monorepo. Find its root (contains
`packages/core/src/index.ts` and `packages/frameworks/react/src/index.ts`).
If working inside it already, use that. The scaffold consumes source directly
via Vite aliases — no publish/build needed.

## 2. Create the app

Copy `assets/showcase-template/` to a working dir, e.g.
`<monorepo>/examples/visualize-<topic>/`. Files:
- `package.json` — React 18 + Vite 5；若走 monorepo 源码 alias，可在示例工程本地安装 `@alicloud/cloud-charts-core ~5.4.8` 以避免解析到仓库根的 native spec v4。发布包依赖模式下不要显式安装 native spec，它由 `@alicloud/cloud-charts-core` 带入.
- `vite.config.ts` — **fix the alias paths** to point at the monorepo's
  `packages/core/src/index.ts` and `packages/frameworks/react/src/index.ts`
  relative to where you placed the app. Keep `dedupe: ['@alicloud/cloud-charts-core','react','react-dom']`.
- `index.html`, `tsconfig.json` — as-is.
- `src/main.tsx` — the gallery skeleton. Edit the `CARDS` array: one entry per
  chart with `{ title, node: <SomeChart data={...} config={...} /> }`.

If placing OUTSIDE the monorepo, set aliases to absolute paths to the two source
entry files.

## 3. Fill in charts

For each chart: look up its data shape + config in `chart-catalog.md`, build
realistic typed data, and add a card. Keep the `<ChartProvider theme locale>`
wrapper. Do not call native spec native API.

## 4. Install & run

```bash
cd <app-dir>
pnpm install            # or npm install
pnpm exec vite --port 5183 > /tmp/visualize-dev.log 2>&1 &
sleep 2
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5183/
```
Pick a free port (5181 may be taken by upgrade-showcase). Confirm HTTP 200 and
scan `/tmp/visualize-dev.log` for compile errors. Report the URL to the user.

## 5. Screenshot (optional)

When the user wants a PNG: with the dev server running, invoke the
`agent-browser` skill to open the URL, wait for charts to render (~1–2s), and
capture a full-page or per-card screenshot to a file. Report the file path.

## Troubleshooting

- **Theme looks like native spec default (blue/cyan), not AISC (purple/teal):** a chart
  is rendering via native spec native API or missing `<ChartProvider>`. Use real components.
- **Line renders a single vertical line:** string x values with default
  `type:'time'`. Use timestamps + `type:'time'`, or `xAxis:{ type:'cat' }`.
- **Chart blank (Nightingale/Histogram/Candlestick):** known model bugs on some
  branches — swap to a simpler equivalent (Pie/Bar/Line) and note it.
- **Alias errors / module not found:** the alias paths in `vite.config.ts` don't
  match the monorepo location. Re-derive relative/absolute paths.
