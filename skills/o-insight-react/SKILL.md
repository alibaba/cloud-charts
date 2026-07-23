---
name: cloud-charts-react
description: Generate correct React code using the cloud-charts (@alicloud/cloud-charts-react) chart components — 23 spec-flat chart components built on G2 v5. Use when the user writes/edits React code that renders cloud-charts/cloud-react charts (Bar, Line, Pie, Scatter, Radar, Funnel, Sunburst, Sankey, Heatmap, Hierarchy, Treemap, etc.), asks how to pass data/config, set theme/locale via ChartProvider, handle loading/empty/error, or install a component with the cloud-charts CLI. Keywords: cloud-react, cloud-charts, cloud-charts, 图表组件, Bar/Line/Pie 组件, ChartProvider, 组件用法.
---

# cloud-charts React 图表组件代码生成器

你是 `@alicloud/cloud-charts-react` 图表组件库的专家。生成**准确、可运行**的 React 代码。
本库是对 G2 v5 的**组件化封装**：用户写 React 组件（`<Bar data config />`），
**不直接调用** G2 的 `chart.options()`。数据与样式**分离**——原始数据进 `data`，
所有样式/行为进 `config`。

> 何时用哪个 skill（本库图表 skill 合集）：
> - 本 skill：React 组件**怎么写对**（API 契约、防幻觉）。
> - `cloud-charts-viz`：还没决定「可视化什么、选哪种图」时，先意图→选图→产出。
> - `cloud-charts-vanilla`：非 React/Solid（纯 JS/TS、Vue、Angular）用单图包命令式渲染。
> - `cloud-charts-g2-spec`：需要**原生 G2 v5 spec** 的表达力（自定义 mark/composition），
>   或想在组件里用 `dataType:'g2'` / `customConfig` 逃生舱（见下方第 5.5 节）。

---

## 1. 核心约束 / Core Constraints (MUST follow)

1. **组件化，不碰 G2 底层**：用 `<Bar data={...} config={{...}} />` 这类组件。
   **禁止**在用户代码里 `new Chart()`、`chart.options()`、`chart.render()` ——
   那是库内部行为。需要 G2 能力时通过 `config` 透传，而不是绕过组件。
2. **data 与 config 分离**：`data` 只放**原始数据**（数值/类别/时间戳）；
   一切样式、坐标轴、图例、堆叠/分组等**行为**放 `config`。
   **禁止**把颜色 hex、样式对象塞进 `data`。
3. **data 形状因图而异，且大多是「系列 + 元组数组」**：
   多数图表 `data: Array<{ name: string; data: Array<[x, y]> }>`（元组，不是 `{x,y}` 对象）。
   **层级图**（Sunburst/Treemap/Hierarchy）是**单根树** `{ name, value?, children? }`，**不是数组**。
   **Sankey** 是**图** `{ nodes, links }`，**不是数组**。逐图以第 5 节 / `references/charts/*` 为准。
4. **导入路径分两处**：组件与其 Props 类型从 `@alicloud/cloud-charts-react`；
   数据/配置类型（`BarSeries`、`BarChartConfig` 等）从 `@alicloud/cloud-charts-core`。
   **禁止**从 `@alicloud/cloud-charts-react` 导入 `BarSeries` 这类数据类型。
5. **主题/语言走 `<ChartProvider theme locale>`**：包裹在应用根部注入。
   优先级链固定为 **显式 prop > context.prop > Provider 值 > 全局状态**。
   需要单图覆盖时，直接在组件上写 `theme="dark"`，不要改 Provider。
6. **尺寸默认值**：`height` 默认 `300`（数字=px），`width` 默认 `'100%'`。
   容器需有确定高度，否则图表塌陷。`autoFit` 由库内部处理，用户不手动设。
7. **config 的开关类字段用布尔/对象二选一**：如 `legend`、`tooltip`、`xAxis`、`yAxis`、
   `label` 均为 `boolean | object`（`false` 关闭，对象为细粒度配置）。
   `yAxis` 在 Line/LineBar 支持**数组**表示**双 Y 轴**。
8. **loading/empty/error 由组件内置**：传 `loading={true}` 显示加载态；
   传 `emptyInfo` / `errorInfo` / `loadingInfo`（`React.ReactNode`）覆盖默认文案。
   **禁止**自己在外面套 loading 遮罩——库已用 `ChartStateOverlay` 处理。
9. **组件先安装再用**：源码复制或 npm 依赖二选一，用 cloud-charts CLI（见第 6 节）。
   **禁止**假设组件已存在于某个本地路径；先确认安装方式。

