---
id: "g2-mark-box-boxplot"
title: "G2 箱线图（Box Mark）"
description: |
  使用 Box Mark 创建箱线图（又称盒须图），展示数据的分位数分布：
  最小值、Q1（25%分位）、中位数、Q3（75%分位）、最大值及异常值。
  本文采用 Spec 模式。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "box"
tags:
  - "箱线图"
  - "盒须图"
  - "Box"
  - "boxplot"
  - "分布"
  - "分位数"
  - "异常值"
  - "spec"

related:
  - "g2-mark-point-scatter"
  - "g2-core-encode-channel"

use_cases:
  - "展示数值数据的分布形态和离散程度"
  - "对比多个分类的数据分布差异"
  - "识别异常值（outliers）"

anti_patterns:
  - "数据量极少（< 5 个点）时箱线图无统计意义"
  - "需要展示具体数据点分布时，改用小提琴图或散点图"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/statistics/boxplot"
---

## 核心概念

Box Mark 需要 5 个数值通道：
- `y`：中位数（Q2）
- `y1`：Q1（25% 分位数）
- `y2`：Q3（75% 分位数）
- `y3`：下须（最小非异常值）
- `y4`：上须（最大非异常值）

**数据格式**：数据需预先计算分位数后传入，或使用原始数据配合 `boxplot` transform 自动计算。

## 使用 boxplot transform 自动计算（推荐）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

// 原始数据，每个分类有多个观测值
const rawData = [
  { category: 'A', value: 10 },
  { category: 'A', value: 25 },
  { category: 'A', value: 30 },
  { category: 'A', value: 45 },
  { category: 'A', value: 50 },
  { category: 'A', value: 55 },
  { category: 'A', value: 80 },   // 异常值
  { category: 'B', value: 20 },
  { category: 'B', value: 35 },
  { category: 'B', value: 40 },
  { category: 'B', value: 48 },
  { category: 'B', value: 52 },
  { category: 'B', value: 65 },
];

chart.options({
  type: 'boxplot',          // boxplot 是 box mark + boxplot transform 的组合快捷方式
  data: rawData,
  encode: {
    x: 'category',
    y: 'value',
  },
  style: {
    fill: '#1890ff',
    fillOpacity: 0.3,
    stroke: '#1890ff',
  },
});

chart.render();
```

## 预计算分位数数据

```javascript
// 数据已包含分位数字段
chart.options({
  type: 'box',
  data: [
    { category: 'A', min: 10, q1: 25, median: 45, q3: 55, max: 75 },
    { category: 'B', min: 20, q1: 35, median: 48, q3: 58, max: 80 },
    { category: 'C', min: 5,  q1: 20, median: 35, q3: 50, max: 65 },
  ],
  encode: {
    x: 'category',
    y: 'median',     // 中位数
    y1: 'q1',        // 下四分位
    y2: 'q3',        // 上四分位
    y3: 'min',       // 下须
    y4: 'max',       // 上须
  },
  style: {
    fill: '#1890ff',
    fillOpacity: 0.3,
    stroke: '#1890ff',
    lineWidth: 1.5,
  },
});
```

## 箱线图 + 散点（显示原始数据点）

```javascript
chart.options({
  type: 'view',
  data: rawData,
  children: [
    {
      type: 'boxplot',
      encode: { x: 'category', y: 'value' },
      style: { fill: '#1890ff', fillOpacity: 0.2, stroke: '#1890ff' },
    },
    {
      // 叠加原始数据点
      type: 'point',
      encode: { x: 'category', y: 'value' },
      transform: [{ type: 'jitter' }],   // jitter 避免点重叠
      style: { fill: '#1890ff', fillOpacity: 0.5, r: 3 },
    },
  ],
});
```

## 常见错误与修正

### 错误：box mark 缺少 y1/y2/y3/y4 通道
```javascript
// ❌ 错误：box mark 需要 5 个 y 通道，缺少会渲染异常
chart.options({
  type: 'box',
  encode: { x: 'category', y: 'median' },  // 缺少 y1-y4！
});

// ✅ 正确：使用 boxplot（自动计算）或补全所有通道
chart.options({ type: 'boxplot', encode: { x: 'category', y: 'value' } });
```
