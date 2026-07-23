---
id: "g2-transform-symmetryy"
title: "G2 SymmetryY 对称变换（蝴蝶图 / 人口金字塔）"
description: |
  symmetryY 对 y 通道应用偏移使数据关于 y=0 轴对称，
  典型应用是人口金字塔（两个方向的柱状图对称展示）和蝴蝶图。
  通常与 transpose（转置）坐标系配合，实现水平对称条形图。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "symmetryY"
  - "对称"
  - "人口金字塔"
  - "蝴蝶图"
  - "population pyramid"
  - "transform"

related:
  - "g2-transform-stacky"
  - "g2-coord-transpose"
  - "g2-mark-interval-stacked"

use_cases:
  - "人口金字塔（男女年龄分布对称展示）"
  - "A/B 对比的蝴蝶图"
  - "正负值关于中心对称的图表"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/symmetry-y"
---

## 最小可运行示例（人口金字塔）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { age: '0-9',   gender: '男', value: 8500 },
  { age: '10-19', gender: '男', value: 9200 },
  { age: '20-29', gender: '男', value: 10300 },
  { age: '30-39', gender: '男', value: 9800 },
  { age: '40-49', gender: '男', value: 8900 },
  { age: '0-9',   gender: '女', value: 8100 },
  { age: '10-19', gender: '女', value: 8800 },
  { age: '20-29', gender: '女', value: 9900 },
  { age: '30-39', gender: '女', value: 9500 },
  { age: '40-49', gender: '女', value: 8700 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'age',
    y: 'value',
    color: 'gender',
  },
  transform: [
    { type: 'stackY' },     // 先堆叠
    { type: 'symmetryY' },  // 再对称（以 y=0 为中轴）
  ],
  coordinate: { transform: [{ type: 'transpose' }] },  // 转置为水平条形
  axis: {
    y: {
      labelFormatter: (v) => Math.abs(v).toLocaleString(),  // 负值显示为正数
    },
  },
});

chart.render();
```

## 配置项

```javascript
transform: [
  {
    type: 'symmetryY',
    groupBy: 'x',   // 按哪个通道分组，默认 'x'
  },
]
```

## 蝴蝶图（两个类别左右对称）

```javascript
chart.options({
  type: 'interval',
  data: abTestData,
  encode: { x: 'metric', y: 'value', color: 'group' },
  transform: [
    { type: 'stackY' },
    { type: 'symmetryY' },
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  style: { fillOpacity: 0.85 },
});
```

## 常见错误与修正

### 错误：symmetryY 前忘记 stackY——分组数据不会对称
```javascript
// ❌ 没有 stackY，两个 gender 的柱体重叠在同侧，对称失效
transform: [
  { type: 'symmetryY' },  // ❌ 少了前置 stackY
]

// ✅ 必须先 stackY 再 symmetryY
transform: [
  { type: 'stackY' },     // ✅ 先堆叠（分组数据叠在一起）
  { type: 'symmetryY' },  // ✅ 再对称（两组各自偏移到两侧）
]
```
