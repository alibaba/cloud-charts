---
id: "g2-transform-stack-enter"
title: "G2 StackEnter 入场动画堆叠变换"
description: |
  stackEnter 是 G2 v5 中用于分组入场动画的 Transform，
  将同一分组内的元素按序错开入场时间（enterDelay），
  实现"一组一组依次出现"的入场动画效果。
  常用于柱状图、折线图的分组逐步入场展示。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "stackEnter"
  - "入场动画"
  - "enterDelay"
  - "分组动画"
  - "transform"
  - "animation"

related:
  - "g2-animation-intro"
  - "g2-transform-stacky"
  - "g2-mark-interval-grouped"

use_cases:
  - "柱状图各分组逐批入场（X 分组依次出现）"
  - "折线图系列逐条依次绘制"
  - "数据讲述场景中按节奏逐步呈现数据"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/stack-enter"
---

## 核心概念

`stackEnter` 为每条数据分配 `enterDelay` 值：
- 将数据按 `groupBy` 通道（默认 `['x']`）分组
- 同一组内的元素共享相同的入场延迟
- 不同组之间依次叠加延迟时间

每组的延迟 = 前面所有组的 `enterDuration` 之和。

## 基本用法（柱状图分组入场）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', value: 83 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 95 },
    { month: 'Apr', value: 72 },
    { month: 'May', value: 110 },
  ],
  encode: { x: 'month', y: 'value', color: 'month' },
  transform: [
    {
      type: 'stackEnter',
      groupBy: ['x'],          // 按 x 分组（每个月份一批）
      orderBy: null,           // 不额外排序
      duration: 300,           // 每组动画持续时长（毫秒），默认使用 enterDuration
    },
  ],
  animate: {
    enter: {
      type: 'scaleInY',        // 每组柱子从下往上生长
      duration: 300,
    },
  },
});

chart.render();
```

## 折线图多系列依次入场

```javascript
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'date', y: 'value', color: 'series' },
  transform: [
    {
      type: 'stackEnter',
      groupBy: ['color'],    // 按颜色（系列）分组，每条线依次入场
      duration: 800,
    },
  ],
  animate: {
    enter: {
      type: 'pathIn',        // 折线从左向右绘制
      duration: 800,
    },
  },
});
```

## 配置项

```javascript
chart.options({
  transform: [
    {
      type: 'stackEnter',
      groupBy: ['x'],          // 分组通道，默认 ['x']
                               // 可以是单个字符串或数组：['x', 'color']
      orderBy: null,           // 组间排序依据：null | 'x' | 函数
      reverse: false,          // 是否反转组的顺序
      duration: undefined,     // 每组入场时长（毫秒），不设则使用 animate.enter.duration
    },
  ],
});
```

## 常见错误与修正

### 错误：忘记配置 animate.enter
```javascript
// ❌ 有 stackEnter 但没有 animate.enter，看不到动画效果
chart.options({
  transform: [{ type: 'stackEnter', groupBy: ['x'] }],
  // 缺少 animate 配置！
});

// ✅ 必须配合 animate.enter 使用
chart.options({
  transform: [{ type: 'stackEnter', groupBy: ['x'], duration: 400 }],
  animate: {
    enter: {
      type: 'scaleInY',    // 选择合适的入场动画类型
      duration: 400,
    },
  },
});
```

### 错误：duration 与 animate.enter.duration 不一致导致动画不连贯
```javascript
// ❌ stackEnter duration 与 animate.enter.duration 不匹配
chart.options({
  transform: [{ type: 'stackEnter', duration: 500 }],  // 500ms 每组
  animate: { enter: { type: 'scaleInY', duration: 200 } },  // ❌ 200ms 动画（组还没完成就切换）

// ✅ 保持一致
chart.options({
  transform: [{ type: 'stackEnter', duration: 400 }],
  animate: { enter: { type: 'scaleInY', duration: 400 } },   // ✅ 一致
});
```
