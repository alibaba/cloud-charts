---
name: antv-g2-chart
description: Generate G2 v5 chart code. Use when user asks for G2 charts, bar charts, line charts, pie charts, scatter plots, area charts, or any data visualization with G2 library.
---

# G2 v5 Chart Code Generator

You are an expert in AntV G2 v5 charting library. Generate accurate, runnable code following G2 v5 best practices.

---

## 1. Core Constraints / 核心约束 (MUST follow)

1. **`container` is mandatory**: `new Chart({ container: 'container', ... })`
2. **Use Spec Mode ONLY**: `chart.options({ type: 'interval', data, encode: {...} })`（V4 链式 API 见 Forbidden Patterns）
3. **`chart.options()` 只能调用一次**：多次调用会完整覆盖前一次配置，只有最后一次生效。多 mark 叠加必须用 `type: 'view'` + `children` 数组，而不是多次调用 `chart.options()`
4. **`encode` object**: `encode: { x, y }`（禁止 V4 的 `.position('x*y')`）
5. **`transform` must be array**: `transform: [{ type: 'stackY' }]`
6. **`labels` is plural**: Use `labels: [{ text: 'field' }]` not `label: {}`
7. **`coordinate` 规则**：
   - 坐标系类型直接写：`coordinate: { type: 'theta' }`、`coordinate: { type: 'polar' }`
   - transpose 是**变换**不是坐标系类型，必须写在 `transform` 数组里：`coordinate: { transform: [{ type: 'transpose' }] }`
   - ❌ 禁止：`coordinate: { type: 'transpose' }`
8. **范围编码**（甘特图、candlestick 等）：`encode: { y: 'start', y1: 'end' }`，禁止 `y: ['start', 'end']`
9. **样式原则**：用户描述中提到的样式（radius、fillOpacity、color、fontSize 等）必须完整保留；用户未提及的装饰性样式（`shadowBlur`、`shadowColor`、`shadowOffsetX/Y` 等）不要自行添加
10. **`animate` 规则**：用户未明确要求动画时不要添加 `animate` 配置（G2 自带默认动画），只有用户明确描述动画需求时才添加
11. **`scale.color.palette` 只能用合法值**：palette 通过 d3-scale-chromatic 查找，非法名称会抛 `Unknown palette` 错误。**不要推断或创造不存在的名称**（如 `'blueOrange'`、`'redGreen'`、`'hot'`、`'jet'`、`'coolwarm'` 等均非法）。合法的常用值：顺序色阶 `'blues'|'greens'|'reds'|'ylOrRd'|'viridis'|'plasma'|'turbo'`；发散色阶 `'rdBu'|'rdYlGn'|'spectral'`；不确定时用 `range: ['#startColor', '#endColor']` 自定义替代
12. **禁止在用户代码中使用 `d3.*`**：G2 内部使用 d3，但 `d3` 对象不会暴露到用户代码作用域，调用 `d3.sum()` 等会抛 `ReferenceError: d3 is not defined`。如需聚合，优先使用 G2 内置选项（如 `sortX` 的 `reducer: 'sum'`），不得不自定义时用原生 JS：`d3.sum(arr, d=>d.v)` → `arr.reduce((s,d)=>s+d.v,0)`；`d3.max(arr, d=>d.v)` → `Math.max(...arr.map(d=>d.v))`
13. **用户未指定配色时，禁止使用白色或近白色作为图形填充色**：`style: { fill: '#fff' }`、`style: { fill: 'white' }`、`style: { fill: '#ffffff' }` 等在白色背景下会让图形完全不可见。未指定配色时应依赖 G2 的 `encode.color` 自动分配主题色，或使用有明确视觉区分度的颜色（如 `'#5B8FF9'`）。以下是合法例外：label 文字 `fill: '#fff'`（深色背景内标签）、分隔线 `stroke: '#fff'`（堆叠/pack/treemap 的分隔白线）
14. **`padding` 只接受 `number | 'auto'`，禁止数组形式**：`padding: [40, 30, 40, 50]` 在 G2 v5 中无效（会被忽略或报错）。四边统一用 `padding: 40`；分方向控制用 `paddingTop` / `paddingRight` / `paddingBottom` / `paddingLeft` 单独设置；默认 `'auto'` 已自动为坐标轴/图例预留空间，大多数情况无需手动配置。**禁止设置 `padding: 0`**——会关闭自动计算，导致坐标轴/图例被截断；只需调整某一方向时单独设置对应方向即可
15. **`autoFit: true` 时禁止同时设置 `width`**：`autoFit` 会完全忽略 `width`，同时出现时 `width` 无效。`autoFit: true` 时只设 `height`；需要固定宽高时去掉 `autoFit` 改用 `width` + `height`
16. **用户未指定容器时**： `container` 默认为 `'container'`，不要通过 `document.createElement('div')` 进行创建，代码末尾必须有 `chart.render();`
17. **禁止在数据中存放 hex 色值并通过 `encode.color` 映射**：`encode.color` 映射到数据中包含 hex 字符串（如 `'#1e3a5f'`）的字段时，Ordinal scale 会将 hex 字符串当作「类别 key」而非颜色值处理——最终渲染颜色来自 G2 默认调色板而非数据中的 hex 值，且图例会显示无意义的 hex 字符串。正确做法：移除数据中的 color 字段，将 hex 色值放入 `scale.color.range`，`encode.color` 指向有业务含义的字段（如 `'group'`），通过 `scale.color.domain` + `range` 精确配对。**例外情况**：若必须直接使用数据中的动态颜色，需显式配置 `scale: { color: { type: 'identity' } }`。
18. **Label 可见性与防重叠**：柱状图 `position: 'inside'` 的 label **必须**添加 `transform: [{ type: 'contrastReverse' }]`；数据密集图表（折线图多系列、散点图、分组柱状图）label 必须添加 `overlapDodgeY` 或 `overlapHide`；堆叠图/TreeMap/旭日图等空间有限 mark 的 label 必须添加 `overflowHide`；**禁止使用 `dx` 偏移定位 label**，应使用 `position` 控制位置。详见 [标签配置](references/components/g2-comp-label-config.md)
19. **深色背景文本对比度**：容器背景为深色/黑色时**必须**使用 `theme: 'classicDark'`（或 `theme: { type: 'classicDark', view: { viewFill: '色值' } }`），G2 会自动将所有组件文本切换为浅色；浅色背景下**禁止**将文本设为浅灰色（如 `labelFill: '#ccc'`）；饼图 `scale.color.range` 中**禁止**包含与背景相同或近似的颜色。详见 [深色主题适配](references/concepts/g2-concept-dark-theme-adaptation.md)

### 1.1 Forbidden Patterns / 禁止使用的写法

**禁止使用 V4 语法**，必须使用 V5 Spec 模式：


```javascript
// ❌ 禁止：V4 createView
const view = chart.createView();
view.options({...});

// ❌ 禁止：V4 链式 API 调用
chart.interval()
  .data([...])
  .encode('x', 'genre')
  .encode('y', 'sold')
  .style({ radius: 4 });

// ❌ 禁止：V4 链式 encode
chart.line().encode('x', 'date').encode('y', 'value');

// ❌ 禁止：V4 source
chart.source(data);

// ❌ 禁止：V4 position
chart.interval().position('genre*sold');

// ✅ 正确：V5 Spec 模式
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  style: { radius: 4 },
});
```

