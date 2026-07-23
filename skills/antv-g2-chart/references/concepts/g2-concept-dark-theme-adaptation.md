---
id: "g2-concept-dark-theme-adaptation"
title: "G2 深色主题与背景色适配"
description: |
  详解 G2 v5 中深色/自定义背景下如何确保图表各组件（坐标轴、图例、tooltip、
  标签）的文本可见性，涵盖内置主题切换、手动样式覆盖、viewStyle 配置等方案。

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "深色主题"
  - "dark theme"
  - "背景色"
  - "文本对比度"
  - "可见性"
  - "classicDark"
  - "tooltip样式"
  - "axis颜色"
  - "legend颜色"

related:
  - "g2-comp-axis-config"
  - "g2-comp-legend-config"
  - "g2-comp-tooltip-config"
  - "g2-comp-label-config"
  - "g2-theme-builtin"
  - "g2-theme-custom"

use_cases:
  - "深色背景下图表文本不可见"
  - "tooltip 文本与背景颜色接近"
  - "坐标轴/图例标签在深色容器中看不清"
  - "自定义背景色时文本颜色适配"

difficulty: "intermediate"
completeness: "full"
created: "2025-06-04"
updated: "2025-06-04"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/theme/overview"
---

## 核心原理

G2 主题系统通过 **color token** 控制所有组件的文字颜色：

| Token | light 主题 | dark/classicDark 主题 |
|-------|-----------|----------------------|
| `colorBlack`（文本主色） | `#1D2129` | `#fff` |
| `colorWhite`（反色） | `#fff` | `#000` |
| `colorStroke`（描边/辅助） | `#416180` | `#416180` |

切换到暗黑主题后，**坐标轴标签、图例文字、标题、label** 都会自动使用 `colorBlack`（即 `#fff`），无需手动逐个设置。

## 内置主题列表

| 主题名称 | 描述 | 适用场景 |
|---------|------|---------|
| `'light'` | 默认亮色主题 | 浅色背景 |
| `'dark'` | 暗色主题 | 深色背景 |
| `'classic'` | 经典主题 | 基于 light 的配色变体 |
| `'classicDark'` | 经典暗色主题 | 基于 dark 的配色变体（推荐深色场景使用） |
| `'academy'` | 学术主题 | 论文/报告 |

## 方式一：使用暗黑主题（推荐）

最简单的深色适配方案——一行配置解决所有组件的文本颜色：

```javascript
// 字符串简写
chart.options({
  type: 'interval',
  theme: 'classicDark',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
});

// 对象形式（可同时配置背景色）
chart.options({
  type: 'interval',
  theme: {
    type: 'classicDark',
    view: { viewFill: '#1a1a1a' },  // 自定义视图背景色
  },
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
});
```

暗黑主题自动处理：
- 坐标轴标签：`labelFill: '#fff'`，`labelOpacity: 0.45`
- 坐标轴标题：`titleFill: '#fff'`，`titleOpacity: 0.9`
- 图例文字：`itemLabelFill: '#fff'`，`itemLabelFillOpacity: 0.9`
- 网格线：`gridStroke: '#fff'`，`gridStrokeOpacity: 0.25`
- Tooltip：深色背景 `#1f1f1f` + 浅色文字 `#A6A6A6`

## 方式二：手动设置组件文本颜色

适用于不想切换整个主题、只需局部深色适配的场景：

### 坐标轴

```javascript
axis: {
  x: {
    labelFill: 'rgba(255,255,255,0.65)',
    titleFill: 'rgba(255,255,255,0.9)',
    gridStroke: '#404040',
    gridLineWidth: 0.5,
  },
  y: {
    labelFill: 'rgba(255,255,255,0.65)',
    titleFill: 'rgba(255,255,255,0.9)',
    gridStroke: '#404040',
    gridLineWidth: 0.5,
  },
}
```

### 图例

```javascript
legend: {
  color: {
    itemLabelFill: 'rgba(255,255,255,0.85)',
    titleFill: 'rgba(255,255,255,0.65)',
  },
}
```

### Tooltip

