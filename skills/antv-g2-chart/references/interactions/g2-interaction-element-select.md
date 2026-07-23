---
id: "g2-interaction-element-select"
title: "G2 元素选中交互（elementSelect）"
description: |
  G2 v5 元素选中交互通过 interaction: [{ type: 'elementSelect' }] 启用，
  点击图形元素切换 selected 状态，支持 selected/active 状态样式自定义，
  可配合 elementSelectByX/elementSelectByColor 实现批量选中。
library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "选中"
  - "elementSelect"
  - "交互"
  - "状态"
  - "click"
  - "spec"

related:
  - "g2-interaction-element-highlight"
  - "g2-mark-interval-basic"
  - "g2-interaction-tooltip"

use_cases:
  - "点击柱子高亮选中，其他柱变灰"
  - "点击图例项过滤图表"
  - "联动外部数据面板显示选中详情"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## 基本用法（柱状图点击选中）

点击柱子切换 selected 状态，再次点击取消选中：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  interaction: [
    { type: 'elementSelect' },   // 点击元素切换 selected 状态
  ],
});

chart.render();
```

## elementSelectByX（按 x 值批量选中）

适合分组柱状图或堆叠图，点击任意一组元素时选中同一 x 位置的所有元素：

```javascript
chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 120 },
    { month: 'Jan', type: 'B', value: 80 },
    { month: 'Feb', type: 'A', value: 160 },
    { month: 'Feb', type: 'B', value: 95 },
    { month: 'Mar', type: 'A', value: 140 },
    { month: 'Mar', type: 'B', value: 110 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  interaction: [
    { type: 'elementSelectByX' },   // 点击任意柱子，选中同 x 位置的所有柱子
  ],
});
```

## 自定义选中状态样式

通过 `state.selected` 指定选中时的视觉样式，未选中的元素样式会相应降低：

```javascript
chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  state: {
    selected: {
      fill: '#1890ff',          // 选中时填充色
      fillOpacity: 1,           // 选中时不透明度
      stroke: '#003a8c',        // 选中时描边色
      lineWidth: 2,             // 选中时描边宽度
    },
    unselected: {
      fillOpacity: 0.3,         // 未选中元素半透明
    },
  },
  interaction: [
    { type: 'elementSelect' },
  ],
});
```

## 组合使用 highlight + select

鼠标悬停触发高亮，点击触发选中，两者可同时启用：

```javascript
chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  state: {
    active: {
      fill: '#69c0ff',        // 悬停高亮色（active 状态）
      fillOpacity: 0.9,
    },
    selected: {
      fill: '#1890ff',        // 点击选中色（selected 状态）
      fillOpacity: 1,
      stroke: '#003a8c',
      lineWidth: 2,
    },
    unselected: {
      fillOpacity: 0.3,
    },
  },
  interaction: [
    { type: 'elementHighlight' },   // 悬停高亮（active 状态）
    { type: 'elementSelect' },      // 点击选中（selected 状态）
    { type: 'tooltip' },
  ],
});
```

## 监听选中事件

```javascript
// 监听选中和取消选中事件
chart.on('element:select', (event) => {
  const datum = event.data?.data;
  console.log('选中元素数据：', datum);
  // 可在此处联动外部面板、更新状态等
});

chart.on('element:unselect', (event) => {
  console.log('取消选中');
});
```

## 常见错误与修正

### 错误：interaction 写成对象而非数组

```javascript
// ❌ 错误：interaction 必须是数组
chart.options({
  interaction: { type: 'elementSelect' },
});

// ✅ 正确
chart.options({
  interaction: [{ type: 'elementSelect' }],
});
```

### 错误：使用了不存在的交互名称

```javascript
// ❌ 错误：G2 中没有 'elementClick' 这个交互类型
chart.options({
  interaction: [{ type: 'elementClick' }],
});

// ✅ 正确的名称
chart.options({
  interaction: [{ type: 'elementSelect' }],         // 单个元素选中
  // 或
  // interaction: [{ type: 'elementSelectByX' }],   // 按 x 值批量选中
  // interaction: [{ type: 'elementSelectByColor' }], // 按颜色批量选中
});
```

### 错误：选中样式不生效（state 位置错误）

```javascript
// ❌ 错误：state 不能嵌套在 style 里
chart.options({
  style: {
    state: { selected: { fill: '#1890ff' } },
  },
});

// ✅ 正确：state 与 encode、style 并列，在 Mark 配置的顶层
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  state: {
    selected: { fill: '#1890ff', fillOpacity: 1 },
  },
  interaction: [{ type: 'elementSelect' }],
});
```

### 错误：同时使用 elementSelect 和 elementSelectByX 导致冲突

```javascript
// ❌ 两者同时启用时行为不可预期，点击会触发双重选中逻辑
chart.options({
  interaction: [
    { type: 'elementSelect' },
    { type: 'elementSelectByX' },
  ],
});

// ✅ 根据需求选择一种
// - elementSelect: 只选中点击的单个元素
// - elementSelectByX: 选中同一 x 值的所有元素（适合分组/堆叠图）
// - elementSelectByColor: 选中同一颜色（系列）的所有元素
chart.options({
  interaction: [{ type: 'elementSelectByX' }],
});
```
