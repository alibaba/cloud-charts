---
id: "g2-transform-group"
title: "G2 Group / GroupX / GroupY 分组聚合变换"
description: |
  Group、GroupX、GroupY 是 G2 v5 中用于分组聚合的 Transform。
  Group 按 x 和 y 通道双维度分组；GroupX 按 x 通道分组；GroupY 按 y 通道分组。
  支持 mean、sum、count、min、max、median、first、last 等聚合函数。
  常用于直方图、统计柱状图、聚合折线图等场景。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "group"
  - "groupX"
  - "groupY"
  - "分组聚合"
  - "transform"
  - "统计"
  - "mean"
  - "sum"

related:
  - "g2-transform-bin"
  - "g2-transform-stacky"
  - "g2-mark-interval-basic"

use_cases:
  - "按类别计算平均值（均值柱状图）"
  - "按 X 分组后求和展示总量"
  - "将明细数据聚合为统计摘要"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/group-x"
---

## 核心概念

| Transform | 分组维度 | 典型场景 |
|-----------|----------|----------|
| `groupX` | x 通道（+ color/series） | 同类别取均值/求和 |
| `groupY` | y 通道 | 按 Y 分组聚合 |
| `group` | x + y 双通道 | 二维分组聚合 |

聚合函数通过 `y: 'mean'` 等形式指定，支持：
`mean`（均值）、`sum`（求和）、`count`（计数）、`min`、`max`、`median`、`first`、`last`

## GroupX 基本用法（按类别求均值）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { category: 'A', value: 10 },
    { category: 'A', value: 20 },
    { category: 'A', value: 30 },
    { category: 'B', value: 40 },
    { category: 'B', value: 50 },
  ],
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'groupX',
      y: 'mean',   // 按 x 分组，y 取均值
    },
  ],
});

chart.render();
// 结果：A 显示均值 20，B 显示均值 45
```

## GroupX 聚合函数一览

```javascript
chart.options({
  type: 'interval',
  data: rawData,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'groupX',
      y: 'mean',      // 均值
      // y: 'sum',    // 求和
      // y: 'count',  // 计数（忽略 y 通道值，统计条数）
      // y: 'max',    // 最大值
      // y: 'min',    // 最小值
      // y: 'median', // 中位数
    },
  ],
});
```

## 统计计数（频率分布）

```javascript
// 统计各类别出现次数
chart.options({
  type: 'interval',
  data: rawData,
  encode: { x: 'category' },    // 无需 y 通道
  transform: [
    { type: 'groupX', y: 'count' },  // y 会自动生成为计数值
  ],
});
```

## GroupY 用法（按 Y 分组）

```javascript
// 水平方向按 y 分组求均值（常用于横向柱状图）
chart.options({
  type: 'interval',
  data: rawData,
  encode: { y: 'category', x: 'value' },
  transform: [
    { type: 'groupY', x: 'mean' },  // 按 y 分组，x 取均值
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## 多字段聚合

```javascript
// 同时对多个字段聚合
chart.options({
  type: 'point',
  data: rawData,
  encode: { x: 'date', y: 'value', size: 'amount' },
  transform: [
    {
      type: 'groupX',
      y: 'mean',       // y 取均值
      size: 'sum',     // size 通道取求和
    },
  ],
});
```

## Cell 图表中的 Group 使用

对于 `cell` 类型的图表，通常需要先对数据进行分组聚合再渲染。例如，按日期的 UTC 日和 UTC 月分组，并取最高温度的最大值：

```javascript
const chart = new Chart({
  container: 'container',
});

chart.options({
  type: 'cell',
  height: 300,
  data: {
    type: 'inline',
    value: [
      { date: '2012-01-01', temp_max: 12.8 },
      { date: '2012-01-02', temp_max: 10.6 },
      // 更多数据...
    ]
  },
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  transform: [{ type: 'group', color: 'max' }],
  scale: { color: { type: 'sequential', palette: 'gnBu' } },
  style: { inset: 0.5 },
});

chart.render();
```

## 常见错误与修正

### 错误 1：transform 写成对象而非数组
```javascript
// ❌ 错误
chart.options({ transform: { type: 'groupX', y: 'mean' } });

// ✅ 正确
chart.options({ transform: [{ type: 'groupX', y: 'mean' }] });
```

### 错误 2：count 聚合时仍传 y encode
```javascript
// ❌ count 聚合时不需要 y 通道
chart.options({
  encode: { x: 'category', y: 'someField' },
  transform: [{ type: 'groupX', y: 'count' }],  // y: 'count' 会忽略 encode.y
});

// ✅ count 聚合只需 x 通道
chart.options({
  encode: { x: 'category' },    // 不需要 y
  transform: [{ type: 'groupX', y: 'count' }],
});
```

### 错误 3：Cell 图表未正确使用 Group 聚合
```javascript
// ❌ 错误：没有对重复的 x/y 组合做聚合，导致渲染异常
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max'
  },
  transform: []  // 缺少必要的 group 聚合
});

// ✅ 正确：使用 group 并指定 color 聚合方式
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max'
  },
  transform: [{ type: 'group', color: 'max' }]  // 必须聚合 color 通道
});
```