**原因**：V5 使用 Spec 模式，结构清晰，易于序列化、动态生成和调试。

#### `createView` 的正确 V5 替代方案

`chart.createView()` 在 V4 中用于"多视图共享容器但数据各异"，V5 中对应两种场景：

**场景 A：同一坐标系内叠加多个 mark（最常见）**
→ 用 `type: 'view'` + `children` 数组，`children` 中不能再嵌套 `view` 或者 `children` ：

```javascript
// ✅ 多 mark 叠加（折线 + 散点）
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line',  encode: { x: 'date', y: 'value' } },
    { type: 'point', encode: { x: 'date', y: 'value' } },
  ],
});
```

**场景 B：多个独立坐标系并排/叠加（如人口金字塔、butterfly 图）**
→ 用 `type: 'spaceLayer'` + `children`（各子 view 有独立数据和坐标系）：

```javascript
// ✅ 人口金字塔：左右两侧独立视图叠加，共享 Y 轴
chart.options({
  type: 'spaceLayer',
  children: [
    {
      type: 'interval',
      data: leftData,                              // 左侧数据（负值或翻转）
      coordinate: { transform: [{ type: 'transpose' }, { type: 'reflectX' }] },
      encode: { x: 'age', y: 'male' },
      axis: { y: { position: 'right' } },
    },
    {
      type: 'interval',
      data: rightData,                             // 右侧数据
      coordinate: { transform: [{ type: 'transpose' }] },
      encode: { x: 'age', y: 'female' },
      axis: { y: false },
    },
  ],
});

// ✅ 更简单方案：单一视图 + 负值技巧（数据可在一个数组里）
chart.options({
  type: 'interval',
  data: combinedData,                              // 合并数据，用负值区分方向
  coordinate: { transform: [{ type: 'transpose' }] },
  encode: {
    x: 'age',
    y: (d) => d.sex === 'male' ? -d.population : d.population,
    color: 'sex',
  },
  axis: {
    y: { labelFormatter: (d) => Math.abs(d) },     // 显示绝对值
  },
});
```

**选择原则**：
- 两侧数据结构相同、只是方向相反 → **优先用负值技巧**（单 `interval`，代码最简洁）
- 两侧需要完全独立的坐标系/比例尺 → 用 `spaceLayer`

### 1.2 禁止使用的幻觉 Mark 类型 / Hallucinated Mark Types

以下类型来自其他图表库（如 ECharts、Vega），**G2 中不存在**，使用将导致运行时报错：

| ❌ 错误写法 | ✅ 正确替换 |
|------------|-----------|
| `type: 'ruleX'` | `type: 'lineX'`（垂直参考线） |
| `type: 'ruleY'` | `type: 'lineY'`（水平参考线） |
| `type: 'regionX'` | `type: 'rangeX'`（X 轴区间高亮） |
| `type: 'regionY'` | `type: 'rangeY'`（Y 轴区间高亮） |
| `type: 'venn'` | `type: 'path'` + `data.transform: [{ type: 'venn' }]` |

**G2 合法 mark 类型完整列表**（不得凭空创造其他 type）：
- 基础：`interval`、`line`、`area`、`point`、`rect`、`cell`、`text`、`image`、`path`、`polygon`、`shape`
- 连接：`link`、`connector`、`vector`
- 参考线/区域：`lineX`、`lineY`、`rangeX`、`rangeY`；`range`（极少用，仅在 x/y 均需限定二维矩形时使用，且数据的 x/y 字段必须是 `[start,end]` 数组）
- 统计：`box`、`boxplot`、`density`、`heatmap`、`beeswarm`
- 层次/关系：`treemap`、`pack`、`partition`、`tree`、`sankey`、`chord`
- 特殊：`wordCloud`、`gauge`、`liquid`
- 需引入扩展包：`sunburst`（需 `@antv/g2-extension-plot`，见 [旭日图](references/marks/g2-mark-sunburst.md)）
---

## 2. Common Mistakes / 常见错误

### ⚠️ 最高频错误：禁止多次调用 `chart.options()`

`chart.options()` 是**全量替换**，不是合并。多次调用时**只有最后一次生效**，前面的配置全部丢失。**每个图表只能调用一次 `chart.options()`。**

```javascript
// ❌ Wrong: 多次调用 chart.options() —— 每次完整替换前一次，只有最后一次生效
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });  // ❌ 被覆盖，不渲染
chart.options({ type: 'line',     data, encode: { x: 'x', y: 'y' } });  // ❌ 被覆盖，不渲染
chart.options({ type: 'text',     data, encode: { x: 'x', y: 'y', text: 'label' } });  // 只有这个生效

// ✅ Correct: 多 mark 叠加必须用 type: 'view' + children，一次 chart.options() 搞定
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'line',     encode: { x: 'x', y: 'y' } },
    { type: 'text',     encode: { x: 'x', y: 'y', text: 'label' } },
  ],
});

// ✅ 子 mark 需要不同数据时，在 children 里单独指定 data
chart.options({
  type: 'view',
  data: mainData,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'text', data: labelData, encode: { x: 'x', text: 'label' } },
  ],
});
```

多 mark 组合规则：
- 只能使用 `children`，禁止 `marks`、`layers` 等属性
- `children` 不能嵌套（`children` 内不能再有 `type: 'view'` + `children`）
- 复杂多坐标系组合用 `spaceLayer`/`spaceFlex`

```javascript
// ❌ Wrong: 使用 marks/layers（禁止）
chart.options({ type: 'view', data, marks: [...] });   // ❌
chart.options({ type: 'view', data, Layers: [...] });  // ❌

// ❌ Wrong: children 嵌套（禁止）
chart.options({ type: 'view', children: [{ type: 'view', children: [...] }] });  // ❌

// ✅ Correct: 复杂多坐标系组合用 spaceLayer
chart.options({
  type: 'spaceLayer',
  children: [
    { type: 'view', children: [...] },
    { type: 'line', encode: { x: 'x', y: 'y' } },
  ],
});
```

### 其他常见错误

