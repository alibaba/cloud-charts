---
id: "g2-mark-point-scatter"
title: "G2 散点图（Point Mark）"
description: |
  使用 Point Mark 创建散点图，通过 x/y 位置展示两个数值变量的相关性。
  本文采用 Spec 模式（chart.options({})），支持气泡图（size 通道）、分类着色、自定义形状等变体。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "point"
tags:
  - "散点图"
  - "气泡图"
  - "Point"
  - "scatter"
  - "bubble"
  - "相关性"
  - "分布"
  - "spec"

related:
  - "g2-core-encode-channel"
  - "g2-scale-linear"
  - "g2-interaction-tooltip"

use_cases:
  - "展示两个连续变量的相关性"
  - "发现数据分布和异常值"
  - "用气泡图展示三维数据（x/y/size）"

anti_patterns:
  - "数据点超过 10000 个时性能较差，考虑使用密度图"
  - "两轴都是分类变量时，散点图意义不大"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/point/scatter"
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
  type: 'point',
  data: [
    { x: 10, y: 30, category: 'A' },
    { x: 20, y: 50, category: 'B' },
    { x: 30, y: 20, category: 'A' },
    { x: 40, y: 80, category: 'B' },
    { x: 50, y: 40, category: 'A' },
    { x: 60, y: 65, category: 'B' },
  ],
  encode: {
    x: 'x',
    y: 'y',
    color: 'category',
  },
});

chart.render();
```

## 气泡图（三维数据）

气泡图样式要点：不要使用白色描边（浅色主题下像错误图表），推荐径向渐变 + 阴影 + 较高 fillOpacity；
size 比例尺推荐使用 sqrt 类型，合理设置 size.range（建议 [4, 40]），隐藏 size 图例，
坐标轴使用虚线网格，标签用 overlapDodgeY 防重叠。

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 500 });

const data1990 = [
  { income: 28604, life: 77,    population: 17096869, country: 'Australia' },
  { income: 31163, life: 77.4,  population: 27662440, country: 'Canada' },
  { income: 1516,  life: 68,    population: 1154605773, country: 'China' },
  { income: 29476, life: 77.1,  population: 56943299, country: 'France' },
  { income: 29550, life: 79.1,  population: 122249285, country: 'Japan' },
  { income: 37062, life: 75.4,  population: 252847810, country: 'United States' },
];

const data2015 = [
  { income: 44056, life: 81.8,  population: 23968973, country: 'Australia' },
  { income: 43294, life: 81.7,  population: 35939927, country: 'Canada' },
  { income: 13334, life: 76.9,  population: 1376048943, country: 'China' },
  { income: 37599, life: 81.9,  population: 64395345, country: 'France' },
  { income: 36162, life: 83.5,  population: 126573481, country: 'Japan' },
  { income: 53354, life: 79.1,  population: 321773631, country: 'United States' },
];

const allData = [
  ...data1990.map(d => ({ ...d, year: '1990' })),
  ...data2015.map(d => ({ ...d, year: '2015' })),
];

// 颜色映射表：scale.color.range 和 fill 回调共用
const COLOR_MAP = { '1990': '#fb7678', '2015': '#81e7ee' };

chart.options({
  type: 'point',
  data: allData,
  encode: {
    x: 'income',
    y: 'life',
    size: 'population',    // 气泡大小 = 第三个维度
    color: 'year',
    shape: 'point',
  },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },    // sqrt 比例尺 + 合适的气泡范围
    color: { domain: ['1990', '2015'], range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,
    lineWidth: 0,
    // 径向渐变 + 阴影：模拟 3D 球体质感
    // 通过 COLOR_MAP[datum.year] 获取颜色，与 scale.color.range 保持一致
    fill: (datum) => {
      const color = COLOR_MAP[datum.year];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },
  legend: { size: false },    // size 图例意义不大，建议隐藏
  labels: [
    { text: 'country', fontSize: 12, fontWeight: 700, fill: '#2D3748', dy: 10,
      transform: [{ type: 'overlapDodgeY' }] },
  ],
  axis: {
    x: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
    y: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
  },
  tooltip: {
    title: (d) => `${d.country} (${d.year})`,
    items: [
      { field: 'income',     name: '人均收入' },
      { field: 'life',       name: '预期寿命' },
      { field: 'population', name: '人口', valueFormatter: (v) => `${(v / 1e6).toFixed(1)}M` },
    ],
  },
});

chart.render();
```

> 气泡图完整样式指南（含径向渐变、阴影等）见 [气泡图文档](g2-mark-point-bubble.md)。

## 自定义点形状

```javascript
chart.options({
  type: 'point',
  data: [...],
  encode: {
    x: 'x',
    y: 'y',
    color: 'type',
    shape: 'type',    // 将 type 字段映射到形状通道
  },
  scale: {
    shape: {
      range: ['circle', 'square', 'triangle', 'diamond'],
    },
  },
});
```

## 散点图 + 趋势线

```javascript
// 用 type: 'view' + children 叠加散点和回归趋势线
chart.options({
  type: 'view',
  data: [...],
  children: [
    {
      type: 'point',
      encode: { x: 'x', y: 'y' },
    },
    {
      type: 'line',
      encode: { x: 'x', y: 'y' },
      transform: [{ type: 'regression' }],
      style: { stroke: '#f00', lineWidth: 1.5 },
    },
  ],
});
```

## 常见错误与修正

### 错误 1：大数据量性能问题
```javascript
// ❌ 注意：十万个点会导致渲染缓慢
chart.options({ type: 'point', data: hugeDataWith100000Points, encode: { x: 'x', y: 'y' } });

// ✅ 优化方案 1：先在数据层面采样
chart.options({ type: 'point',  sampledData, encode: { x: 'x', y: 'y' } });

// ✅ 优化方案 2：改用密度图展示分布
chart.options({ type: 'density',  [...], encode: { x: 'x', y: 'y' } });
```

### 错误 2：size 通道使用字符串常量
```javascript
// ❌ 误解：size 传字符串会被当作字段名
chart.options({ type: 'point', encode: { size: '10' } });  // 寻找名为 '10' 的字段

// ✅ 正确：固定大小用数字，数据映射用字段名字符串
chart.options({ type: 'point', encode: { size: 10 } });           // 固定大小 10
chart.options({ type: 'point', encode: { size: 'population' } }); // 映射字段
```
