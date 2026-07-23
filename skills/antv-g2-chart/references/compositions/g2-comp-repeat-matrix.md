---
id: "g2-comp-repeat-matrix"
title: "G2 重复矩阵（repeatMatrix）"
description: |
  G2 v5 repeatMatrix 组合类型将同一图表按两个维度字段重复排列成矩阵，
  每个格子共享相同的 Mark 配置，x 轴和 y 轴分别对应一个分类字段，
  适合展示多变量之间的两两关系（散点图矩阵）。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "重复矩阵"
  - "repeatMatrix"
  - "散点图矩阵"
  - "多变量"
  - "分面"
  - "spec"

related:
  - "g2-comp-facet-rect"
  - "g2-mark-point-scatter"
  - "g2-core-view-composition"

use_cases:
  - "多变量两两散点图矩阵"
  - "多维度数据的相关性探索"
  - "对角线展示分布直方图"

difficulty: "advanced"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/matrix"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 800,
});

// 多维度数据（每行是一个样本，多个数值字段）
const data = [
  { sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2, species: 'setosa' },
  { sepalLength: 4.9, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.2, species: 'setosa' },
  { sepalLength: 7.0, sepalWidth: 3.2, petalLength: 4.7, petalWidth: 1.4, species: 'versicolor' },
  { sepalLength: 6.4, sepalWidth: 3.2, petalLength: 4.5, petalWidth: 1.5, species: 'versicolor' },
  { sepalLength: 6.3, sepalWidth: 3.3, petalLength: 6.0, petalWidth: 2.5, species: 'virginica' },
  // ...更多数据
];

chart.options({
  type: 'repeatMatrix',
  data,
  encode: {
    x: ['sepalLength', 'sepalWidth', 'petalLength'],   // 列变量
    y: ['sepalLength', 'sepalWidth', 'petalLength'],   // 行变量
  },
  children: [
    {
      type: 'point',
      encode: { color: 'species' },
      style: { r: 3, fillOpacity: 0.7 },
    },
  ],
});

chart.render();
```

## 完整散点图矩阵（含对角线）

```javascript
chart.options({
  type: 'repeatMatrix',
  data,
  encode: {
    x: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth'],
    y: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth'],
  },
  // 格子间距
  padding: 10,
  children: [
    {
      type: 'point',
      encode: { color: 'species' },
      style: { r: 2.5, fillOpacity: 0.6 },
      legend: { color: { position: 'top' } },
    },
  ],
});
```

## 与 facetRect 的对比

```javascript
// repeatMatrix：x/y encode 均为变量数组，自动排列成 n×n 矩阵
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: ['var1', 'var2', 'var3'],
    y: ['var1', 'var2', 'var3'],
  },
  children: [{ type: 'point', encode: { color: 'category' } }],
});

// facetRect：按单个分类字段的不同值分面（每个值一个格子，排成一行或一列）
chart.options({
  type: 'facetRect',
  encode: { x: 'region' },   // 按 region 的不同值分成多列
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'sales' },
    },
  ],
});
```

## 常见错误与修正

### 错误 1：encode.x/y 写成单个字段而非数组

```javascript
// ❌ 错误：repeatMatrix 的 encode.x/y 必须是字段名数组
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: 'sepalLength',   // ❌ 单个字段名
    y: 'sepalWidth',
  },
});

// ✅ 正确：x/y 都必须是数组
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: ['sepalLength', 'sepalWidth', 'petalLength'],   // ✅ 数组
    y: ['sepalLength', 'sepalWidth', 'petalLength'],
  },
});
```

### 错误 2：将散点图矩阵与普通分面混淆

```javascript
// ❌ 错误：想做散点图矩阵却用了 facetRect
chart.options({
  type: 'facetRect',
  encode: {
    x: ['sepalLength', 'sepalWidth'],   // ❌ facetRect 的 encode.x 只接受单个字段
  },
});

// ✅ 正确：多变量两两比较用 repeatMatrix
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: ['sepalLength', 'sepalWidth'],   // ✅
    y: ['sepalLength', 'sepalWidth'],
  },
  children: [{ type: 'point', encode: { color: 'species' } }],
});
```
