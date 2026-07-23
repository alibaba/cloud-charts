---
id: "g2-mark-mosaic"
title: "G2 马赛克图（mosaic）"
description: |
  马赛克图（Mosaic Plot / Marimekko Chart）有两种形式：
  1. 均匀马赛克图：type: 'cell'，用颜色和大小展示二维分类数据分布；
  2. 非均匀马赛克图：type: 'interval' + flexX/stackY/normalizeY transform，
     矩形宽度代表类别规模，高度代表内部分布比例；
  3. 密度马赛克图：type: 'rect' + bin transform，展示二维连续数据的分布密度。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "马赛克图"
  - "mosaic"
  - "marimekko"
  - "cell"
  - "flexX"
  - "bin"
  - "热力图"

related:
  - "g2-mark-cell-heatmap"
  - "g2-mark-interval-stacked"

use_cases:
  - "二维分类数据分布（均匀马赛克图）"
  - "市场细分分析（非均匀马赛克图）"
  - "二维连续数据密度分析（密度马赛克图）"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/mosaic"
---

## 核心概念

马赛克图有三种实现方式：

| 类型 | mark | 特点 |
|------|------|------|
| 均匀马赛克图 | `cell` | 坐标轴均匀分布，用颜色/大小编码第三维 |
| 非均匀马赛克图 | `interval` + flexX | X 轴宽度按数据比例分配 |
| 密度马赛克图 | `rect` + bin | 连续数据分箱后展示密度 |

## 均匀马赛克图（cell）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 400,
});

chart.options({
  type: 'cell',
   [
    { product: '手机', region: '华北', sales: 120, category: '高端' },
    { product: '手机', region: '华东', sales: 180, category: '高端' },
    { product: '手机', region: '华南', sales: 150, category: '高端' },
    { product: '电脑', region: '华北', sales: 80, category: '中端' },
    { product: '电脑', region: '华东', sales: 110, category: '中端' },
    { product: '电脑', region: '华南', sales: 95, category: '中端' },
    { product: '平板', region: '华北', sales: 60, category: '中端' },
    { product: '平板', region: '华东', sales: 85, category: '中端' },
    { product: '平板', region: '华南', sales: 70, category: '低端' },
    { product: '耳机', region: '华北', sales: 40, category: '低端' },
    { product: '耳机', region: '华东', sales: 55, category: '低端' },
    { product: '耳机', region: '华南', sales: 45, category: '低端' },
  ],
  encode: {
    x: 'product',
    y: 'region',
    color: 'category',
    size: 'sales',      // 用格子大小编码数值
  },
  scale: {
    color: { palette: 'category10', type: 'ordinal' },
    size: { type: 'linear', range: [0.3, 1] },
  },
  style: {
    stroke: '#fff',
    lineWidth: 2,
    inset: 2,
  },
});

chart.render();
```

## 非均匀马赛克图（Marimekko Chart）

矩形宽度按 X 轴字段的总量比例分配，展示市场份额类数据：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 900,
  height: 600,
  paddingLeft: 0,
  paddingRight: 0,
});

chart.options({
  type: 'interval',
  data: {
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/bmw-prod/3041da62-1bf4-4849-aac3-01a387544bf4.csv',
  },
  transform: [
    { type: 'flexX', reducer: 'sum' },  // X轴宽度按 sum 比例分配
    { type: 'stackY' },                  // Y轴堆叠
    { type: 'normalizeY' },              // Y轴归一化到 0-1
  ],
  encode: {
    x: 'market',
    y: 'value',
    color: 'segment',
  },
  axis: {
    y: false,
  },
  scale: {
    x: { paddingOuter: 0, paddingInner: 0.01 },
  },
  tooltip: 'value',
  labels: [
    {
      text: 'segment',
      x: 5,
      y: 5,
      textAlign: 'start',
      textBaseline: 'top',
      fontSize: 10,
      fill: '#fff',
    },
  ],
});

chart.render();
```

## 密度马赛克图（bin transform）

适合展示两个连续字段的分布密度关系：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'rect',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/movies.json',
  },
  encode: {
    x: 'IMDB Rating',
    y: 'Rotten Tomatoes Rating',
  },
  transform: [
    { type: 'bin', color: 'count', thresholdsX: 30, thresholdsY: 20 },
  ],
  scale: {
    color: { palette: 'ylGnBu' },
  },
});

chart.render();
```

## 常见错误与修正

### 错误 1：非均匀马赛克图缺少 flexX transform

```javascript
// ❌ 错误：没有 flexX，X 轴宽度均等，不是真正的马赛克图
chart.options({
  type: 'interval',
  data,
  transform: [
    { type: 'stackY' },
    { type: 'normalizeY' },
    // ❌ 缺少 flexX
  ],
  encode: { x: 'market', y: 'value', color: 'segment' },
});

// ✅ 正确：三个 transform 必须同时使用
chart.options({
  type: 'interval',
  data,
  transform: [
    { type: 'flexX', reducer: 'sum' },  // ✅ X轴宽度按比例
    { type: 'stackY' },
    { type: 'normalizeY' },
  ],
  encode: { x: 'market', y: 'value', color: 'segment' },
});
```

### 错误 2：均匀马赛克图使用 interval 而非 cell

```javascript
// ❌ 问题：interval 在均匀网格场景下不如 cell 直观
chart.options({
  type: 'interval',   // ❌ 均匀格子应用 cell
  data,
  encode: { x: 'product', y: 'region', color: 'category' },
});

// ✅ 正确：均匀二维分类用 cell
chart.options({
  type: 'cell',  // ✅
  data,
  encode: { x: 'product', y: 'region', color: 'category' },
});
```

### 错误 3：密度马赛克图用 cell/interval 而非 rect

```javascript
// ❌ 错误：连续数据分箱应用 rect + bin transform
chart.options({
  type: 'cell',   // ❌ cell 适合离散数据
  data,
  encode: { x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' },
});

// ✅ 正确：连续数据分箱用 rect
chart.options({
  type: 'rect',  // ✅
  data,
  encode: { x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' },
  transform: [{ type: 'bin', color: 'count' }],
});
```

## 三种马赛克图对比

| 类型 | 数据类型 | mark | 核心 transform |
|------|---------|------|---------------|
| 均匀马赛克图 | 二维离散 | `cell` | 无 |
| 非均匀马赛克图 | 多维分类+数值 | `interval` | `flexX + stackY + normalizeY` |
| 密度马赛克图 | 二维连续 | `rect` | `bin` |
