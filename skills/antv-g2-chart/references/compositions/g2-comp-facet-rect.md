---
id: "g2-comp-facet-rect"
title: "G2 矩形分面（facetRect）"
description: |
  facetRect 将数据按分类字段拆分，在网格布局中为每个分类绘制一个独立的子图表。
  适合对比不同分组的数据分布和趋势。通过 type: 'facetRect' + encode.x/y 指定分面维度。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "facetRect"
  - "分面"
  - "facet"
  - "小多图"
  - "trellis"
  - "网格布局"
  - "spec"

related:
  - "g2-core-view-composition"
  - "g2-mark-interval-basic"
  - "g2-mark-point-scatter"

use_cases:
  - "对比不同类别的数据分布"
  - "多维度时间序列对比"
  - "按地区/产品/部门分面展示"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/facet-rect"
---

## 基本概念

```
chart.options({
  type: 'facetRect',
  encode: {
    x: '分面列字段',      // 按此字段将数据分为多列
    y: '分面行字段',      // 按此字段将数据分为多行（可选）
  },
  children: [
    { type: '子图 Mark', ... },    // 每个子图的配置（共用，数据自动过滤）
  ],
});
```

**关键规则**：
- `encode.x` → 按该字段的唯一值拆分为多列（列分面）
- `encode.y` → 按该字段的唯一值拆分为多行（行分面）
- `children` 中的 Mark 会自动接收过滤后的数据

## 单维度列分面（按类别分列）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 300,
});

const data = [
  { month: 'Jan', value: 33, region: '华东' },
  { month: 'Feb', value: 78, region: '华东' },
  { month: 'Mar', value: 56, region: '华东' },
  { month: 'Jan', value: 45, region: '华南' },
  { month: 'Feb', value: 62, region: '华南' },
  { month: 'Mar', value: 71, region: '华南' },
  { month: 'Jan', value: 28, region: '华北' },
  { month: 'Feb', value: 39, region: '华北' },
  { month: 'Mar', value: 53, region: '华北' },
];

chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'region' },     // 按 region 列分面（3 列）
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
      style: { fill: '#1890ff' },
    },
  ],
});

chart.render();
```

## 二维分面（行 + 列）

```javascript
const data = [
  { quarter: 'Q1', value: 100, region: '华东', type: '线上' },
  { quarter: 'Q2', value: 130, region: '华东', type: '线上' },
  { quarter: 'Q1', value: 80,  region: '华南', type: '线上' },
  { quarter: 'Q2', value: 95,  region: '华南', type: '线上' },
  { quarter: 'Q1', value: 60,  region: '华东', type: '线下' },
  { quarter: 'Q2', value: 85,  region: '华东', type: '线下' },
  { quarter: 'Q1', value: 40,  region: '华南', type: '线下' },
  { quarter: 'Q2', value: 55,  region: '华南', type: '线下' },
];

chart.options({
  type: 'facetRect',
  data,
  encode: {
    x: 'region',   // 列：华东/华南
    y: 'type',     // 行：线上/线下
  },
  children: [
    {
      type: 'interval',
      encode: { x: 'quarter', y: 'value' },
    },
  ],
});
```

## 分面折线图（多系列趋势对比）

```javascript
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'product' },          // 按产品分面
  children: [
    {
      type: 'view',
      children: [
        {
          type: 'area',
          encode: { x: 'month', y: 'sales' },
          style: { fill: '#1890ff', fillOpacity: 0.15 },
        },
        {
          type: 'line',
          encode: { x: 'month', y: 'sales' },
          style: { stroke: '#1890ff', lineWidth: 2 },
        },
      ],
    },
  ],
});
```

## 配置分面标题样式

```javascript
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'region' },
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
    },
  ],
  // 分面标题配置（通过 frame 字段）
  frame: false,                        // 是否显示边框
  // 标题通过 facetRect 的 title 配置
  title: {
    position: 'top',                   // 标题在顶部
    style: { fontSize: 13, fill: '#333', fontWeight: 'bold' },
  },
});
```

## 共享坐标轴（shareData）

```javascript
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'category' },
  shareData: true,          // 共享数据范围（坐标轴刻度一致）
  children: [
    {
      type: 'point',
      encode: { x: 'x', y: 'y', color: 'category' },
    },
  ],
});
```

## 常见错误与修正

### 错误：facetRect 的 children 中写了 data
```javascript
// ❌ 错误：不应在子 Mark 中再指定 data，否则分面过滤不生效
chart.options({
  type: 'facetRect',
  data: allData,
  encode: { x: 'region' },
  children: [
    {
      type: 'interval',
       allData,            // ❌ 会导致每个分面显示全量数据
      encode: { x: 'month', y: 'value' },
    },
  ],
});

// ✅ 正确：子 Mark 不指定 data，自动接收分面过滤后的数据
chart.options({
  type: 'facetRect',
  data: allData,
  encode: { x: 'region' },
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },   // 不写 data，继承并自动过滤
    },
  ],
});
```

### 错误：encode 字段与数据字段名不匹配
```javascript
// ❌ 错误：encode.x 指定的分面字段在数据中不存在
chart.options({
  type: 'facetRect',
  data: [{ month: 'Jan', value: 33, area: '华东' }],
  encode: { x: 'region' },   // ❌ 数据中是 'area'，不是 'region'
});

// ✅ 正确：字段名与数据保持一致
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'area' },     // ✅ 与数据字段名一致
});
```
