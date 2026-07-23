---
id: "g2-scale-band"
title: "G2 Band 分类比例尺"
description: |
  Band Scale 是 G2 中用于分类 x 轴（柱状图等）的比例尺，
  将离散分类值映射到等宽区间（band），支持配置内外间距。
  当 encode.x 映射字符串/分类字段时自动使用。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "band"
  - "分类比例尺"
  - "柱状图"
  - "padding"
  - "scale"
  - "ordinal"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-grouped"
  - "g2-comp-axis-config"

use_cases:
  - "配置柱状图的柱体宽度和间距"
  - "指定分类轴的显示顺序"
  - "控制分类数据的对齐方式"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/band"
---

## 自动识别

当 encode.x 映射字符串类型字段时，G2 自动使用 Band Scale，通常无需显式配置：

```javascript
chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
  ],
  encode: { x: 'genre', y: 'sold' },   // 'genre' 是字符串，自动使用 Band Scale
});
```

## 配置柱体宽度（padding）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  scale: {
    x: {
      type: 'band',
      padding: 0.3,         // 柱体内间距（0-1），默认 0.1
      // paddingInner: 0.3, // 同 padding
      // paddingOuter: 0.2, // 两端外间距
    },
  },
});
```

## 自定义分类顺序

```javascript
// 指定分类显示顺序（不按数据顺序）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  scale: {
    x: {
      type: 'band',
      domain: ['Action', 'Shooter', 'Sports', 'Strategy', 'Other'],  // 显式指定顺序
    },
  },
});
```

## 热力图（cell mark）

`cell` mark 同样依赖 bandwidth，离散的 x/y 轴应使用 `band`（或省略让 G2 自动推断）。**不要用 `point` 比例尺**——point 的 bandwidth=0，格子会不可见。

```javascript
chart.options({
  type: 'cell',
  data: heatmapData,
  encode: { x: 'date', y: 'month', color: 'value' },
  // ✅ 省略 x/y scale，G2 自动为 cell 使用 band
  scale: {
    color: { type: 'sequential', palette: 'blues' },
  },
});

// ✅ 也可以显式写 band
scale: {
  x: { type: 'band' },
  y: { type: 'band' },
  color: { type: 'sequential', palette: 'blues' },
}

// ❌ 不要用 point：bandwidth=0，格子消失
scale: {
  x: { type: 'point' },  // ❌
  y: { type: 'point' },  // ❌
}
```

## 常见错误与修正

### 错误：padding 超出 [0, 1] 范围
```javascript
// ❌ 错误：padding > 1，柱体宽度变为负值
chart.options({ scale: { x: { padding: 1.5 } } });

// ✅ 正确：padding 在 0-1 之间，0 = 无间距，0.5 = 柱宽与间距各占一半
chart.options({ scale: { x: { padding: 0.3 } } });
```