```javascript
// ❌ Wrong: padding 数组形式（CSS 简写），G2 v5 不支持，会被忽略
const chart = new Chart({ container: 'container', padding: [40, 30, 40, 50] });  // ❌

// ✅ Correct: 四边统一
const chart = new Chart({ container: 'container', padding: 40 });

// ✅ Correct: 分方向控制
const chart = new Chart({ container: 'container', paddingTop: 40, paddingLeft: 60 });

// ❌ Wrong: missing container
const chart = new Chart({ width: 640, height: 480 });

// ✅ Correct: container required
const chart = new Chart({ container: 'container', width: 640, height: 480 });

// ❌ Wrong: transform as object
chart.options({ transform: { type: 'stackY' } });

// ✅ Correct: transform as array
chart.options({ transform: [{ type: 'stackY' }] });

// ❌ Wrong: label (singular)
chart.options({ label: { text: 'value' } });

// ✅ Correct: labels (plural)
chart.options({ labels: [{ text: 'value' }] });

// ❌ Wrong: labels formatter 把第一个参数当 datum 对象
// formatter 的第一个参数是 text 已映射的值（如 85），不是 datum
// d.value 在数字 85 上为 undefined，结果为 "undefined%"
chart.options({
  labels: [{ text: 'value', formatter: (d) => d.value + '%' }],
});

// ✅ Correct: 用 text 函数直接访问 datum 并格式化（推荐）
chart.options({
  labels: [{ text: (d) => d.value + '%' }],
});

// ✅ Correct: 或用 formatter 的正确用法（val 是已映射的数值）
chart.options({
  labels: [{ text: 'value', formatter: (val) => val + '%' }],
});

// ❌ Wrong: hex 色值放在数据中，被 Ordinal scale 当作类别 key
// 渲染颜色是 G2 默认调色板，图例显示无意义的 '#1e3a5f' 等字符串
const barData = [
  { group: '法律界', value: 85, color: '#1e3a5f' },
  { group: '公司治理专家', value: 78, color: '#2d4a6f' },
];
chart.options({
  type: 'interval',
  data: barData,
  encode: { x: 'group', y: 'value', color: 'color' },
  scale: { color: { type: 'ordinal' } },
});

// ✅ Correct: hex 色值放入 scale.color.range，encode.color 指向业务字段
chart.options({
  type: 'interval',
  data: [
    { group: '法律界', value: 85 },
    { group: '公司治理专家', value: 78 },
  ],
  encode: { x: 'group', y: 'value', color: 'group' },
  scale: {
    color: {
      type: 'ordinal',
      domain: ['法律界', '公司治理专家'],
      range: ['#1e3a5f', '#2d4a6f'],
    },
  },
});

// ✅ Correct (Dynamic Colors): 若必须直接使用数据中的 hex 颜色，需显式指定 identity 比例尺
chart.options({
  type: 'interval',
  data: [
    { group: '法律界', value: 85, color: '#1e3a5f' },
    { group: '公司治理专家', value: 78, color: '#2d4a6f' },
  ],
  encode: { x: 'group', y: 'value', color: 'color' },
  scale: {
    color: { type: 'identity' },
  },
});

// ❌ Wrong: area 图上使用 stroke + lineWidth 会包裹整个填充区域
// 底部和两侧也会被描边，正确做法是 view + children 叠加 area + line
chart.options({
  type: 'area',
  data,
  encode: { x: 'date', y: 'value' },
  style: { fill: '#FF5924', fillOpacity: 0.4, stroke: '#FF5924', lineWidth: 2 },
});

// ✅ Correct: view + area(填充) + line(顶部边缘线)
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'area', encode: { x: 'date', y: 'value' }, style: { fill: '#FF5924', fillOpacity: 0.4 } },
    { type: 'line', encode: { x: 'date', y: 'value' }, style: { stroke: '#FF5924', lineWidth: 2 } },
  ],
});

// ❌ Wrong: unnecessary scale type specification
chart.options({ scale: { x: { type: 'linear' }, y: { type: 'linear' } } });

// ✅ Correct: let G2 infer scale type automatically
chart.options({ scale: { y: { domain: [0, 100] } } });
```

<!-- CONSTRAINTS:END -->

---

## 3. Basic Structure / 基础结构

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',           // Mark type
  data: [...],                // Data array
  encode: { x: 'field', y: 'field', color: 'field' },
  transform: [],              // Data transforms
  scale: {},                  // Scale config
  coordinate: {},             // Coordinate system
  style: {},                  // Style config
  labels: [],                 // Data labels
  tooltip: {},                // Tooltip config
  axis: {},                   // Axis config
  legend: {},                 // Legend config
});

chart.render();
```

---

## 4. Core / 核心概念

核心概念是 G2 的基础，理解这些概念是正确使用 G2 的前提。

### 4.1 Chart 初始化

Chart 是 G2 的核心类，所有图表都从 Chart 实例开始。

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',  // 必填：DOM 容器 ID 或元素
  width: 640,              // 可选：宽度
  height: 480,             // 可选：高度
  autoFit: true,           // 可选：自适应容器大小
  padding: 'auto',         // 可选：内边距
  theme: 'light',          // 可选：主题
});
```

> **详细文档**: [Chart 初始化](references/core/g2-core-chart-init.md)

### 4.2 encode 通道系统

encode 将数据字段映射到视觉通道，是 G2 的核心概念。

| 通道 | 用途 | 示例 |
|------|------|------|
| `x` | X 轴位置 | `encode: { x: 'month' }` |
| `y` | Y 轴位置 | `encode: { y: 'value' }` |
| `color` | 颜色 | `encode: { color: 'category' }` |
| `size` | 大小 | `encode: { size: 'population' }` |
| `shape` | 形状 | `encode: { shape: 'type' }` |

> **详细文档**: [encode 通道系统](references/core/g2-core-encode-channel.md)

### 4.3 视图组合 (view + children)

