---
id: "g2-interaction-brush-xy"
title: "G2 单轴框选（brushXHighlight / brushYHighlight / brushXFilter / brushYFilter）"
description: |
  单轴框选交互限制刷选只在一个方向上生效：
  - brushXHighlight/brushYHighlight：框选高亮，不过滤数据
  - brushXFilter/brushYFilter：框选并过滤数据（隐藏框选范围外的元素）
  X 方向框选适合时间序列的区间选择，Y 方向框选适合数值范围筛选。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brushXHighlight"
  - "brushYHighlight"
  - "brushXFilter"
  - "brushYFilter"
  - "单轴框选"
  - "刷选"
  - "interaction"

related:
  - "g2-interaction-brush-filter"
  - "g2-interaction-brush-axis"
  - "g2-comp-slider"

use_cases:
  - "时间序列图表：X 方向框选时间区间高亮"
  - "散点图：Y 方向框选数值范围筛选"
  - "折线图区间对比标注"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-highlight"
---

## brushXHighlight（X 方向框选高亮）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'series' },
  interaction: {
    brushXHighlight: true,  // 横向框选，高亮选中区间的折线
  },
});

chart.render();
```

## brushXFilter（X 方向框选过滤）

```javascript
// 框选后只显示框选区间内的数据
chart.options({
  type: 'point',
  data: scatterData,
  encode: { x: 'date', y: 'value', color: 'category' },
  interaction: {
    brushXFilter: true,   // 框选 X 范围，过滤范围外的点
  },
});
```

## brushYFilter（Y 方向框选过滤）

```javascript
// 框选数值范围，只显示 Y 值在选中区间内的数据
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'category', size: 'value' },
  interaction: {
    brushYFilter: true,   // 纵向框选，过滤 Y 范围外的点
  },
});
```

## 四种框选交互对比

```javascript
// brushHighlight   → 二维框选，高亮（不过滤）
// brushFilter      → 二维框选，过滤数据
// brushXHighlight  → X 方向框选，高亮
// brushXFilter     → X 方向框选，过滤
// brushYHighlight  → Y 方向框选，高亮
// brushYFilter     → Y 方向框选，过滤

// 在散点图上同时支持高亮（单 X 轴框选）
chart.options({
  interaction: {
    brushXHighlight: {
      series: true,        // 是否高亮同系列其他点
    },
  },
});
```

## 常见错误与修正

### 错误：brushXFilter 与 brushFilter 效果相同的误解
```javascript
// brushFilter 可以在 X/Y 两个方向同时框选一个矩形区域
chart.options({ interaction: { brushFilter: true } });  // 二维矩形框选

// brushXFilter 只能在 X 方向拖拽，形成一个竖直条带
chart.options({ interaction: { brushXFilter: true } }); // 仅 X 轴方向

// 使用场景不同：时间序列用 brushXFilter 更直观
```
