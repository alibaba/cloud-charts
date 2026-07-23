---
id: "g2-comp-label-config"
title: "G2 数据标签配置（labels）"
description: |
  详解 G2 v5 Spec 模式中 labels 字段的配置，涵盖标签文本、位置、格式化、
  选择器（只显示部分标签）、标签转换（transform）、背景框、连接线及样式定制。
  注意：Spec 模式中使用 labels（复数）。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "labels"
  - "label"
  - "数据标签"
  - "文字标签"
  - "position"
  - "formatter"
  - "transform"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"
  - "g2-comp-annotation"

use_cases:
  - "在柱体上方显示数值"
  - "在折线末端显示系列名称"
  - "在饼图扇区内外显示百分比"
  - "解决标签重叠问题"
  - "标签颜色与图形颜色对比度优化"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-05-31"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/label"
---

## 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  labels: [
    {
      text: 'sold',          // 显示哪个字段的值（字段名字符串或函数）
      position: 'outside',   // 标签位置
    },
  ],
});

chart.render();
```

## 常用位置说明

### 笛卡尔坐标系（interval / point / line / cell 等）

支持 9 种位置：`top`、`left`、`right`、`bottom`、`top-left`、`top-right`、`bottom-left`、`bottom-right`、`inside`。

| position 值      | 适用 Mark | 效果                     |
| ---------------- | --------- | ------------------------ |
| `'top'`          | interval  | 柱体顶部（紧贴顶端）     |
| `'right'`        | interval  | 柱体右侧                 |
| `'left'`         | interval  | 柱体左侧                 |
| `'bottom'`       | interval  | 柱体底部                 |
| `'inside'`       | interval  | 柱体内部中央             |
| `'top-left'`     | interval  | 柱体左上角               |
| `'top-right'`    | interval  | 柱体右上角               |
| `'bottom-left'`  | interval  | 柱体左下角               |
| `'bottom-right'` | interval  | 柱体右下角               |
| `'top'`          | point     | 点的上方                 |
| `'right'`        | line      | 折线末端右侧             |

### 非笛卡尔坐标系（arc / 饼图 / 环形图）

支持 `outside`、`inside` 两种基本位置，以及特殊位置：

| position     | 用途                                             |
| ------------ | ------------------------------------------------ |
| `'outside'`  | 扇区外侧引线                                     |
| `'inside'`   | 扇区内部                                         |
| `'spider'`   | 调整标签沿坐标轴边沿两端对齐，适用于 polar 坐标系（饼图/环形图） |
| `'surround'` | 调整标签环形环绕坐标系，适用于玫瑰图             |
| `'area'`     | 将面积图的标签显示在面积区域中心，并设置一定的旋转角度 |

## 格式化标签文本

```javascript
labels: [
  {
    // 推荐：text 函数方式，可访问完整数据行 datum
    text: (d) => `${d.sold.toLocaleString()} 万`,

    // 或字符串字段名（自动取该字段的值）
    // text: 'sold',
  },
],
```

## formatter 用法（仅格式化已取值的文本）

`formatter` 接收的第一个参数是 `text` 已映射的值（非完整 datum），适合对数值进行简单格式化：

```javascript
labels: [
  {
    text: 'yield_rate',              // 先映射字段 yield_rate 的值
    formatter: (val) => `${val}%`,   // val 是 yield_rate 的值，非 datum 对象
  },
],
```

完整签名：`formatter(text, datum, index, data) => string`

## 完整 label 配置项

```javascript
labels: [
  {
    text: (d) => d.value.toFixed(1),  // 标签文本（推荐用函数直接访问 datum）
    position: 'outside',               // 位置

    // ── 样式（可直接在 label 上配置，也可通过 style 嵌套） ──
    fill: '#333',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    dy: -4,                          // y 方向偏移（px）
    dx: 0,                           // x 方向偏移

    // ── 选择器（只显示部分标签）──────────────
    selector: 'last',                  // 'first' | 'last' | (labels) => filteredLabels
    // 过滤（只对满足条件的数据显示标签）
    filter: (d) => d.value > 50,

    // ── 标签转换（优化标签展示）──────────────
    transform: [{ type: 'overlapDodgeY' }],

    // ── 连接线（饼图 spider/surround 位置时常用）──
    connectorDistance: 5,
    connectorStroke: '#aaa',
    connectorLineWidth: 1,

    // ── 背景框 ───────────────────────────────
    background: true,
    backgroundFill: '#fff',
    backgroundRadius: 4,
    backgroundPadding: [8, 12],
  },
],
```

## selector 选择器

`selector` 用于选择需要保留显示的标签，支持三种方式：

```javascript
labels: [
  {
    text: 'Symbol',
    selector: 'first',              // 方式一：预置 'first' / 'last'
    style: { fill: 'blue' },
  },
  {
    text: 'Symbol',
    selector: 'last',               // 最后一个
    style: { fill: 'red' },
  },
  {
    text: 'Symbol',
    selector: (labels) => {         // 方式二：自定义函数，参数为所有 label 数组
      // labels 内含 bounds 坐标等信息，可用于过滤
      return labels.filter(({ bounds }) => {
        const [x, y] = bounds[0];
        return x > 200 && x < 300 && y > 200 && y < 350;
      });
    },
    style: { fill: '#ac1ce6' },
  },
],
```
`selector` 支持的值：
- `'first'` — 保留第一个标签
- `'last'` — 保留最后一个标签
- `(labels) => filteredLabels` — 自定义选择器函数，接收全部 label 信息数组，可基于坐标等信息过滤

## 标签转换（transform）

当标签的展示不符合预期时（如重叠、颜色不明显、溢出等），可以使用**标签转换（Label Transform）** 来优化标签的展示。

### transform 配置方式

标签转换支持两种配置层级：

**方式一：在 labels 数组中的单个 label 上配置（推荐）**

```javascript
labels: [
  {
    text: 'value',
    transform: [{ type: 'overlapDodgeY' }],
  },
],
```

**方式二：在 view 层级通过 labelTransform 全局配置**

在 `view` 层级通过 `labelTransform` 声明标签转换，作用于该视图下所有标签：

```javascript
chart.options({
  type: 'view',
  labelTransform: [{ type: 'overlapHide' }, { type: 'contrastReverse' }],
});
```

### 标签转换类型一览

| type            | 描述                                                       |
| --------------- | ---------------------------------------------------------- |
| overlapDodgeY   | 对位置碰撞的标签在 y 方向上调整，防止标签重叠             |
| contrastReverse | 标签颜色在图形背景上对比度低时，从指定色板选择最优对比颜色 |
| overflowStroke  | 标签溢出图形时，从指定色板选择对比度最优的颜色进行描边    |
| overflowHide    | 对于标签在图形上放置不下时，隐藏标签                      |
| overlapHide     | 对位置碰撞的标签进行隐藏，默认保留前一个、隐藏后一个      |
| exceedAdjust    | 自动对标签做溢出检测和矫正，超出指定区域时做反方向位移    |

### overlapDodgeY — 防重叠（y 方向调整）

对位置碰撞的标签在 y 方向上做位置调整，适合折线图等标签密集场景。

```javascript
labels: [
  {
    text: 'price',
    transform: [{ type: 'overlapDodgeY' }],
  },
],
```

| 属性          | 描述                                     | 类型     | 默认值 |
| ------------- | ---------------------------------------- | -------- | ------ |
| maxIterations | 位置调整的最大迭代次数                   | _number_ | `10`   |
| padding       | 期望调整后标签之间的间距                 | _number_ | `1`    |
| maxError      | 最大误差（实际间距与期望 padding 的误差）| _number_ | `0.1`  |

### contrastReverse — 对比度反转

标签颜色在图形背景上对比度低时，从指定色板自动选择一个对比度最优的颜色。适用于多颜色的柱状图中颜色和标签接近的场景。

```javascript
labels: [
  {
    text: 'genre',
    transform: [{ type: 'contrastReverse' }],
  },
],
```

| 属性      | 描述                                                   | 类型     | 默认值             |
| --------- | ------------------------------------------------------ | -------- | ------------------ |
| threshold | 标签和背景的颜色对比度阈值，超过阈值才推荐提升对比度  | _number_ | `4.5`              |
| palette   | 对比度提升算法中备选的颜色色板                          | _string[]_ | `['#000', '#fff']` |

可以同时搭配 `overflowStroke` 使用：

```javascript
labels: [
  {
    text: 'frequency',
    transform: [
      { type: 'contrastReverse' },
      { type: 'overflowStroke' },
    ],
  },
],
```

### overflowStroke — 溢出描边

类似字幕黑底白字原理，从指定色板选择一个与标签颜色对比度最优的颜色进行描边，解决标签溢出图形后可读性变差的问题。

```javascript
labels: [
  {
    text: 'frequency',
    transform: [{ type: 'overflowStroke' }],
  },
],
```

| 属性      | 描述                         | 类型       | 默认值             |
| --------- | ---------------------------- | ---------- | ------------------ |
| threshold | 溢出阈值，越大越不容易触发描边 | _number_   | `2`                |
| palette   | 描边备选的颜色色板            | _string[]_ | `['#000', '#fff']` |

### overflowHide — 溢出隐藏

对于标签在图形上放不下的时候，隐藏标签。适用于每个小图形都映射有 `label` 标签导致重叠不清的场景（如旭日图、矩形树图等）。

> **与 overlapDodgeY 的区别**：`overflowHide` 针对 label 与 mark 图形之间的溢出问题；`overlapDodgeY` 针对多个 label 之间的重叠问题。

```javascript
labels: [
  {
    text: 'name',
    transform: [{ type: 'overflowHide' }],
  },
],
```

### overlapHide — 碰撞隐藏

对位置碰撞的标签进行隐藏，默认保留前一个，隐藏后一个。和 `overlapDodgeY` 的区别在于 `overlapHide` 直接隐藏而不是移动位置。

```javascript
labels: [
  {
    text: 'price',
    transform: [{ type: 'overlapHide' }],
  },
],
```

### exceedAdjust — 溢出矫正

自动对标签做溢出检测和矫正，当标签超出指定区域时自动做反方向位移。

```javascript
labels: [
  {
    text: 'tooltip',
    transform: [{ type: 'exceedAdjust' }],  // 默认检测 view 边界
  },
],
```

```javascript
// 带完整配置
labels: [
  {
    text: 'tooltip',
    transform: [{
      type: 'exceedAdjust',
      bounds: 'main',     // 检测主区域边界
      offsetX: 15,        // X 轴偏移附加值
      offsetY: 10,        // Y 轴偏移附加值
    }],
  },
],
```

| 属性    | 说明                                                              | 类型               | 默认值  |
| ------- | ----------------------------------------------------------------- | ------------------ | ------- |
| bounds  | 指定检测边界的区域类型（`5.3.4` 开始支持）。`'view'` 为整个视图区域；`'main'` 为主区域 | `'view' \| 'main'` | `'view'` |
| offsetX | 触发自动调整位置时 X 轴偏移附加值（左侧边界向右，右侧边界向左）  | _number_           | `0`     |
| offsetY | 触发自动调整位置时 Y 轴偏移附加值（上侧边界向下，下侧边界向上）  | _number_           | `0`     |

## 标签背景框（background）

标签可以配置背景框样式，格式为 `background${style}`，如 `backgroundFill` 代表背景框填充色。需要设置 `background: true` 开启。

```javascript
labels: [
  {
    text: 'value',
    background: true,
    backgroundFill: '#fff',
    backgroundRadius: 4,
    backgroundPadding: [10, 10, 10, 10],
    backgroundOpacity: 0.8,
    backgroundStroke: '#000',
    backgroundLineWidth: 1,
  },
],
```

### 背景框配置项

| 参数                    | 说明               | 类型              | 默认值 |
| ----------------------- | ------------------ | ----------------- | ------ |
| backgroundFill          | 背景框填充色       | _string_          | -      |
| backgroundFillOpacity   | 背景框填充透明度   | _number_          | -      |
| backgroundStroke        | 背景框描边         | _string_          | -      |
| backgroundStrokeOpacity | 背景框描边透明度   | _number_          | -      |
| backgroundLineWidth     | 背景框描边宽度     | _number_          | -      |
| backgroundLineDash      | 背景框描边虚线配置 | _[number,number]_ | -      |
| backgroundOpacity       | 背景框整体透明度   | _number_          | -      |
| backgroundShadowColor   | 背景框阴影颜色     | _string_          | -      |
| backgroundShadowBlur    | 背景框阴影模糊系数 | _number_          | -      |
| backgroundShadowOffsetX | 背景框阴影水平偏移 | _number_          | -      |
| backgroundShadowOffsetY | 背景框阴影垂直偏移 | _number_          | -      |
| backgroundCursor        | 鼠标样式           | _string_          | `default` |
| backgroundRadius        | 背景框圆角半径     | _number_          | -      |
| backgroundPadding       | 背景框内边距       | _number[]_        | -      |

## 推荐 Label Transform 组合

不同场景下的最佳 transform 组合，避免标签可见性问题：

### 柱状图 inside label（多色柱）

多色柱状图的 label 放在柱体内部时，必须使用 `contrastReverse` 自动适配背景色，配合 `overflowHide` 隐藏放不下的标签：

```javascript
labels: [
  {
    text: 'value',
    position: 'inside',
    transform: [{ type: 'contrastReverse' }, { type: 'overflowHide' }],
  },
]
```

### 折线图末端标签（密集系列）

多系列折线图末端标签容易重叠，用 `overlapDodgeY` 在 Y 方向自动避让，`exceedAdjust` 防止溢出边界：

```javascript
labels: [
  {
    text: 'type',
    selector: 'last',
    position: 'right',
    transform: [{ type: 'overlapDodgeY' }, { type: 'exceedAdjust' }],
  },
]
```

### 饼图外侧标签

饼图 `spider` 或 `outside` 位置的标签可能重叠，用 `overlapHide` 隐藏碰撞标签：

```javascript
labels: [
  {
    text: (d) => `${d.name}: ${d.value}%`,
    position: 'spider',
    transform: [{ type: 'overlapHide' }],
  },
]
```

### 堆叠图 / TreeMap / 旭日图

空间有限的 mark 使用 `overflowHide` 隐藏放不下的标签，配合 `contrastReverse` 确保可读性：

```javascript
labels: [
  {
    text: 'name',
    position: 'inside',
    transform: [{ type: 'contrastReverse' }, { type: 'overflowHide' }],
  },
]
```

### 通用安全组合（适用于大多数场景）

不确定该用哪种 transform 时，以下组合覆盖最常见的标签问题：

```javascript
labels: [
  {
    text: 'field',
    transform: [{ type: 'overlapHide' }, { type: 'exceedAdjust' }],
  },
]
```

## innerHTML / render 自定义 HTML 标签

除了 `text` 字段映射，还可以使用 `innerHTML` 或 `render` 渲染自定义 HTML 内容。

```javascript
labels: [
  {
    // innerHTML 自定义，返回 string 或 HTMLElement
    innerHTML: ({ genre, sold }) =>
      `<div style="padding:0 4px;border-radius:10px;background:#f5f5f5;border:2px solid #5ea9e6;font-size:11px;">${genre}:${sold}</div>`,
    dx: 10,
    dy: 50,
    style: { fill: 'rgba(0,0,0,0)', color: '#333' },
  },
],
```

> **注意**：`innerHTML` 和 `text` 同时配置时 `text` 会失效。`render` 与 `innerHTML` 数据类型一致，传参略有区别：
> ```ts
> type RenderFunc = (text: string, datum: object, index: number, { channel: Record<string, Channel> }) => String | HTMLElement;
> ```

## 连接线完整样式（connector）

在饼图和环形图等非笛卡尔坐标系下，使用 `position: 'spider'` 或 `'surround'` 时会展示连接线元素。连接线样式格式为 `connector${style}`。

```javascript
labels: [
  {
    text: 'id',
    position: 'spider',
    connectorDistance: 5,           // 文本和连接线的间距
    connectorStroke: '#0649f2',     // 连接线颜色
    connectorLineWidth: 1,          // 连接线宽度
    connectorLineDash: [3, 4],      // 虚线配置
    connectorOpacity: 0.8,          // 透明度
  },
],
```

| 参数                   | 说明                    | 类型              | 默认值    |
| ---------------------- | ----------------------- | ----------------- | --------- |
| connectorStroke        | 连接线颜色              | _string_          | -         |
| connectorStrokeOpacity | 连接线透明度            | _number_          | -         |
| connectorLineWidth     | 连接线描边宽度          | _number_          | -         |
| connectorLineDash      | 连接线虚线配置          | _[number,number]_ | -         |
| connectorOpacity       | 连接线整体透明度        | _number_          | -         |
| connectorShadowColor   | 连接线阴影颜色          | _string_          | -         |
| connectorShadowBlur    | 连接线阴影模糊系数      | _number_          | -         |
| connectorShadowOffsetX | 连接线阴影水平偏移      | _number_          | -         |
| connectorShadowOffsetY | 连接线阴影垂直偏移      | _number_          | -         |
| connectorCursor        | 鼠标样式                | _string_          | `default` |
| connectorDistance      | 连接线和文本距离        | _number_          | -         |

## 折线末端标签

```javascript
// 只在每条折线的最后一个点显示系列名称
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  labels: [
    {
      text: 'type',         // 显示系列名
      selector: 'last',     // 只在最后一个数据点显示
      position: 'right',
      style: { fontSize: 11 },
    },
  ],
});
```

## 堆叠柱中心标签

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  labels: [
    {
      text: (d) => d.value >= 30 ? d.value : '',  // 数值太小时不显示
      position: 'inside',
      style: { fill: 'white', fontSize: 11 },
    },
  ],
});
```