使用 `view` 类型配合 `children` 数组组合多个 mark。

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'date', y: 'value' } },
    { type: 'point', encode: { x: 'date', y: 'value' } },
  ],
});
```

> **详细文档**: [视图组合](references/core/g2-core-view-composition.md)

---

## 5. Concepts / 概念指南

概念指南帮助选择正确的图表类型和配置方案。

### 5.1 图表类型选择 / Chart Selection

根据数据特征和可视化目标选择合适的图表类型：

| 数据关系 | 推荐图表 | Mark |
|---------|---------|------|
| 比较 | 柱状图、条形图 | `interval` |
| 趋势 | 折线图、面积图 | `line`、`area` |
| 占比 | 饼图、环形图 | `interval` + `theta` |
| 分布 | 直方图、箱线图 | `rect`、`boxplot` |
| 相关 | 散点图、气泡图 | `point` |
| 层级 | 矩形树图、分区图、旭日图 | `treemap`、`partition`、`sunburst`（需扩展包） |

> **详细文档**: [图表类型选择指南](references/concepts/g2-concept-chart-selection.md)

### 5.2 视觉通道 / Visual Channels

视觉通道是数据到视觉属性的映射方式：

| 通道类型 | 适合数据 | 感知精度 |
|---------|---------|---------|
| 位置 | 连续/离散 | 最高 |
| 长度 | 连续 | 高 |
| 颜色（色相） | 离散 | 中 |
| 颜色（亮度） | 连续 | 中 |
| 大小 | 连续 | 中低 |
| 形状 | 离散 | 低 |

> **详细文档**: [视觉通道](references/concepts/g2-concept-visual-channels.md)

### 5.3 配色理论 / Color Theory

选择合适的配色方案提升图表可读性：

| 场景 | 推荐方案 | 示例 |
|------|---------|------|
| 分类数据 | 离散色板 | `category10`、`category20` |
| 连续数据 | 顺序色板 | `Blues`、`RdYlBu` |
| 正负对比 | 发散色板 | `RdYlGn` |

> **详细文档**: [配色理论](references/concepts/g2-concept-color-theory.md)

---

## 6. Marks / 图表类型

Marks 是 G2 的核心可视化元素，决定了数据的视觉表现形式。每种 Mark 适合特定的数据类型和可视化场景。

### 6.1 柱状图系列 / Interval

柱状图用于比较分类数据的大小，是最常用的图表类型。基础柱状图使用 `interval` mark，堆叠柱状图需要添加 `stackY` transform，分组柱状图使用 `dodgeX` transform。

| 类型 | Mark | 关键配置 |
|------|------|----------|
| 基础柱状图 | `interval` | - |
| 堆叠柱状图 | `interval` | `transform: [{ type: 'stackY' }]` |
| 分组柱状图 | `interval` | `transform: [{ type: 'dodgeX' }]` |
| 百分比柱状图 | `interval` | `transform: [{ type: 'normalizeY' }]` |
| 水平柱状图 | `interval` | `coordinate: { transform: [{ type: 'transpose' }] }` |

> **详细文档**: [基础柱状图](references/marks/g2-mark-interval-basic.md) | [堆叠柱状图](references/marks/g2-mark-interval-stacked.md) | [分组柱状图](references/marks/g2-mark-interval-grouped.md) | [百分比柱状图](references/marks/g2-mark-interval-normalized.md)

### 6.2 折线图系列 / Line

折线图用于展示数据随时间或有序类别的变化趋势。支持单线、多线对比，以及不同插值方式。

| 类型 | Mark | 关键配置 |
|------|------|----------|
| 基础折线图 | `line` | - |
| 多系列折线 | `line` | `encode: { color: 'category' }` |
| 平滑曲线 | `line` | `encode: { shape: 'smooth' }` |
| 阶梯线 | `line` | `encode: { shape: 'step' }` |

> **详细文档**: [基础折线图](references/marks/g2-mark-line-basic.md) | [多系列折线](references/marks/g2-mark-line-multi.md) | [LineX/LineY](references/marks/g2-mark-linex-liney.md)

### 6.3 面积图系列 / Area

面积图在折线图基础上填充区域，强调数量随时间的变化程度。堆叠面积图用于展示各部分对整体的贡献。

| 类型 | Mark | 关键配置 |
|------|------|----------|
| 基础面积图 | `area` | - |
| 堆叠面积图 | `area` | `transform: [{ type: 'stackY' }]` |

> **详细文档**: [基础面积图](references/marks/g2-mark-area-basic.md) | [堆叠面积图](references/marks/g2-mark-area-stacked.md)

### 6.4 饼图/环形图 / Arc (Pie/Donut)

饼图用于展示各部分占整体的比例关系。使用 `theta` 坐标系配合 `interval` mark 实现。

| 类型 | Mark | 关键配置 |
|------|------|----------|
| 饼图 | `interval` | `coordinate: { type: 'theta' }` + `stackY` |
| 环形图 | `interval` | `coordinate: { type: 'theta', innerRadius: 0.6 }` |

> **详细文档**: [饼图](references/marks/g2-mark-arc-pie.md) | [环形图](references/marks/g2-mark-arc-donut.md)

### 6.5 散点图/气泡图 / Point

散点图用于展示两个数值变量的关系，气泡图通过点的大小展示第三个维度。

| 类型 | Mark | 关键配置 |
|------|------|----------|
| 散点图 | `point` | `encode: { x, y }` |
| 气泡图 | `point` | `encode: { x, y, size }` |

> **详细文档**: [散点图](references/marks/g2-mark-point-scatter.md) | [气泡图](references/marks/g2-mark-point-bubble.md)

### 6.6 直方图 / Histogram

直方图用于展示连续数值数据的分布情况，使用 `rect` 标记配合 `binX` 转换实现。与柱状图不同，直方图的柱子之间无间隔，表示数据连续。

| 类型 | Mark | 关键配置 |
|------|------|----------|
| 基础直方图 | `rect` | `transform: [{ type: 'binX', y: 'count' }]` |
| 多分布对比 | `rect` | `groupBy` 分组 |

> **详细文档**: [直方图](references/marks/g2-mark-histogram.md)

### 6.7 玫瑰图/玉珏图 / Polar Charts

极坐标系下的图表，通过半径或弧长表示数值大小，视觉上更加美观。

| 类型 | Mark | 关键配置 |
|------|------|----------|
| 玫瑰图 | `interval` | `coordinate: { type: 'polar' }` |
| 玉珏图 | `interval` | `coordinate: { type: 'radial' }` |

> **详细文档**: [玫瑰图](references/marks/g2-mark-rose.md) | [玉珏图](references/marks/g2-mark-radial-bar.md)

### 6.8 统计分布图 / Distribution

展示数据分布特征的图表，适用于统计分析和探索性数据分析。

| 类型 | Mark | 用途 |
|------|------|------|
| 箱线图 | `boxplot` | 数据分布统计 |
| 箱型图(Box) | `box` | 手动指定五数概括的箱线图 |
| 密度图 | `density` | 核密度估计曲线 |
| 小提琴图 | `density` + `boxplot` | 密度分布 + 统计信息 |
| 分布曲线图 | `line` + `smooth` | 频率密度分布曲线 |
| 多边形 | `polygon` | 自定义多边形区域 |
| 等高线图 | `cell` + sequential色阶 | 二维连续数据分布（模拟等高线） |

> **详细文档**: [箱线图](references/marks/g2-mark-boxplot.md) | [箱型图(Box)](references/marks/g2-mark-box-boxplot.md) | [密度图](references/marks/g2-mark-density.md) | [小提琴图](references/marks/g2-mark-violin.md) | [分布曲线图](references/marks/g2-mark-distribution-curve.md) | [等高线图](references/marks/g2-mark-contourline.md) | [多边形](references/marks/g2-mark-polygon.md)

### 6.9 关系图 / Relation

展示数据之间关系的图表，适用于网络分析和集合关系展示。

| 类型 | Mark | 用途 |
|------|------|------|
| 桑基图 | `sankey` | 流向/转移关系 |
| 和弦图 | `chord` | 矩阵流向关系 |
| 韦恩图 | `path` + venn数据变换 | 集合交集关系（venn 是 data transform，不是 mark type） |
| 弧长连接图 | `line` + `point` | 节点链接关系 |

> **详细文档**: [桑基图](references/marks/g2-mark-sankey.md) | [和弦图](references/marks/g2-mark-chord.md) | [韦恩图](references/marks/g2-mark-venn.md) | [弧长连接图](references/marks/g2-mark-arc-diagram.md)

### 6.10 项目管理图 / Project

适用于项目管理和进度跟踪的图表。

| 类型 | Mark | 用途 |
|------|------|------|
| 甘特图 | `interval` | 任务时间安排 |
| 子弹图 | `interval` + `point` | KPI 指标展示 |

> **详细文档**: [甘特图](references/marks/g2-mark-gantt.md) | [子弹图](references/marks/g2-mark-bullet.md)

### 6.11 金融图表 / Finance

适用于金融数据分析的专业图表。

| 类型 | Mark | 用途 |
|------|------|------|
| K线图 | `link` + `interval` | 股票四价数据 |

> **详细文档**: [K线图](references/marks/g2-mark-k-chart.md)

### 6.12 多维数据图 / Multivariate

展示多维数据关系的图表。

| 类型 | Mark | 用途 |
|------|------|------|
| 平行坐标系 | `line` | 多维数据关系分析 |
| 雷达图 | `line` | 多维数据对比 |

> **详细文档**: [平行坐标系](references/marks/g2-mark-parallel.md) | [雷达图](references/marks/g2-mark-radar.md)

### 6.13 对比图 / Comparison

适用于数据对比的图表。

| 类型 | Mark | 用途 |
|------|------|------|
| 双向柱状图 | `interval` | 正负数据对比 |
| 漏斗图 | `interval` + `shape:'funnel'` | 业务转化率展示 |
| 马赛克图 | `interval`/`cell` + transform | 二维分类分布 |

> **详细文档**: [双向柱状图](references/marks/g2-mark-bi-directional-bar.md) | [漏斗图](references/marks/g2-mark-funnel.md) | [马赛克图](references/marks/g2-mark-mosaic.md)

### 6.14 基础标记 / Basic Marks

基础标记是 G2 的底层构建块，可独立使用或组合构建复杂图表。

| 类型 | Mark | 用途 |
|------|------|------|
| 矩形 | `rect` | 矩形区域，直方图/热力图基础 |
| 文本 | `text` | 文本标注和标签 |
| 图片 | `image` | 图片标记，数据点用图片表示 |
| 路径 | `path` | 自定义路径绘制 |
| 链接 | `link` | 两点之间的连线 |
| 连接器 | `connector` | 数据点之间的连接线 |
| 形状 | `shape` | 自定义形状绘制 |
| 向量 | `vector` | 向量/箭头标记，风场图等 |

> **详细文档**: [rect](references/marks/g2-mark-rect.md) | [text](references/marks/g2-mark-text.md) | [image](references/marks/g2-mark-image.md) | [path](references/marks/g2-mark-path.md) | [link](references/marks/g2-mark-link.md) | [connector](references/marks/g2-mark-connector.md) | [shape](references/marks/g2-mark-shape.md) | [vector](references/marks/g2-mark-vector.md)

### 6.15 范围标记 / Range

范围标记用于展示数据的区间范围。

| 类型 | Mark | 用途 |
|------|------|------|
| 时间段/区间高亮（X 方向） | `rangeX` | X 轴区间，`encode: { x: 'start', x1: 'end' }` |
| 数值范围高亮（Y 方向） | `rangeY` | Y 轴区间，`encode: { y: 'min', y1: 'max' }` |
| 二维矩形区域 | `range` | x/y 字段为 `[start,end]` 数组，`encode: { x:'x', y:'y' }`，极少使用 |

> **详细文档**: [range/rangeY](references/marks/g2-mark-range-rangey.md) | [rangeX](references/marks/g2-mark-rangex.md)

### 6.16 分布与打包图 / Distribution & Pack

| 类型 | Mark | 用途 |
|------|------|------|
| 蜂群图 | `point` + `pack` | 数据点紧密排列展示分布 |
| 打包图 | `pack` | 层级数据的圆形打包 |

> **详细文档**: [蜂群图](references/marks/g2-mark-beeswarm.md) | [打包图](references/marks/g2-mark-pack.md)

### 6.17 层次结构图 / Hierarchy

展示层级数据的图表，通过面积或半径表示数值占比。

| 类型 | Mark | 用途 |
|------|------|------|
| 矩形树图 | `treemap` | 层级数据占比 |
| 旭日图 | `sunburst`⚠️ | 多层级同心圆展示（需引入 @antv/g2-extension-plot） |
| 分区图 | `partition` | 层级数据分区展示 |
| 树图 | `tree` | 树形层级结构 |

> **详细文档**: [矩形树图](references/marks/g2-mark-treemap.md) | [旭日图](references/marks/g2-mark-sunburst.md) | [分区图](references/marks/g2-mark-partition.md) | [树图](references/marks/g2-mark-tree.md)

### 6.18 其他图表 / Others

| 类型 | Mark | 用途 |
|------|------|------|
| 热力图 | `cell` | 二维矩阵数据可视化 |
| 密度热力图 | `heatmap` | 连续密度热力图 |
| 仪表盘 | `gauge` | 指标进度展示 |
| 词云 | `wordCloud` | 文本频率可视化 |
| 水波图 | `liquid` | 百分比进度 |
| 螺旋图 | `line`/`interval` + helix坐标系 | 大量时间序列的周期性规律 |

> **详细文档**: [热力图](references/marks/g2-mark-cell-heatmap.md) | [密度热力图](references/marks/g2-mark-heatmap.md) | [仪表盘](references/marks/g2-mark-gauge.md) | [词云](references/marks/g2-mark-wordcloud.md) | [水波图](references/marks/g2-mark-liquid.md) | [螺旋图](references/marks/g2-mark-spiral.md)

---

## 7. Data / 数据变换

数据变换在数据加载阶段执行，配置在 `data.transform` 中，影响所有使用该数据的标记。

### 7.1 Data Transform 类型（配置在 `data.transform`）

| 变换 | 类型 | 用途 | 示例场景 |
|------|------|------|---------|
| **fold** | `fold` | 宽表转长表 | 多列数据转多系列 |
| **filter** | `filter` | 条件过滤数据 | 过滤无效数据 |
| **sort** | `sort` | 使用回调函数排序 | 自定义排序逻辑 |
| **sortBy** | `sortBy` | 按字段排序 | 按字段值排序 |
| **map** | `map` | 数据映射转换 | 添加计算字段 |
| **join** | `join` | 合并数据表 | 关联外部数据 |
| **pick** | `pick` | 选择指定字段 | 精简字段 |
| **rename** | `rename` | 重命名字段 | 字段重命名 |
| **slice** | `slice` | 截取数据范围 | 分页/截取 |
| **ema** | `ema` | 指数移动平均 | 时间序列平滑 |
| **kde** | `kde` | 核密度估计 | 密度图/小提琴图 |
| **log** | `log` | 打印数据到控制台 | 调试 |
| **custom** | `custom` | 自定义数据处理 | 复杂转换 |

### 7.2 数据格式与模式

| 类型 | 用途 |
|------|------|
| 表格数据格式 | G2 接受的标准表格数据格式说明 |
| 数据变换模式 | Data Transform 和 Mark Transform 的组合使用模式 |

> **详细文档**: [filter](references/data/g2-data-filter.md) | [sort](references/data/g2-data-sort.md) | [sortBy](references/data/g2-data-sortby.md) | [fold](references/data/g2-data-fold.md) | [slice](references/data/g2-data-slice.md) | [ema](references/data/g2-data-ema.md) | [kde](references/data/g2-data-kde.md) | [log](references/data/g2-data-log.md) | [fetch](references/data/g2-data-fetch.md) | [数据变换模式](references/data/g2-data-transform-patterns.md)

### 7.3 常见错误：Data Transform 放错位置

```javascript
// ❌ 错误：fold 是数据变换，不能放在 mark transform
chart.options({
  type: 'interval',
  data: wideData,
  transform: [{ type: 'fold', fields: ['a', 'b'] }],  // ❌ 错误！
});

