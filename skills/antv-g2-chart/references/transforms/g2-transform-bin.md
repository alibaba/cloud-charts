---
id: "g2-transform-bin"
title: "G2 Bin / BinX 数值分桶变换（直方图）"
description: |
  binX 将连续的数值 x 通道分成若干区间（桶），统计每个区间内的数据量，
  是直方图的核心变换。bin 同时对 x 和 y 两个方向分桶，生成二维频率矩阵。
  通过 thresholds 控制桶的数量，y 通道指定聚合方式（count/sum 等）。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "bin"
  - "binX"
  - "分桶"
  - "直方图"
  - "histogram"
  - "频率分布"
  - "transform"

related:
  - "g2-transform-groupx"
  - "g2-mark-interval-basic"
  - "g2-mark-cell-heatmap"

use_cases:
  - "绘制直方图（数值分布频率）"
  - "二维频率热力图（bin 同时对 x/y 分桶）"
  - "将连续数值转化为离散分组统计"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/bin"
---

## 最小可运行示例（直方图）

```javascript
import { Chart } from '@antv/g2';

// 连续数值数据，不需要预先统计频率
const rawData = Array.from({ length: 1000 }, () => ({
  age: Math.floor(Math.random() * 50 + 20),  // 20~70 岁之间的随机年龄
}));

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data: rawData,
  encode: {
    x: 'age',   // 连续数值 → 自动分桶
    y: '★',     // 占位符，binX 会计算 count
  },
  transform: [
    {
      type: 'binX',
      y: 'count',        // 聚合方式：统计每桶数量
      thresholds: 15,    // 桶的数量（近似值），默认自动计算
    },
  ],
  style: { inset: 1 },  // 柱子之间留 1px 间隙
  axis: { y: { title: '人数' } },
});

chart.render();
```

## BinX 配置项

```javascript
transform: [
  {
    type: 'binX',
    thresholds: 20,  // 桶数量（整数）或阈值数组（如 [0, 25, 50, 75, 100]）
    y: 'count',      // 聚合：'count' | 'sum' | 'mean' | 'min' | 'max' | function
    // groupBy: 'color',  // 按颜色分组分桶（用于分组直方图）
  },
]
```

## 二维频率热力图（bin）

```javascript
// bin 同时对 x 和 y 方向分桶，生成二维频率矩阵
chart.options({
  type: 'cell',
  data: scatterData,
  encode: {
    x: 'x',
    y: 'y',
    color: '★',
  },
  transform: [
    {
      type: 'bin',
      color: 'count',    // 统计每个格子的点数（映射到颜色）
      thresholds: [20, 20],  // [x 方向桶数, y 方向桶数]
    },
  ],
  scale: { color: { type: 'sequential', palette: 'ylOrRd' } },
  style: { lineWidth: 0 },
});
```

## 分组直方图（按颜色分桶）

```javascript
chart.options({
  type: 'interval',
  data: employeeData,
  encode: { x: 'salary', y: '★', color: 'dept' },
  transform: [
    { type: 'binX', y: 'count', thresholds: 12 },
    { type: 'stackY' },   // 堆叠
  ],
});
```

## 常见错误与修正

### 错误 1：对分类字段 x 用 binX——分类应用 groupX
```javascript
// ❌ 错误：x 是字符串类别，binX 无法对字符串分桶
chart.options({
  encode: { x: 'department', y: '★' },   // department 是字符串
  transform: [{ type: 'binX', y: 'count' }],  // ❌
});

// ✅ 字符串类别用 groupX
chart.options({
  encode: { x: 'department', y: '★' },
  transform: [{ type: 'groupX', y: 'count' }],  // ✅
});

// ✅ binX 用于连续数值
chart.options({
  encode: { x: 'age', y: '★' },   // age 是数字
  transform: [{ type: 'binX', y: 'count' }],  // ✅
});
```

### 错误 2：thresholds 设置太大——出现极多细小的桶
```javascript
// ❌ 1000 条数据设置 500 个桶，每桶 2 条，直方图没有统计意义
transform: [{ type: 'binX', y: 'count', thresholds: 500 }]  // ❌

// ✅ 直方图桶数通常在 10~50 之间
transform: [{ type: 'binX', y: 'count', thresholds: 20 }]  // ✅
```
