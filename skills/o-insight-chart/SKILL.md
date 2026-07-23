---
name: cloud-charts-chart
description: Generate chart code for the cloud-charts refactored library (@alicloud/cloud-charts-*, 23 charts on G2 v5). Benchmark counterpart to antv-g2-chart — a dispatcher that routes to the right writing mode. Use when the user wants an cloud-charts/cloud-charts chart in any framework and it is not yet clear whether to write raw G2 spec or the data+config components. Decides between two modes: G2-native spec (default) vs wrapped data+config (when the context already uses it), then hands off to cloud-charts-g2-spec / cloud-charts-react / cloud-charts-vanilla. Keywords: cloud-charts, cloud-charts, cloud-charts, 图表, chart, G2 spec, data config, 组件, 选择怎么写, 图表代码生成.
---

# cloud-charts 图表代码生成器（调度器）

你是 cloud-charts 重构图表库（`@alicloud/cloud-charts-*`，23 种图表，构建于 G2 v5）的专家。
本 skill 是**对标 `antv-g2-chart` 的入口调度器**：先判定「用哪种写法」，再交给对应子 skill 落地准确代码。

本库有**两种写法**（同一批图表，两种保真度）：
- **G2 原生 spec**（默认）：直接写 G2 v5 spec。Solid 用 `@alicloud/cloud-charts-solid` 的 `<Chart spec={...} />`；其他环境用 core 的 `createChart({ container, spec, renderer })`，
  或在组件上用 `config.dataType:'g2'` 喂 G2 记录。表达力 = 完整 G2。
- **封装 data+config**：写 `<Bar data={...} config={{...}} />`（React/Solid 的已实现图表）或 `renderWbarModel({...})`（vanilla），
  原始数据进 `data`、样式行为进 `config`，库负责主题/图例/状态。

---

## 0. 决策门 / Decision Gate（先做这一步，再写任何代码）

按顺序判断，命中即停：

1. **上下文已用 data+config** → 用**封装模式**。
   触发信号（任一）：用户消息或当前代码里出现 `<Bar data= config=`、`renderWxxxModel(`、
   `BarSeries`/`BarChartConfig` 等类型、从 `@alicloud/cloud-charts-react` 或 `@alicloud/cloud-charts-{chart}` 导入组件、
   或用户明确说「用 data/config」「用组件」。
   → React 交给 **`cloud-charts-react`**；非 React（纯 JS/Vue/Angular）交给 **`cloud-charts-vanilla`**。

2. **上下文已用 G2 spec** → 用 **G2 原生模式**。
   触发信号：出现 `chart.options(`、`type:`/`encode:`/`transform:`/`coordinate:`、
   `createChart(`/`renderG2Spec(`、`ChartSpec`、或用户明确说「用 G2 spec / 原生」。
   → 交给 **`cloud-charts-g2-spec`**。

3. **都没有明确信号（新建/模糊）** → **默认 G2 原生 spec**（交给 `cloud-charts-g2-spec`）。
   但在动手前**先用一句话引导用户确认**，例如：
   > 「这张图我默认用 **G2 原生 spec**（表达力最全）来写；如果你的项目是用我们的
   > `<Bar data config/>` 组件，我改成 **data+config**。你倾向哪种？」
   用户一旦表态就按其选择，不再追问。

> 记忆口诀：**有 data+config 信号→封装；有 spec 信号或无信号→G2 原生（默认）；模糊先问一句**。

### 0.1 路由表

| 判定结果 | 子 skill | 关键入口 |
|---------|---------|---------|
| 封装 · React | `cloud-charts-react` | `<Bar data config />` + `<ChartProvider>` |
| 封装 · Solid | 本 skill / Solid API | 23 图表 `<Bar data config />` 等组件 |
| 封装 · 非 React/Solid | `cloud-charts-vanilla` | `renderWxxxModel({ container, data, config })` |
| G2 原生 · Solid | 本 skill / Solid API | `<Chart spec={spec} />`（默认 Solid 路线） |
| G2 原生 · 其他 | `cloud-charts-g2-spec` | `createChart({ container, spec, renderer })` / `config.dataType:'g2'` |
| 还没决定画什么图 | `cloud-charts-viz` | 意图→选图→产出 |

---

## 1. 核心约束 / Core Constraints (MUST follow)

