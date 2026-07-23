---
id: "g2-interaction-brush-axis"
title: "G2 轴刷选高亮（brushAxisHighlight）"
description: |
  brushAxisHighlight 在平行坐标系中，对单个轴进行区间刷选，
  高亮满足所有轴选区条件的折线。是平行坐标图最常见的多维过滤交互，
  可在多个轴上同时设置区间，实现多维度联合过滤。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brushAxisHighlight"
  - "轴刷选"
  - "平行坐标"
  - "多维过滤"
  - "interaction"

related:
  - "g2-coord-parallel"
  - "g2-interaction-brush-filter"

use_cases:
  - "平行坐标图中多维联合筛选数据"
  - "在多个轴上分别设置过滤区间"
  - "高维数据的交互式探索"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-axis-highlight"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { name: '产品A', price: 120, sales: 300, rating: 4.5, stock: 80 },
  { name: '产品B', price: 85,  sales: 450, rating: 3.8, stock: 120 },
  { name: '产品C', price: 200, sales: 180, rating: 4.9, stock: 40 },
  { name: '产品D', price: 60,  sales: 600, rating: 3.2, stock: 200 },
  { name: '产品E', price: 150, sales: 220, rating: 4.2, stock: 65 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: {
    position: ['price', 'sales', 'rating', 'stock'],
    color: 'name',
  },
  coordinate: { type: 'parallel' },
  style: { lineWidth: 1.5, strokeOpacity: 0.7 },
  interaction: {
    brushAxisHighlight: true,   // 在每个轴上可拖拽设置过滤区间
  },
});

chart.render();
```

## 与 parallel 坐标系的标准组合

```javascript
chart.options({
  type: 'line',
  data: carData,
  encode: {
    position: ['mpg', 'cylinders', 'displacement', 'horsepower', 'weight', 'acceleration'],
    color: 'origin',
  },
  coordinate: { type: 'parallel' },
  style: { lineWidth: 1, strokeOpacity: 0.5 },
  interaction: {
    brushAxisHighlight: {
      // 未被选中的线条的样式
      unhighlightedOpacity: 0.1,
    },
  },
  legend: { color: { position: 'top' } },
});
```

## 常见错误与修正

### 错误：在非平行坐标系图表上使用 brushAxisHighlight
```javascript
// ❌ brushAxisHighlight 专门为平行坐标系设计
chart.options({
  type: 'line',
  encode: { x: 'date', y: 'value' },   // 普通折线图
  coordinate: { type: 'cartesian' },
  interaction: { brushAxisHighlight: true },  // ❌ 普通图表没有"轴"可以刷选
});

// ✅ 应使用普通的 brushHighlight 或 brushFilter
chart.options({
  interaction: { brushHighlight: true },  // ✅ 普通矩形刷选
});

// ✅ 平行坐标图才用 brushAxisHighlight
chart.options({
  coordinate: { type: 'parallel' },
  interaction: { brushAxisHighlight: true },  // ✅
});
```