// ✅ 正确：fold 放在 data.transform
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['a', 'b'] }],  // ✅ 正确
  },
  transform: [{ type: 'stackY' }],  // mark transform
});
```

### 7.4 组合示例：宽表数据 + 堆叠图

```javascript
// 宽表数据：每个月有多个类型的数据列
const wideData = [
  { year: '2000', '类型 A': 21, '类型 B': 16, '类型 C': 8 },
  { year: '2001', '类型 A': 25, '类型 B': 16, '类型 C': 8 },
  // ...
];

chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      // ✅ Data Transform：宽表转长表
      { type: 'fold', fields: ['类型 A', '类型 B', '类型 C'], key: 'type', value: 'value' },
    ],
  },
  encode: { x: 'year', y: 'value', color: 'type' },
  transform: [
    // ✅ Mark Transform：堆叠
    { type: 'stackY' },
  ],
  coordinate: { type: 'polar' },  // 极坐标系
});
```

---

## 8. Transforms / 标记变换

标记变换在绑定视觉通道时执行，配置在 mark 的 `transform` 数组中，用于数据聚合、防重叠等。

**配置位置**：`transform` 数组，与 `data`、`encode` 同级，**不是**在 `data.transform` 中。

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [  // ✅ Mark Transform：与 data/encode 同级
    { type: 'stackY' },
    { type: 'sortX', by: 'y' },
  ],
});
```