**通用（两种模式都适用）**
1. **先过决策门**：没判定写法前不要写代码；模糊时先问一句（见第 0 节）。
2. **一张图一种模式，不混写**：同一个图表实例，要么纯 G2 spec，要么 data+config；
   不要在 data+config 组件里又直接 `chart.options()`。跨模式的桥是 `config.dataType:'g2'` 与 `customConfig`。
3. **容器/尺寸**：React 组件 `height` 默认 300、`width` 默认 '100%'，容器需有确定高度；
   原生 `createChart` 的 `container` 是 `HTMLElement`（非选择器字符串）且需有宽高。
4. **合法组件/图表清单**（23 图，勿造名）：`Bar Line Pie Scatter Radar Funnel Nightingale
   Histogram Box Heatmap Hexagonal LineBar LineScatter Linebox Candlestick Sunburst Treemap
   Hierarchy Sankey Rectangle Map Miniline MultiCircle`；KPI 部件 `Wnumber Wcount Wcircle
   Wgauge Wnumbercard`。别用 ECharts 名字（`Column/Area/Donut/Rose/Gauge/WordCloud` 等，本库没有）。

**封装模式约束**（详见 `cloud-charts-react` / `cloud-charts-vanilla`）
5. data 与 config 分离：data 只放原始值（元组/树/图），样式行为进 config；禁止把颜色 hex 塞进 data。
6. data 形状因图而异：多数「系列+元组」`[{name,data:[[x,y]]}]`；层级图是单根树；桑基是 `{nodes,links}`。
7. 组件从 `@alicloud/cloud-charts-react`（或单图包）导入，数据/配置类型从 `@alicloud/cloud-charts-core`。
8. 主题：React/Solid 用 `<ChartProvider theme locale>`；vanilla 用 `context:{theme,locale}`。

**G2 原生模式约束**（详见 `cloud-charts-g2-spec`，其中转引 `antv-g2-chart` 的 G2 v5 规则）
9. `ChartSpec` = G2 v5 spec 别名；`createChart` 必须显式传 `renderer`（用 `defaultG2Renderer`）。
10. 纯原生路径（`createChart`/`renderG2Spec`）**不套**库主题与 loading/empty/error；
    需要主题+状态就用组件 + `config.dataType:'g2'`。
11. G2 v5 本身的铁律仍成立（借用 `antv-g2-chart`）：`chart.options()` 只调一次、
    多 mark 用 `type:'view'`+`children`、`transform` 是数组、`labels` 复数、
    `coordinate.transform` 放 transpose、padding 不接受数组等。

<!-- CONSTRAINTS:END -->

---

## 2. 图表索引 / Chart Index（两种写法的对照）

按分析目标选图；同一行给出**封装组件名**与**等价 G2 spec 要点**，便于两种模式互查。
逐图 data 形状/config 全字段见 `cloud-charts-react/references/charts/*`；G2 mark 细节见 `antv-g2-chart/references/marks/*`。

| 目标 | 封装组件 | 封装 data 形状 | G2 原生要点（mark + 关键 spec） |
|------|---------|---------------|-------------------------------|
| 比较 | `Bar` | `{name,data:[cat,val][]}` | `interval`；堆叠`stackY`/分组`dodgeX`/水平`coordinate.transform:transpose` |
| 趋势 | `Line` | `{name,data:[x,y][]}` | `line`；`area:true`→加`area`；平滑`encode.shape:'smooth'` |
| 占比 | `Pie` | `{name,data:[label,val][]}` | `interval`+`coordinate:{type:'theta'}`+`stackY`；环形`innerRadius` |
| 玫瑰 | `Nightingale` | 同 Pie | `interval`+`coordinate:{type:'polar'}` |
| 转化 | `Funnel` | `{name,data:[stage,val][]}` | `interval`+`shape:'funnel'` |
| 相关/气泡 | `Scatter` | `{name,data:[x,y,size?][]}` | `point`；气泡`encode.size` |
| 多维 | `Radar` | `{name,data:[dim,val][]}` | `line`+`coordinate:{type:'polar'}`+parallel axis |
| 频率分布 | `Histogram` | `number[]`或`[x,count][]` | `rect`+`transform:[{type:'binX',y:'count'}]` |
| 统计分布 | `Box` | `{name,data:[x,low,q1,med,q3,high][]}` | `box`/`boxplot` |
| 密度矩阵 | `Heatmap` | `{name,data:[x,y,value][]}` | `cell`/`heatmap` |
| 密集散点 | `Hexagonal` | `[number,number][]` | `point`+`pack`/binX 分箱 |
| 量+率组合 | `LineBar`/`LineScatter`/`Linebox` | 每系列`geomType`+`yAxis` | `type:'view'`+`children`(interval+line…) |
| 层级(径向) | `Sunburst` | 单根树`{name,value?,children?}` | `sunburst`（需 g2 扩展包）/`partition`+polar |
| 层级(矩形) | `Treemap` | 同树 | `treemap` |
| 层级(链接) | `Hierarchy` | 同树 | `tree` |
| 流向 | `Sankey` | `{nodes,links}` | `sankey` |
| 日历/网格 | `Rectangle` | `[x,y,value][]` | `cell` |
| 金融 | `Candlestick` | `{name,data:[x,open,close,low,high][]}` | `link`+`interval`；范围`encode:{y,y1}` |
| 地理 | `Map` | `[{name,value,lng?,lat?}]`+geoData | `geoView`/`geoPath` |
| 迷你趋势 | `Miniline` | 同 Line 无轴 | `line` 去轴去图例 |
| 环形进度 | `MultiCircle` | `[{name,value,max?}]` | `interval`+`coordinate:{type:'radial'}` |
| 单值 KPI | `Wnumber`等 | 大数字/仪表 | — |

