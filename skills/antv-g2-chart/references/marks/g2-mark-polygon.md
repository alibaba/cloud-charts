---
id: "g2-mark-polygon"
title: "G2 多边形图（polygon）"
description: |
  polygon mark 根据多个 x/y 通道坐标绘制任意多边形，
  每条记录对应一个多边形，坐标点通过 x、x1、x2...和 y、y1、y2...通道传入。
  常用于地图区域着色、Voronoi 图等自定义形状场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "polygon"
  - "多边形"
  - "Voronoi"
  - "地图"
  - "自定义形状"

related:
  - "g2-mark-image"
  - "g2-mark-path"

use_cases:
  - "Voronoi 图（自然邻域分区）"
  - "自定义形状的区域着色"
  - "地理区域多边形着色（非标准地图）"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#polygon"
---

## 最小可运行示例（Voronoi 图）

```javascript
import { Chart } from '@antv/g2';
import { Delaunay } from 'd3-delaunay';

// 随机生成点，计算 Voronoi 分区
const points = Array.from({ length: 30 }, () => [
  Math.random() * 600,
  Math.random() * 400,
]);

const delaunay = Delaunay.from(points);
const voronoi = delaunay.voronoi([0, 0, 600, 400]);

// 将 Voronoi 多边形转换为 G2 数据格式
const polygonData = Array.from({ length: points.length }, (_, i) => {
  const cell = voronoi.cellPolygon(i);
  if (!cell) return null;
  return {
    x: cell.map(([px]) => px),
    y: cell.map(([, py]) => py),
    index: i,
  };
}).filter(Boolean);

const chart = new Chart({ container: 'container', width: 600, height: 400 });

chart.options({
  type: 'polygon',
  data: polygonData,
  encode: {
    x: 'x',    // 多边形各顶点的 x 坐标数组
    y: 'y',    // 多边形各顶点的 y 坐标数组
    color: 'index',
  },
  scale: {
    x: { domain: [0, 600] },   // 指定坐标范围（type 默认为 linear）
    y: { domain: [0, 400] },
    color: { type: 'ordinal' },
  },
  style: {
    fillOpacity: 0.6,
    stroke: '#fff',
    lineWidth: 1,
  },
  axis: false,
  legend: false,
});

chart.render();
```

## 数据格式说明

```javascript
// polygon mark 的数据格式：每条记录的 x/y 字段是数组（多边形顶点序列）
const data = [
  {
    x: [10, 50, 90, 10],   // 多边形顶点 x 坐标（按顺序，首尾自动闭合）
    y: [10, 80, 10, 10],   // 多边形顶点 y 坐标
    category: 'A',
  },
  {
    x: [100, 150, 200],    // 三角形
    y: [20, 100, 20],
    category: 'B',
  },
];

chart.options({
  type: 'polygon',
  data,
  encode: { x: 'x', y: 'y', color: 'category' },
});
```

## 常见错误与修正

### 错误：x/y 传入单个数值而不是数组
```javascript
// ❌ 错误：polygon 的 x/y 必须是坐标数组，不是单个值
chart.options({
  type: 'polygon',
  data: [{ x: 100, y: 200, ... }],  // ❌ x/y 是单值，只是一个点
  encode: { x: 'x', y: 'y' },
});

// ✅ 正确：x/y 是坐标数组
chart.options({
  type: 'polygon',
  data: [{ x: [10, 50, 90], y: [10, 80, 10], ... }],  // ✅ 数组
  encode: { x: 'x', y: 'y' },
});
```