### 8.1 防重叠变换 / Anti-overlap

| 变换 | 类型 | 用途 |
|------|------|------|
| 堆叠 | `stackY` | 数据堆叠，用于堆叠图 |
| 分组 | `dodgeX` | 数据分组，用于分组图 |
| 抖动 | `jitter` | 散点抖动避免重叠 |
| X轴抖动 | `jitterX` | X 方向抖动 |
| Y轴抖动 | `jitterY` | Y 方向抖动 |
| 打包 | `pack` | 紧密排列数据点 |

> **详细文档**: [stackY](references/transforms/g2-transform-stacky.md) | [dodgeX](references/transforms/g2-transform-dodgex.md) | [jitter](references/transforms/g2-transform-jitter.md) | [jitterX](references/transforms/g2-transform-jitterx.md) | [jitterY](references/transforms/g2-transform-jittery.md) | [pack](references/transforms/g2-transform-pack.md)

### 8.2 聚合变换 / Aggregation

| 变换 | 类型 | 用途 |
|------|------|------|
| 通用分组 | `group` | 通用分组聚合 |
| 分组聚合 | `groupX` / `groupY` | 按维度分组并聚合 |
| 分组颜色 | `groupColor` | 按颜色分组聚合 |
| 分箱 | `bin` | 二维分箱 |
| X轴分箱 | `binX` | X 轴方向分箱 |
| 采样 | `sample` | 数据采样 |

> **详细文档**: [group](references/transforms/g2-transform-group.md) | [groupX](references/transforms/g2-transform-groupx.md) | [groupY](references/transforms/g2-transform-groupy.md) | [groupColor](references/transforms/g2-transform-groupcolor.md) | [bin](references/transforms/g2-transform-bin.md) | [binX](references/transforms/g2-transform-binx.md) | [sample](references/transforms/g2-transform-sample.md)

### 8.3 排序变换 / Sorting

| 变换 | 类型 | 用途 |
|------|------|------|
| X轴排序 | `sortX` | 按 X 通道排序 |
| Y轴排序 | `sortY` | 按 Y 通道排序 |
| 颜色排序 | `sortColor` | 按颜色通道排序 |

> **详细文档**: [sortX](references/transforms/g2-transform-sortx.md) | [sortY](references/transforms/g2-transform-sorty.md) | [sortColor](references/transforms/g2-transform-sort-color.md)

### 8.4 选取变换 / Selection

| 变换 | 类型 | 用途 |
|------|------|------|
| 选取 | `select` | 全局选取数据 |
| X轴选取 | `selectX` | 按 X 分组选取 |
| Y轴选取 | `selectY` | 按 Y 分组选取 |

> **详细文档**: [select](references/transforms/g2-transform-select.md) | [selectX](references/transforms/g2-transform-selectx.md) | [selectY](references/transforms/g2-transform-selecty.md)

### 8.5 其他变换 / Others

| 变换 | 类型 | 用途 |
|------|------|------|
| 归一化 | `normalizeY` | Y 轴归一化 |
| 差值 | `diffY` | 计算差值 |
| 对称 | `symmetryY` | Y 轴对称 |
| 弹性X | `flexX` | X 轴弹性布局 |
| 堆叠入场 | `stackEnter` | 入场动画堆叠 |

> **详细文档**: [normalizeY](references/transforms/g2-transform-normalizey.md) | [diffY](references/transforms/g2-transform-diffy.md) | [symmetryY](references/transforms/g2-transform-symmetryy.md) | [flexX](references/transforms/g2-transform-flexx.md) | [stackEnter](references/transforms/g2-transform-stack-enter.md)

---

## 9. Interactions / 交互

G2 提供丰富的内置交互，用于数据探索和图表操作。

### 9.1 选择类交互 / Selection

| 交互 | 类型 | 用途 |
|------|------|------|
| 元素选择 | `elementSelect` | 点击选择数据元素 |
| 按条件选择 | `elementSelectBy` | 按条件批量选择元素 |
| 框选 | `brush` / `brushX` / `brushY` | 矩形区域选择 |
| 二维框选 | `brushXY` | XY 同时框选 |
| 轴框选 | `brushAxis` | 坐标轴范围选择 |
| 图例过滤 | `legendFilter` | 点击图例筛选数据 |

> **详细文档**: [elementSelect](references/interactions/g2-interaction-element-select.md) | [elementSelectBy](references/interactions/g2-interaction-element-select-by.md) | [brush](references/interactions/g2-interaction-brush.md) | [brushXY](references/interactions/g2-interaction-brush-xy.md) | [brushAxis](references/interactions/g2-interaction-brush-axis.md) | [legendFilter](references/interactions/g2-interaction-legend-filter.md)

### 9.2 高亮类交互 / Highlight

| 交互 | 类型 | 用途 |
|------|------|------|
| 元素高亮 | `elementHighlight` | 悬停高亮元素 |
| 按条件高亮 | `elementHighlightBy` | 按条件批量高亮元素 |
| 悬停缩放 | `elementHoverScale` | 悬停时元素放大 |
| 图例高亮 | `legendHighlight` | 悬停图例高亮对应元素 |
| 框选高亮 | `brushXHighlight` / `brushYHighlight` | 框选区域高亮 |

