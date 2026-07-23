---
id: "g2-transform-stacky"
title: "G2 StackY 堆叠变换"
description: |
  StackY 是 G2 v5 中用于实现数据堆叠的 Mark Transform，
  将同一 x 位置的多个数值依次叠加，生成 y0/y1 区间。
  配置在 transform 数组中（与 data、encode 同级），是堆叠柱状图、堆叠面积图、饼图的核心依赖。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "StackY"
  - "堆叠"
  - "stackY"
  - "mark transform"
  - "堆叠柱状图"
  - "堆叠面积图"
  - "spec"

related:
  - "g2-mark-interval-stacked"
  - "g2-mark-area-stacked"
  - "g2-transform-normalizey"
  - "g2-transform-dodgex"
  - "g2-data-fold"

use_cases:
  - "创建堆叠柱状图"
  - "创建堆叠面积图"
  - "创建饼图（配合 theta 坐标系）"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/stack-y"
---

## 核心概念

**StackY 是标记变换（Mark Transform），不是数据变换（Data Transform）**

- 标记变换配置在 `transform` 数组中（与 `data`、`encode` 同级）
- 在标记渲染过程中执行，修改视觉通道值
- **不要**放在 `data.transform` 中

StackY 对每个 x 分组内的数据进行累积计算：
- 输入：`y` 值（各子类别的原始数值）
- 输出：`y0`（底部位置）和 `y1`（顶部位置），驱动柱体/面积的起止位置

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],  // ✅ Mark Transform：与 data/encode 同级
});
```

## 基本用法（Spec 模式）

```javascript
import { Chart } from '@antv/g2';

// 堆叠柱状图
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 100 },
    { month: 'Jan', type: 'B', value: 200 },
    { month: 'Feb', type: 'A', value: 120 },
    { month: 'Feb', type: 'B', value: 180 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // 声明堆叠变换
});

chart.render();
```

## 配置项

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    {
      type: 'stackY',
      orderBy: null,     // null | 'value' | 'sum' | 'series' — 控制堆叠顺序
      reverse: false,    // 是否反转堆叠顺序
      y: 'y',            // 输入 y 通道名（默认 'y'）
      y1: 'y1',          // 输出底部通道名（默认 'y1'）
    },
  ],
});
```

## 与 normalizeY 组合（百分比堆叠）

```javascript
// transform 数组支持多个变换链式执行
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },       // 先堆叠
    { type: 'normalizeY' },   // 再归一化到 [0, 1]
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## 用于饼图（配合 theta 坐标系）

```javascript
chart.options({
  type: 'interval',
  data: [
    { type: '分类一', value: 40 },
    { type: '分类二', value: 30 },
    { type: '分类三', value: 30 },
  ],
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],           // 将数值转为角度区间
  coordinate: { type: 'theta', outerRadius: 0.8 },
});
```

## 用于堆叠面积图

```javascript
chart.options({
  type: 'area',
  data: [...],
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});
```

## 常见错误与修正

### 错误 1：stackY 放在 data.transform 中

```javascript
// ❌ 错误：stackY 是 Mark Transform，不能放在 data.transform 中
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'stackY' }],  // ❌ 错误位置
  },
});

// ✅ 正确：stackY 放在 mark 的 transform 中（与 data/encode 同级）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],  // ✅ 正确
});
```

### 错误 2：transform 写成对象而非数组
```javascript
// ❌ 错误：transform 必须是数组
chart.options({ transform: { type: 'stackY' } });

// ✅ 正确
chart.options({ transform: [{ type: 'stackY' }] });
```

### 错误 3：饼图忘记 stackY
```javascript
// ❌ 错误：theta 坐标系中没有 stackY，所有扇形角度从 0 开始，完全重叠
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  coordinate: { type: 'theta' },
  // 缺少 transform！
});

// ✅ 正确
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // 必须！
  coordinate: { type: 'theta' },
});
```

### 错误 4：多系列数据不堆叠直接显示导致重叠
```javascript
// ❌ 错误：多类型 interval 没有 stackY 或 dodgeX，柱体在同位置堆叠
chart.options({
  type: 'interval',
  data: multiTypeData,
  encode: { x: 'month', y: 'value', color: 'type' },
  // 既没有 stackY（堆叠）也没有 dodgeX（分组）
});

// ✅ 堆叠展示
chart.options({ transform: [{ type: 'stackY' }], ... });

// ✅ 分组展示
chart.options({ transform: [{ type: 'dodgeX' }], ... });
```
