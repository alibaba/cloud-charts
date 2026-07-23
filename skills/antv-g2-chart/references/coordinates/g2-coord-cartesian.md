---
id: "g2-coord-cartesian"
title: "G2 直角坐标系（cartesian）"
description: |
  cartesian（直角坐标系）是 G2 v5 的默认坐标系，x 和 y 通道分别映射为水平和垂直位置。
  大多数常见图表（柱状图、折线图、散点图）均使用直角坐标系。
  通过 coordinate.transform 可以为直角坐标系添加转置（transpose）等变换。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "cartesian"
  - "直角坐标系"
  - "默认坐标系"
  - "coordinate"
  - "笛卡尔坐标"

related:
  - "g2-coord-transpose"
  - "g2-coord-polar"
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"

use_cases:
  - "柱状图（默认直角坐标）"
  - "折线图（默认直角坐标）"
  - "条形图（直角坐标 + 转置）"
  - "散点图（直角坐标）"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/cartesian"
---

## 核心概念

直角坐标系是 G2 的**默认坐标系**，无需显式配置 `coordinate` 字段。

- x 通道 → 水平位置（从左到右）
- y 通道 → 垂直位置（从下到上）
- 支持通过 `coordinate.transform` 添加转置等变换

## 默认使用（无需配置）

```javascript
import { Chart } from '@antv/g2';

// 直角坐标系是默认值，不需要写 coordinate 配置
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
  ],
  encode: { x: 'genre', y: 'sold' },
  // 无需 coordinate 配置，默认即为直角坐标系
});

chart.render();
```

## 显式指定（与默认等效）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  coordinate: { type: 'cartesian' },  // 显式指定（与不写等效）
});
```

## 直角坐标系 + 转置（条形图）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  coordinate: {
    type: 'cartesian',
    transform: [{ type: 'transpose' }],  // 转置：x/y 互换，柱状图变条形图
  },
});
```

## 坐标系配置项

```javascript
chart.options({
  coordinate: {
    type: 'cartesian',
    transform: [
      { type: 'transpose' },         // 转置（x↔y 互换）
      { type: 'reflect', x: true },  // X 轴镜像翻转
      { type: 'reflect', y: true },  // Y 轴镜像翻转
      { type: 'scale', sx: 1, sy: -1 },  // 自定义缩放
    ],
  },
});
```

## 常见错误与修正

### 错误：配置了 cartesian 坐标系但期望得到环形图
```javascript
// ❌ 错误：饼图/环形图需要 theta 坐标系，不是 cartesian
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'cartesian' },  // ❌ 这样会画出普通柱状图
});

// ✅ 饼图/环形图使用 theta 坐标系
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8, innerRadius: 0.5 },  // ✅
});
```
