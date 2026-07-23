---
id: "g2-comp-facet-circle"
title: "G2 圆形分面（facetCircle）"
description: |
  facetCircle 将数据按某个字段分成多个子集，每个子集的图表排列在圆形轨迹上。
  与 facetRect 的矩形网格不同，facetCircle 适合展示循环性数据（如 12 个月的环形排列）。
  每个子图共享相同的 y 轴范围，便于对比。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "facetCircle"
  - "圆形分面"
  - "facet"
  - "分面"
  - "循环"
  - "小多图"

related:
  - "g2-comp-facet-rect"
  - "g2-comp-repeat-matrix"

use_cases:
  - "12 个月的环形小多图对比"
  - "周期性时间数据的圆形分面（7天 / 12月）"
  - "循环分类的图表排列"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/facet-circle"
---

## 最小可运行示例（12 个月圆形分面）

```javascript
import { Chart } from '@antv/g2';

// 每个月的每日数据
const data = [];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
months.forEach((month, mi) => {
  for (let day = 1; day <= 10; day++) {
    data.push({ month, day, value: Math.random() * 100 });
  }
});

const chart = new Chart({ container: 'container', width: 640, height: 640 });

chart.options({
  type: 'facetCircle',
  data,
  encode: { position: 'month' },  // 按月份分面（决定每个子图的位置）
  children: [
    {
      type: 'interval',
      encode: { x: 'day', y: 'value', color: 'value' },
      scale: { color: { type: 'sequential', palette: 'blues' } },
      style: { lineWidth: 0 },
      coordinate: { type: 'polar' },  // 每个子图用极坐标
    },
  ],
});

chart.render();
```

## 常见错误与修正

### 错误：children 中没有用 coordinate: polar——子图是矩形而非环形
```javascript
// ❌ facetCircle 虽然分面排列是圆形，但子图本身仍可以是直角坐标
// 通常需要在 children 中指定 polar 坐标系才有圆形效果
chart.options({
  type: 'facetCircle',
  encode: { position: 'month' },
  children: [
    {
      type: 'interval',
      encode: { x: 'day', y: 'value' },
      // ❌ 没有 coordinate: polar，子图是普通柱状图，排列在圆圈上但不是极坐标
    },
  ],
});

// ✅ 通常在子图中加上 polar 坐标
children: [
  {
    type: 'interval',
    encode: { x: 'day', y: 'value' },
    coordinate: { type: 'polar' },  // ✅
  },
]
```
