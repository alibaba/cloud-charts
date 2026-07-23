---
id: "g2-mark-point-bubble"
title: "G2 气泡图（bubble chart）"
description: |
  气泡图是散点图的扩展，用第三个通道 size（气泡大小）编码额外的数值维度。
  通过 encode.size 绑定数值字段，G2 自动将数值映射为圆的面积（而非半径）。
  适合同时展示三个数值维度的关系。
  
  样式要点：
  1. 不要使用白色描边（stroke: '#fff'），浅色主题下会显得像错误图表；
  2. 推荐径向渐变填充（radial-gradient）+ 阴影（shadow），模拟 3D 球体质感；
  3. 定义颜色映射表 COLOR_MAP，scale.color.range 和 fill 回调共用，保持一致；
  4. size 比例尺推荐使用 sqrt 类型，确保气泡面积与数值成正比；
  5. 合理设置 size.range（建议 [4, 40] 区间），避免极端大小差异；
  6. 坐标轴使用虚线网格（gridLineDash），背景更清爽。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "气泡图"
  - "bubble"
  - "散点图"
  - "point"
  - "三维度"
  - "size"

related:
  - "g2-mark-point-scatter"
  - "g2-scale-linear"
  - "g2-scale-pow-sqrt"

use_cases:
  - "三维度数据关系（如 GDP、人口、预期寿命）"
  - "用气泡大小表达第三个指标"
  - "对比矩阵中的强度展示"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#bubble"
---

## 最小可运行示例

经典气泡图设计：径向渐变填充 + 阴影 + sqrt 比例尺 + 虚线网格 + 双系列对比。