### 1.1 禁止使用的写法 / Forbidden Patterns

```tsx
// ❌ 禁止：直接调用 G2 底层（本库已封装）
import { Chart } from '@antv/g2';
const chart = new Chart({ container: 'c' });
chart.options({ type: 'interval', data, encode: { x, y } });

// ✅ 正确：用组件 + data/config
import { Bar } from '@alicloud/cloud-charts-react';
<Bar data={data} config={{ stack: true }} height={320} />

// ❌ 禁止：data 用 {x, y} 对象数组（本库多数图表是元组）
const data = [{ name: 'A', data: [{ x: '1月', y: 100 }] }];

// ✅ 正确：元组数组 [x, y]
const data = [{ name: 'A', data: [['1月', 100], ['2月', 120]] }];

// ❌ 禁止：把颜色/样式塞进 data
const data = [{ name: 'A', data: [['1月', 100]], color: '#5B8FF9' }];

// ✅ 正确：样式进 config，data 只有原始值
<Bar data={[{ name: 'A', data: [['1月', 100]] }]} config={{ colors: ['#5B8FF9'] }} />

// ❌ 禁止：从 cloud-react 导入数据类型
import { Bar, BarSeries } from '@alicloud/cloud-charts-react';

// ✅ 正确：组件从 react，类型从 core
import { Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';

// ❌ 禁止：给层级图/桑基图传系列数组
<Sunburst data={[{ name: 'root', data: [['a', 1]] }]} />

// ✅ 正确：层级图是单根树对象
<Sunburst data={{ name: 'root', children: [{ name: 'a', value: 1 }] }} />
```

### 1.2 禁止使用的幻觉组件 / Hallucinated Components

以下来自 ECharts / antd-charts / 旧版命名，**本库不存在**，用了会编译或运行报错：

| ❌ 错误 | ✅ 正确 |
|--------|--------|
| `<Column>` | `<Bar>`（纵向柱状；水平柱通过 config 转置） |
| `<Area>` | `<Line config={{ area: true }} />` |
| `<Donut>` / `<Ring>` | `<Pie config={{ cycle: true }} />` |
| `<Rose>` | `<Nightingale>` |
| `<Gauge>`（图表） | `<Wgauge>`（KPI 部件，非 chart 系列） |
| `<WordCloud>` | 本库无词云组件 |
| `<Bar type="line">` | 用对应组件 `<Line>`，不是 type 切换 |
| 旧版 `<Wbar height="300">`（字符串） | 新版 `<Bar height={300} />`（数字），旧 W* 仅 compat 兼容层 |

**合法组件清单**（不得凭空创造其他名字）：
`Bar`、`Line`、`Pie`、`Scatter`、`Radar`、`Funnel`、`Nightingale`、`Histogram`、
`Box`、`Heatmap`、`Hexagonal`、`LineBar`、`LineScatter`、`Linebox`、`Candlestick`、
`Sunburst`、`Treemap`、`Hierarchy`、`Sankey`、`Rectangle`、`Map`、`Miniline`、`MultiCircle`。
KPI/部件：`Wnumber`、`Wcount`、`Wcircle`、`Wgauge`、`Wnumbercard`、`Wlistcontainer`。
辅助：`ChartProvider`、`FreeTooltip`、`AiLoadingIcon`、`Wplaceholder`、
`TableLegend`、`FoldableLegend`、`GradientLegend`。

<!-- CONSTRAINTS:END -->

---

## 2. 常见错误 / Common Mistakes

```tsx
// ❌ 时间序列用字符串 x → 会塌成一个点
const data = [{ name: 'QPS', data: [['2026-07-01', 120], ['2026-07-02', 130]] }];
<Line data={data} />

// ✅ 用时间戳 + 时间轴（Line 默认 xAxis 即 time）
const T0 = new Date('2026-07-01').getTime(), D = 86400_000;
const data = [{ name: 'QPS', data: [[T0, 120], [T0 + D, 130]] }];
<Line data={data} config={{ xAxis: { type: 'time', mask: 'auto' } }} />

// ✅ 分类 x（月份等标签）用 point 轴
<Line data={data} config={{ xAxis: { type: 'point' } }} />

// ❌ 容器无高度 → 图表塌陷不显示
<div><Bar data={data} /></div>   // 父级无高度且未设 height

// ✅ 显式高度
<Bar data={data} height={320} />

// ❌ 关闭图例写成 legend={{ visible: false }} 之外还自己删数据
// ✅ 直接布尔关闭
<Bar data={data} config={{ legend: false, tooltip: false }} />

// ❌ 双 Y 轴只给 yAxis 一个对象
<LineBar data={data} config={{ yAxis: {} }} />

// ✅ 双 Y 轴：series 标 yAxis 索引 + config.yAxis 传数组
const data = [
  { name: '销量', geomType: 'bar', yAxis: 0, data: [['1月', 100]] },
  { name: '增速', geomType: 'line', yAxis: 1, data: [['1月', 0.2]] },
];
<LineBar data={data} config={{ yAxis: [{}, {}] }} />

// ❌ 自己套 loading 遮罩
{loading ? <Spin/> : <Bar data={data} />}

// ✅ 用内置状态
<Bar data={data} loading={loading} loadingInfo="加载中…" />
```

