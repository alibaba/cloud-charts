---
id: "g2-transform-normalizey"
title: "G2 NormalizeY 归一化变换"
description: |
  NormalizeY 将每个 x 分组内的 y 值归一化到 [0, 1]，
  通常跟在 stackY 之后使用，用于创建百分比堆叠图表，
  消除总量差异，聚焦占比分布。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "normalizeY"
  - "归一化"
  - "百分比"
  - "transform"
  - "百分比堆叠"
  - "占比"
  - "spec"

related:
  - "g2-mark-interval-normalized"
  - "g2-transform-stacky"

use_cases:
  - "创建百分比堆叠柱状图"
  - "创建百分比堆叠面积图"
  - "消除总量差异，聚焦占比"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/normalize-y"
---

## 基本用法（必须配合 stackY）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },       // 第一步：堆叠
    { type: 'normalizeY' },   // 第二步：归一化（顺序不能颠倒！）
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});

chart.render();
```

## 配置项

```javascript
transform: [
  { type: 'stackY' },
  {
    type: 'normalizeY',
    basis: 'max',    // 归一化基准：'max'（默认，每组最大值）| 'min' | 'first' | 'last' | 'mean' | 'median'
    series: 'y',     // 指定归一化的通道，默认 'y'
  },
],
```

## 百分比堆叠面积图

```javascript
chart.options({
  type: 'area',
  data,
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'normalizeY' },
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## Y 轴百分比格式化

normalizeY 后 y 值范围为 [0, 1]，需手动格式化为百分比显示：

```javascript
axis: {
  y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
}
```

## 常见错误与修正

### 错误 1：normalizeY 在 stackY 之前执行
```javascript
// ❌ 错误：先归一化再堆叠，得不到百分比堆叠效果
transform: [{ type: 'normalizeY' }, { type: 'stackY' }],

// ✅ 正确：先堆叠，再归一化
transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
```

### 错误 2：缺少 stackY 直接使用 normalizeY
```javascript
// ❌ 错误：仅 normalizeY 不会产生百分比堆叠效果
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'normalizeY' }],
});

// ✅ 正确：stackY + normalizeY 配合
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
});
```

### 错误 3：Y 轴未格式化为百分比
```javascript
// ❌ 问题：归一化后 y 轴显示 0.0 - 1.0，用户看不懂
chart.options({ transform: [{ type: 'stackY' }, { type: 'normalizeY' }] });

// ✅ 正确：添加百分比格式化
chart.options({
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
  axis: { y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` } },
});
```
