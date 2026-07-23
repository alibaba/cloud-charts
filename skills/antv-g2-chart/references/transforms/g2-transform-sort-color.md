---
id: "g2-transform-sort-color"
title: "G2 SortColor 按颜色分组排序变换"
description: |
  sortColor 是 G2 v5 中的排序 Transform，对颜色（color）通道的比例尺域（domain）进行排序。
  与 sortX（对 x 轴排序）类似，但排序作用于 color 通道的类别顺序。
  常用于图例排序、堆叠图层顺序调整等场景。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sortColor"
  - "颜色排序"
  - "图例顺序"
  - "transform"
  - "sort"
  - "color"

related:
  - "g2-transform-sortx"
  - "g2-transform-sorty"
  - "g2-mark-interval-stacked"

use_cases:
  - "按数值大小对图例顺序排序"
  - "堆叠柱状图的颜色分层顺序调整"
  - "折线图系列颜色分配顺序控制"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sort-color"
---

## 核心概念

`sortColor` 通过计算各 color 分组的聚合值（默认 y 通道的均值），
对 color scale 的 domain 进行重新排序，影响：
- 图例的显示顺序
- 堆叠图中各层的叠放顺序
- 颜色分配顺序

## 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 50 },
    { month: 'Jan', type: 'B', value: 80 },
    { month: 'Jan', type: 'C', value: 30 },
    { month: 'Feb', type: 'A', value: 60 },
    { month: 'Feb', type: 'B', value: 70 },
    { month: 'Feb', type: 'C', value: 40 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'sortColor', channel: 'y', order: 'descending' },  // 按 y 均值降序排列颜色
  ],
});

chart.render();
```

## 配置项

```javascript
chart.options({
  transform: [
    {
      type: 'sortColor',
      channel: 'y',           // 用于计算排序依据的通道，默认 'y'
      order: 'ascending',     // 'ascending'（升序）| 'descending'（降序），默认 'ascending'
      reducer: 'mean',        // 聚合方式：'mean' | 'sum' | 'max' | 'min' | 函数，默认 'mean'
      reverse: false,         // 是否反转排序结果
    },
  ],
});
```

## 与 sortX 对比

```javascript
// sortX：对 x 轴类别顺序排序（影响柱子/点的 x 轴位置顺序）
transform: [{ type: 'sortX', channel: 'y', order: 'descending' }]

// sortColor：对颜色分组（图例/堆叠层）排序（不影响 x 轴顺序）
transform: [{ type: 'sortColor', channel: 'y', order: 'descending' }]
```

## 常见错误与修正

### 错误：期望改变柱子位置但用了 sortColor
```javascript
// ❌ 错误：sortColor 只改变颜色/图例顺序，不改变 x 轴柱子位置
chart.options({
  encode: { x: 'type', y: 'value' },
  transform: [{ type: 'sortColor', channel: 'y', order: 'descending' }],
  // x 轴柱子顺序没有变化！
});

// ✅ 要改变 x 轴柱子位置，使用 sortX
chart.options({
  encode: { x: 'type', y: 'value' },
  transform: [{ type: 'sortX', channel: 'y', order: 'descending' }],  // ✅
});
```
