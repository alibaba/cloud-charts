---
id: "g2-mark-radar"
title: "G2 雷达图（polar 坐标 + area/line）"
description: |
  G2 v5 雷达图通过 coordinate: { type: 'polar' } + area + line Mark 组合实现，
  数据采用长表格式，encode.x 映射维度字段，encode.y 映射数值字段，
  encode.color 区分多个系列。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "雷达图"
  - "radar"
  - "polar"
  - "极坐标"
  - "蜘蛛网图"
  - "多维度"
  - "spec"

related:
  - "g2-core-view-composition"
  - "g2-mark-area-basic"
  - "g2-mark-line-basic"

use_cases:
  - "多维度能力/指标对比（如 KPI 雷达图）"
  - "多个对象的综合评分对比"
  - "运动员/产品多维评测"

anti_patterns:
  - "维度超过 8 个时，标签会重叠，改用平行坐标图"
  - "各维度量纲差异过大时，需先归一化"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/radar"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 480,
  height: 480,
});

const data = [
  { item: '设计', type: '产品A', score: 70 },
  { item: '开发', type: '产品A', score: 60 },
  { item: '营销', type: '产品A', score: 50 },
  { item: '运营', type: '产品A', score: 80 },
  { item: '服务', type: '产品A', score: 90 },
  { item: '设计', type: '产品B', score: 40 },
  { item: '开发', type: '产品B', score: 75 },
  { item: '营销', type: '产品B', score: 85 },
  { item: '运营', type: '产品B', score: 55 },
  { item: '服务', type: '产品B', score: 65 },
];

chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },   // 关键：极坐标
  scale: {
    x: { padding: 0.5, align: 0 },
    y: { tickCount: 5, domainMin: 0, domainMax: 100 },
  },
  axis: {
    x: { grid: true },
    y: { zIndex: 1, title: false },
  },
  children: [
    {
      type: 'area',
      encode: { x: 'item', y: 'score', color: 'type' },
      style: { fillOpacity: 0.2 },
    },
    {
      type: 'line',
      encode: { x: 'item', y: 'score', color: 'type' },
      style: { lineWidth: 2 },
    },
  ],
});

chart.render();
```

## 带数据点的雷达图

```javascript
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },
  scale: {
    x: { padding: 0.5, align: 0 },
    y: { tickCount: 5, domainMin: 0 },
  },
  axis: {
    x: { grid: true, labelFontSize: 13 },
    y: { zIndex: 1, title: false, label: false },  // 隐藏 y 轴标签（只显示网格）
  },
  children: [
    {
      type: 'area',
      encode: { x: 'item', y: 'score', color: 'type' },
      style: { fillOpacity: 0.15 },
    },
    {
      type: 'line',
      encode: { x: 'item', y: 'score', color: 'type' },
      style: { lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'item', y: 'score', color: 'type' },
      style: { r: 4, fill: 'white', lineWidth: 2 },
    },
  ],
  legend: { color: { position: 'top' } },
  interaction: [{ type: 'tooltip' }],
});
```

## 单系列雷达图（纯色填充）

```javascript
const singleData = [
  { item: '攻击', score: 85 },
  { item: '防御', score: 72 },
  { item: '速度', score: 90 },
  { item: '魔法', score: 60 },
  { item: '体力', score: 78 },
  { item: '运气', score: 66 },
];

chart.options({
  type: 'view',
  data: singleData,
  coordinate: { type: 'polar' },
  scale: {
    x: { padding: 0.5, align: 0 },
    y: { tickCount: 4, domainMin: 0, domainMax: 100 },
  },
  axis: {
    x: { grid: true, labelFontSize: 14 },
    y: { zIndex: 1, title: false },
  },
  children: [
    {
      type: 'area',
      encode: { x: 'item', y: 'score' },
      style: { fill: '#1890ff', fillOpacity: 0.25 },
    },
    {
      type: 'line',
      encode: { x: 'item', y: 'score' },
      style: { stroke: '#1890ff', lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'item', y: 'score' },
      style: { r: 5, fill: '#1890ff' },
      labels: [{ text: (d) => d.score, position: 'top', style: { fontSize: 11 } }],
    },
  ],
});
```

## 常见错误与修正

### 错误 1：忘记设置 polar 坐标，变成普通面积折线图
```javascript
// ❌ 缺少 coordinate，渲染出的是普通折线图而非雷达图
chart.options({
  type: 'view',
  data,
  // 忘记了 coordinate: { type: 'polar' }
  children: [{ type: 'area', ... }],
});

// ✅ 正确：必须声明 polar 坐标
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },   // ✅ 关键
  children: [{ type: 'area', ... }],
});
```

### 错误 2：数据格式使用宽表

```javascript
// ❌ 宽表格式无法直接用 color 区分系列
const wrongData = [
  { item: '设计', A: 70, B: 40 },
  { item: '开发', A: 60, B: 75 },
];

// ✅ 正确：使用长表格式（每行一个数据点 + 系列字段）
const correctData = [
  { item: '设计', type: 'A', score: 70 },
  { item: '设计', type: 'B', score: 40 },
  { item: '开发', type: 'A', score: 60 },
  { item: '开发', type: 'B', score: 75 },
];
```

### 错误 3：各维度量纲不统一导致视觉失真

```javascript
// ❌ 不同维度量级差异大（0-100 vs 0-10000），图形严重失真
const data = [
  { item: '销售额', score: 8500 },   // 万元
  { item: '评分',   score: 85 },     // 百分制
];

// ✅ 先归一化到 0-100 再绘制
const normalized = data.map(d => ({
  ...d,
  score: (d.score / maxScores[d.item]) * 100,
}));
```
