---
id: "g2-transform-jitter"
title: "G2 Jitter 抖动变换（散开重叠点）"
description: |
  jitter 变换为分类轴上的数据点添加随机偏移，避免相同类别下数据点完全重叠。
  jitter 同时抖动 X 和 Y，jitterX 只抖动 X（常用于条形图上的点），
  jitterY 只抖动 Y。常与 point mark 配合展示分类数据分布。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "jitter"
  - "抖动"
  - "点图"
  - "分布"
  - "重叠"
  - "beeswarm"
  - "transform"

related:
  - "g2-mark-point-scatter"
  - "g2-transform-dodgex"
  - "g2-transform-stacky"

use_cases:
  - "展示各类别下数据点的分布密度（比箱线图更详细）"
  - "类别轴上多个数据点防止重叠"
  - "与箱线图叠加，同时显示统计摘要和原始数据"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/jitter"
---

## 最小可运行示例（jitter 防止分类散点图重叠）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data: [
    { dept: '研发', salary: 18000 }, { dept: '研发', salary: 22000 },
    { dept: '研发', salary: 15000 }, { dept: '研发', salary: 19000 },
    { dept: '销售', salary: 12000 }, { dept: '销售', salary: 16000 },
    { dept: '销售', salary: 14000 }, { dept: '销售', salary: 11000 },
    { dept: '设计', salary: 17000 }, { dept: '设计', salary: 20000 },
  ],
  encode: {
    x: 'dept',     // 分类轴（会在此方向抖动）
    y: 'salary',
    color: 'dept',
  },
  transform: [{ type: 'jitter' }],   // 在 x 和 y 方向添加随机抖动
  style: { fillOpacity: 0.7, r: 4 },
});

chart.render();
```

## jitterX（仅水平抖动）

```javascript
// 适合竖向分类轴 — 仅在 x 方向展开，y 方向保持精确数值
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  transform: [
    {
      type: 'jitterX',
      padding: 0.1,    // 类别宽度比例（0~0.5），默认 0
      random: Math.random,  // 自定义随机函数（可用固定种子）
    },
  ],
});
```

## 与箱线图叠加

```javascript
chart.options({
  type: 'view',
  children: [
    // 箱线图（显示统计摘要）
    {
      type: 'boxplot',
      data,
      encode: { x: 'dept', y: 'salary' },
      style: { boxFill: 'transparent', lineWidth: 1.5 },
    },
    // 散点（显示原始数据分布）
    {
      type: 'point',
      data,
      encode: { x: 'dept', y: 'salary', color: 'dept' },
      transform: [{ type: 'jitter', padding: 0.1 }],
      style: { r: 3, fillOpacity: 0.6 },
    },
  ],
});
```

## 配置项

```javascript
transform: [
  {
    type: 'jitter',    // 或 'jitterX' / 'jitterY'
    padding: 0,        // 类别边界留白（0~0.5），默认 0
    paddingX: 0,       // 单独设置 X 留白（覆盖 padding）
    paddingY: 0,       // 单独设置 Y 留白（覆盖 padding）
    random: Math.random, // 随机函数，可替换为固定种子伪随机
  },
]
```

## 常见错误与修正

### 错误 1：在数值轴上使用 jitter——两个方向都是数值时效果混乱
```javascript
// ❌ 错误：x 和 y 都是数值时，jitter 会破坏精确的数值关系
chart.options({
  type: 'point',
  encode: { x: 'price', y: 'sales' },  // 都是数值轴
  transform: [{ type: 'jitter' }],      // ❌ 散点图本就不重叠，不需要
});

// ✅ jitter 应用于有分类轴的场景
chart.options({
  encode: { x: 'category', y: 'value' },  // x 是分类
  transform: [{ type: 'jitter' }],         // ✅
});
```

### 错误 2：point mark 数据量大时抖动效果不明显——padding 太小
```javascript
// ❌ 默认 padding: 0 时，所有点只在类别宽度极小范围内抖动
transform: [{ type: 'jitter' }]  // padding 默认 0，抖动范围很小

// ✅ 适当增大 padding
transform: [{ type: 'jitter', padding: 0.15 }]  // 类别宽度 15% 作为抖动范围
```
