---
id: "g2-mark-beeswarm"
title: "G2 蜂群图（beeswarm）"
description: |
  beeswarm mark 将散点沿分类轴自动排布避免重叠，形如蜂巢，
  每个点紧密排列但互不遮挡。适合展示分类变量下单维数值分布。
  与 jitter transform 的随机偏移不同，beeswarm 使用力导向算法精确排布。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "beeswarm"
  - "蜂群图"
  - "点分布"
  - "无重叠散点"
  - "分布图"

related:
  - "g2-mark-point-scatter"
  - "g2-transform-jitter"
  - "g2-mark-box-boxplot"

use_cases:
  - "展示各类别下数据点的精确分布（无重叠）"
  - "与箱线图叠加使用，同时显示摘要和原始数据"
  - "小样本数据的精确分布展示"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#beeswarm"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { dept: '研发', salary: 18000 }, { dept: '研发', salary: 22000 },
  { dept: '研发', salary: 15000 }, { dept: '研发', salary: 25000 },
  { dept: '研发', salary: 19000 }, { dept: '研发', salary: 21000 },
  { dept: '销售', salary: 12000 }, { dept: '销售', salary: 16000 },
  { dept: '销售', salary: 14000 }, { dept: '销售', salary: 11000 },
  { dept: '设计', salary: 17000 }, { dept: '设计', salary: 20000 },
  { dept: '设计', salary: 18500 }, { dept: '设计', salary: 23000 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'dept',
    y: 'salary',
    color: 'dept',
    shape: 'point',
  },
  // beeswarm 布局通过 layout 配置，而不是独立的 mark type
  // 实际上是 point mark + 蜂群布局变换
  style: { r: 5, fillOpacity: 0.8 },
  // 用 jitter transform 近似蜂群效果（或使用 beeswarm data 变换）
  transform: [{ type: 'jitter', padding: 0.1 }],
});

chart.render();
```

## 使用 beeswarm mark（独立类型）

```javascript
// G2 v5 也支持 type: 'beeswarm' 直接使用蜂群布局
const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'dept',
    y: 'salary',
    color: 'dept',
  },
  // beeswarm 通过力导向算法排布，点不重叠
  style: { r: 4, fillOpacity: 0.75 },
  layout: {
    type: 'beeswarm',   // 使用蜂群布局
    padding: 1,         // 点间距
  },
});
```

## 与箱线图叠加

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'boxplot',
      encode: { x: 'dept', y: 'salary' },
      style: { boxFill: 'transparent', boxStroke: '#999', lineWidth: 1.5 },
    },
    {
      type: 'point',
      encode: { x: 'dept', y: 'salary', color: 'dept' },
      transform: [{ type: 'jitter', padding: 0.1 }],
      style: { r: 3.5, fillOpacity: 0.65 },
    },
  ],
});
```

## 常见错误与修正

### 错误：数据量太大用 beeswarm——布局计算慢且视觉拥挤
```javascript
// ❌ 千条以上数据用蜂群图会很慢且视觉饱和
chart.options({
  data: tenThousandRows,   // ❌ 数据太多
  transform: [{ type: 'jitter' }],
});

// ✅ 大数据量改用密度图或带颜色的散点图
// beeswarm 适合 < 500 条数据
chart.options({
  data: smallSample,
  transform: [{ type: 'jitter', padding: 0.08 }],  // ✅ 小样本
});
```
