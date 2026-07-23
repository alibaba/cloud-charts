---
id: "g2-transform-sortx"
title: "G2 SortX 排序变换"
description: |
  SortX 对 x 轴的分类数据按指定字段或函数进行排序，
  常用于将柱状图按数值从大到小排列，创建排名图表。
  多系列按分组总量排序用内置 reducer: 'sum'，无需自定义函数。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sortX"
  - "排序"
  - "排名"
  - "transform"
  - "柱状图排序"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-transform-dodgex"

use_cases:
  - "创建按值降序排列的柱状图（排名图）"
  - "对分类轴自定义排序顺序"
  - "多系列堆叠图按分组总量排序"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-04-02"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sort-x"
---

## 最小可运行示例（按值降序排列）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { city: '北京', gdp: 3.6 },
    { city: '上海', gdp: 4.3 },
    { city: '广州', gdp: 2.8 },
    { city: '深圳', gdp: 3.2 },
    { city: '杭州', gdp: 1.8 },
    { city: '成都', gdp: 2.0 },
  ],
  encode: { x: 'city', y: 'gdp' },
  transform: [
    {
      type: 'sortX',
      by: 'y',           // 按 y 通道值排序
      reverse: true,     // true = 降序（最大值在左）
    },
  ],
  coordinate: { transform: [{ type: 'transpose' }] },   // 转为水平排名图
});