---

## 3. 基础结构 / Basic Structure

```tsx
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';

const data: BarSeries[] = [
  { name: '2025', data: [['一季度', 120], ['二季度', 132], ['三季度', 101]] },
  { name: '2026', data: [['一季度', 90], ['二季度', 155], ['三季度', 130]] },
];
const config: BarChartConfig = { legend: { position: 'top' }, label: true };

export default function App() {
  return (
    <ChartProvider theme="normal" locale="zh-CN">
      <Bar data={data} config={config} height={320} />
    </ChartProvider>
  );
}
```

组件通用 props（所有 chart 系列一致）：
`data`（必填）、`config?`、`height?`（默认 300）、`width?`（默认 '100%'）、
`theme?`、`language?`、`context?`、`className?`、`style?`、
`event?`（`Record<string, fn>`，绑到 G2 事件）、
`loading?`、`loadingInfo?`、`emptyInfo?`、`errorInfo?`。

config 通用键（各图都有）：`legend`、`tooltip`（`boolean | object`）、
`colors`、`label`（`boolean | object`）、`customConfig`、`dataType`。

---

## 4. 主题与状态 / Theme & State

- **主题**：`<ChartProvider theme>` 可选 `'normal'`（默认浅色）、`'dark'`（深色）、`'yunxiao'`（云效）。
  单图覆盖：`<Line theme="dark" />`。**禁止**硬编码颜色伪造主题——颜色若像 G2 默认蓝青色，
  说明该图没走 Provider。
- **语言**：`<ChartProvider locale="zh-CN">`，或单图 `language="en-US"`。
- **状态**：`loading` → 加载态；数据为空 → 自动空态（`emptyInfo` 覆盖文案）；
  渲染出错 → 错误态（`errorInfo` 覆盖）。均由内置 `ChartStateOverlay` 处理。
- **图例模式**：库会按 `config.legend` 决定用 G2 原生或 React 增强图例
  （table/foldable/gradient），一般无需手动挑选。

---

## 5. 组件索引 / Component Index

按分析目标选组件；每个组件的完整 data 形状、config 全字段、可运行示例见 `references/charts/`。

| 目标 | 组件 | data 形状要点 | 详情 |
|------|------|--------------|------|
| 比较（分类） | `Bar` | `{name,data:[cat,val][]}`；多系列 `dodge`(默认) 或 `stack:true` | [bar](references/charts/bar.md) |
| 趋势（时间/有序） | `Line` | `{name,data:[x,y][],yAxis?}`；`area/stack/spline` | [line](references/charts/line.md) |
| 趋势迷你 | `Miniline` | 同 Line，无轴无图例，KPI 卡用 | — |
| 量+率组合 | `LineBar` / `LineScatter` / `Linebox` | 每系列 `geomType` + `yAxis` 索引，双 Y | — |
| 占比 | `Pie` | `{name,data:[label,val][]}`；`cycle:true`→环形 | [pie](references/charts/pie.md) |
| 占比玫瑰 | `Nightingale` | 同 Pie，半径编码值 | — |
| 转化阶段 | `Funnel` | `{name,data:[stage,val][]}`；`shape:'column'|'pyramid'` | — |
| 相关/气泡 | `Scatter` | `{name,data:[x,y,size?][]}`（第三元素可选=气泡大小） | [scatter](references/charts/scatter.md) |
| 多维对比 | `Radar` | `{name,data:[dim,val][]}`；3–8 维 | — |
| 频率分布 | `Histogram` | `number[]` 或 `[x,count][]` | — |
| 统计分布 | `Box` | `{name,data:[x,low,q1,med,q3,high][]}` | — |
| 密度矩阵 | `Heatmap` | `{name,data:[x,y,value:number][]}`（第三元素必填数字） | — |
| 密集散点 | `Hexagonal` | `Array<[number,number]>` | — |
| 层级占比（径向） | `Sunburst` | **单根树** `{name,value?,children?}` | [hierarchy](references/charts/hierarchy.md) |
| 层级占比（矩形） | `Treemap` | 同树形 | [hierarchy](references/charts/hierarchy.md) |
| 层级结构（节点链接） | `Hierarchy` | 同树形；`polar:true` 转径向 | [hierarchy](references/charts/hierarchy.md) |
| 流向/转移 | `Sankey` | **图** `{nodes:[{name}],links:[{source,target,value}]}` | [sankey](references/charts/sankey.md) |
| 日历/网格 | `Rectangle` | `Array<[x,y,value]>` | — |
| OHLC 金融 | `Candlestick` | `{name,data:[x,open,close,low,high][]}` | — |
| 地理 | `Map` | `Array<{name,value,lng?,lat?}>` + `geoData`(GeoJSON) | — |
| 单值 KPI | `Wnumber`/`Wcount`/`Wcircle`/`Wgauge`/`Wnumbercard` | 大数字/进度/仪表部件 | — |

