---
id: "g2-mark-area-basic"
title: "G2 基础面积图（Area Mark）"
description: |
  使用 Area Mark 创建面积图，在折线图的基础上填充线下方区域，
  强调数据的量级和趋势。本文采用 Spec 模式，涵盖单系列、渐变填充等用法。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "area"
tags:
  - "面积图"
  - "Area"
  - "area chart"
  - "趋势"
  - "量级"
  - "填充"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-mark-area-stacked"
  - "g2-core-encode-channel"

use_cases:
  - "展示数值随时间的变化趋势，同时强调量级"
  - "叠加折线时作为背景填充"
  - "对比多个系列的总量分布"

anti_patterns:
  - "多系列面积图（无堆叠）时各系列互相遮挡，改用堆叠面积图或折线图"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/area/basic"
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
    { month: 'Jan', value: 33 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 56 },
    { month: 'Apr', value: 91 },
    { month: 'May', value: 67 },
    { month: 'Jun', value: 45 },
  ],
  encode: { x: 'month', y: 'value' },
});

chart.render();
```

## 渐变填充面积图

```javascript
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value' },
  style: {
    fill: 'linear-gradient(180deg, #1890ff 0%, rgba(24,144,255,0.1) 100%)',
    fillOpacity: 0.8,
  },
});
```

## 面积图 + 折线（叠加）

```javascript
// 面积提供背景量感，折线提供精确走势
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'area',
      encode: { x: 'month', y: 'value' },
      style: { fillOpacity: 0.2, fill: '#1890ff' },
    },
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
      style: { stroke: '#1890ff', lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'month', y: 'value', shape: 'circle' },
      style: { fill: '#1890ff', r: 4 },
    },
  ],
});
```

## 平滑曲线面积图

```javascript
chart.options({
  type: 'area',
  data,
  encode: {
    x: 'month',
    y: 'value',
    shape: 'smooth',    // 平滑插值
  },
  style: { fillOpacity: 0.6 },
});
```

## 时间序列面积图

```javascript
chart.options({
  type: 'area',
  data: [
    { date: new Date('2024-01'), value: 100 },
    { date: new Date('2024-02'), value: 130 },
    { date: new Date('2024-03'), value: 90  },
    { date: new Date('2024-04'), value: 160 },
    { date: new Date('2024-05'), value: 145 },
  ],
  encode: { x: 'date', y: 'value' },
  axis: {
    x: { labelFormatter: 'YYYY-MM' },
  },
});
```

## 常见错误与修正

### 错误 1：在 area mark 上使用 stroke + lineWidth 描边

```javascript
// ❌ 错误：stroke + lineWidth 会包裹整个填充区域（底部、两侧都描边），
// 而不是仅顶部边缘线
chart.options({
  type: 'area',
  data,
  encode: { x: 'date', y: 'value' },
  style: {
    fill: '#FF5924',
    fillOpacity: 0.4,
    stroke: '#FF5924',      // ❌ 描边包裹整个区域
    lineWidth: 2,            // ❌
  },
});

// ✅ 正确：用 view + children 叠加 area（填充）+ line（顶部边缘线）
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'area',
      encode: { x: 'date', y: 'value' },
      style: { fill: '#FF5924', fillOpacity: 0.4 },
    },
    {
      type: 'line',
      encode: { x: 'date', y: 'value' },
      style: { stroke: '#FF5924', lineWidth: 2 },
    },
  ],
});
```

### 错误 2：多系列面积图不加 stackY 导致互相遮挡
```javascript
// ❌ 问题：多系列面积相互覆盖，后面的系列遮挡前面的
chart.options({
  type: 'area',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
  // 没有 stackY，各系列从 y=0 开始叠加，互相遮盖
});

// ✅ 方案 1：堆叠面积图（见 g2-mark-area-stacked）
chart.options({
  type: 'area',
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});

// ✅ 方案 2：改用折线图对比多系列
chart.options({
  type: 'line',
  encode: { x: 'month', y: 'value', color: 'type' },
});
```
