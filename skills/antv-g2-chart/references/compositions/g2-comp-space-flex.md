---
id: "g2-comp-space-flex"
title: "G2 弹性布局（spaceFlex）"
description: |
  spaceFlex 将多个子图按弹性比例（ratio）排列在行（row）或列（col）方向。
  类似 CSS flexbox，每个子图的大小由 ratio 数组按比例分配画布空间。
  适合制作不等宽的多图并排布局，比 repeatMatrix 更灵活。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "spaceFlex"
  - "弹性布局"
  - "多图"
  - "flex"
  - "并排"
  - "composition"

related:
  - "g2-comp-space-layer"
  - "g2-comp-facet-rect"
  - "g2-comp-repeat-matrix"

use_cases:
  - "左宽右窄的双图布局（如 2:1 比例）"
  - "多图等分排列（如 3 个等宽图表）"
  - "不等宽的多图并排展示"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/space-flex"
---

## 最小可运行示例（左右 2:1 布局）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 900, height: 400 });

chart.options({
  type: 'spaceFlex',
  width: 900,
  height: 400,
  direction: 'row',      // 'row'（横向）或 'col'（纵向）
  ratio: [2, 1],         // 左图占 2/3，右图占 1/3
  padding: 20,           // 子图间距
  children: [
    // 左图：折线图（占 2/3 宽度）
    {
      type: 'line',
       salesData,
      encode: { x: 'month', y: 'value', color: 'city' },
      title: '月度销售趋势',
    },
    // 右图：饼图（占 1/3 宽度）
    {
      type: 'interval',
       categoryData,
      encode: { y: 'value', color: 'type' },
      transform: [{ type: 'stackY' }],
      coordinate: { type: 'theta', outerRadius: 0.85 },
      title: '类别占比',
    },
  ],
});

chart.render();
```

## 纵向布局（上大下小）

```javascript
chart.options({
  type: 'spaceFlex',
  width: 640,
  height: 700,
  direction: 'col',      // 纵向排列
  ratio: [3, 1],         // 上图占 3/4 高度，下图占 1/4
  children: [
    {
      type: 'line',
       timeData,
      encode: { x: 'date', y: 'value', color: 'type' },
    },
    // 缩略轴图（底部小图）
    {
      type: 'line',
       timeData,
      encode: { x: 'date', y: 'value', color: 'type' },
      style: { lineWidth: 1 },
      axis: { y: false },
    },
  ],
});
```

## 等分三图并排

```javascript
chart.options({
  type: 'spaceFlex',
  direction: 'row',
  ratio: [1, 1, 1],   // 三图等宽
  children: [chart1Config, chart2Config, chart3Config],
});
```

## 常见错误与修正

### 错误：ratio 数组长度与 children 不一致
```javascript
// ❌ 错误：3 个子图但 ratio 只有 2 个值
chart.options({
  type: 'spaceFlex',
  ratio: [2, 1],       // ❌ 只有 2 个比例值
  children: [c1, c2, c3],  // 3 个子图
});

// ✅ ratio 数组长度必须等于 children 数组长度
chart.options({
  ratio: [2, 1, 1],   // ✅ 3 个比例值对应 3 个子图
  children: [c1, c2, c3],
});
```

### 错误：子图没有设置宽高——spaceFlex 会自动计算，不需要子图单独设置
```javascript
// ⚠️  子图单独设置 width/height 会覆盖 spaceFlex 的自动布局
children: [
  { type: 'line', width: 400, height: 300, ... },  // ⚠️  不要单独设置
]

// ✅ 子图只设置内容，宽高由父级 spaceFlex 按 ratio 自动分配
children: [
  { type: 'line', data: ..., encode: { ... } },  // ✅ 不设置宽高
]
```
