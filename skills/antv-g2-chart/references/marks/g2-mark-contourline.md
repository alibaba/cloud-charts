---
id: "g2-mark-contourline"
title: "G2 等高线图（contour line）"
description: |
  等高线图通过 type: 'cell' 或 type: 'line' 实现，
  用颜色渐变网格或线条展示二维平面上的连续数据分布（如地形高程、温度分布）。
  G2 无内置等高线算法，通常用 cell + sequential 色阶模拟等高线效果。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "等高线图"
  - "contour"
  - "地形图"
  - "热力图"
  - "连续数据"
  - "二维分布"

related:
  - "g2-mark-cell-heatmap"
  - "g2-mark-point-scatter"

use_cases:
  - "地形海拔可视化"
  - "气象数据分布（温度、气压）"
  - "二维连续数据的空间分布"

anti_patterns:
  - "离散分类数据不适合等高线图"
  - "时间序列数据不适合"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/contourline"
---

## 核心概念

G2 中等高线图有两种实现方式：

1. **网格色块模拟等高线**：`type: 'cell'` + `sequential` 色阶，颜色深浅代表数值高低
2. **等高线轮廓**：`type: 'line'` + 按数值级别分组，绘制闭合等值线

**网格密度越高，等高线效果越细腻**（需要数据覆盖均匀的网格点）

## 网格色块模拟等高线（最常用）

```javascript
import { Chart } from '@antv/g2';

// 生成地形数据
const terrainData = [];
for (let x = 0; x <= 50; x += 2) {
  for (let y = 0; y <= 50; y += 2) {
    const elevation1 = 100 * Math.exp(-((x - 15) ** 2 + (y - 15) ** 2) / 200);
    const elevation2 = 80 * Math.exp(-((x - 35) ** 2 + (y - 35) ** 2) / 150);
    const elevation = elevation1 + elevation2 + 10;
    terrainData.push({ x, y, elevation });
  }
}

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'cell',
  data: terrainData,
  encode: {
    x: 'x',
    y: 'y',
    color: 'elevation',
  },
  style: {
    stroke: '#333',
    lineWidth: 0.5,
    inset: 0.5,
  },
  scale: {
    color: {
      palette: 'viridis',
      type: 'sequential',
    },
  },
  legend: {
    color: {
      length: 300,
      layout: { justifyContent: 'center' },
      labelFormatter: (value) => `${Math.round(value)}m`,
    },
  },
  tooltip: {
    title: '海拔信息',
    items: [
      { field: 'x', name: '经度' },
      { field: 'y', name: '纬度' },
      {
        field: 'elevation',
        name: '海拔',
        valueFormatter: (value) => `${Math.round(value)}m`,
      },
    ],
  },
});

chart.render();
```

## 等高线轮廓（折线实现）

按数值级别预处理数据，每条线绘制一个等值级别：

```javascript
import { Chart } from '@antv/g2';

// 预先计算各等高线级别的点
const generateContourLines = () => {
  const lines = [];
  const levels = [20, 40, 60, 80, 100];

  levels.forEach((level, index) => {
    for (let angle = 0; angle <= 360; angle += 5) {
      const radian = (angle * Math.PI) / 180;
      const baseRadius = 5 + index * 4;
      const radius = baseRadius + Math.sin((angle * Math.PI) / 45) * 2;
      lines.push({
        x: 25 + radius * Math.cos(radian),
        y: 25 + radius * Math.sin(radian),
        level,
        lineId: `line_${level}`,
      });
    }
  });
  return lines;
};

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'line',
  data: generateContourLines(),
  encode: {
    x: 'x',
    y: 'y',
    color: 'level',
    series: 'lineId',   // 每条等高线独立成一个系列
  },
  style: {
    lineWidth: 2,
    strokeOpacity: 0.8,
  },
  scale: {
    color: {
      type: 'sequential',
      palette: 'oranges',
    },
  },
  axis: {
    x: { title: '距离 (km)' },
    y: { title: '距离 (km)' },
  },
  legend: {
    color: { title: '海拔高度 (m)' },
  },
});

chart.render();
```

## 常见错误与修正

### 错误 1：data 关键字缺失

```javascript
// ❌ 错误：data 关键字必须写明
chart.options({
  type: 'cell',
  terrainData,   // ❌ 孤立对象字面量，缺少 data: 键
  encode: { x: 'x', y: 'y', color: 'elevation' },
});

// ✅ 正确
chart.options({
  type: 'cell',
  data: terrainData,
  encode: { x: 'x', y: 'y', color: 'elevation' },
});
```

### 错误 2：等高线轮廓缺少 series 分组

```javascript
// ❌ 错误：没有 series，所有等高线点连成一条线
chart.options({
  type: 'line',
  data,
  encode: {
    x: 'x',
    y: 'y',
    color: 'level',
    // ❌ 缺少 series: 'lineId'
  },
});

// ✅ 正确：每条等高线用 series 独立分组
chart.options({
  type: 'line',
  data,
  encode: {
    x: 'x',
    y: 'y',
    color: 'level',
    series: 'lineId',  // ✅ 确保每条线独立绘制
  },
});
```

### 错误 3：色阶类型不匹配

```javascript
// ❌ 错误：连续数据用 ordinal 色阶，颜色过少
scale: { color: { type: 'ordinal' } }  // ❌ 适合离散类别

// ✅ 正确：连续数据用 sequential 色阶
scale: { color: { type: 'sequential', palette: 'viridis' } }  // ✅
```

## cell 等高线与 heatmap 的区别

| 特性 | 等高线 cell | 热力图 heatmap |
|------|------------|--------------|
| 坐标 | 二维均匀网格（x, y 均离散） | 二维均匀网格 |
| 颜色 | sequential 连续渐变 | 通常 sequential |
| 用途 | 地形、连续场分布 | 频率、密度可视化 |
| 数据 | 三维（x, y, z） | 通常频次聚合 |
