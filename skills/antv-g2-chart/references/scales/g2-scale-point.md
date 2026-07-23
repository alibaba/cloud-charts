---
id: "g2-scale-point"
title: "G2 Point Scale"
description: |
  点比例尺，将离散的类别映射到均匀分布的点上。
  与 Band Scale 类似，但带宽固定为 0，常用于散点图的位置映射。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "比例尺"
  - "scale"
  - "point"
  - "离散"
  - "位置"

related:
  - "g2-scale-band"
  - "g2-scale-ordinal"
  - "g2-mark-point-scatter"

use_cases:
  - "散点图的 X/Y 轴位置映射"
  - "分类数据的位置映射"
  - "需要均匀分布的离散数据"

anti_patterns:
  - "连续数值数据应使用 Linear Scale"
  - "需要带宽的场景应使用 Band Scale"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale"
---

## 核心概念

Point Scale 是一种离散比例尺：
- 将类别映射到均匀分布的点位置
- 带宽（bandwidth）固定为 0
- 每个类别对应一个精确的位置点

**与 Band Scale 的区别：**
- Band Scale：每个类别占据一段区间（有带宽）
- Point Scale：每个类别对应一个精确点（无带宽）

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
    { category: 'B', value: 20 },
    { category: 'C', value: 15 },
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  scale: {
    x: { type: 'point' },
  },
});

chart.render();
```

## 常用变体

### 设置内边距

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      padding: 0.5,  // 两端的内边距，范围 [0, 1]
    },
  },
});
```

### 设置对齐方式

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      align: 0.5,  // 0: 左对齐, 0.5: 居中, 1: 右对齐
    },
  },
});
```

### 指定 domain

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      domain: ['A', 'B', 'C', 'D'],  // 显式指定类别顺序
    },
  },
});
```

### 指定 range

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      range: [0.1, 0.9],  // 映射范围，默认 [0, 1]
    },
  },
});
```

## 完整类型参考

```typescript
interface PointScaleOption {
  type: 'point';
  domain?: string[] | number[];  // 类别域
  range?: [number, number];      // 输出范围，默认 [0, 1]
  padding?: number;              // 内边距，默认 0
  align?: number;                // 对齐方式，默认 0.5
  round?: boolean;               // 是否四舍五入，默认 false
}
```

## 与 Band Scale 的对比

| 特性 | Point Scale | Band Scale |
|------|-------------|------------|
| 带宽 | 0 | 有带宽 |
| 输出 | 精确点位置 | 区间起点 |
| 适用 | 散点图、点图 | 柱状图、条形图 |
| padding | 单一值 | paddingInner + paddingOuter |

## 自动推断

G2 会根据 mark 类型自动推断比例尺：
- `interval` mark 的分类轴 → Band Scale
- `point` mark 的分类轴 → Point Scale
- `line` mark 的分类轴 → Band Scale

```javascript
// 自动推断为 Point Scale
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  // scale: { x: { type: 'point' } }  // 可省略
});
```

## 常见错误与修正

### 错误 1：用于需要带宽的 mark（柱状图、热力图）

`point` 比例尺 bandwidth = 0，`interval`（柱状图）和 `cell`（热力图）mark 依赖 bandwidth 来渲染有面积的图形。对这类 mark 使用 `point` 比例尺会导致柱体/格子宽度为 0，图形不可见。

```javascript
// ❌ 错误：柱状图用 point，柱体宽度为 0
chart.options({
  type: 'interval',
  encode: { x: 'category', y: 'value' },
  scale: { x: { type: 'point' } },  // ❌ bandwidth=0，柱子消失
});

// ❌ 错误：热力图用 point，格子宽度为 0（常见误用："确保均匀分布"）
chart.options({
  type: 'cell',
  encode: { x: 'date', y: 'month', color: 'value' },
  scale: {
    x: { type: 'point' },  // ❌ cell 需要 bandwidth
    y: { type: 'point' },  // ❌
  },
});

// ✅ 正确：interval 和 cell 用 band（或省略，G2 自动推断）
chart.options({
  type: 'cell',
  encode: { x: 'date', y: 'month', color: 'value' },
  scale: {
    x: { type: 'band' },   // ✅ 有带宽，格子可见
    y: { type: 'band' },   // ✅
  },
  // 或直接省略 scale，cell mark 默认就是 band
});
```

**适用 `point` 的 mark**：`point`（散点图）、`line`（折线图，用于分类 x 轴）。

### 错误 2：padding 值过大

```javascript
// ❌ 错误：padding 超过范围
scale: { x: { type: 'point', padding: 1.5 } }

// ✅ 正确：padding 在 [0, 1] 范围内
scale: { x: { type: 'point', padding: 0.5 } }
```

### 错误 3：align 值错误

```javascript
// ❌ 错误：align 超过范围
scale: { x: { type: 'point', align: 2 } }

// ✅ 正确：align 在 [0, 1] 范围内
scale: { x: { type: 'point', align: 0.5 } }
```