```javascript
import { Chart } from '@antv/g2';

// 数据：GDP、预期寿命、人口、国家、年份
const data1990 = [
  { income: 28604, life: 77,    population: 17096869, country: 'Australia' },
  { income: 31163, life: 77.4,  population: 27662440, country: 'Canada' },
  { income: 1516,  life: 68,    population: 1154605773, country: 'China' },
  { income: 13670, life: 74.7,  population: 10582082, country: 'Cuba' },
  { income: 28599, life: 75,    population: 4986705, country: 'Finland' },
  { income: 29476, life: 77.1,  population: 56943299, country: 'France' },
  { income: 31476, life: 75.4,  population: 78958237, country: 'Germany' },
  { income: 28666, life: 78.1,  population: 254830, country: 'Iceland' },
  { income: 1777,  life: 57.7,  population: 870601776, country: 'India' },
  { income: 29550, life: 79.1,  population: 122249285, country: 'Japan' },
  { income: 2076,  life: 67.9,  population: 20194354, country: 'North Korea' },
  { income: 12087, life: 72,    population: 42972254, country: 'South Korea' },
  { income: 24021, life: 75.4,  population: 3397534, country: 'New Zealand' },
  { income: 43296, life: 76.8,  population: 4240375, country: 'Norway' },
  { income: 10088, life: 70.8,  population: 38195258, country: 'Poland' },
  { income: 19349, life: 69.6,  population: 147568552, country: 'Russia' },
  { income: 10670, life: 67.3,  population: 53994605, country: 'Turkey' },
  { income: 26424, life: 75.7,  population: 57110117, country: 'United Kingdom' },
  { income: 37062, life: 75.4,  population: 252847810, country: 'United States' },
];

const data2015 = [
  { income: 44056, life: 81.8,  population: 23968973, country: 'Australia' },
  { income: 43294, life: 81.7,  population: 35939927, country: 'Canada' },
  { income: 13334, life: 76.9,  population: 1376048943, country: 'China' },
  { income: 21291, life: 78.5,  population: 11389562, country: 'Cuba' },
  { income: 38923, life: 80.8,  population: 5503457, country: 'Finland' },
  { income: 37599, life: 81.9,  population: 64395345, country: 'France' },
  { income: 44053, life: 81.1,  population: 80688545, country: 'Germany' },
  { income: 42182, life: 82.8,  population: 329425, country: 'Iceland' },
  { income: 5903,  life: 66.8,  population: 1311050527, country: 'India' },
  { income: 36162, life: 83.5,  population: 126573481, country: 'Japan' },
  { income: 1390,  life: 71.4,  population: 25155317, country: 'North Korea' },
  { income: 34644, life: 80.7,  population: 50293439, country: 'South Korea' },
  { income: 34186, life: 80.6,  population: 4528526, country: 'New Zealand' },
  { income: 64304, life: 81.6,  population: 5210967, country: 'Norway' },
  { income: 24787, life: 77.3,  population: 38611794, country: 'Poland' },
  { income: 23038, life: 73.13, population: 143456918, country: 'Russia' },
  { income: 19360, life: 76.5,  population: 78665830, country: 'Turkey' },
  { income: 38225, life: 81.4,  population: 64715810, country: 'United Kingdom' },
  { income: 53354, life: 79.1,  population: 321773631, country: 'United States' },
];

const allData = [
  ...data1990.map(d => ({ ...d, year: '1990' })),
  ...data2015.map(d => ({ ...d, year: '2015' })),
];

// 颜色映射表：scale.color.range 和 fill 回调共用，保持一致
const COLOR_MAP = { '1990': '#fb7678', '2015': '#81e7ee' };

const chart = new Chart({ container: 'container', width: 800, height: 500 });

chart.options({
  type: 'view',
  data: allData,
  children: [
    {
      type: 'point',
      encode: {
        x: 'income',
        y: 'life',
        size: 'population',
        color: 'year',
        shape: 'point',
      },
      scale: {
        size: { type: 'sqrt', range: [4, 40] },   // ✅ sqrt 比例尺：确保面积与数值成正比
        color: { domain: ['1990', '2015'], range: Object.values(COLOR_MAP) },
        y: { nice: true },
      },
      style: {
        fillOpacity: 0.85,
        lineWidth: 0,
        // ✅ 径向渐变：从白色中心到映射色边缘，模拟 3D 球体感
        // 通过 COLOR_MAP[datum.year] 获取颜色，与 scale.color.range 保持一致
        // 注意：channel.color[index] 存的是映射前的原始值（如 '1990'），不是映射后的颜色
        fill: (datum) => {
          const color = COLOR_MAP[datum.year];
          return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
        },
        // ✅ 阴影：让气泡有浮起感
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffsetY: 5,
      },
      legend: { size: false },
      labels: [
        { text: 'country', position: 'outside', fontSize: 11, fill: '#333',
          transform: [{ type: 'overlapDodgeY' }] },
      ],
      tooltip: {
        title: (d) => `${d.country} (${d.year})`,
        items: [
          { channel: 'x', name: '人均GDP', valueFormatter: (v) => `$${v}` },
          { channel: 'y', name: '预期寿命', valueFormatter: (v) => `${v}岁` },
          { channel: 'size', name: '人口', valueFormatter: (v) => `${(v / 1e6).toFixed(1)}M` },
        ],
      },
    },
  ],
  axis: {
    x: { title: '人均GDP ($)', grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
    y: { title: '预期寿命 (岁)', grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
  },
});

chart.render();
```

> **设计要点**：
> - **径向渐变**（`radial-gradient`）— 从白色中心到映射色边缘，模拟 3D 球体质感
> - **阴影**（`shadowBlur` + `shadowColor` + `shadowOffsetY`）— 让气泡有浮起感
> - **sqrt 比例尺** — 确保气泡面积与数值成正比，而非半径
> - **虚线网格**（`gridLineDash: [4, 4]`）— 背景更清爽不喧宾夺主
> - **双系列对比**（1990 vs 2015）— 用颜色区分时间维度
> - **隐藏 size 图例**（`legend: { size: false }`）— size 图例对用户意义不大

## 配置 size 比例尺