chart.render();
```

## 配置项

```javascript
transform: [
  {
    type: 'sortX',
    by: 'y',          // 排序依据的 channel 名（'y' | 'x' | 'color' 等）
    reducer: 'max',   // 分组聚合方式（见下方说明），默认 'max'
    reverse: true,    // 是否反转顺序（默认 false = 升序）
    slice: 10,        // 只保留前 N 个（用于 Top N 图表）
  },
],
```

**`reducer` 内置值**（多系列/堆叠场景下对分组内的多个 y 值做聚合）：

| 值 | 含义 |
|----|------|
| `'max'` | 取分组最大值（默认） |
| `'min'` | 取分组最小值 |
| `'sum'` | 取分组总和 ← **多系列按总量排序用这个** |
| `'mean'` | 取分组平均值 |
| `'median'` | 取分组中位数 |
| `'first'` | 取分组第一个值 |
| `'last'` | 取分组最后一个值 |

## Top N 排名图（只展示前 10）

```javascript
chart.options({
  type: 'interval',
  data: fullData,
  encode: { x: 'name', y: 'score' },
  transform: [
    {
      type: 'sortX',
      by: 'y',
      reverse: true,
      slice: 10,   // 只取前 10 名
    },
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: { x: { title: null } },
});
```

## 自定义排序（按指定字段）

```javascript
// 数据中有 rank 字段，按 rank 排序
chart.options({
  type: 'interval',
  data,
  encode: { x: 'name', y: 'value' },
  transform: [
    { type: 'sortX', by: 'rank', reverse: false },
  ],
});
```

## 按分组总量排序（多系列堆叠图）

多系列图中每个 x 分组有多条数据，用内置 `reducer: 'sum'` 按各分组 y 值之和排序，**不需要自定义函数**：

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'city', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    {
      type: 'sortX',
      by: 'y',
      reducer: 'sum',   // ✅ 内置求和，按各城市所有系列总和排序
      reverse: true,
    },
  ],
});
```

## 径向坐标系中的排序注意事项

在使用 `radial` 径向坐标系时，SortX 的行为与常规笛卡尔坐标系一致，但需要注意以下几点：

1. **x 和 y 通道映射**：在径向坐标系中，x 通常映射为角度（即圆周方向），y 映射为半径（即距离中心的距离）。因此，`by: 'y'` 实际上是对半径进行排序。
2. **排序必要性**：由于径向图表存在“半径反馈效应”，即外圈即使数值较小也可能看起来比内圈数值大的条目长，因此**强烈建议在使用径向坐标系时对数据进行排序**，以确保视觉准确性。
3. **排序方向控制**：`reverse: true` 会使数据按降序排列，即数值最大的项靠近最外圈；`reverse: false` 则相反。

```javascript
// ✅ 正确：在径向坐标系中按 y 值排序并渲染
chart.options({
  type: 'interval',
  data: [
    { movie: '电影A', rating: 9.2, genre: '科幻' },
    { movie: '电影B', rating: 8.7, genre: '动作' },
    { movie: '电影C', rating: 8.5, genre: '科幻' },
    { movie: '电影D', rating: 7.9, genre: '喜剧' },
    { movie: '电影E', rating: 7.2, genre: '动作' },
    { movie: '电影F', rating: 6.8, genre: '喜剧' }
  ].sort((a, b) => b.rating - a.rating), // 数据预排序
  coordinate: { type: 'radial', innerRadius: 0.35 },
  encode: {
    x: 'movie',
    y: 'rating',
    color: 'rating',
  },
  scale: {
    y: { domain: [0, 10] },
  },
  style: {
    radius: 5,
    fillOpacity: 0.95,
  },
  labels: [{
    text: 'rating',
    position: 'inside',
    style: { fontWeight: 'bold', fill: 'white' },
  }],
  axis: {
    x: { label: { autoRotate: true, style: { fontSize: 10 } } },
    y: { label: true, grid: false, style: { fontSize: 9 } },
  },
  interaction: [{ type: 'elementHighlightByColor' }],
});
```

## 常见错误与修正

### 错误：用自定义函数代替内置 reducer，且误用不存在的 `{ value }` 参数

`sortX` 没有 `by: ({ value }) => ...` 这种 API。`by` 只接受 **channel 名字符串**，聚合逻辑通过 `reducer` 控制。自定义 `reducer` 函数的签名是 `(GI, V) => number`（`GI` = 该分组的行索引数组，`V` = 整列数值数组），而不是接收数据对象数组。

```javascript
// ❌ 错误：by 不接受函数，({ value }) 参数不存在
transform: [
  {
    type: 'sortX',
    by: ({ value }) => d3.sum(value, (d) => d.sales),   // ❌ by 只能是字符串
    reverse: true,
  },
],

// ❌ 同样错误：即使不用 d3，函数形式也不对
transform: [
  {
    type: 'sortX',
    by: ({ value }) => value.reduce((sum, d) => sum + d.value, 0),  // ❌ by 不支持函数
    reverse: true,
  },
],

// ✅ 正确：按分组总和排序用内置 reducer: 'sum'
transform: [
  {
    type: 'sortX',
    by: 'y',
    reducer: 'sum',   // ✅ 内置聚合，无需自定义函数
    reverse: true,
  },
],
```

### 错误：在任何回调中使用未导入的 `d3`

G2 内部使用 d3，但 `d3` 对象不会暴露到用户代码作用域。调用 `d3.sum()`、`d3.max()` 等会抛出 `ReferenceError: d3 is not defined`。如确需自定义逻辑，用原生 JS 替代：

```javascript
// d3.sum(arr, d => d.v)  →  arr.reduce((s, d) => s + d.v, 0)
// d3.max(arr, d => d.v)  →  Math.max(...arr.map(d => d.v))
// d3.min(arr, d => d.v)  →  Math.min(...arr.map(d => d.v))
// d3.mean(arr, d => d.v) →  arr.reduce((s, d) => s + d.v, 0) / arr.length
```

### 错误：在径向坐标系中错误使用 x/y 映射导致排序无效

在径向坐标系中，如果将本应作为排序依据的字段错误地映射到 x 通道，而将角度映射到 y 通道，则 `sortX` 将无法达到预期效果。正确的做法是将排序依据字段映射到 y 通道，并确保数据已按该字段排序。

```javascript
// ❌ 错误：在径向坐标系中错误地将 rating 映射到 x 通道
chart.options({
  type: 'interval',
  data: [
    { movie: '电影A', rating: 9.2, genre: '科幻' },
    { movie: '电影B', rating: 8.7, genre: '动作' },
    // ...
  ],
  coordinate: { type: 'radial', innerRadius: 0.2 },
  encode: {
    x: 'rating',       // ❌ 错误：rating 应该映射到 y 通道
    y: 'movie',        // ❌ 错误：movie 应该映射到 x 通道
    color: 'rating',
  },
  transform: [
    {
      type: 'sortX',
      by: 'rating',    // ❌ 错误：by 应该是 'y'
      reverse: false,
    },
  ],
});

// ✅ 正确：rating 映射到 y 通道，movie 映射到 x 通道，并预排序
chart.options({
  type: 'interval',
  data: [
    { movie: '电影A', rating: 9.2, genre: '科幻' },
    { movie: '电影B', rating: 8.7, genre: '动作' },
    // ...
  ].sort((a, b) => b.rating - a.rating),
  coordinate: { type: 'radial', innerRadius: 0.35 },
  encode: {
    x: 'movie',        // ✅ 正确：movie 映射到 x 通道（角度）
    y: 'rating',       // ✅ 正确：rating 映射到 y 通道（半径）
    color: 'rating',
  },
});
```