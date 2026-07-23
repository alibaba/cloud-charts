---
id: "g2-mark-range-rangey"
title: "G2 range / rangeX / rangeY 区域标注"
description: |
  range、rangeX、rangeY 是 G2 v5 中用于绘制矩形区域标注的 Mark。
  rangeX 在 X 轴方向标注区间（纵向矩形带），常用于高亮时间段；
  rangeY 在 Y 轴方向标注区间（横向矩形带），常用于高亮数值范围；
  range 同时在 X 和 Y 两个方向标注矩形区域。
  常与其他 Mark 叠加使用，作为背景区域标注。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "range"
  - "rangeX"
  - "rangeY"
  - "区域标注"
  - "高亮区间"
  - "背景带"
  - "annotation"

related:
  - "g2-mark-linex-liney"
  - "g2-mark-connector"
  - "g2-comp-annotation"

use_cases:
  - "折线图上高亮特定时间段（如促销期）"
  - "标注正常范围的上下限区间"
  - "对比图中高亮某个参考区域"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/extra-topics/annotation#rangex"
---

## 三种 range Mark 对比

| Mark | 数据格式 | encode | 用途 |
|------|---------|--------|------|
| `rangeX` | `[{ start: v1, end: v2 }]` | `x: 'start', x1: 'end'` | X 轴区间（纵向带）**常用** |
| `rangeY` | `[{ min: v1, max: v2 }]` | `y: 'min', y1: 'max'` | Y 轴区间（横向带）**常用** |
| `range` | `[{ x: [v1,v2], y: [v1,v2] }]` | `x: 'x', y: 'y'` | 二维矩形，x/y 字段为数组 **极少用** |

> **选择原则**：只需高亮 X 方向时间段 → `rangeX`；只需高亮 Y 方向数值区间 → `rangeY`；需要同时限定 X 和 Y 的矩形区域 → `range`

## RangeX 高亮时间段

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'view',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value' },
  children: [
    // 主折线图
    { type: 'line' },
    // X 轴区间标注（高亮促销期）
    {
      type: 'rangeX',
      data: [
        { start: '2024-11-01', end: '2024-11-30', label: '双十一' },
      ],
      encode: {
        x: 'start',    // 区间开始
        x1: 'end',     // 区间结束
      },
      style: {
        fill: '#ff4d4f',
        fillOpacity: 0.1,
      },
    },
  ],
});

chart.render();
```

## RangeY 标注数值区间

```javascript
chart.options({
  type: 'view',
  data,
  encode: { x: 'date', y: 'value' },
  children: [
    { type: 'line' },
    // Y 轴区间标注（正常范围）
    {
      type: 'rangeY',
      data: [{ min: 60, max: 100, label: '正常范围' }],
      encode: {
        y: 'min',    // 区间下限
        y1: 'max',   // 区间上限
      },
      style: {
        fill: '#52c41a',
        fillOpacity: 0.08,
        stroke: '#52c41a',
        strokeOpacity: 0.3,
        lineWidth: 1,
        lineDash: [4, 4],
      },
    },
  ],
});
```

## Range 二维矩形区域

> ⚠️ **`range` 的数据格式与 `rangeX`/`rangeY` 完全不同**：`x` 和 `y` 字段本身是 `[start, end]` 数组，encode 只需 `x` 和 `y`，**不需要** `x1`/`y1`。

```javascript
// 散点图四象限背景色（同时限定 X 和 Y 方向）
chart.options({
  type: 'view',
  children: [
    {
      type: 'point',
      data: scatterData,
      encode: { x: 'changeX', y: 'changeY' },
    },
    {
      type: 'range',
      // ✅ x 和 y 字段的值是 [start, end] 数组
      data: [
        { x: [-25, 0], y: [-30, 0], region: 'Q3' },
        { x: [-25, 0], y: [0, 20],  region: 'Q2' },
        { x: [0, 5],   y: [-30, 0], region: 'Q4' },
        { x: [0, 5],   y: [0, 20],  region: 'Q1' },
      ],
      encode: { x: 'x', y: 'y', color: 'region' },  // ✅ encode 只需 x 和 y
      style: { fillOpacity: 0.15 },
    },
  ],
});
```

## 与 lineX/lineY 搭配标注阈值

```javascript
// rangeY 标注背景区域 + lineY 标注具体阈值线
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'date', y: 'value' } },
    // 危险区域背景
    {
      type: 'rangeY',
      data: [{ min: 80, max: 100 }],
      encode: { y: 'min', y1: 'max' },
      style: { fill: '#ff4d4f', fillOpacity: 0.08 },
    },
    // 阈值线
    {
      type: 'lineY',
      data: [{ y: 80 }],
      encode: { y: 'y' },
      style: { stroke: '#ff4d4f', lineWidth: 1, lineDash: [4, 4] },
    },
  ],
});
```

## 常见错误与修正

### ❌ 错误：使用不存在的 regionX / regionY 类型
```javascript
// ❌ 错误：regionX、regionY 是其他库的概念，G2 中不存在
chart.options({ type: 'regionX', ... });
chart.options({ type: 'regionY', ... });

