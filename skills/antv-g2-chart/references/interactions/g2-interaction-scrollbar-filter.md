---
id: "g2-interaction-scrollbar-filter"
title: "G2 ScrollbarFilter 滚动条过滤交互"
description: |
  scrollbarFilter 是 G2 v5 的交互，通过图表内嵌滚动条来过滤可见数据范围。
  与 sliderFilter 类似，但使用更紧凑的滚动条控件（而非滑块），
  适用于数据量大、需要翻页浏览的场景（如大量类别的柱状图）。
  需配合 scrollbar 组件（scrollbar: { x: true }）一起使用。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "scrollbarFilter"
  - "滚动条"
  - "scrollbar"
  - "数据过滤"
  - "分页"
  - "interaction"

related:
  - "g2-interaction-slider-filter"
  - "g2-comp-scrollbar"
  - "g2-mark-interval-basic"

use_cases:
  - "类别过多的柱状图横向滚动查看"
  - "长时间序列数据翻页浏览"
  - "大量分类数据的局部展示"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/scrollbar"
---

## 核心概念

`scrollbarFilter` 交互需要与 `scrollbar` 组件配合：
- `scrollbar` 字段：控制滚动条的显示位置（x 轴 / y 轴）
- `scrollbarFilter` 交互：响应滚动条拖动事件，过滤数据范围

与 `sliderFilter` 的区别：
- `sliderFilter`：双端滑块，支持任意范围选取
- `scrollbarFilter`：固定窗口大小的滚动条，只能平移不能缩放范围

## 基本用法（X 轴滚动条）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 600, height: 400 });

chart.options({
  type: 'interval',
   manyCategories,   // 大量类别数据
  encode: { x: 'category', y: 'value' },
  scrollbar: {
    x: true,   // 启用 X 轴滚动条
  },
  interaction: {
    scrollbarFilter: true,   // 启用滚动条过滤
  },
});

chart.render();
```

## Y 轴滚动条

```javascript
chart.options({
  type: 'interval',
  data: manyCategories,
  encode: { x: 'value', y: 'category' },  // 条形图
  coordinate: { transform: [{ type: 'transpose' }] },
  scrollbar: {
    y: true,   // 启用 Y 轴滚动条（条形图竖向滚动）
  },
  interaction: {
    scrollbarFilter: true,
  },
});
```

## 配置项

```javascript
chart.options({
  scrollbar: {
    x: {
      ratio: 0.3,    // 滚动条初始窗口比例（显示全部数据的 30%），默认根据数据量计算
    },
  },
  interaction: {
    scrollbarFilter: {
      // 目前 scrollbarFilter 选项较少，主要通过 scrollbar 组件配置
    },
  },
});
```

## 常见错误与修正

### 错误：忘记配置 scrollbar 组件
```javascript
// ❌ 只加 interaction 但没有 scrollbar 组件，不会显示滚动条
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  interaction: { scrollbarFilter: true },  // ❌ 没有 scrollbar 组件
});

// ✅ 必须同时配置 scrollbar 组件
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  scrollbar: { x: true },              // ✅ 启用滚动条组件
  interaction: { scrollbarFilter: true },  // ✅ 启用过滤交互
});
```

### 错误：与 sliderFilter 混用
```javascript
// ❌ scrollbar 与 slider 同时启用会冲突
chart.options({
  scrollbar: { x: true },
  slider: { x: true },
  interaction: {
    scrollbarFilter: true,
    sliderFilter: true,   // ❌ 不要同时启用
  },
});

// ✅ 选择其中一种
chart.options({
  scrollbar: { x: true },
  interaction: { scrollbarFilter: true },
});
```
