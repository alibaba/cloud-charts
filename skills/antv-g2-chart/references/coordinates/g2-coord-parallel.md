---
id: "g2-coord-parallel"
title: "G2 平行坐标系（parallel）"
description: |
  平行坐标系将多个维度排列为平行的竖轴，每条折线代表一条数据记录，
  用于发现多维数据中的模式、聚类和异常值。
  需要配合 line mark 使用，encode 中用 position 通道绑定多个字段。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "parallel"
  - "平行坐标"
  - "parallel coordinates"
  - "多维"
  - "高维数据"
  - "coordinate"

related:
  - "g2-mark-line-basic"
  - "g2-coord-transpose"

use_cases:
  - "多维度数据对比分析（如汽车性能多指标）"
  - "发现高维数据中的聚类和关联"
  - "异常值检测"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/parallel"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { name: '产品A', price: 120, sales: 300, rating: 4.5, stock: 80 },
  { name: '产品B', price: 85,  sales: 450, rating: 3.8, stock: 120 },
  { name: '产品C', price: 200, sales: 180, rating: 4.9, stock: 40 },
  { name: '产品D', price: 60,  sales: 600, rating: 3.2, stock: 200 },
];

const chart = new Chart({ container: 'container', width: 600, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: {
    position: ['price', 'sales', 'rating', 'stock'],  // 多维字段列表
  },
  coordinate: { type: 'parallel' },  // 平行坐标系
  style: {
    lineWidth: 1.5,
    strokeOpacity: 0.7,
  },
  legend: { color: { position: 'right' } },
});

chart.render();
```

## 带交互高亮的平行坐标

```javascript
chart.options({
  type: 'line',
  data,
  encode: {
    position: ['cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'miles_per_gallon'],
    color: 'origin',
  },
  coordinate: { type: 'parallel' },
  style: { lineWidth: 1, strokeOpacity: 0.5 },
  interaction: {
    elementHighlight: { background: true },  // 悬停高亮
  },
  axis: {
    // 为每个维度单独配置标题
    position0: { title: '气缸数' },
    position1: { title: '排量' },
    position2: { title: '马力' },
  },
});
```

## 常见错误与修正

### 错误 1：用 x/y encode 替代 position
```javascript
// ❌ 错误：平行坐标不使用 x/y，必须用 position 通道
chart.options({
  type: 'line',
  encode: {
    x: 'price',      // ❌
    y: 'sales',      // ❌ 只有两个维度，不是平行坐标
  },
  coordinate: { type: 'parallel' },
});

// ✅ 正确：position 通道传入字段数组
chart.options({
  type: 'line',
  encode: {
    position: ['price', 'sales', 'rating'],  // ✅ 数组形式
  },
  coordinate: { type: 'parallel' },
});
```

### 错误 2：在平行坐标中使用 interval 或 point mark
```javascript
// ❌ 错误：平行坐标系只适合 line mark
chart.options({
  type: 'interval',  // ❌ 在平行坐标中没有意义
  coordinate: { type: 'parallel' },
});

// ✅ 正确：配合 line mark
chart.options({
  type: 'line',      // ✅
  coordinate: { type: 'parallel' },
});
```
