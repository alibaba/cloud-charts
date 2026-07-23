---
name: cloud-charts-vanilla
description: Render cloud-charts charts in framework-agnostic JavaScript/TypeScript using the per-chart vanilla packages (@alicloud/cloud-charts-bar, @alicloud/cloud-charts-line, @alicloud/cloud-charts-pie, … one npm package per chart). Use when the user is NOT in React/Solid — plain JS/TS, Vue, Angular, Svelte, web components, or a build-tool-free page — and wants to mount a chart into a DOM element, or asks about renderWxxxModel / renderWxxx / createWxxx, single-chart packages, or imperative chart lifecycle. Keywords: vanilla, 原生 JS, cloud-bar, cloud-line, renderWbarModel, renderWbar, createWbar, 单图包, Vue, Angular, 命令式图表, container element.
---

# cloud-charts Vanilla（单图包 / 框架无关）

本 skill 负责在**非 React/Solid**环境用 cloud-charts 图表：纯 JS/TS、Vue、Angular、Svelte、
Web Components、无构建的页面。每种图表是一个**独立 npm 包**（`@alicloud/cloud-charts-bar` 等），
提供**命令式**渲染函数，把图表挂到一个 `HTMLElement`。

> 何时用哪个 skill：
> - React 组件 → `cloud-charts-react`。
> - 写原生 G2 spec / 需要 G2 完整表达力 → `cloud-charts-g2-spec`。
> - 还没决定画什么 → `cloud-charts-viz`。
> - **框架无关 / 命令式挂载** → 本 skill。

---

## 1. 核心约束 / Core Constraints (MUST follow)

1. **一图一包，包名 = `@alicloud/cloud-charts-{图表名}`**（去掉前缀 `w`）：
   `wbar → @alicloud/cloud-charts-bar`、`wline → @alicloud/cloud-charts-line`、`wpie → @alicloud/cloud-charts-pie`、
   `wsankey → @alicloud/cloud-charts-sankey`、`wsunburst → @alicloud/cloud-charts-sunburst` …
   **禁止**假想一个「全家桶」包；按需装单图包。类型仍从 `@alicloud/cloud-charts-core`（各包也 re-export）。
2. **所有函数都收「选项对象」，不是位置参数**：
   `renderWbarModel({ container, data, config?, context?, renderer? })`。
   **禁止**写成 `renderWbarModel(container, data, config)`。
3. **`container` 是 `HTMLElement`，不是选择器字符串**，且需有确定宽高。
   传 `document.getElementById('x')!`，不要传 `'#x'`。
4. **两条渲染路径**（详见第 2 节）：
   - **Model 路径｜`renderWxxxModel`**（**所有 23 图都有**，**推荐**）：走完整业务运行时
     （rules/scale/theme/legend/tooltip/axis/zoom/slider），返回 `{ chart, model }`。
   - **Spec 路径｜`createWxxx` / `renderWxxx`**（**仅 bar/line/pie 提供**）：只经 `createXxxSpec`，
     扁平 G2 spec，无 rules/theme，返回图表实例。更接近原生 G2、更轻。
5. **config 类型随路径不同**：Model 路径用 `BarChartConfig`（全功能）；
   Spec 路径用 `BarSpecConfig`（精简）。别混用字段。
6. **返回值要保存并管理生命周期**：`renderWxxx*` 返回的实例（Model 路径是 `{ chart, model }`，
   `chart` 为 `NativeChartInstance`）需在销毁时 `chart.destroy()`；
   数据更新优先 `chart.changeData(nextData)`，结构变更 `chart.update(nextSpec)`。
7. **data 形状与 React 版一致**（因图而异）：多数图「系列+元组」`[{ name, data:[[x,y]] }]`；
   层级图（sunburst/treemap/hierarchy）是**单根树**；桑基是**图** `{ nodes, links }`。
   逐图形状见 `cloud-charts-react` 的 `references/charts/*` 或各包 README。
8. **主题/语言走 `context`**，不是 Provider（无 React 上下文）：
   `renderWbarModel({ container, data, context: { theme: 'dark', locale: 'zh-CN' } })`。
   Spec 路径（createWxxx/renderWxxx）**不吃 context/主题**——需要主题就用 Model 路径。

<!-- CONSTRAINTS:END -->

---

## 2. 两条路径 / Two Paths

### Model 路径（推荐，全功能，所有图都有）

```ts
import { renderWbarModel } from '@alicloud/cloud-charts-bar';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [
  { name: '2025', data: [['一季度', 120], ['二季度', 132]] },
  { name: '2026', data: [['一季度', 90],  ['二季度', 155]] },
];
const config: BarChartConfig = { legend: { position: 'top' }, label: true };

const { chart, model } = renderWbarModel({
  container: document.getElementById('chart')!, // 需有宽高
  data,
  config,
  context: { theme: 'dark', locale: 'zh-CN' },  // 主题/语言在此
});

// 更新 / 卸载
chart.changeData([{ name: '2025', data: [['一季度', 200]] }]);
chart.destroy();
```

