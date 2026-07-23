---
id: "g2-transform-binx"
title: "G2 BinX 分箱变换（直方图）"
description: |
  BinX 将连续 x 值按指定区间（bin）分组，自动统计每个区间内的记录数（或聚合值），
  是绘制频率直方图的核心 Transform。与 Interval Mark 组合直接使用原始数据即可生成直方图。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "BinX"
  - "直方图"
  - "histogram"
  - "分箱"
  - "分布"
  - "频率"
  - "transform"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-transform-stacky"

use_cases:
  - "展示连续数值数据的频率分布"
  - "探索数据的分布形态（正态、偏态等）"

anti_patterns:
  - "数据是离散分类时不需要 binX，直接用 interval 即可"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/bin-x"
---

## 最小可运行示例（直方图）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 400,
});

// 原始连续数值数据
const rawData = Array.from({ length: 200 }, () => ({
  value: Math.random() * 100,
}));

chart.options({
  type: 'interval',
  data: rawData,
  encode: { x: 'value' },
  transform: [
    {
      type: 'binX',
      y: 'count',      // 统计每个 bin 内的记录数，结果存入 y 通道
      thresholds: 20,  // 分成约 20 个 bin
    },
  ],
  style: { inset: 0.5 },    // 柱体间留细缝
});

chart.render();
```

## 配置项

```javascript
transform: [
  {
    type: 'binX',
    // 统计目标
    y: 'count',       // 'count'（默认，计数）| 'sum' | 'mean' | 'max' | 'min'
    // 如果是 sum/mean 等，还需指定聚合的字段：
    // y: 'sum', field: 'amount',

    // 分箱数量控制（三选一）
    thresholds: 20,           // 目标分箱数（近似值，库会自动调整）
    // domain: [0, 100],      // 指定值域范围
    // step: 5,               // 每个 bin 的宽度（与 thresholds 互斥）
  },
],
```

## 分组直方图（按类别着色）

```javascript
chart.options({
  type: 'interval',
   data,  // [{ value: 42, group: 'A' }, ...]
  encode: { x: 'value', color: 'group' },
  transform: [
    { type: 'binX', y: 'count', thresholds: 15 },
    { type: 'stackY' },   // 堆叠同一 bin 内不同分组的计数
  ],
});
```

## 常见错误与修正

### 错误：对离散分类数据使用 binX
```javascript
// ❌ 错误：genre 是分类字段，不需要 binX
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre' },
  transform: [{ type: 'binX', y: 'count' }],  // 不必要！
});

// ✅ 正确：分类数据直接用 interval，不需要 binX
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'count' },
});
```

### 错误：忘记指定 y 统计量
```javascript
// ❌ 错误：没有 y 参数，不知道统计什么
chart.options({ transform: [{ type: 'binX', thresholds: 20 }] });

// ✅ 正确：必须指定 y
chart.options({ transform: [{ type: 'binX', y: 'count', thresholds: 20 }] });
```
