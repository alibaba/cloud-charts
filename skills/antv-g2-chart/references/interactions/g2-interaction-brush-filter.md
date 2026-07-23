---
id: "g2-interaction-brush-filter"
title: "G2 刷选过滤交互（brushFilter）"
description: |
  brushFilter 允许用户在图表上拖拽绘制矩形区域来过滤数据。
  与 brushHighlight 不同，brushFilter 会直接过滤掉选区外的数据点，
  只保留选中区域内的数据。支持 x/y 方向单轴过滤和二维矩形过滤。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush"
  - "brushFilter"
  - "刷选"
  - "过滤"
  - "交互"
  - "interaction"

related:
  - "g2-interaction-brush"
  - "g2-interaction-element-select"

use_cases:
  - "散点图中框选感兴趣的数据点进行深入分析"
  - "时间序列中框选特定时间段放大查看"
  - "多维数据探索：矩形框选数据子集"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-filter"
---

## 最小可运行示例（散点图刷选过滤）

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 300 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  group: Math.floor(Math.random() * 4),
}));

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'group', shape: 'point' },
  scale: { color: { type: 'ordinal' } },
  interaction: {
    brushFilter: true,   // 启用刷选过滤：拖拽矩形区域过滤数据
  },
});

chart.render();
```

## 仅 X 轴方向刷选（时间范围过滤）

```javascript
chart.options({
  type: 'line',
  data: timeData,
  encode: { x: 'date', y: 'value', color: 'type' },
  interaction: {
    brushXFilter: true,   // 仅 X 轴方向的刷选过滤（常用于时间筛选）
  },
});
```

## 自定义刷选样式

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushFilter: {
      maskFill: '#1890ff',
      maskFillOpacity: 0.15,
      maskStroke: '#1890ff',
      maskLineWidth: 1.5,
    },
  },
});
```

## 刷选高亮 vs 刷选过滤

```javascript
// brushHighlight：选区外的元素变暗（全部数据仍可见）
chart.options({ interaction: { brushHighlight: true } });

// brushFilter：选区外的元素被过滤掉（只剩选中数据）
chart.options({ interaction: { brushFilter: true } });
```

## 常见错误与修正

### 错误：brushFilter 和 brushHighlight 同时启用——行为冲突
```javascript
// ❌ 两者同时启用会产生冲突
chart.options({
  interaction: {
    brushFilter: true,
    brushHighlight: true,  // ❌ 与 brushFilter 冲突
  },
});

// ✅ 只启用其中一个
chart.options({
  interaction: {
    brushFilter: true,  // ✅ 过滤模式
  },
});
```
