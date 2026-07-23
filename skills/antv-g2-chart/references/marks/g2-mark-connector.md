---
id: "g2-mark-connector"
title: "G2 连接器标注（connector）"
description: |
  connector mark 在两点之间绘制带折角的连接线，用于标注图表中两个数据点的关联或差异。
  常用于标注两个柱之间的差值、两个数据点之间的变化，配合 text 或 labels 显示差值标注。
  与 link mark 类似但更偏向标注用途，默认带直角折线。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "connector"
  - "连接器"
  - "标注"
  - "差值标注"
  - "annotation"
  - "折线连接"

related:
  - "g2-mark-link"
  - "g2-mark-linex-liney"
  - "g2-comp-annotation"

use_cases:
  - "标注两个柱状图数值之间的差异"
  - "连接两个数据点并显示差值"
  - "折线图中标注起止点的变化量"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/connector/"
---

## 最小可运行示例（差值标注）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'view',
  children: [
    // 主柱状图
    {
      type: 'interval',
       data,
      encode: { x: 'month', y: 'value', color: 'month' },
    },
    // connector：连接 Jan 和 Mar 两柱，标注差值
    {
      type: 'connector',
       [{ x: 'Jan', y: 83, x1: 'Mar', y1: 95 }],
      encode: {
        x: 'x',
        y: 'y',
        x1: 'x1',
        y1: 'y1',
      },
      labels: [
        {
          text: '+12',
          position: 'top',
          style: { fill: '#52c41a', fontWeight: 'bold' },
        },
      ],
      style: {
        stroke: '#52c41a',
        lineWidth: 1.5,
        offset: 16,   // 连接线相对于数据点的偏移量
      },
    },
  ],
});

chart.render();
```

## 配置项

```javascript
chart.options({
  type: 'connector',
  data: [{ x: 'A', y: 100, x1: 'B', y1: 150 }],
  encode: {
    x: 'x',    // 起点 x（与主图 x 轴对应）
    y: 'y',    // 起点 y
    x1: 'x1',  // 终点 x
    y1: 'y1',  // 终点 y
  },
  style: {
    stroke: '#999',
    lineWidth: 1,
    offset: 16,         // 连接线距离数据点的像素偏移，默认 16
    endMarker: true,    // 是否显示终点标记
    startMarker: false, // 是否显示起点标记
  },
});
```

## 常见错误与修正

### 错误：encode 中只写 x/y，没有 x1/y1——连接线无终点
```javascript
// ❌ 错误：connector 需要起点和终点
chart.options({
  type: 'connector',
  encode: { x: 'x', y: 'y' },   // ❌ 缺少 x1/y1
});

// ✅ 正确：必须同时指定起点和终点
chart.options({
  type: 'connector',
  encode: { x: 'x', y: 'y', x1: 'x1', y1: 'y1' },  // ✅
});
```