> **详细文档**: [elementHighlight](references/interactions/g2-interaction-element-highlight.md) | [elementHighlightBy](references/interactions/g2-interaction-element-highlight-by.md) | [elementHoverScale](references/interactions/g2-interaction-element-hover-scale.md) | [legendHighlight](references/interactions/g2-interaction-legend-highlight.md) | [brushXHighlight](references/interactions/g2-interaction-brushx-highlight.md) | [brushYHighlight](references/interactions/g2-interaction-brushy-highlight.md) | [单轴框选高亮](references/interactions/g2-interaction-brush-x-y-highlight.md)

### 9.3 过滤类交互 / Filter

| 交互 | 类型 | 用途 |
|------|------|------|
| 滑动条过滤 | `sliderFilter` | 滑动条筛选数据范围 |
| 滚动条过滤 | `scrollbarFilter` | 滚动条筛选数据 |
| 框选过滤 | `brushFilter` | 框选区域过滤数据 |
| X轴框选过滤 | `brushXFilter` | X 轴方向框选过滤 |
| Y轴框选过滤 | `brushYFilter` | Y 轴方向框选过滤 |
| 自适应过滤 | `adaptiveFilter` | 自适应数据过滤 |

> **详细文档**: [sliderFilter](references/interactions/g2-interaction-slider-filter.md) | [scrollbarFilter](references/interactions/g2-interaction-scrollbar-filter.md) | [brushFilter](references/interactions/g2-interaction-brush-filter.md) | [brushXFilter](references/interactions/g2-interaction-brushx-filter.md) | [brushYFilter](references/interactions/g2-interaction-brushy-filter.md) | [adaptiveFilter](references/interactions/g2-interaction-adaptive-filter.md)

### 9.4 其他交互 / Others

| 交互 | 类型 | 用途 |
|------|------|------|
| 提示信息 | `tooltip` | 悬停显示数据详情 |
| 气泡提示 | `poptip` | 简洁气泡提示 |
| 下钻 | `drilldown` | 层级数据下钻 |
| 矩形树图下钻 | `treemapDrilldown` | 矩形树图层级下钻 |
| 缩放 | `fisheye` | 鱼眼放大镜效果 |
| 滚轮滑动 | `sliderWheel` | 鼠标滚轮控制滑动条 |
| 拖拽移动 | `elementPointMove` | 拖拽数据点移动 |
| 图表索引 | `chartIndex` | 多图表联动索引线 |

> **详细文档**: [tooltip](references/interactions/g2-interaction-tooltip.md) | [poptip](references/interactions/g2-interaction-poptip.md) | [drilldown](references/interactions/g2-interaction-drilldown.md) | [treemapDrilldown](references/interactions/g2-interaction-treemap-drilldown.md) | [fisheye](references/interactions/g2-interaction-fisheye.md) | [sliderWheel](references/interactions/g2-interaction-slider-wheel.md) | [elementPointMove](references/interactions/g2-interaction-element-point-move.md) | [chartIndex](references/interactions/g2-interaction-chart-index.md)

---

## 10. Components / 组件

组件是图表的辅助元素，如坐标轴、图例、提示信息等。

### 10.1 坐标轴 / Axis

坐标轴展示数据维度，支持丰富的样式配置。

> **详细文档**: [坐标轴配置](references/components/g2-comp-axis-config.md) | [雷达图坐标轴](references/components/g2-comp-axis-radar.md)

### 10.2 图例 / Legend

图例展示数据分类或连续数值映射，支持分类图例和连续图例（色带）。

| 类型 | 用途 |
|------|------|
| 分类图例 | 离散分类数据的颜色映射说明 |
| 连续图例 | 连续数值的颜色/大小映射说明（色带） |

> **详细文档**: [图例配置](references/components/g2-comp-legend-config.md) | [分类图例](references/components/g2-comp-legend-category.md) | [连续图例](references/components/g2-comp-legend-continuous.md)

### 10.3 提示信息 / Tooltip

Tooltip 在悬停时显示数据详情，支持自定义模板和格式化。

> **详细文档**: [Tooltip 配置](references/components/g2-comp-tooltip-config.md)

### 10.4 其他组件 / Others

| 组件 | 用途 |
|------|------|
| 标题 | 图表标题 |
| 标签 | 数据标签 |
| 滚动条 | 数据滚动浏览 |
| 滑动条 | 数据范围选择 |
| 标注 | 数据标注和辅助线 |

> **详细文档**: [标题](references/components/g2-comp-title.md) | [标签](references/components/g2-comp-label-config.md) | [滚动条](references/components/g2-comp-scrollbar.md) | [滑动条](references/components/g2-comp-slider.md) | [标注](references/components/g2-comp-annotation.md)

---

## 11. Scales / 比例尺

比例尺将数据值映射到视觉通道，如位置、颜色、大小等。

### 11.1 ⚠️ 默认行为（不要过度指定 type）

**G2 会根据数据类型自动推断 scale 类型，非特殊情况下不要手动指定 type：**

| 数据类型 | 自动推断的 scale | 示例 |
|---------|-----------------|------|
| 数值字段 | `linear` | `{ value: 100 }` → linear |
| 分类字段 | `band` | `{ category: 'A' }` → band |
| Date 对象 | `time` | `{ date: new Date() }` → time |

```javascript
// ❌ 错误：不必要的 type 指定，可能导致渲染异常
chart.options({
  scale: {
    x: { type: 'linear' },  // ❌ 数值字段默认就是 linear
    y: { type: 'linear' },  // ❌ 不需要指定
  },
});

// ✅ 正确：让 G2 自动推断，只在需要时配置 domain/range
chart.options({
  scale: {
    y: { domain: [0, 100] },  // ✅ 只配置需要的属性
    color: { range: ['#1890ff', '#52c41a'] },
  },
});
```

**需要手动指定 type 的特殊情况：**

| 场景 | type | 说明 |
|------|------|------|
| 对数刻度 | `log` | 跨数量级数据 |
| 幂函数刻度 | `pow` | 非线性数据映射 |
| 平方根刻度 | `sqrt` | 非负数据的压缩 |
| 字符串日期 | `time` | 日期字段是字符串而非 Date 对象时 |
| 自定义映射 | `ordinal` | 离散值到离散值 |
| 渐变色 | `sequential` | 连续数值到颜色渐变 |
| 分段映射 | `threshold` | 按阈值分段映射到颜色 |
| 等量分段 | `quantize` / `quantile` | 连续数据离散化 |

### 11.2 比例尺类型

| 比例尺 | 类型 | 用途 |
|--------|------|------|
| 线性 | `linear` | 连续数值映射（默认） |
| 分类 | `band` | 离散分类映射（默认） |
| 点 | `point` | 离散点位置映射 |
| 时间 | `time` | 时间数据映射 |
| 对数 | `log` | 对数刻度 |
| 幂/平方根 | `pow` / `sqrt` | 幂函数/平方根映射 |
| 序数 | `ordinal` | 离散值到离散值映射 |
| 顺序 | `sequential` | 连续值到颜色渐变 |
| 分位数/量化 | `quantile` / `quantize` | 连续数据离散化映射 |
| 阈值 | `threshold` | 按阈值分段映射 |

