---
id: "g2-coord-theta"
title: "G2 Theta 坐标系（饼图 / 环形图）"
description: |
  Theta 坐标系是 G2 v5 中制作饼图和环形图的专用坐标系。
  本质上是 Transpose + Polar 的组合：将 y 通道（数值）映射为角度。
  必须配合 stackY transform 使用，否则所有扇形角度从 0 开始完全重叠。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "theta"
  - "饼图"
  - "环形图"
  - "pie"
  - "donut"
  - "coordinate"

related:
  - "g2-transform-stacky"
  - "g2-mark-arc-pie"
  - "g2-mark-arc-donut"
  - "g2-coord-polar"

use_cases:
  - "饼图（展示各部分占总体的比例）"
  - "环形图（中间留空展示汇总数值）"
  - "玫瑰饼图"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/theta"
---

## 最小可运行示例（饼图）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 480, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { type: '电子产品', value: 40 },
    { type: '服装',     value: 25 },
    { type: '食品',     value: 20 },
    { type: '其他',     value: 15 },
  ],
  encode: {
    y: 'value',      // 数值映射为扇形角度大小
    color: 'type',   // 颜色区分类别
  },
  transform: [{ type: 'stackY' }],       // 必须！将数值累积为角度区间
  coordinate: { type: 'theta' },         // 必须！theta 坐标系
});

chart.render();
```

## 环形图（设置 innerRadius）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: {
    type: 'theta',
    innerRadius: 0.6,   // 内孔半径比例（0.5~0.7 是常见值）
    outerRadius: 0.9,
  },
  labels: [
    {
      position: 'outside',
      text: (d) => `${d.type}: ${d.value}`,
    },
  ],
});
```

## 配置项

```javascript
coordinate: {
  type: 'theta',
  startAngle: -Math.PI / 2,    // 起始角度，默认 -π/2（12点钟方向）
  endAngle: (Math.PI * 3) / 2, // 结束角度，默认顺时针一整圈
  innerRadius: 0,              // 内孔大小，0 = 实心饼图，> 0 = 环形图
  outerRadius: 1,              // 外径比例
}
```

## 带百分比标签的饼图

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  labels: [
    {
      position: 'outside',
      text: (d, i, arr) => {
        const total = arr.reduce((sum, item) => sum + item.value, 0);
        return `${((d.value / total) * 100).toFixed(1)}%`;
      },
    },
  ],
  legend: { color: { position: 'right' } },
});
```

## 常见错误与修正

### 错误 1：忘记 stackY —— 所有扇形从 0 开始完全重叠
```javascript
// ❌ 错误：没有 stackY，所有扇区角度都从 0 开始，图形全部重叠
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  coordinate: { type: 'theta' },   // ❌ 缺少 transform！
});

// ✅ 正确：必须加 stackY
chart.options({
  transform: [{ type: 'stackY' }],  // ✅ 先累积角度
  coordinate: { type: 'theta' },
});
```

### 错误 2：用 polar 代替 theta 做饼图
```javascript
// ❌ 错误：polar 坐标系 y 通道映射半径，不会生成扇形角度
chart.options({
  coordinate: { type: 'polar' },  // ❌ 得到玫瑰图，不是饼图
});

// ✅ 饼图必须用 theta
chart.options({
  coordinate: { type: 'theta' },  // ✅
});
```

### 错误 3：encode 中设置了 x 通道
```javascript
// ❌ 错误：theta 坐标系的饼图不需要 x 通道
chart.options({
  encode: {
    x: 'type',    // ❌ 多余，theta 坐标中 x 通道无意义
    y: 'value',
    color: 'type',
  },
});

// ✅ 正确：theta 饼图只需要 y 和 color
chart.options({
  encode: {
    y: 'value',    // ✅ 数值 → 角度
    color: 'type', // ✅ 类别 → 颜色
  },
});
```
