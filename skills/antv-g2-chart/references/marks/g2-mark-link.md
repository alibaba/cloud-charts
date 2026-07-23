---
id: "g2-mark-link"
title: "G2 Link 连线图（两点间连线）"
description: |
  link mark 在两个数据点之间绘制连线，每条记录有独立的起点(x/y)和终点(x1/y1)。
  与 line mark 不同，link 的每条记录就是一条独立的线段，不需要通过 color/series 分组。
  适合展示迁移、比较、排名变化等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "link"
  - "连线"
  - "坡度图"
  - "slope chart"
  - "迁移图"
  - "两点连线"

related:
  - "g2-mark-line-basic"
  - "g2-mark-point-scatter"

use_cases:
  - "坡度图（展示两个时期的排名/数值变化）"
  - "两个分类之间的连线（迁移、关联）"
  - "起止点数据的路径展示"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/link/"
---

## 最小可运行示例（坡度图 — 排名变化）

```javascript
import { Chart } from '@antv/g2';

// 每条记录代表一个城市从 2022 到 2023 年的排名变化
const data = [
  { city: '北京', rank2022: 1, rank2023: 2 },
  { city: '上海', rank2022: 2, rank2023: 1 },
  { city: '广州', rank2022: 3, rank2023: 5 },
  { city: '深圳', rank2022: 4, rank2023: 3 },
  { city: '成都', rank2022: 5, rank2023: 4 },
];

const chart = new Chart({ container: 'container', width: 400, height: 480 });

chart.options({
  type: 'link',
  data,
  encode: {
    x: ['2022', '2023'],           // x 轴的两个位置（起点/终点）
    y: ['rank2022', 'rank2023'],   // 两个端点的 y 值（起点/终点）
    color: 'city',
  },
  scale: {
    y: { reverse: true },  // 排名从上到下（1 在顶部）
  },
  style: {
    lineWidth: 2,
    strokeOpacity: 0.8,
  },
  // 显示两端散点
  labels: [
    { text: (d) => `${d.city} ${d.rank2022}`, position: 'left' },
    { text: (d) => `${d.rank2023}`, position: 'right' },
  ],
});

chart.render();
```

## 箭头连线

```javascript
chart.options({
  type: 'link',
  data,
  encode: {
    x: ['source_x', 'target_x'],
    y: ['source_y', 'target_y'],
    color: 'type',
  },
  style: {
    lineWidth: 1.5,
    // 末端箭头
    endArrow: true,
    endArrowSize: 8,
  },
});
```

## 常见错误与修正

### 错误：encode.x/y 写成单个字段名——link 需要 [起点字段, 终点字段] 数组
```javascript
// ❌ 错误：x 和 y 是单个字段，只绑定了一端
chart.options({
  type: 'link',
  encode: {
    x: 'x',    // ❌ 只有一个位置
    y: 'y',    // ❌
  },
});

// ✅ 正确：x 和 y 必须是包含两个字段名的数组
chart.options({
  type: 'link',
  encode: {
    x: ['x0', 'x1'],  // ✅ [起点字段, 终点字段]
    y: ['y0', 'y1'],  // ✅
  },
});
```

### 错误：用 line mark 代替 link——多数据系列时行为不同
```javascript
// ❌ 如果每条记录是独立的一段连线，用 line 需要 series 分组，容易出错
chart.options({
  type: 'line',
  encode: { x: 'x', y: 'y', color: 'id' },  // 需要 color 才能分线
});

// ✅ 每条记录一条线段的场景，直接用 link
chart.options({
  type: 'link',
  encode: { x: ['x0', 'x1'], y: ['y0', 'y1'] },  // ✅ 更直观
});
```