`model` 里含 `{ spec, legend, tooltip, state, ... }`，可用来自绘增强图例/提示。

### Spec 路径（仅 bar / line / pie，更轻、更接近原生 G2）

```ts
import { renderWbar, createWbar } from '@alicloud/cloud-charts-bar';
import type { BarSeries, BarSpecConfig } from '@alicloud/cloud-charts-core';

// renderWbar：创建并立即渲染
const chart = renderWbar({
  container: document.getElementById('chart')!,
  data: [{ name: 'A', data: [['1月', 100], ['2月', 120]] }] as BarSeries[],
  config: { stack: true } as BarSpecConfig,
});

// createWbar：只创建不渲染（需自己 chart.render()），便于先改再画
const c = createWbar({ container, data, config });
c.render();
```

> Spec 路径不经过主题/rules。要主题、zoom、slider、增强图例，用 Model 路径。
> 需要**完全自定义的 G2 spec**（自定义 mark/composition）→ 用 `cloud-charts-g2-spec`。

---

## 3. 各框架接入 / Framework glue

命令式函数天然适配任意框架——**在框架的「挂载后 / 卸载前」钩子里调用**：

```ts
// Vue 3
import { onMounted, onUnmounted, ref } from 'vue';
import { renderWlineModel } from '@alicloud/cloud-charts-line';
const el = ref<HTMLElement>();
let inst: { chart: { destroy(): void } } | null = null;
onMounted(() => { inst = renderWlineModel({ container: el.value!, data, config }); });
onUnmounted(() => inst?.chart.destroy());
// 模板：<div ref="el" style="height:320px"></div>
```

```ts
// Angular
ngAfterViewInit() { this.inst = renderWpieModel({ container: this.host.nativeElement, data: this.data }); }
ngOnDestroy() { this.inst?.chart.destroy(); }
```

```ts
// 无构建 / <script type="module">：从 CDN/本地 ESM 导入对应单图包，逻辑同上。
```

> Vue/Angular **没有官方封装组件**，用单图包 + 生命周期钩子即可。React/Solid 才有 `<Bar>` 组件。

---

## 4. 常见错误 / Common Mistakes

```ts
// ❌ 位置参数
renderWbarModel(container, data, config);
// ✅ 选项对象
renderWbarModel({ container, data, config });

// ❌ 传选择器字符串
renderWbarModel({ container: '#chart', data });
// ✅ 传 HTMLElement
renderWbarModel({ container: document.getElementById('chart')!, data });

// ❌ 对 sankey/sunburst 用 Spec 路径（它们只有 Model 路径）
renderWsankey({ container, data });          // 不存在
// ✅ 只有 Model 路径
renderWsankeyModel({ container, data });

// ❌ Spec 路径却期望主题生效
renderWbar({ container, data, config: { /* 无 theme 能力 */ } });
// ✅ 要主题用 Model 路径 + context
renderWbarModel({ container, data, context: { theme: 'dark' } });

// ❌ 容器无高度 → 图塌陷
<div id="chart"></div>  // 无 height
// ✅ 给容器确定高度
<div id="chart" style="height:320px"></div>

// ❌ 丢弃实例 → 泄漏
renderWlineModel({ container, data });
// ✅ 保存并在卸载时 destroy
const { chart } = renderWlineModel({ container, data }); /* … */ chart.destroy();
```

---

## 5. 安装 / Install（cloud-charts CLI）

```bash
# 依赖方式（推荐；跟随上游更新）
npx @alicloud/cloud-charts-cli@alpha add wbar wline wpie --vanilla --as-dep
npm install
# 或源码复制（可改可控）
npx @alicloud/cloud-charts-cli@alpha add wbar --vanilla
```

装出来的包即 `@alicloud/cloud-charts-bar` / `@alicloud/cloud-charts-line` / …；类型从 `@alicloud/cloud-charts-core`。

## 6. 参考 / References

- `references/functions.md` — 三个函数（`createWxxx`/`renderWxxx`/`renderWxxxModel`）的选项对象、
  返回值、`NativeChartInstance` 方法（render/update/changeData/resize/destroy）、
  哪些图有 Spec 路径（仅 bar/line/pie）。
- data 形状逐图见 `cloud-charts-react/references/charts/*` 或各包 `README.md`。
- 精确导出以源码为准：`packages/charts/<wxxx>/src/index.ts`、`packages/charts/<wxxx>/package.json`。
