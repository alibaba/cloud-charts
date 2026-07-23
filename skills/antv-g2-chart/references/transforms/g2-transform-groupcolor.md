---
id: "g2-transform-groupcolor"
title: "G2 GroupColor Transform"
description: |
  按 color 通道对数据进行分组聚合。常用于分类聚合场景，
  如按类别统计总和、平均值等。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "分组"
  - "聚合"
  - "color"
  - "分类统计"

related:
  - "g2-transform-groupx"
  - "g2-transform-groupy"
  - "g2-transform-group"

use_cases:
  - "按类别统计总和"
  - "按颜色维度聚合数据"
  - "计算各类别的平均值、最大值"

anti_patterns:
  - "需要保留原始数据时不应使用"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## 核心概念

GroupColor Transform 按 `color` 通道的值对数据进行分组，然后对每组进行聚合计算。

**聚合函数支持：**
- `sum`：求和
- `mean`：平均值
- `median`：中位数
- `max`：最大值
- `min`：最小值
- `count`：计数
- `first`：取第一个值
- `last`：取最后一个值

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
    { category: 'A', type: 'X', value: 10 },
    { category: 'A', type: 'Y', value: 20 },
    { category: 'B', type: 'X', value: 15 },
    { category: 'B', type: 'Y', value: 25 },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'type',  // 按 type 分组
  },
  transform: [
    {
      type: 'groupColor',
      y: 'sum',  // 对每组求和
    },
  ],
});

chart.render();
```

## 常用变体

### 计算平均值

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [
    { type: 'groupColor', y: 'mean' },
  ],
});
```

### 多通道聚合

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type', size: 'count' },
  transform: [
    {
      type: 'groupColor',
      y: 'sum',
      size: 'count',  // 同时聚合 size 通道
    },
  ],
});
```

### 自定义聚合函数

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [
    {
      type: 'groupColor',
      y: (I, V) => {
        // I: 组内索引数组
        // V: 该通道的值数组
        return I.reduce((sum, i) => sum + V[i], 0) / I.length;
      },
    },
  ],
});
```

## 完整类型参考

```typescript
interface GroupColorTransform {
  type: 'groupColor';
  y?: 'sum' | 'mean' | 'median' | 'max' | 'min' | 'count' | 'first' | 'last' | ((I: number[], V: any[]) => any);
  // 其他通道也可以聚合
  [channel: string]: Reducer;
}

type Reducer = 'sum' | 'mean' | 'median' | 'max' | 'min' | 'count' | 'first' | 'last' | ((I: number[], V: any[]) => any);
```

## 常见错误与修正

### 错误 1：未指定 color 通道

```javascript
// ❌ 错误：没有 color 通道，groupColor 无效
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [{ type: 'groupColor', y: 'sum' }],
});

// ✅ 正确：添加 color 通道
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [{ type: 'groupColor', y: 'sum' }],
});
```

### 错误 2：聚合函数名拼写错误

```javascript
// ❌ 错误
transform: [{ type: 'groupColor', y: 'average' }]

// ✅ 正确
transform: [{ type: 'groupColor', y: 'mean' }]
```