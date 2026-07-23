---
id: "g2-interaction-element-highlight"
title: "G2 元素高亮交互（elementHighlight）"
description: |
  elementHighlight 是 G2 v5 中最常用的交互之一，鼠标悬停时高亮当前元素、
  同时可选择高亮同系列元素或联动其他视图。支持柱状图、折线图、散点图等所有 Mark 类型。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementHighlight"
  - "高亮"
  - "interaction"
  - "hover"
  - "交互"
  - "spec"

related:
  - "g2-interaction-brush"
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"

use_cases:
  - "柱状图悬停高亮当前柱子"
  - "折线图悬停高亮当前系列"
  - "散点图悬停高亮同类数据点"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-highlight"
---

## 基本用法（柱状图高亮）

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
  encode: { x: 'genre', y: 'sold' },
  interaction: { elementHighlight: true },   // 悬停高亮当前柱子
});

chart.render();
```

## 高亮背景色配置

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  interaction: {
    elementHighlight: {
      background: true,              // 是否显示高亮背景
      backgroundFill: '#f0f0f0',    // 背景填充色
    },
  },
});
```

## 折线图：高亮当前系列

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'series' },
  interaction: {
    elementHighlight: true,        // 悬停高亮当前折线
  },
});
```

## elementHighlightByColor：高亮同色系列

```javascript
// 悬停时高亮所有相同颜色（系列）的元素
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlightByColor: true,   // 高亮同系列所有柱子
  },
});
```

## elementHighlightByX：高亮同 x 位置的元素

```javascript
// 悬停时高亮同一 x 值的所有元素（适合分组柱状图）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  interaction: {
    elementHighlightByX: true,    // 高亮同组（同 x 位置）的所有元素
  },
});
```

## 同时启用 tooltip + 高亮

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'revenue', color: 'product' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlight: true,    // 元素高亮
    tooltip: true,             // Tooltip 提示
  },
  tooltip: {
    title: 'month',
    items: [
      { field: 'revenue', valueFormatter: (v) => `$${v}万` },
    ],
  },
});
```

## 监听高亮事件

```javascript
chart.on('element:highlight', (event) => {
  const datum = event.data?.data;
  console.log('高亮元素数据：', datum);
});

chart.on('element:unhighlight', () => {
  console.log('取消高亮');
});
```

## 常见错误与修正

### 错误：interaction 写成对象
```javascript
// ❌ 错误：interaction 必须是数组（旧版写法）
chart.options({
  interaction: { type: 'elementHighlight' },
});

// ✅ 正确（新版支持对象形式）
chart.options({
  interaction: { elementHighlight: true },
});
```

### 错误：混淆 elementHighlight 与 elementHighlightByColor
```javascript
// ❌ 同时使用会导致重复响应
chart.options({
  interaction: {
    elementHighlight: true,
    elementHighlightByColor: true,
  },
});

// ✅ 根据需求选择一种
// - elementHighlight: 只高亮鼠标悬停的单个元素
// - elementHighlightByColor: 高亮同颜色（系列）的所有元素
// - elementHighlightByX: 高亮同 x 位置的所有元素
```

### 错误：在 view 的 children 中嵌套 view 导致白屏
```javascript
// ❌ 错误：在 children 中嵌套 view 会导致渲染失败
chart.options({
  type: 'view',
  children: [
    {
      type: 'view', // 不允许嵌套 view
      children: [...]
    }
  ]
});

// ✅ 正确：使用顶层容器或单一 view 结构
chart.options({
  type: 'view',
  children: [
    { type: 'interval', ... },
    { type: 'image', ... }
  ]
});
```

### 错误：未正确设置 image 标记导致无法显示
```javascript
// ❌ 错误：缺少必要的 encode 和 style 配置
{
  type: 'image',
  data: [{ url: '...' }],
  encode: { x: () => 0, y: () => 0 } // 不适用于居中显示
}

// ✅ 正确：使用 style 设置固定位置和尺寸
{
  type: 'image',
  style: {
    x: '50%', // 居中
    y: '50%',
    width: 80,
    height: 80
  },
  encode: {
    src: 'url'
  }
}
```

</skill>