---
id: "g2-core-view-composition"
title: "G2 视图组合（view + children）"
description: |
  G2 v5 通过 type: 'view' 容器和 children 数组实现多 Mark 叠加、
  共享数据、分面（facet）等复合图表。
  这是 Spec 模式中组合多个图形层的标准方式。

library: "g2"
version: "5.x"
category: "core"
tags:
  - "view"
  - "children"
  - "视图组合"
  - "多Mark叠加"
  - "layer"
  - "复合图表"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-comp-annotation"
  - "g2-comp-facet-rect"

use_cases:
  - "在同一坐标系中叠加多种图形（折线+散点、面积+折线）"
  - "为多个子 Mark 共享数据源"
  - "在图表中添加标注层"

anti_patterns:
  - "只有单个 Mark 时不需要 view 容器，直接用对应 type 即可"
  - "children 中嵌套 type: 'view'——当某个子 Mark 需要独立数据时，直接在该 Mark 上指定 data 字段，而非再套一层 view + children"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/view"
---

## 核心概念

```
chart.options({
  type: 'view',      // 容器类型
   [...],       // 父级数据（子 Mark 可继承）
  encode: {...},     // 父级编码（子 Mark 可继承）
  children: [        // 子 Mark 列表（按顺序渲染，后面的在上层）
    { type: 'area', ... },
    { type: 'line', ... },
    { type: 'point', ... },
  ],
});
```

**数据继承规则**：
- 子 Mark 若未指定 `data`，继承父级 `data`
- 子 Mark 若未指定 `encode`，继承父级 `encode` 中对应通道

## 面积 + 折线 + 散点叠加

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { month: 'Jan', value: 33 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 56 },
  { month: 'Apr', value: 91 },
  { month: 'May', value: 67 },
];

chart.options({
  type: 'view',
  data,                                    // 父级数据，三个子 Mark 共享
  encode: { x: 'month', y: 'value' },     // 父级编码，子 Mark 继承
  children: [
    {
      type: 'area',
      style: { fill: '#1890ff', fillOpacity: 0.15 },
    },
    {
      type: 'line',
      style: { stroke: '#1890ff', lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { shape: 'circle' },
      style: { fill: 'white', stroke: '#1890ff', r: 4, lineWidth: 2 },
    },
  ],
});

chart.render();
```

## 子 Mark 独立数据（不继承父级）

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
       salesData,       // 独立数据
      encode: { x: 'month', y: 'revenue' },
    },
    {
      type: 'line',
       trendData,       // 独立数据
      encode: { x: 'month', y: 'growth' },
      scale: { y: { key: 'right' } },   // 独立 y 轴
    },
  ],
});
```

## 折线 + 参考线组合

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
    },
    {
      type: 'lineY',                       // 水平参考线
       [{ threshold: 60 }],
      encode: { y: 'threshold' },
      style: { stroke: 'red', lineDash: [4, 4] },
      labels: [{ text: '目标线', position: 'right', style: { fill: 'red' } }],
    },
  ],
});
```

## 常见错误与修正

### 错误 1：多次调用 options() 覆盖配置
```javascript
// ❌ 错误：每次 options() 调用都会覆盖上一次
chart.options({ type: 'area', ... });
chart.options({ type: 'line', ... });   // 覆盖了面积图！

// ✅ 正确：用 view + children
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'area', ... },
    { type: 'line', ... },
  ],
});
```

### 错误 2：children 中嵌套 view（为子 Mark 单独变换数据时的常见误区）

```javascript
// ❌ 错误：在 children 里再套一层 type:'view' + children
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'time', y: 'value' } },
    {
      type: 'view',                        // ❌ 不必要的嵌套 view
      data: data.map(d => ({              // 只是想用派生数据
        time: d.time,
        min: d.value - 0.1,
        max: d.value + 0.1,
      })),
      children: [
        { type: 'rangeY', encode: { x: 'time', y: 'min', y1: 'max' } },
      ],
    },
  ],
});

// ✅ 正确：直接在子 Mark 上指定 data，无需嵌套 view
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'time', y: 'value' } },
    {
      type: 'rangeY',
      data: data.map(d => ({             // ✅ 直接在 Mark 上声明独立 data
        time: d.time,
        min: d.value - 0.1,
        max: d.value + 0.1,
      })),
      encode: { x: 'time', y: 'min', y1: 'max' },
      style: { fillOpacity: 0.1 },
    },
  ],
});
```

**规则**：`children` 数组的每个元素必须是 Mark（`line`/`point`/`interval` 等），
当某个 Mark 需要独立或派生数据时，在该 Mark 节点上直接写 `data`，而不是再包一层 `view`。
G2 不支持在 `children` 内嵌套 `view`。

### 错误 3：子 Mark 的 encode 字段名与数据不匹配
```javascript
// ❌ 错误：父级和子级 encode 的字段名应保持一致
chart.options({
  type: 'view',
  data: [{ month: 'Jan', value: 33 }],
  encode: { x: 'month', y: 'value' },
  children: [
    {
      type: 'point',
      encode: { x: 'date', y: 'amount' },  // 字段名与数据不匹配！
    },
  ],
});
```