> 未列出「详情」链接的组件，其 data/config 形状遵循同类规律（系列+元组 或 树/图）；
> 需要精确字段时直接读对应 `packages/core/src/model/<chart>.ts` 与 `<chart>DefaultConfig.ts`。

---

## 5.5 双模式：封装 vs G2 原生 / Wrapped vs G2-native

同一套组件支持两种「保真度」。默认走**封装模式**（data 系列+元组 → 库归一化）；
需要 G2 原生表达力时用**逃生舱**，仍保留主题/图例/状态。完整说明见 `cloud-charts-g2-spec` skill。

- **封装模式（默认）**：`<Bar data={series} config={{ stack:true }} />`，data 是「系列+元组」。
- **`dataType:'g2'`（旁路归一化）**：data 直接传 **G2 平铺记录**，库不再解析元组；
  主题/图例/loading 仍生效。配 `customConfig.encode` 指定 x/y/color 维度。

```tsx
const g2Records = [
  { type: '线上', month: '1月', value: 120 },
  { type: '线下', month: '1月', value: 80 },
];
<Bar
  data={g2Records as any}   // 运行期是 G2 记录；TS 形参仍是 BarSeries[]（已知宽松点）
  config={{ dataType: 'g2', customConfig: { encode: { x: 'month', y: 'value', color: 'type' } } }}
/>
```

- **`customConfig`（局部逃生舱）**：把原生 G2 子 spec 深合并进 **axis / legend / tooltip**
  （不是根 spec，改不了 type/data/根 encode）。

```tsx
<Line data={series} config={{ customConfig: { axis: { y: { tickCount: 5 } } } }} />
```

- **完全原生 spec**：若要自定义 mark、多视图 composition、coordinate/transform —— 组件封装做不到，
  改用 `cloud-charts-g2-spec` 的 `createChart({ container, spec, renderer })`（注意：纯原生路径**不套**库主题）。

| 需求 | 用法 |
|------|------|
| 常规图，数据是系列+元组 | 封装模式（默认） |
| 数据已是 G2 记录，但要库主题/状态 | `config.dataType:'g2'` + `customConfig.encode` |
| 只改轴/图例/提示的 G2 细节 | `config.customConfig` |
| 自定义 mark / composition / 完整 G2 | → `cloud-charts-g2-spec`（`createChart`+spec） |

---

## 6. 安装组件 / Install (cloud-charts CLI)

组件需先装入项目，两种方式（详见 `references/core/install.md`）：

```bash
# 源码复制（shadcn 式，可改可控，import 自动改写为项目别名）
npx @alicloud/cloud-charts-cli@alpha add wbar wline wpie --react

# 或作为 npm 依赖（跟随上游更新）
npx @alicloud/cloud-charts-cli@alpha add wbar --react --as-dep
npm install
```

- 依赖方式：从 `@alicloud/cloud-charts-react` 导入组件、`@alicloud/cloud-charts-core` 导入类型。
- 源码复制方式：从项目别名（默认 `@/components/charts`）导入，需在 tsconfig/vite 配置别名。
- React 支持全部图表 + KPI 部件；Solid 支持全部 23 图表；vanilla 走单图包；Vue 暂未实现。