Tooltip 样式通过 interaction 的 css 属性配置：

```javascript
interaction: {
  tooltip: {
    css: {
      '.g2-tooltip': {
        background: '#1f1f1f',
        color: '#fff',
        opacity: '0.95',
      },
      '.g2-tooltip-title': {
        color: '#a6a6a6',
      },
      '.g2-tooltip-list-item-name-label': {
        color: '#a6a6a6',
      },
      '.g2-tooltip-list-item-value': {
        color: '#fff',
      },
    },
  },
}
```

**Tooltip 可用的 CSS 选择器完整列表**：

| 选择器 | 作用 |
|--------|------|
| `.g2-tooltip` | 主容器（背景色、圆角、阴影） |
| `.g2-tooltip-title` | 标题文字 |
| `.g2-tooltip-list` | 数据列表容器 |
| `.g2-tooltip-list-item` | 单条数据行 |
| `.g2-tooltip-list-item-name-label` | 数据项名称 |
| `.g2-tooltip-list-item-value` | 数据项值 |
| `.g2-tooltip-list-item-marker` | 色块标记 |

### Label

```javascript
labels: [
  {
    text: 'value',
    fill: 'rgba(255,255,255,0.85)',
  },
]
```

## viewStyle 配置项

控制图表各区域的背景色：

```javascript
chart.options({
  theme: { type: 'classicDark' },
  viewStyle: {
    viewFill: '#1f1f1f',    // 整个视图区域（含标题/图例区）
    plotFill: '#2a2a2a',    // 绘图区域（数据展示区）
    mainFill: 'transparent', // 主区域
    contentFill: 'transparent', // 内容区域
    plotStroke: '#404040',  // 绘图区边框
    plotLineWidth: 1,
  },
});
```

也可通过 `theme.view` 配置：

```javascript
theme: {
  type: 'classicDark',
  view: {
    viewFill: '#111827',
    plotFill: '#1a1a1a',
  },
}
```

## 完整深色主题示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', height: 400 });

chart.options({
  type: 'view',
  theme: {
    type: 'classicDark',
    view: { viewFill: '#0f0f0f', plotFill: '#1a1a1a' },
  },
  data: [
    { month: '1月', value: 120, type: '产品A' },
    { month: '2月', value: 180, type: '产品A' },
    { month: '1月', value: 90, type: '产品B' },
    { month: '2月', value: 150, type: '产品B' },
  ],
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value', color: 'type' },
      transform: [{ type: 'dodgeX' }],
      labels: [
        {
          text: 'value',
          position: 'top',
          fill: 'rgba(255,255,255,0.85)',
          transform: [{ type: 'overlapHide' }],
        },
      ],
    },
  ],
  axis: {
    x: { grid: true, gridStroke: '#404040' },
    y: { grid: true, gridStroke: '#404040' },
  },
  legend: {
    color: {
      position: 'top',
      layout: { justifyContent: 'center' },
    },
  },
});

chart.render();
```

## 常见错误与修正

### 错误 1：深色容器 + 默认 light 主题

```javascript
// ❌ 错误：容器背景深色但使用默认 light 主题
// 坐标轴标签为深色 #1D2129，在深色背景上完全不可见
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  viewStyle: { viewFill: '#1a1a1a' },
});

// ✅ 正确：使用暗黑主题
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  theme: { type: 'classicDark', view: { viewFill: '#1a1a1a' } },
});
```

### 错误 2：浅色背景下将文本设为浅灰色

```javascript
// ❌ 错误：白色背景 + 浅灰文字 → 看不清
axis: { y: { labelFill: '#ccc' } }

// ✅ 正确：浅色背景保持深色文本
axis: { y: { labelFill: '#666' } }
```

### 错误 3：饼图配色包含与背景相同的颜色

```javascript
// ❌ 错误：白色背景 + range 中包含白色 → 某个扇区不可见
scale: { color: { range: ['#1890ff', '#ffffff', '#52c41a'] } }

// ✅ 正确：所有颜色与背景有明确区分
scale: { color: { range: ['#1890ff', '#fadb14', '#52c41a'] } }
```
