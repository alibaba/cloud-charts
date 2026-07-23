---
id: "g2-interaction-brush"
title: "G2 框选交互（brush）"
description: |
  G2 v5 内置框选交互，通过 interaction: [{ type: 'brushHighlight' }] 或 brushFilter
  实现鼠标拖拽框选、高亮/过滤数据点。常用于散点图、折线图等需要局部聚焦的场景。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush"
  - "框选"
  - "interaction"
  - "brushHighlight"
  - "brushFilter"
  - "交互"
  - "spec"

related:
  - "g2-mark-point-scatter"
  - "g2-interaction-element-highlight"
  - "g2-core-view-composition"

use_cases:
  - "散点图中框选关注的数据点区域"
  - "时间序列图中框选某段时间范围并过滤"
  - "大数据集局部聚焦分析"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-highlight"
---

## 基本用法（brushHighlight：框选高亮）

拖拽鼠标框选数据点，选中区域高亮，未选中区域变暗：

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
    { x: 1, y: 4.8, category: 'A' },
    { x: 2, y: 3.2, category: 'B' },
    { x: 3, y: 6.1, category: 'A' },
    { x: 4, y: 2.5, category: 'C' },
    { x: 5, y: 7.3, category: 'B' },
    { x: 6, y: 5.0, category: 'A' },
    { x: 7, y: 1.8, category: 'C' },
  ],
  encode: { x: 'x', y: 'y', color: 'category', size: 8 },
  interaction: [
    { type: 'brushHighlight' },   // 框选高亮
  ],
});

chart.render();
```

## brushFilter：框选过滤

框选后只保留选中区域内的数据点（其余被移除）：

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'category' },
  interaction: [
    { type: 'brushFilter' },   // 框选过滤（只显示选中区域的点）
  ],
});
```

## 散点图 + 框选 + 详情联动

```javascript
chart.options({
  type: 'point',
  data,
  encode: {
    x: 'income',
    y: 'happiness',
    color: 'region',
    size: 'population',
  },
  scale: {
    size: { range: [4, 20] },
  },
  interaction: [
    { type: 'brushHighlight' },
    { type: 'tooltip' },         // 同时保留 tooltip 交互
  ],
  legend: { color: { position: 'top' } },
});
```

## 单轴框选（只横向/纵向）

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'date', y: 'price' },
  interaction: [
    {
      type: 'brushXHighlight',   // 只允许横向框选（按时间范围）
    },
  ],
});

// 纵向框选：brushYHighlight
chart.options({
  interaction: [{ type: 'brushYHighlight' }],
});
```

## 框选 + 联动其他图表

通过监听事件，实现多图联动：

```javascript
const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  interaction: [{ type: 'brushFilter' }],
});

chart.render();

// 监听框选事件
chart.on('brush:filter', (event) => {
  const filteredData = event.data.items;   // 框选后的剩余数据
  console.log('选中数据：', filteredData);
  // 可据此更新其他图表...
});
```

## 常见错误与修正

### 错误：interaction 写成对象而非数组
```javascript
// ❌ 错误：interaction 必须是数组
chart.options({
  interaction: { type: 'brushHighlight' },
});

// ✅ 正确：数组格式
chart.options({
  interaction: [{ type: 'brushHighlight' }],
});
```

### 错误：同时启用 brushHighlight 和 brushFilter
```javascript
// ❌ 不推荐：两者功能冲突，同时使用会产生意外行为
chart.options({
  interaction: [
    { type: 'brushHighlight' },
    { type: 'brushFilter' },
  ],
});

// ✅ 正确：根据需求选其一
chart.options({
  interaction: [{ type: 'brushHighlight' }],  // 高亮但保留所有点
  // 或
  // interaction: [{ type: 'brushFilter' }],  // 过滤只显示选中点
});
```
