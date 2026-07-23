---
id: "g2-transform-diffy"
title: "G2 DiffY 差值区域变换"
description: |
  diffY 计算两条折线之间的差值区间（y0 到 y1），用于绘制差值面积图。
  保持上方折线的 y 值不变，计算下方折线相对于上方的差值作为 y1，
  视觉上展示两系列之间的正/负差异区域。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "diffY"
  - "差值"
  - "差异面积"
  - "对比"
  - "transform"
  - "区间面积"

related:
  - "g2-mark-area-stacked"
  - "g2-transform-stacky"
  - "g2-mark-line-basic"

use_cases:
  - "展示两条折线之间的正/负差异区域"
  - "实际值 vs 预测值的偏差可视化"
  - "价格上下区间的差值展示"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/diff-y"
---

## 最小可运行示例（实际 vs 预测差异）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', actual: 83,  forecast: 75 },
  { month: 'Feb', actual: 60,  forecast: 70 },
  { month: 'Mar', actual: 95,  forecast: 85 },
  { month: 'Apr', actual: 72,  forecast: 80 },
  { month: 'May', actual: 110, forecast: 100 },
  { month: 'Jun', actual: 88,  forecast: 95 },
];

// 转换为长表格式
const longData = data.flatMap(d => [
  { month: d.month, value: d.actual,   type: '实际' },
  { month: d.month, value: d.forecast, type: '预测' },
]);

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'view',
  children: [
    // 差值面积（正差异：实际>预测 显示绿色，负差异：实际<预测 显示红色）
    {
      type: 'area',
       longData,
      encode: { x: 'month', y: 'value', color: 'type', series: 'type' },
      transform: [{ type: 'diffY' }],   // 计算两系列间的差值区间
      style: {
        fillOpacity: 0.3,
      },
    },
    // 主折线
    {
      type: 'line',
       longData,
      encode: { x: 'month', y: 'value', color: 'type' },
      style: { lineWidth: 2 },
    },
  ],
});

chart.render();
```

## 配置项

```javascript
transform: [
  {
    type: 'diffY',
    groupBy: 'x',   // 按 x 通道分组对齐，默认 'x'
  },
]
```

## 常见错误与修正

### 错误：数据没有两个系列——diffY 需要至少两个 series 才能计算差值
```javascript
// ❌ 只有一个系列，diffY 没有对比基准，差值为 0
chart.options({
  type: 'area',
  data: singleSeriesData,
  encode: { x: 'date', y: 'value' },  // ❌ 没有 series/color 区分两组
  transform: [{ type: 'diffY' }],
});

// ✅ 必须有两个系列（通过 color/series 区分）
chart.options({
  type: 'area',
  data: twoSeriesData,
  encode: {
    x: 'date',
    y: 'value',
    color: 'type',   // ✅ 区分两个系列
    series: 'type',
  },
  transform: [{ type: 'diffY' }],
});
```

### 错误：diffY 与 stackY 混淆——stackY 是累积，diffY 是差值
```javascript
// stackY：将多个系列的 y 值累积（适合堆叠图）
transform: [{ type: 'stackY' }]

// diffY：计算两个系列之间的差值区间（适合差值面积图）
transform: [{ type: 'diffY' }]
```