---

## 3. 两种写法的最小骨架 / Minimal skeletons

**封装 · React**
```tsx
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries } from '@alicloud/cloud-charts-core';
const data: BarSeries[] = [{ name: '2026', data: [['Q1', 120], ['Q2', 155]] }];
<ChartProvider theme="normal" locale="zh-CN">
  <Bar data={data} config={{ stack: true }} height={320} />
</ChartProvider>
```

**封装 · vanilla**
```ts
import { renderWbarModel } from '@alicloud/cloud-charts-bar';
const { chart } = renderWbarModel({ container: el, data, config: { stack: true }, context: { theme: 'dark' } });
// … chart.destroy() on unmount
```

**G2 原生 spec**
```ts
import { createChart, defaultG2Renderer } from '@alicloud/cloud-charts-core';
import type { ChartSpec } from '@alicloud/cloud-charts-core';
const spec: ChartSpec = { type: 'interval', data: records, encode: { x: 'q', y: 'v' }, transform: [{ type: 'stackY' }] };
const c = createChart({ container: el, spec, renderer: defaultG2Renderer }); c.render();
```

**桥（组件里用 G2 记录，保留主题）**
```tsx
<Bar data={g2Records as any} config={{ dataType: 'g2', customConfig: { encode: { x: 'q', y: 'v', color: 't' } } }} />
```

---

## 4. 分主题参考 / Reference topics

本 skill 是调度器，深度内容分布在合集里，按需读取：

- **决策/上下文判定**：`references/decision.md`（信号清单、边界例子、追问话术）。
- **逐图 data+config**：`cloud-charts-react/references/charts/*`（bar/line/pie/scatter/hierarchy/sankey…）。
- **G2 原生**：`cloud-charts-g2-spec/references/{native-api,escape-hatches}.md`。
- **G2 v5 语义大全**（marks/scales/transforms/coordinates/interactions/components/compositions/themes/palettes/animations/label-transform/patterns）：
  直接复用官方 **`antv-g2-chart/references/**`**（本仓库已镜像）。
- **配置专题（封装侧）**：`references/config/*`（axis/legend/tooltip…，映射到我们的 config 字段）。
- **框架安装**：见 `cloud-charts-react` / `cloud-charts-vanilla` 的安装节，或 CLI：
  `npx @alicloud/cloud-charts-cli@alpha add wbar --react`（源码复制）/ `--as-dep`（npm 依赖）。

---

## 5. 与 antv-g2-chart 的关系 / Relationship

- `antv-g2-chart`：教**纯 G2 v5 spec**（与本库无关的通用 G2 知识）。
- `cloud-charts-chart`（本 skill）：教**在本重构库里怎么选写法并落地**，G2 原生部分**复用** `antv-g2-chart` 的规则，
  封装部分走我们的 data+config。二者互补：需要 G2 语义细节时下钻 `antv-g2-chart`，需要本库 API/组件时用本合集。