## 常见错误与修正

### 错误：Spec 模式中写成 label（单数）
```javascript
// ❌ 错误：链式 API 是 .label()，但 Spec 模式是 labels（复数，且是数组）
chart.options({ label: { text: 'value' } });

// ✅ 正确：Spec 中用 labels 数组
chart.options({ labels: [{ text: 'value' }] });
```

### 错误：text 传入了数字常量
```javascript
// ❌ 错误：text 为数字 0，所有标签显示 '0'
chart.options({ labels: [{ text: 0 }] });

// ✅ 正确：text 应为字段名字符串或函数
chart.options({ labels: [{ text: 'value' }] });
chart.options({ labels: [{ text: (d) => d.value.toFixed(1) }] });
```

### 错误：formatter 中把第一个参数当成 datum
```javascript
// ❌ 错误：formatter 的第一个参数是已映射的文本值，不是 datum
labels: [{
  text: 'yield_rate',
  formatter: (d) => `${d.yield_rate}%`,  // d 是数值，d.yield_rate 为 undefined
}]

// ✅ 方案一：用 text 函数直接访问 datum（推荐）
labels: [{
  text: (d) => `${d.yield_rate}%`,
}]

// ✅ 方案二：formatter 正确用法（参数是已取值的文本）
labels: [{
  text: 'yield_rate',
  formatter: (val) => `${val}%`,  // val 是 yield_rate 的值
}]
```
