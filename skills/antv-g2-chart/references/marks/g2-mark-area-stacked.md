---
id: "g2-mark-area-stacked"
title: "G2 堆叠面积图"
description: |
  使用 Area Mark 配合 stackY Transform 创建堆叠面积图，
  同时展示各系列的变化趋势和总量的积累效果，各系列的面积从上一个系列顶端开始填充。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "area"
tags:
  - "堆叠面积图"
  - "stacked area"
  - "stackY"
  - "多系列"
  - "趋势"
  - "总量"
  - "spec"

related:
  - "g2-mark-area-basic"
  - "g2-transform-stacky"
  - "g2-mark-interval-stacked"

use_cases:
  - "展示多个系列的总量随时间的变化"
  - "同时关注各系列趋势和总体规模"
  - "流量来源、收入构成等场景"

anti_patterns:
  - "系列超过 5 个时颜色难以区分"
  - "需要精确对比单个系列的变化时（基准线不统一），改用折线图"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/area/stacked"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'area',
  data: [
    { month: 'Jan', type: 'A', value: 100 },
    { month: 'Jan', type: 'B', value: 200 },
    { month: 'Jan', type: 'C', value: 150 },
    { month: 'Feb', type: 'A', value: 120 },
    { month: 'Feb', type: 'B', value: 180 },
    { month: 'Feb', type: 'C', value: 160 },
    { month: 'Mar', type: 'A', value: 90  },
    { month: 'Mar', type: 'B', value: 220 },
    { month: 'Mar', type: 'C', value: 130 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});

chart.render();
```

## 平滑堆叠面积图

```javascript
chart.options({
  type: 'area',
  data,
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
    shape: 'smooth',
  },
  transform: [{ type: 'stackY' }],
  style: { fillOpacity: 0.85 },
});
```

## 堆叠面积 + 折线描边

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'area',
      encode: { x: 'month', y: 'value', color: 'type' },
      transform: [{ type: 'stackY' }],
      style: { fillOpacity: 0.7 },
    },
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type', series: 'type' },
      transform: [{ type: 'stackY' }],
      style: { lineWidth: 1.5 },
    },
  ],
});
```

## 百分比堆叠面积图

```javascript
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'normalizeY' },
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## 常见错误与修正

### 错误：忘记 stackY 导致系列互相遮挡
```javascript
// ❌ 错误：各系列面积都从 y=0 起，相互覆盖
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // 没有 transform！
});

// ✅ 正确
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});
```
