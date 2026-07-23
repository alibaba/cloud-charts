---
id: "g2-mark-arc-pie"
title: "G2 饼图（Interval + theta 坐标系）"
description: |
  使用 Interval Mark 配合 theta 坐标系和 stackY 变换创建饼图，
  展示各部分在整体中的占比关系。本文采用 Spec 模式（chart.options({})）。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "arc"
tags:
  - "饼图"
  - "pie chart"
  - "占比"
  - "比例"
  - "theta坐标系"
  - "stackY"
  - "spec"

related:
  - "g2-mark-arc-donut"
  - "g2-core-chart-init"
  - "g2-transform-stacky"
  - "g2-interaction-tooltip"

use_cases:
  - "展示各类别占总量的比例"
  - "显示市场份额分布"
  - "可视化资源分配比例"

anti_patterns:
  - "类别超过 6-7 个时饼图难以阅读，改用柱状图"
  - "需要精确比较数值时不适用（人眼对角度判断不准确）"
  - "有零值或负值时饼图无意义"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/pie"
---

## 核心概念

G2 v5 饼图的 Spec 结构：
- `coordinate: { type: 'theta' }` — 将直角坐标转换为圆形角度坐标
- `transform: [{ type: 'stackY' }]` — 将各分类数值累积为角度区间（**必须**）
- `encode.y` — 映射数值字段（角度大小）
- `encode.color` — 映射分类字段（扇区颜色）

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
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
    { type: '其他',   value: 5  },
  ],
  encode: {
    y: 'value',       // 映射数值字段（决定扇区角度大小）
    color: 'type',    // 映射分类字段（决定扇区颜色）
  },
  transform: [{ type: 'stackY' }],   // 必须：将 y 值转换为角度区间
  coordinate: { type: 'theta', outerRadius: 0.8 },
  legend: {
    color: { position: 'bottom', layout: { justifyContent: 'center' } },
  },
  labels: [
    {
      text: (d) => `${d.type}\n${d.value}`,
      position: 'outside',
      connector: true,
    },
  ],
});

chart.render();
```

## 带百分比标签的饼图

```javascript
import { Chart } from '@antv/g2';

const data = [
  { type: '分类一', value: 27 },
  { type: '分类二', value: 25 },
  { type: '分类三', value: 18 },
  { type: '分类四', value: 15 },
  { type: '其他',   value: 15 },
];
const total = data.reduce((sum, d) => sum + d.value, 0);

const chart = new Chart({ container: 'container', width: 600, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  labels: [
    {
      text: (d) => `${((d.value / total) * 100).toFixed(1)}%`,
      position: 'inside',
      style: { fill: 'white', fontSize: 12, fontWeight: 'bold' },
    },
  ],
});

chart.render();
```

## 环形图（Donut）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: {
    type: 'theta',
    outerRadius: 0.8,
    innerRadius: 0.5,    // 设置内径即为环形图
  },
});
```

## 玫瑰图（极坐标柱状图）

```javascript
// 极坐标下每个扇区角度相同，半径由数值决定
chart.options({
  type: 'interval',
  data,
  encode: { x: 'type', y: 'value', color: 'type' },
  coordinate: { type: 'polar' },   // 注意：玫瑰图用 polar，不用 theta
});
```

## 常见错误与修正

### 错误 1：忘记 transform stackY
```javascript
// ❌ 错误：没有 stackY，所有扇形从 0 开始角度，完全重叠
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  coordinate: { type: 'theta' },
  // 缺少 transform！
});

// ✅ 正确：必须声明 stackY
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // 必须！
  coordinate: { type: 'theta' },
});
```

### 错误 2：饼图误用 x 通道
```javascript
// ❌ 错误：theta 坐标系中 x 通道无效，不要在饼图中 encode.x
chart.options({
  type: 'interval',
  encode: { x: 'type', y: 'value' },    // x 在 theta 下没有意义
  coordinate: { type: 'theta' },
});

// ✅ 正确：饼图只需 encode.y（数值）和 encode.color（分类）
chart.options({
  type: 'interval',
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
});
```

### 错误 3：G2 v4 饼图写法
```javascript
// ❌ 错误（G2 v4 写法）
chart.coord('theta', { radius: 0.75 });
chart.interval().position('value').color('type');

// ✅ 正确（G2 v5 Spec 写法）
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
});
```
