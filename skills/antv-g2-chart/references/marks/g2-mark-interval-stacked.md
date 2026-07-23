---
id: "g2-mark-interval-stacked"
title: "G2 堆叠柱状图"
description: |
  使用 Interval Mark 配合 stackY Transform 创建堆叠柱状图。
  在 Spec 模式中，通过 transform 数组添加 stackY 变换。
  堆叠柱状图用于展示部分与整体的关系及各子类别在总量中的占比变化。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "堆叠柱状图"
  - "stacked bar"
  - "StackY"
  - "堆叠"
  - "部分整体"
  - "多系列"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-grouped"
  - "g2-mark-interval-normalized"
  - "g2-transform-stacky"

use_cases:
  - "展示多个子类别在各时间点的构成"
  - "比较不同类别中各子项的占比"
  - "可视化总量与子项的关系"

anti_patterns:
  - "子类别超过 5-7 个时堆叠图难以阅读，考虑用分组柱状图"
  - "不适合比较单个子类别的趋势（难以对齐基准线）"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/stacked"
---

## 核心概念

堆叠柱状图 = `type: 'interval'` + `transform: [{ type: 'stackY' }]`。
`stackY` 将同一 x 位置的多个数值叠加计算 y0/y1 区间，
使各子类别的柱体在垂直方向上依次堆叠。

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 100 },
    { month: 'Jan', type: 'B', value: 200 },
    { month: 'Jan', type: 'C', value: 150 },
    { month: 'Feb', type: 'A', value: 120 },
    { month: 'Feb', type: 'B', value: 180 },
    { month: 'Feb', type: 'C', value: 160 },
    { month: 'Mar', type: 'A', value: 90 },
    { month: 'Mar', type: 'B', value: 220 },
    { month: 'Mar', type: 'C', value: 130 },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
  },
  transform: [{ type: 'stackY' }],   // 关键：堆叠变换
});

chart.render();
```

## 带数据标签的堆叠柱状图

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  labels: [
    {
      text: 'value',
      position: 'inside',     // 标签在柱体内部
      style: { fontSize: 11, fill: 'white' },
    },
  ],
});
```

## 堆叠条形图（水平方向）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { transform: [{ type: 'transpose' }] },   // 转置为水平条形图
});
```

## 控制堆叠顺序

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY', orderBy: 'value' }],  // 按值大小排序堆叠
});
```

## 百分比堆叠柱状图

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'normalizeY' },  // 归一化到 [0, 1]，即百分比堆叠
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## 常见错误与修正

### 错误 1：忘记 transform stackY
```javascript
// ❌ 错误：多系列数据不会自动堆叠，柱体会在同一位置重叠
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // 缺少 transform！
});

// ✅ 正确：必须显式声明 stackY
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // 必须！
});
```

### 错误 2：同一 (x, color) 组合有重复数据行
```javascript
// ❌ 错误：同月份同类型出现两条数据，stackY 会重复叠加
const badData = [
  { month: 'Jan', type: 'A', value: 100 },
  { month: 'Jan', type: 'A', value: 50 },  // 重复！
];

// ✅ 正确：每个 (x, color) 组合只有一条数据；如需合并请在数据层聚合
```

### 错误 3：transform 写成对象而非数组
```javascript
// ❌ 错误：transform 必须是数组
chart.options({ transform: { type: 'stackY' } });

// ✅ 正确：transform 是数组，支持多个变换链式执行
chart.options({ transform: [{ type: 'stackY' }] });
```
