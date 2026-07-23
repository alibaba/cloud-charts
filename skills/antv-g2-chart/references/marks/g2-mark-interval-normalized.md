---
id: "g2-mark-interval-normalized"
title: "G2 百分比堆叠柱状图"
description: |
  使用 Interval Mark 配合 stackY + normalizeY Transform 创建百分比堆叠柱状图。
  每组柱体总高度归一化为 100%，聚焦展示各子类别的占比变化，
  消除总量差异的干扰，便于跨组比较结构分布。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "百分比堆叠"
  - "normalized"
  - "normalizeY"
  - "占比"
  - "结构分析"
  - "100% stacked bar"
  - "spec"

related:
  - "g2-mark-interval-stacked"
  - "g2-mark-interval-grouped"
  - "g2-transform-normalizey"
  - "g2-transform-stacky"

use_cases:
  - "比较不同组别中各子类别的比例分布"
  - "关注结构变化而非绝对数值时"
  - "消除总量差异，突出占比"

anti_patterns:
  - "需要看绝对数值变化时，改用普通堆叠柱状图"
  - "子类别只有两个时，简单折线图或面积图更直观"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/normalized"
---

## 核心概念

百分比堆叠 = `stackY` + `normalizeY` 两个变换顺序执行：
1. `stackY`：先将各子类别数值堆叠为 y0/y1 区间
2. `normalizeY`：再将每组的 y 值归一化到 [0, 1]

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 100 },
    { month: 'Jan', type: 'B', value: 200 },
    { month: 'Jan', type: 'C', value: 150 },
    { month: 'Feb', type: 'A', value: 80  },
    { month: 'Feb', type: 'B', value: 220 },
    { month: 'Feb', type: 'C', value: 100 },
    { month: 'Mar', type: 'A', value: 130 },
    { month: 'Mar', type: 'B', value: 180 },
    { month: 'Mar', type: 'C', value: 90  },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
  },
  transform: [
    { type: 'stackY' },      // 1. 先堆叠
    { type: 'normalizeY' },  // 2. 再归一化为百分比
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});

chart.render();
```

## 带百分比数据标签

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
  labels: [
    {
      text: (d) => `${(d.value * 100).toFixed(1)}%`,  // 注意：归一化后 value 已是 0-1
      position: 'inside',
      style: {
        fill: 'white',
        fontSize: 11,
        fontWeight: 'bold',
      },
      // 过滤掉占比过小的标签（避免拥挤）
      filter: (d) => d.value > 0.05,
    },
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## 百分比堆叠条形图（水平）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    x: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## 常见错误与修正

### 错误：transform 顺序颠倒
```javascript
// ❌ 错误：先 normalizeY 再 stackY，结果不正确
chart.options({
  transform: [{ type: 'normalizeY' }, { type: 'stackY' }],
});

// ✅ 正确：必须先 stackY 后 normalizeY
chart.options({
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
});
```
