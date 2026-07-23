---
id: "g2-mark-interval-grouped"
title: "G2 分组柱状图"
description: |
  使用 Interval Mark 配合 dodgeX Transform 创建分组柱状图。
  分组柱状图将同类别的多系列数据并排展示，便于横向对比各子类别的绝对数值。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "分组柱状图"
  - "grouped bar"
  - "dodgeX"
  - "多系列"
  - "并排"
  - "对比"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-stacked"
  - "g2-transform-dodgex"

use_cases:
  - "对比同一类别下多个子指标的绝对值"
  - "不同时间段各产品线的销量对比"
  - "多维度数据并排展示"

anti_patterns:
  - "系列数超过 4-5 个时每组柱子过细，可读性差"
  - "关注占比关系时改用堆叠柱状图"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/grouped"
---

## 核心概念

分组柱状图 = `type: 'interval'` + `transform: [{ type: 'dodgeX' }]`。
`dodgeX` 将同一 x 位置的多系列柱体在水平方向上错开排列，避免重叠。

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
    { month: 'Jan', type: '产品A', value: 100 },
    { month: 'Jan', type: '产品B', value: 130 },
    { month: 'Jan', type: '产品C', value: 90  },
    { month: 'Feb', type: '产品A', value: 120 },
    { month: 'Feb', type: '产品B', value: 100 },
    { month: 'Feb', type: '产品C', value: 150 },
    { month: 'Mar', type: '产品A', value: 80  },
    { month: 'Mar', type: '产品B', value: 140 },
    { month: 'Mar', type: '产品C', value: 110 },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
  },
  transform: [{ type: 'dodgeX' }],   // 关键：分组变换
});

chart.render();
```

## 分组条形图（水平方向）

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## 分组柱状图 + 数据标签

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  labels: [
    {
      text: 'value',
      position: 'outside',
      style: { fontSize: 11 },
    },
  ],
});
```

## 调整分组间距

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    {
      type: 'dodgeX',
      padding: 0.1,       // 组内柱子间距（0-1），默认 0
      paddingOuter: 0.1,  // 组间间距
    },
  ],
});
```

## 常见错误与修正

### 错误 1：忘记 dodgeX，柱体重叠
```javascript
// ❌ 错误：多系列数据没有 dodgeX，柱体在同位置叠加
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // 缺少 transform！
});

// ✅ 正确
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});
```

### 错误 2：同时用了 stackY 和 dodgeX
```javascript
// ❌ 错误：两个变换冲突，行为不可预期
chart.options({
  transform: [{ type: 'stackY' }, { type: 'dodgeX' }],
});

// ✅ 正确：堆叠和分组是互斥的，选其一
chart.options({ transform: [{ type: 'stackY' }] });   // 堆叠
chart.options({ transform: [{ type: 'dodgeX' }] });   // 分组
```