```javascript
scale: {
  size: {
    type: 'sqrt',    // ✅ 推荐：sqrt 比例尺，确保气泡面积与数值成正比
    range: [4, 40],  // [最小半径, 最大半径] (px)
    // 注意：G2 用面积而非半径映射，视觉上更准确
    // 建议 range 区间适中（4~40），避免极端大小差异导致遮挡或不可见
  },
}
```

> **为什么用 sqrt？** 气泡图的 size 通道映射的是圆的面积。如果使用 linear 比例尺，面积与数值的映射不是线性的（面积 = πr²）。
> 使用 sqrt 比例尺后，半径 = √数值，面积 = π(√数值)² = π×数值，实现**面积与数值的线性映射**。
> 详细说明见 [sqrt 比例尺文档](g2-scale-pow-sqrt.md)。

## 气泡样式最佳实践

### ✅ 推荐：径向渐变 + 阴影 + sqrt 比例尺 + 虚线网格
```javascript
chart.options({
  type: 'point',
  encode: { x: 'income', y: 'life', size: 'population', color: 'year' },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },    // sqrt 比例尺
    color: { domain: ['1990', '2015'], range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,
    lineWidth: 0,
    // 径向渐变：从白色中心到映射色边缘，模拟 3D 球体感
    // 通过 COLOR_MAP[datum.year] 获取颜色，与 scale.color.range 保持一致
    fill: (datum) => {
      const color = COLOR_MAP[datum.year];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    // 阴影：让气泡有浮起感
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },
  legend: { size: false },
  axis: {
    x: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
    y: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
  },
});
```

### ❌ 避免：白色描边 + 低透明度填充（浅色主题下像错误图表）
```javascript
// ❌ 浅色主题下，白色描边 + 半透明填充会让气泡看起来像空心/残缺
chart.options({
  style: {
    fillOpacity: 0.7,   // 太低，气泡显得空洞
    stroke: '#fff',      // 白色描边在浅色背景上几乎不可见，像没有描边
    lineWidth: 1,
  },
});
```

## 常见错误与修正

### 错误 1：size 通道绑定字符串类别而不是数值
```javascript
// ❌ 错误：size 通道应绑定数值字段，而不是类别
chart.options({
  encode: {
    size: 'country',  // ❌ 字符串，无法映射为大小
  },
});

// ✅ 正确：size 绑定数值字段
chart.options({
  encode: {
    size: 'population',  // ✅ 数值，可映射为气泡大小
  },
});
```

### 错误 2：没有设置 scale.size.range——气泡太小或太大
```javascript
// ❌ 默认 range 可能导致气泡尺寸不合适（遮挡其他数据或几乎不可见）
chart.options({
  encode: { size: 'value' },
  // ❌ 没有 scale.size.range
});

// ✅ 明确设置合适的气泡大小范围，建议 [4, 40] 区间
chart.options({
  encode: { size: 'value' },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },  // ✅ sqrt 比例尺 + 合适的视觉范围
  },
});
```

### 错误 3：使用白色描边（stroke: '#fff'）——浅色主题下像错误图表
```javascript
// ❌ 白色描边在浅色背景上几乎不可见，加上低 fillOpacity 让气泡显得空心/残缺
chart.options({
  style: { fillOpacity: 0.7, stroke: '#fff', lineWidth: 1 },
});

// ✅ 去掉描边，改用径向渐变 + 阴影 + 较高 fillOpacity
chart.options({
  style: {
    fillOpacity: 0.85,
    lineWidth: 0,
    fill: (datum) => {
      // 径向渐变：从白色中心到映射色边缘，模拟 3D 球体感
      const color = COLOR_MAP[datum.year];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },
});
```

### 错误 4：气泡重叠导致信息丢失
```javascript
// ❌ 数据点密集时气泡互相遮挡
chart.options({ type: 'point', encode: { x: 'gdp', y: 'life', size: 'population' } });

// ✅ 添加 overlapDodgeY 标签防重叠
chart.options({
  type: 'point',
  encode: { x: 'gdp', y: 'life', size: 'population' },
  labels: [{ text: 'country', transform: [{ type: 'overlapDodgeY' }] }],
});
```