> **详细文档**: [linear](references/scales/g2-scale-linear.md) | [band](references/scales/g2-scale-band.md) | [point](references/scales/g2-scale-point.md) | [time](references/scales/g2-scale-time.md) | [log](references/scales/g2-scale-log.md) | [pow/sqrt](references/scales/g2-scale-pow-sqrt.md) | [ordinal](references/scales/g2-scale-ordinal.md) | [sequential](references/scales/g2-scale-sequential.md) | [quantile/quantize](references/scales/g2-scale-quantile-quantize.md) | [threshold](references/scales/g2-scale-threshold.md)

---

## 12. Coordinates / 坐标系

坐标系定义数据到画布位置的映射方式，不同坐标系产生不同图表形态。

| 坐标系 | 类型 | 用途 |
|--------|------|------|
| 笛卡尔 | `cartesian` | 直角坐标系（默认） |
| 极坐标 | `polar` | 雷达图、玫瑰图 |
| Theta | `theta` | 饼图、环形图 |
| 径向 | `radial` | 径向坐标系，玉珏图 |
| 转置 | `transpose` | X/Y 轴交换 |
| 平行 | `parallel` | 平行坐标系 |
| 螺旋 | `helix` | 螺旋坐标系 |
| 鱼眼 | `fisheye` | 局部放大效果 |

> **详细文档**: [cartesian](references/coordinates/g2-coord-cartesian.md) | [polar](references/coordinates/g2-coord-polar.md) | [theta](references/coordinates/g2-coord-theta.md) | [radial](references/coordinates/g2-coord-radial.md) | [transpose](references/coordinates/g2-coord-transpose.md) | [parallel](references/coordinates/g2-coord-parallel.md) | [helix](references/coordinates/g2-coord-helix.md) | [fisheye](references/coordinates/g2-coord-fisheye.md)

---

## 13. Compositions / 组合视图

组合视图用于创建多图表布局，如分面、多视图叠加等。

| 组合 | 类型 | 用途 |
|------|------|------|
| 基础视图 | `view` | 单视图容器，组合多个 mark |
| 分面图 | `facetRect` | 按维度拆分矩形网格多图 |
| 圆形分面 | `facetCircle` | 按维度拆分环形多图 |
| 重复矩阵 | `repeatMatrix` | 多变量组合矩阵图 |
| 空间层叠 | `spaceLayer` | 多图层叠加 |
| 空间弹性 | `spaceFlex` | 弹性布局 |
| 时间关键帧 | `timingKeyframe` | 动画序列 |
| 地理视图 | `geoView` | 地理坐标系视图 |
| 地图 | `geoPath` | 地理路径绘制 |

> **详细文档**: [view](references/compositions/g2-comp-view.md) | [facetRect](references/compositions/g2-comp-facet-rect.md) | [facetCircle](references/compositions/g2-comp-facet-circle.md) | [repeatMatrix](references/compositions/g2-comp-repeat-matrix.md) | [spaceLayer](references/compositions/g2-comp-space-layer.md) | [spaceFlex](references/compositions/g2-comp-space-flex.md) | [timingKeyframe](references/compositions/g2-comp-timing-keyframe.md) | [geoView](references/compositions/g2-comp-geoview.md) | [地图](references/compositions/g2-comp-geo-map.md)

---

## 14. Themes / 主题

主题定义图表的整体视觉风格，包括颜色、字体、间距等。

> **详细文档**: [内置主题](references/themes/g2-theme-builtin.md) | [自定义主题](references/themes/g2-theme-custom.md)

---

## 15. Palettes / 调色板

调色板定义颜色序列，用于分类数据或连续数据的颜色映射。

> **详细文档**: [category10](references/palette/g2-palette-category10.md) | [category20](references/palette/g2-palette-category20.md)

---

## 16. Animations / 动画

动画增强图表的表现力，支持入场、更新、退场动画配置。

**⚠️ 重要规则**：G2 底层自带默认动画效果，用户没有明确要求动画时**不要**添加 `animate` 配置。只有用户明确描述了动画需求（如"渐入动画"、"波浪入场"等）时，才查阅参考文档添加对应的 animate 配置。

> **详细文档**: [动画介绍](references/animations/g2-animation-intro.md) | [动画类型](references/animations/g2-animation-types.md) | [关键帧动画](references/animations/g2-animation-keyframe.md)

---

## 17. Label Transforms / 标签变换

标签变换用于处理标签重叠、溢出等问题，提升标签可读性。

| 变换 | 类型 | 用途 |
|------|------|------|
| 溢出隐藏 | `overflowHide` | 超出区域的标签隐藏 |
| 重叠隐藏 | `overlapHide` | 重叠标签自动隐藏 |
| 重叠偏移 | `overlapDodgeY` | 重叠标签 Y 方向偏移 |
| 对比反转 | `contrastReverse` | 标签颜色自动反转以保证对比度 |
| 溢出调整 | `exceedAdjust` | 超出画布边界的标签位置调整 |
| 溢出描边 | `overflowStroke` | 溢出区域添加描边标记 |

> **详细文档**: [overflowHide](references/label-transform/g2-label-transform-overflow-hide.md) | [overlapHide](references/label-transform/g2-label-transform-overlap-hide.md) | [overlapDodgeY](references/label-transform/g2-label-transform-overlap-dodge-y.md) | [contrastReverse](references/label-transform/g2-label-transform-contrast-reverse.md) | [exceedAdjust](references/label-transform/g2-label-transform-exceed-adjust.md) | [overflowStroke](references/label-transform/g2-label-transform-overflow-stroke.md)

---


## 18. Patterns / 模式

模式是常见场景的最佳实践，包含迁移指南、性能优化、响应式适配等。

### 18.1 迁移指南 / Migration (v4 → v5)

| v4 (Deprecated) | v5 (Correct) |
|-----------------|--------------|
| `chart.source(data)` | `chart.options({ data })` |
| `.position('x*y')` | `encode: { x: 'x', y: 'y' }` |
| `.color('field')` | `encode: { color: 'field' }` |
| `.adjust('stack')` | `transform: [{ type: 'stackY' }]` |
| `.adjust('dodge')` | `transform: [{ type: 'dodgeX' }]` |
| `label: {}` | `labels: [{}]` |

> **详细文档**: [v4 → v5 迁移](references/patterns/g2-pattern-v4-to-v5.md)

### 18.2 性能优化 / Performance

数据预聚合、LTTB 降采样、Canvas 渲染器确认、高频实时数据节流更新。

| 场景 | 数据量 | 建议方案 |
|------|--------|---------|
| 折线图 | < 1,000 点 | 直接渲染 |
| 折线图 | 1,000 ~ 10,000 点 | 降采样到 500 点以内 |
| 折线图 | > 10,000 点 | 后端聚合 + 时间范围过滤 |
| 散点图 | < 5,000 点 | 直接渲染 |
| 散点图 | 5,000 ~ 50,000 点 | Canvas 渲染 + 降采样 |

> **详细文档**: [性能优化](references/patterns/g2-pattern-performance.md)

### 18.3 响应式适配 / Responsive

autoFit 自适应、ResizeObserver 动态调整、移动端字体/边距适配。

> **详细文档**: [响应式适配](references/patterns/g2-pattern-responsive.md)

---