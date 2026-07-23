---
id: "g2-transform-selectx"
title: "G2 SelectX Transform"
description: |
  按 X 通道选择数据子集。用于筛选每个 X 类别的特定数据点，
  如最大值、最小值、首个、末个等。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "选择"
  - "筛选"
  - "X轴"
  - "极值"

related:
  - "g2-transform-select"
  - "g2-transform-selecty"

use_cases:
  - "只显示每个类别的最大值"
  - "筛选每个 X 分组的首个/末个数据点"
  - "突出显示极值点"

anti_patterns:
  - "需要保留所有数据时不应使用"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## 核心概念

SelectX Transform 按 X 通道分组，然后从每组中选择特定的数据点。选择器支持：
- `max`：Y 值最大的点
- `min`：Y 值最小的点
- `first`：首个数据点
- `last`：末个数据点
- 自定义选择函数

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'point',
  data: [
    { category: 'A', value: 10 },
    { category: 'A', value: 25 },
    { category: 'A', value: 15 },
    { category: 'B', value: 20 },
    { category: 'B', value: 35 },
    { category: 'B', value: 30 },
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  transform: [
    {
      type: 'selectX',
      selector: 'max',  // 只保留每个类别的最大值点
    },
  ],
});

chart.render();
```

## 常用变体

### 选择最小值

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    { type: 'selectX', selector: 'min' },
  ],
});
```

### 选择首个/末个

```javascript
// 选择每个类别的第一个数据点
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    { type: 'selectX', selector: 'first' },
  ],
});

// 选择每个类别的最后一个数据点
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    { type: 'selectX', selector: 'last' },
  ],
});
```

### 自定义选择器

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'selectX',
      selector: (I, Y) => {
        // I: 组内索引数组
        // Y: Y 通道的值数组
        // 返回选中的索引
        return I.reduce((maxIdx, i) => Y[i] > Y[maxIdx] ? i : maxIdx, I[0]);
      },
    },
  ],
});
```

## 完整类型参考

```typescript
interface SelectXTransform {
  type: 'selectX';
  selector: 'max' | 'min' | 'first' | 'last' | ((I: number[], Y: any[]) => number);
}
```

## 与 Select/SelectY 的对比

| Transform | 分组维度 | 常用场景 |
|-----------|---------|---------|
| select | 按指定通道 | 通用选择 |
| selectX | 按 X 通道 | X 轴分类筛选 |
| selectY | 按 Y 通道 | Y 轴分类筛选 |

## 常见错误与修正

### 错误 1：selector 拼写错误

```javascript
// ❌ 错误
transform: [{ type: 'selectX', selector: 'maximum' }]

// ✅ 正确
transform: [{ type: 'selectX', selector: 'max' }]
```

### 错误 2：自定义选择器返回值错误

```javascript
// ❌ 错误：返回了值而非索引
selector: (I, Y) => Math.max(...I.map(i => Y[i]))

// ✅ 正确：返回索引
selector: (I, Y) => I.reduce((maxIdx, i) => Y[i] > Y[maxIdx] ? i : maxIdx, I[0])
```