// ✅ 正确：G2 中用 rangeX / rangeY
chart.options({ type: 'rangeX', encode: { x: 'start', x1: 'end' } });
chart.options({ type: 'rangeY', encode: { y: 'start', y1: 'end' } });
```

### ❌ 错误：range 使用 x1/y1 字段（混淆了 rangeX/rangeY 的写法）

```javascript
// ❌ 错误：range 不用 x1/y1，x 和 y 字段本身就是 [start, end] 数组
chart.options({
  type: 'range',
  data: [{ x0: 20, x1: 40, y0: 50, y1: 80 }],
  encode: { x: 'x0', x1: 'x1', y: 'y0', y1: 'y1' },  // ❌
});

// ✅ 正确：x/y 字段值是数组
chart.options({
  type: 'range',
  data: [{ x: [20, 40], y: [50, 80] }],
  encode: { x: 'x', y: 'y' },  // ✅
});

// 💡 大多数情况下，应使用 rangeX 或 rangeY，而非 range：
// - 只需高亮 X 方向 → rangeX（encode: { x: 'start', x1: 'end' }）
// - 只需高亮 Y 方向 → rangeY（encode: { y: 'min', y1: 'max' }）
```

### ❌ 错误：省略 encode（最常见，导致区域不渲染）

`rangeY` / `rangeX` 必须显式写 `encode`，G2 无法从字段名自动推断区间起止。

```javascript
// ❌ 错误：缺少 encode，区域不会渲染
{
  type: 'rangeY',
  data: [{ y: 54, y1: 72 }],
  style: { fill: '#FF0000', fillOpacity: 0.1 },
  // ❌ 没有 encode！
}

// ✅ 正确：必须写 encode 显式映射字段名
{
  type: 'rangeY',
  data: [{ y: 54, y1: 72 }],
  encode: { y: 'y', y1: 'y1' },         // ✅ 告诉 G2 哪个字段是起止
  style: { fill: '#FF0000', fillOpacity: 0.1 },
}

// ✅ 字段名可以随意，关键是 encode 里要映射
{
  type: 'rangeY',
  data: [{ lower: 54, upper: 72 }],
  encode: { y: 'lower', y1: 'upper' },   // ✅ 字段名与 data 对应即可
  style: { fill: '#FF0000', fillOpacity: 0.1 },
}
```

### ❌ 错误：rangeX 只写了 x 没有 x1
```javascript
// ❌ 错误：rangeX 需要 x（开始）和 x1（结束）两个 encode 字段
chart.options({
  type: 'rangeX',
  data: [{ start: 10, end: 20 }],
  encode: { x: 'start' },   // ❌ 缺少 x1
});

// ✅ 正确
chart.options({
  type: 'rangeX',
  data: [{ start: 10, end: 20 }],
  encode: { x: 'start', x1: 'end' },  // ✅ x 和 x1 都要
});
```
