---
id: "g2-comp-space-layer"
title: "G2 图层叠加（spaceLayer / view 多 mark）"
description: |
  spaceLayer 将多个视图堆叠在同一区域（共享坐标轴），
  实现折线图 + 柱状图叠加、折线图 + 散点图叠加等复合图表。
  更常见的用法是在单个 view 中使用 children 数组配置多个 mark。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "spaceLayer"
  - "图层"
  - "叠加"
  - "复合图表"
  - "双轴图"
  - "view"
  - "children"

related:
  - "g2-core-view-composition"
  - "g2-comp-facet-rect"

use_cases:
  - "柱状图 + 折线图叠加（双指标对比）"
  - "散点图 + 趋势线叠加"
  - "折线图 + 置信区间面积叠加"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/space-layer"
---

## 最小可运行示例（柱状图 + 折线图）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', sales: 200, growth: 15 },
  { month: 'Feb', sales: 280, growth: 22 },
  { month: 'Mar', sales: 320, growth: 8 },
  { month: 'Apr', sales: 250, growth: -5 },
  { month: 'May', sales: 410, growth: 18 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

// 方式一：type: 'view' + children（推荐，最简洁）
chart.options({
  type: 'view',
  data,
  children: [
    // 柱状图：展示销售额
    {
      type: 'interval',
      encode: { x: 'month', y: 'sales', color: '#5B8FF9' },
      style: { fillOpacity: 0.8 },
      axis: { y: { title: '销售额' } },
    },
    // 折线图：展示增长率（共享 x 轴）
    {
      type: 'line',
      encode: { x: 'month', y: 'growth' },
      scale: { y: { independent: true } },  // 独立 y 轴（双 Y 轴）
      style: { lineWidth: 2.5, stroke: '#F4664A' },
      axis: { y: { position: 'right', title: '增长率 (%)' } },
    },
  ],
});

chart.render();
```

## 折线图 + 散点（mark 复合）

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'date', y: 'value', color: 'type' },
      style: { lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'date', y: 'value', color: 'type' },
      style: { r: 4, lineWidth: 1, fill: '#fff' },
    },
  ],
});
```

## 面积图 + 折线（置信区间）

```javascript
chart.options({
  type: 'view',
  data: confidenceData,
  children: [
    // 置信区间（面积）
    {
      type: 'area',
      encode: { x: 'date', y: 'upper', y1: 'lower', color: '#5B8FF9' },
      style: { fillOpacity: 0.2 },
    },
    // 中线（折线）
    {
      type: 'line',
      encode: { x: 'date', y: 'mean' },
      style: { lineWidth: 2, stroke: '#5B8FF9' },
    },
  ],
});
```

## 常见错误与修正

### 错误：双 Y 轴不设置 independent: true——两组数据被映射到同一 y 轴范围
```javascript
// ❌ sales（0~400）和 growth（-10~25）共用一个 y 轴，growth 曲线近乎水平
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'month', y: 'sales' } },
    { type: 'line',     encode: { x: 'month', y: 'growth' } },  // ❌ 没有独立 y 轴
  ],
});

// ✅ 第二个 y 轴设置 independent: true
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'month', y: 'sales' } },
    {
      type: 'line',
      encode: { x: 'month', y: 'growth' },
      scale: { y: { independent: true } },  // ✅ 独立比例尺
      axis: { y: { position: 'right' } },    // ✅ 放在右侧
    },
  ],
});
```
