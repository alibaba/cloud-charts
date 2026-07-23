---
id: "g2-transform-groupy"
title: "G2 GroupY Transform"
description: |
  按 Y 通道对数据进行分组聚合。与 GroupX 对称，
  用于按 Y 维度聚合数据的场景。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "分组"
  - "聚合"
  - "Y轴"
  - "统计"

related:
  - "g2-transform-groupx"
  - "g2-transform-groupcolor"
  - "g2-transform-group"

use_cases:
  - "按 Y 维度统计"
  - "水平条形图聚合"
  - "转置坐标系下的分组聚合"

anti_patterns:
  - "Y 通道为连续数值时分组效果不佳"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## 核心概念

GroupY Transform 按 `y` 通道的值对数据进行分组，同时考虑 `color` 和 `series` 通道，然后对每组进行聚合计算。

**分组维度：**
- 主维度：`y` 通道
- 附加维度：`color`、`series`

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
  coordinate: { transform: [{ type: 'transpose' }] },  // 转置为水平条形图
  data: [
    { category: 'A', group: 'X', value: 10 },
    { category: 'A', group: 'Y', value: 20 },
    { category: 'B', group: 'X', value: 15 },
    { category: 'B', group: 'Y', value: 25 },
  ],
  encode: {
    x: 'value',
    y: 'category',
    color: 'group',
  },
  transform: [
    {
      type: 'groupY',
      x: 'sum',  // 对每组求和
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
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category', color: 'group' },
  transform: [
    { type: 'groupY', x: 'mean' },
  ],
});
```

### 计数统计

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    { type: 'groupY', x: 'count' },
  ],
});
```

### 多通道聚合

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category', size: 'count' },
  transform: [
    {
      type: 'groupY',
      x: 'sum',
      size: 'count',
    },
  ],
});
```

## 完整类型参考

```typescript
interface GroupYTransform {
  type: 'groupY';
  x?: Reducer;
  // 其他通道也可以聚合
  [channel: string]: Reducer;
}

type Reducer = 'sum' | 'mean' | 'median' | 'max' | 'min' | 'count' | 'first' | 'last' | ((I: number[], V: any[]) => any);
```

## 与 GroupX 的对比

| 特性 | GroupX | GroupY |
|------|--------|--------|
| 分组维度 | x, color, series | y, color, series |
| 常用场景 | 竖向柱状图 | 水平条形图 |
| 聚合通道 | 通常是 y | 通常是 x |

## 常见错误与修正

### 错误 1：在非转置坐标系中使用

```javascript
// ⚠️ 注意：在普通坐标系中，GroupY 通常用于 Y 为分类轴的情况
// 如果 Y 是数值轴，分组可能没有意义

// ✅ 正确：转置坐标系 + GroupY
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category' },
  transform: [{ type: 'groupY', x: 'sum' }],
});
```