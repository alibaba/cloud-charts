---
id: "g2-interaction-adaptive-filter"
title: "G2 AdaptiveFilter 自适应过滤交互"
description: |
  adaptiveFilter 是 G2 v5 的交互，当数据量过大导致图表渲染性能下降时，
  自动对数据进行采样或聚合，保持图表响应流畅。
  适用于大数据量折线图、散点图等场景，结合 sliderFilter 或 scrollbarFilter 使用效果更佳。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "adaptiveFilter"
  - "自适应过滤"
  - "大数据"
  - "性能优化"
  - "采样"
  - "interaction"

related:
  - "g2-interaction-slider-filter"
  - "g2-transform-sample"
  - "g2-mark-line-basic"

use_cases:
  - "大数据量折线图自动降采样保持流畅"
  - "滑动窗口过滤时动态调整数据密度"
  - "散点图数据量超过阈值时自动聚合"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/adaptive-filter"
---

## 核心概念

`adaptiveFilter` 监听图表的视口变化和数据规模，当可见数据量超过像素容量时，
自动应用采样策略（LTTB 算法等）减少渲染点数，避免过度绘制导致的性能问题。

通常与 `sliderFilter` 或 `scrollbarFilter` 配合使用，实现"滑动时自动适配数据量"。

## 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: largeDataArray,   // 数千条以上数据
  encode: { x: 'date', y: 'value' },
  interaction: {
    adaptiveFilter: true,   // 启用自适应过滤
  },
});

chart.render();
```

## 与 sliderFilter 配合使用

```javascript
chart.options({
  type: 'view',
  data: largeDataArray,
  children: [
    {
      type: 'line',
      encode: { x: 'date', y: 'value' },
    },
  ],
  interaction: {
    sliderFilter: {
      x: { labelFormatter: (v) => new Date(v).toLocaleDateString() },
    },
    adaptiveFilter: true,   // 滑动窗口过滤后自动采样
  },
  slider: {
    x: { values: [0, 0.3] },   // 初始显示前 30% 数据
  },
});
```

## 配置项

```javascript
chart.options({
  interaction: {
    adaptiveFilter: {
      // 触发自适应采样的数据量阈值（默认 2000）
      // 可见数据点数超过此值时开始采样
      maxPoints: 2000,
    },
  },
});
```

## 常见错误与修正

### 错误：小数据量也启用 adaptiveFilter 导致数据被意外过滤
```javascript
// ❌ 不必要：数据量小时无需启用，反而可能造成数据丢失误解
chart.options({
   smallData,   // 只有 50 条数据
  interaction: { adaptiveFilter: true },
});

// ✅ 仅在大数据量场景启用
// adaptiveFilter 适用于 > 1000 条数据的场景
chart.options({
  data: massiveData,
  interaction: { adaptiveFilter: true },
});
```
