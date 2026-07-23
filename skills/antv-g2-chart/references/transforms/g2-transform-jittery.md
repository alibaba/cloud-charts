---
id: "g2-transform-jittery"
title: "G2 JitterY Transform"
description: |
  在 Y 方向对数据进行抖动处理，避免点重叠。
  常用于散点图中分类数据点的分散显示。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "抖动"
  - "jitter"
  - "散点图"
  - "防重叠"
  - "Y轴"

related:
  - "g2-transform-jitter"
  - "g2-transform-jitterx"
  - "g2-mark-point-scatter"

use_cases:
  - "分类散点图中避免点重叠"
  - "水平方向分类数据的分布展示"
  - "转置坐标系下的抖动"

anti_patterns:
  - "连续数值数据不需要抖动"
  - "点数量过少时抖动效果不明显"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## 核心概念

JitterY Transform 在 Y 方向对数据点进行随机偏移，使重叠的点分散显示。与 JitterX 对称，适用于 Y 轴为分类数据的情况。

**工作原理：**
1. 根据 Y 轴比例尺确定每个类别的范围
2. 在范围内随机偏移每个点的 Y 位置
3. 通过 `padding` 控制偏移范围

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
    { value: 10, category: 'A' },
    { value: 12, category: 'A' },
    { value: 11, category: 'A' },
    { value: 20, category: 'B' },
    { value: 22, category: 'B' },
  ],
  encode: {
    x: 'value',
    y: 'category',
  },
  transform: [
    { type: 'jitterY' },
  ],
});

chart.render();
```

## 常用变体

### 控制抖动范围

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    {
      type: 'jitterY',
      padding: 0.2,  // 抖动范围比例
    },
  ],
});
```

### 结合 JitterX 使用

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'categoryX', y: 'categoryY' },
  transform: [
    { type: 'jitterX' },
    { type: 'jitterY' },
  ],
});
```

### 自定义随机函数

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    {
      type: 'jitterY',
      random: () => Math.random(),
    },
  ],
});
```

## 完整类型参考

```typescript
interface JitterYTransform {
  type: 'jitterY';
  padding?: number;      // 抖动范围的内边距，默认 0
  random?: () => number; // 随机数生成函数，默认 Math.random
}
```

## 与 Jitter/JitterX 的对比

| Transform | 抖动方向 | 常用场景 |
|-----------|---------|---------|
| jitter | X 和 Y | 二维分类数据 |
| jitterX | 仅 X | X 轴分类数据 |
| jitterY | 仅 Y | Y 轴分类数据 |

## 常见错误与修正

### 错误 1：对连续数据使用抖动

```javascript
// ❌ 不推荐：Y 轴是连续数值时抖动可能造成误解
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'continuousValue' },
  transform: [{ type: 'jitterY' }],
});

// ✅ 正确：Y 轴是分类数据时使用
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [{ type: 'jitterY' }],
});
```

### 错误 2：padding 值过大

```javascript
// ❌ 错误：padding 过大会导致点溢出到相邻类别
transform: [{ type: 'jitterY', padding: 0.8 }]

// ✅ 正确：合理的 padding 值
transform: [{ type: 'jitterY', padding: 0.2 }]
```