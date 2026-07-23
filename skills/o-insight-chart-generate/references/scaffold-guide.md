# Scaffold Guide

Use this guide to stand up a runnable showcase page that renders real `@alicloud/cloud-charts-react` components and can be screenshotted.

## 1. Locate the monorepo

Find the `cloud-charts` repository root. It should contain:

- `packages/core/src/index.ts`
- `packages/frameworks/react/src/index.ts`

If working inside the repository already, use the current root.

## 2. Create the app

Copy `assets/showcase-template/` to a working directory, for example:

```text
<repo>/examples/visualize-<topic>/
```

Files:

- `package.json`: React + Vite example dependencies.
- `vite.config.ts`: update aliases to point to the local `packages/core` and `packages/frameworks/react` source entries.
- `index.html`, `tsconfig.json`: usually unchanged.
- `src/main.tsx`: gallery skeleton; edit chart cards here.

## 3. Fill in charts

For every chart card:

1. Choose the component through `cloud-charts-chart-recommend` or `references/report-patterns.md`.
2. Build data/config through `cloud-charts-chart-usage` rules.
3. Wrap all charts in `<ChartProvider theme locale>`.
4. Give every card a title and one concise insight sentence.

## 4. Install and run

```bash
cd <app-dir>
npm install
npm run dev -- --host 127.0.0.1 --port 5183
```

Pick a free port if 5183 is already used. Confirm the page loads and scan the dev-server output for compile errors.

## 5. Screenshot

When the user wants a PNG:

1. Keep the dev server running.
2. Use browser automation to open the local URL.
3. Wait for charts to render.
4. Capture a full-page or per-card screenshot.
5. Report the file path.

## Troubleshooting

- Theme does not match the page: ensure every chart is inside `<ChartProvider>`.
- Line collapses to one vertical line: use timestamps for real time axes, or configure categorical x values as point/category axis.
- Chart is blank: verify data shape first, then component name, then container height.
- Module not found: re-check `vite.config.ts` aliases relative to the app directory.
