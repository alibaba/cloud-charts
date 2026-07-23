---
id: "g2-mark-rect"
title: "G2 矩形标注（rect）"
description: |
  rect mark 在图表中绘制任意位置和大小的矩形，
  通过 x/x1 指定左右边界，y/y1 指定上下边界（与坐标轴单位一致）。
  常用于高亮某个数据区间、背景分区、标注区域等。
  与 rangeX 类似但更通用（支持同时指定 x 和 y 方向边界）。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "rect"
  - "矩形"
  - "区域标注"
  - "背景分区"
  - "annotation"

related:
  - "g2-mark-rangex"
  - "g2-comp-annotation"
  - "g2-mark-linex-liney"

use_cases:
  - "高亮图表中特定 x/y 区间范围"
  - "在散点图中标注某个数值区间矩形"
  - "分区背景着色"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/range/"
---

## 最小可运行示例（二维区间标注）

```javascript
import { Chart } from '@antv/g2';

const scatterData = Array.from({ length: 100 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'view',
  children: [
    // 主散点图
    {
      type: 'point',
      data: scatterData,
      encode: { x: 'x', y: 'y' },
      style: { r: 3, fillOpacity: 0.6 },
    },
    // 矩形标注：高亮 x: 30~70, y: 30~70 的区间
    {
      type: 'rect',
       [{ x: 30, x1: 70, y: 30, y1: 70, label: '目标区间' }],
      encode: { x: 'x', x1: 'x1', y: 'y', y1: 'y1' },
      style: {
        fill: '#52c41a',
        fillOpacity: 0.1,
        stroke: '#52c41a',
        lineWidth: 1.5,
        lineDash: [4, 4],
      },
      labels: [
        { text: 'label', position: 'top-left', style: { fill: '#52c41a', fontSize: 11 } },
      ],
    },
  ],
});

chart.render();
```

## 配置项

```javascript
chart.options({
  type: 'rect',
  data: [{ x: 20, x1: 60, y: 0, y1: 100, label: '区间 A' }],
  encode: {
    x: 'x',     // 矩形左边界（与 x 轴单位相同）
    x1: 'x1',   // 矩形右边界
    y: 'y',     // 矩形下边界（与 y 轴单位相同）
    y1: 'y1',   // 矩形上边界
  },
  style: {
    fill: '#5B8FF9',
    fillOpacity: 0.1,
    stroke: '#5B8FF9',
    lineWidth: 1,
  },
});
```

## 常见错误与修正

### 错误：rect 和 rangeX/rangeY 混淆——rect 需要同时指定 x/y 两个方向
```javascript
// rangeX：只指定 x 方向边界，y 方向填满整个图表高度
chart.options({ type: 'rangeX', encode: { x: 'start', x1: 'end' } });

// rangeY：只指定 y 方向边界，x 方向填满整个图表宽度
chart.options({ type: 'rangeY', encode: { y: 'min', y1: 'max' } });

// rect：同时指定 x 和 y 两个方向（完整的矩形区间）
chart.options({ type: 'rect', encode: { x: 'x', x1: 'x1', y: 'y', y1: 'y1' } });
```
