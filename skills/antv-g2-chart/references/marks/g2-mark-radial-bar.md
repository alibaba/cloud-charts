---
id: "g2-mark-radial-bar"
title: "G2 Radial Bar Chart Mark"
description: |
  玉珏图/径向柱状图 Mark。使用 interval 标记配合 radial 坐标系，以环形方式展示分类数据对比。
  适用于审美需求较高的数据展示场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "玉珏图"
  - "径向柱状图"
  - "radial bar"
  - "环形柱状图"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-rose"

use_cases:
  - "分类数据对比"
  - "美观展示"
  - "大屏可视化"

anti_patterns:
  - "精确数值对比应使用柱状图"
  - "数据必须排序"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/radial-bar"
---

## 核心概念

玉珏图（径向柱状图）是柱状图在极坐标系下的变换：
- 使用 `interval` 标记
- 配合 `radial` 坐标系
- 以弧长表示数值大小

**注意事项：**
- 存在半径反馈效应，外圈看起来更大
- 数据必须排序
- 更适合审美展示而非精确对比

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'interval',
  data: [
    { question: '台海关系', percent: 0.21 },
    { question: '军事力量', percent: 0.47 },
    { question: '环境影响', percent: 0.49 },
  ],
  coordinate: { type: 'radial', innerRadius: 0.2 },
  encode: {
    x: 'question',
    y: 'percent',
    color: 'question',
  },
  style: {
    radiusTopLeft: 4,
    radiusTopRight: 4,
  },
});

chart.render();
```

## 常用变体

### 指定角度范围

```javascript
chart.options({
  type: 'interval',
  coordinate: {
    type: 'radial',
    innerRadius: 0.3,
    startAngle: -Math.PI,
    endAngle: -0.25 * Math.PI,
  },
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
});
```

### 带标签

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'radial', innerRadius: 0.2 },
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      style: { fontWeight: 'bold', fill: 'white' },
    },
  ],
});
```

### 配合交互

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'radial', innerRadius: 0.2 },
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  interaction: [
    { type: 'elementHighlight', background: true },
  ],
});
```

## 完整类型参考

```typescript
interface RadialBarOptions {
  type: 'interval';
  coordinate: {
    type: 'radial';
    innerRadius?: number;    // 内半径
    startAngle?: number;     // 起始角度
    endAngle?: number;       // 结束角度
  };
  encode: {
    x: string;    // 分类字段（映射到角度）
    y: string;    // 数值字段（映射到半径）
    color?: string;
  };
}
```

## 玉珏图 vs 柱状图

| 特性 | 玉珏图 | 柱状图 |
|------|--------|--------|
| 坐标系 | 极坐标 | 直角坐标 |
| 视觉效果 | 更美观 | 更精确 |
| 数据对比 | 有半径效应 | 准确对比 |

## 常见错误与修正

### 错误 1：数据未排序

```javascript
// ❌ 问题：未排序会导致视觉误导
data: [{ category: 'A', value: 100 }, { category: 'B', value: 50 }]

// ✅ 正确：数据按值排序
data: [{ category: 'B', value: 50 }, { category: 'A', value: 100 }]
```

### 错误 2：使用 polar 坐标系

```javascript
// ❌ 问题：polar 是玫瑰图坐标系
coordinate: { type: 'polar' }

// ✅ 正确：使用 radial 坐标系
coordinate: { type: 'radial' }
```

### 错误 3：分类过多

```javascript
// ⚠️ 注意：分类数量建议不超过 15 个
// 过多分类会导致环形过窄
```

### 错误 4：encode 通道映射错误

```javascript
// ❌ 问题：x 映射数值字段，y 映射分类字段，这在 radial 坐标系中是错误的
encode: {
  x: 'value',       // x 应该映射分类字段
  y: 'category',    // y 应该映射数值字段
}

// ✅ 正确：x 映射分类字段，y 映射数值字段
encode: {
  x: 'category',    // x 映射分类字段（对应角度）
  y: 'value',       // y 映射数值字段（对应半径）
}
```

### 错误 5：transform 排序方式错误

```javascript
// ❌ 问题：使用了 transform 排序但方向错误
transform: [
  {
    type: 'sortX',
    by: 'value',
    reverse: false,   // 应该为 true 才能实现由内向外递增
  },
],

// ✅ 正确：使用正确的排序方向
transform: [
  {
    type: 'sortX',
    by: 'value',
    reverse: true,   // 由内向外递增
  },
],
// 或者更推荐的方式是在数据层面预先排序
data: rawData.sort((a, b) => b.value - a.value)
```