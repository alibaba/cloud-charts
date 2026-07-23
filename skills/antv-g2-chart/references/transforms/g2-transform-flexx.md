---
id: "g2-transform-flexx"
title: "G2 FlexX 弹性宽度变换（马赛克图 / 不等宽柱）"
description: |
  flexX 根据数据值动态调整 x 轴比例尺的 flex 属性，使每个柱的宽度与数值成比例。
  常用于马赛克图（Marimekko chart）：柱宽表示一个维度，柱高表示另一个维度。
  通过 field 指定控制宽度的字段，reducer 指定聚合方式。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "flexX"
  - "不等宽柱"
  - "马赛克图"
  - "Marimekko"
  - "弹性宽度"
  - "transform"

related:
  - "g2-transform-stacky"
  - "g2-mark-interval-stacked"

use_cases:
  - "马赛克图（双维度占比：柱宽 × 柱高）"
  - "不等宽柱状图（柱宽代表样本量/权重）"
  - "市场份额图（宽度=市场规模，高度=占比）"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/flex-x"
---

## 最小可运行示例（马赛克图）

```javascript
import { Chart } from '@antv/g2';

// 马赛克图：x 类别，y 子类别比例，value 控制柱宽（市场规模）
const data = [
  { region: '华北', type: '线上', revenue: 300, share: 0.6 },
  { region: '华北', type: '线下', revenue: 300, share: 0.4 },
  { region: '华东', type: '线上', revenue: 500, share: 0.7 },
  { region: '华东', type: '线下', revenue: 500, share: 0.3 },
  { region: '华南', type: '线上', revenue: 200, share: 0.5 },
  { region: '华南', type: '线下', revenue: 200, share: 0.5 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'region',
    y: 'share',
    color: 'type',
  },
  transform: [
    {
      type: 'flexX',
      field: 'revenue',    // 控制柱宽的字段
      reducer: 'sum',      // 聚合方式（同一 x 类别可能有多行，需要 sum）
    },
    { type: 'stackY' },   // 再堆叠 y 方向（百分比）
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});

chart.render();
```

## 配置项

```javascript
transform: [
  {
    type: 'flexX',
    field: 'sampleSize',  // 控制宽度的字段名（每个 x 类别的权重）
    channel: 'y',         // 依据哪个通道的值计算弹性（默认 'y'）
    reducer: 'sum',       // 同一 x 类别下 field 值的聚合方式（'sum' 是最常用的）
  },
]
```

## 常见错误与修正

### 错误：flexX 和 stackY 顺序错误——先 stackY 后 flexX
```javascript
// ❌ 错误：应该先 flexX 再 stackY
transform: [
  { type: 'stackY' },   // ❌ stackY 先执行，flexX 后调整宽度，比例关系出错
  { type: 'flexX', field: 'revenue' },
]

// ✅ 正确顺序：先 flexX（设置宽度弹性），再 stackY（堆叠高度）
transform: [
  { type: 'flexX', field: 'revenue', reducer: 'sum' },  // ✅ 先设置弹性宽度
  { type: 'stackY' },                                     // ✅ 再堆叠
]
```

### 错误：没有设置 reducer——同一 x 有多行时宽度计算不一致
```javascript
// ❌ 未设置 reducer，同一 region 有多行（线上/线下），flexX 不知如何聚合宽度
transform: [{ type: 'flexX', field: 'revenue' }]  // ❌ 缺少 reducer

// ✅ 设置 reducer: 'sum' 对同一 x 的 field 求和
transform: [{ type: 'flexX', field: 'revenue', reducer: 'sum' }]  // ✅
```
