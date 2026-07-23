---
id: "g2-transform-sorty"
title: "G2 SortY 按 Y 值排序变换"
description: |
  sortY 在每个 x 分组内按 y 值对数据记录排序，常用于堆叠图中控制各分类的堆叠顺序，
  确保较大的值在底部或顶部。sortX 按 x 通道值对全局数据排序，
  sortColor 则按颜色通道值排序。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sortY"
  - "sortX"
  - "排序"
  - "堆叠顺序"
  - "transform"

related:
  - "g2-transform-sortx"
  - "g2-transform-stacky"
  - "g2-mark-interval-stacked"

use_cases:
  - "堆叠柱状图中控制各分类的堆叠顺序（大值在底）"
  - "确保视觉上更稳定的堆叠布局"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sort"
---

## 最小可运行示例（堆叠柱状图排序）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', type: 'A', value: 100 },
  { month: 'Jan', type: 'B', value: 200 },
  { month: 'Jan', type: 'C', value: 50 },
  { month: 'Feb', type: 'A', value: 120 },
  { month: 'Feb', type: 'B', value: 80 },
  { month: 'Feb', type: 'C', value: 180 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'sortY', reverse: false },  // 每个 x 分组内按 y 值升序排列
    { type: 'stackY' },                 // 再堆叠（大值在顶部）
  ],
});

chart.render();
```

## sortX（全局按 x 值排序）

```javascript
// 条形图按数值降序排列（最大值在顶）
chart.options({
  type: 'interval',
  data: rankingData,
  encode: { x: 'name', y: 'value' },
  transform: [
    { type: 'sortX', by: 'y', reverse: true },  // 按 y 值降序
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## 配置项

```javascript
// sortY：在每个 x 分组内排序
transform: [
  {
    type: 'sortY',
    reverse: false,   // false = 升序（小值先），true = 降序（大值先），默认 false
    by: 'y',          // 排序依据通道，默认 'y'
  },
]

// sortX：全局按 x 通道值排序
transform: [
  {
    type: 'sortX',
    by: 'y',          // 排序依据：'x'（按 x 值）或 'y'（按 y 值大小）
    reverse: true,    // true = 降序，默认 false
  },
]
```

## 常见错误与修正

### 错误：sortY 在 stackY 之后执行——堆叠后 y 值已变化，排序基准错误
```javascript
// ❌ 错误顺序：stackY 之后的 y 值是累积值，sortY 基于累积值排序
transform: [
  { type: 'stackY' },  // ❌ 先堆叠
  { type: 'sortY' },   // ❌ 后排序，此时 y 已是累积值
]

// ✅ 正确：先排序后堆叠
transform: [
  { type: 'sortY' },   // ✅ 先按原始 y 值排序
  { type: 'stackY' },  // ✅ 再堆叠（堆叠顺序按排序结果）
]
```
