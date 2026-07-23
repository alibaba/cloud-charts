---
id: "g2-mark-line-basic"
title: "G2 基础折线图（Line Mark）"
description: |
  使用 Line Mark 创建折线图，用于展示数据随时间或有序类别的变化趋势。
  本文采用 Spec 模式（chart.options({})），支持单系列、多系列、平滑曲线等常见变体。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "line"
tags:
  - "折线图"
  - "趋势"
  - "时间序列"
  - "Line"
  - "line chart"
  - "曲线"
  - "多系列"
  - "spec"

related:
  - "g2-mark-area-basic"
  - "g2-core-encode-channel"
  - "g2-scale-time"
  - "g2-interaction-tooltip"

use_cases:
  - "展示数据随时间的变化趋势"
  - "对比多个指标或维度的走势"
  - "展示连续数值的变化"

anti_patterns:
  - "数据点较少（< 5 个）时折线图不直观，改用柱状图"
  - "非有序数据（无序分类）不适合折线图"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/line/basic"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',
  data: [
    { month: 'Jan', value: 33 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 56 },
    { month: 'Apr', value: 91 },
    { month: 'May', value: 67 },
    { month: 'Jun', value: 45 },
  ],
  encode: { x: 'month', y: 'value' },
});

chart.render();
```

## 时间序列折线图

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: [
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 130 },
    { date: new Date('2024-03-01'), value: 110 },
    { date: new Date('2024-04-01'), value: 160 },
    { date: new Date('2024-05-01'), value: 145 },
  ],
  encode: {
    x: 'date',     // Date 类型自动使用 Time Scale
    y: 'value',
  },
  axis: {
    x: {
      tickCount: 5,
      labelFormatter: 'YYYY-MM',  // 日期格式化
    },
  },
});

chart.render();
```

## 多系列折线图

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'line',
  data: [
    { month: 'Jan', type: '产品A', value: 33 },
    { month: 'Jan', type: '产品B', value: 55 },
    { month: 'Feb', type: '产品A', value: 78 },
    { month: 'Feb', type: '产品B', value: 62 },
    { month: 'Mar', type: '产品A', value: 56 },
    { month: 'Mar', type: '产品B', value: 89 },
    { month: 'Apr', type: '产品A', value: 91 },
    { month: 'Apr', type: '产品B', value: 74 },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',   // color 通道自动按 type 拆分多条线
  },
});

chart.render();
```

## 平滑曲线

```javascript
chart.options({
  type: 'line',
  data: [...],
  encode: {
    x: 'month',
    y: 'value',
    shape: 'smooth',    // 'line' | 'smooth' | 'hv' | 'vh' | 'hvh' | 'vhv'
  },
});
```

## 折线 + 数据点（Layer 组合）

```javascript
// Spec 中用 children 数组实现多 Mark 叠加
chart.options({
  type: 'view',               // view 容器
   [...],
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type' },
    },
    {
      type: 'point',
      encode: {
        x: 'month',
        y: 'value',
        color: 'type',
        shape: 'circle',
      },
      style: { r: 4 },
    },
  ],
});
```

## 折线 + 面积填充（Layer 组合）

```javascript
chart.options({
  type: 'view',
  data: [...],
  children: [
    {
      type: 'area',
      encode: { x: 'month', y: 'value' },
      style: { fillOpacity: 0.2 },
    },
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
      style: { stroke: '#1890ff', lineWidth: 2 },
    },
  ],
});
```

## 带 Tooltip 和末端标签

```javascript
chart.options({
  type: 'line',
  data: [...],
  encode: { x: 'month', y: 'value' },
  tooltip: {
    items: [{ field: 'value', name: '值' }],
  },
  labels: [
    {
      text: 'value',
      selector: 'last',    // 只在最后一个点显示标签
      style: { fontSize: 12, fill: '#1890ff' },
    },
  ],
});
```

## 宽表数据 + fold 转长表

宽表每行含多个指标列，用 `fold` data transform 转为长表再绘制多系列。

⚠️ `fold` 是 **data transform**，必须放在 `data.transform` 中，不能放在 mark 级 `transform`。

```javascript
const wideData = [
  { date: '2024-01', DAU: 12000, MAU: 45000 },
  { date: '2024-02', DAU: 13500, MAU: 47000 },
  { date: '2024-03', DAU: 11800, MAU: 44500 },
];

chart.options({
  type: 'line',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      {
        type: 'fold',
        fields: ['DAU', 'MAU'],   // 要转换的列
        key: 'metric',             // 新增列名（存原字段名）
        value: 'count',            // 新增列名（存原字段值）
      },
    ],
  },
  encode: {
    x: 'date',
    y: 'count',      // fold 后使用 value 字段名
    color: 'metric', // fold 后使用 key 字段名
  },
  labels: [
    { text: 'metric', selector: 'last', position: 'right' },
  ],
});
```

## 双 Y 轴（不同量级系列）

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
      data: revenueData,
      encode: { x: 'date', y: 'revenue', color: () => '收入(万元)' },
      scale: { y: { key: 'revenue' } },   // key 唯一 → 独立 y 轴
    },
    {
      type: 'line',
      data: userCountData,
      encode: { x: 'date', y: 'count', color: () => '用户数' },
      scale: { y: { key: 'count' } },
      axis: { y: { position: 'right' } },  // 右侧 y 轴
    },
  ],
});
```

## 多系列 Tooltip 配置

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'series' },
  tooltip: {
    title: (d) => {
      const date = new Date(d.date);
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    },
    items: [
      { field: 'series', name: '系列' },
      { field: 'value', name: '数值', valueFormatter: (v) => v.toLocaleString() },
    ],
  },
  interaction: [{ type: 'tooltip' }],
});
```

## Spec 字段速查

| 字段 | 示例值 | 说明 |
|------|--------|------|
| `encode.x` | `'month'` | X 轴字段 |
| `encode.y` | `'value'` | Y 轴字段 |
| `encode.color` | `'type'` | 颜色/系列区分 |
| `encode.shape` | `'smooth'` | 线型 |
| `style.lineWidth` | `2` | 线宽 |
| `style.stroke` | `'#f00'` | 线条颜色（固定） |
| `labels` | `[{ text: 'value', selector: 'last' }]` | 数据标签 |
| `tooltip` | `{ items: [{ field: 'value' }] }` | Tooltip |

## 常见错误与修正

### 错误 1：多系列数据缺少 color 通道
```javascript
// ❌ 错误：多类型数据没有 color，所有点被错误地连成一条乱线
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value' },  // 缺少 color！
});

// ✅ 正确
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
});
```

### 错误 2：时间字段是字符串
```javascript
// ❌ 不推荐：字符串时间轴排序可能不正确
const data = [{ date: '2024-03-01', value: 100 }];

// ✅ 正确：转为 Date 对象，或显式配置 scale type
const data = [{ date: new Date('2024-03-01'), value: 100 }];
// 或：
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
});
```

### 错误 3：多 Mark 叠加需要 view+children（详见核心约束 #3）
```javascript
// ❌ chart.options({ type: 'line', ... }); chart.options({ type: 'point', ... }); → 只有 point 生效
// ✅ chart.options({ type: 'view', data, children: [{ type: 'line', ... }, { type: 'point', ... }] });
```
