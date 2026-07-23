---
id: "g2-mark-line-multi"
title: "G2 多系列折线图"
description: |
  通过 color 通道编码分类字段实现多系列折线图，每条线代表一个类别。
  G2 会自动为每个 color 值生成独立的折线。
  常用于趋势对比、多指标随时间变化的展示。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "折线图"
  - "多系列"
  - "line"
  - "时间序列"
  - "趋势对比"
  - "多折线"

related:
  - "g2-mark-line-basic"
  - "g2-mark-area-stacked"
  - "g2-transform-select"

use_cases:
  - "多个产品的销售趋势对比"
  - "多地区气温随时间变化"
  - "多指标 KPI 折线对比"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/line/"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: '北京', temp: -3 },
  { month: 'Feb', city: '北京', temp: 0 },
  { month: 'Mar', city: '北京', temp: 9 },
  { month: 'Apr', city: '北京', temp: 18 },
  { month: 'Jan', city: '上海', temp: 5 },
  { month: 'Feb', city: '上海', temp: 7 },
  { month: 'Mar', city: '上海', temp: 13 },
  { month: 'Apr', city: '上海', temp: 20 },
  { month: 'Jan', city: '广州', temp: 15 },
  { month: 'Feb', city: '广州', temp: 16 },
  { month: 'Mar', city: '广州', temp: 21 },
  { month: 'Apr', city: '广州', temp: 26 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: {
    x: 'month',
    y: 'temp',
    color: 'city',   // 关键：按城市分色，自动生成多条折线
  },
  style: { lineWidth: 2 },
  legend: { color: { position: 'top' } },
});

chart.render();
```

## 折线 + 散点组合（突出数据点）

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'city' },
      style: { lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'month', y: 'value', color: 'city', shape: 'circle' },
      style: { r: 4, lineWidth: 1.5, fill: '#fff' },
    },
  ],
});
```

## 折线 + 末端标签

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       data,
      encode: { x: 'month', y: 'value', color: 'city' },
    },
    {
      type: 'text',
       data,
      encode: {
        x: 'month',
        y: 'value',
        color: 'city',
        text: 'city',
      },
      transform: [{ type: 'selectX', selector: 'last' }],  // 只取每条线末端
      style: { textAnchor: 'start', dx: 6, fontSize: 12 },
    },
  ],
});
```

## 平滑曲线

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  style: {
    lineWidth: 2,
    shape: 'smooth',   // 平滑曲线（代替折线）
  },
});
```

## 常见错误与修正

### 错误：多系列数据使用宽表格式——应使用长表格式
```javascript
// ❌ 错误：宽表格式，G2 无法自动按系列分色
const wrongData = [
  { month: 'Jan', 北京: -3, 上海: 5, 广州: 15 },
  { month: 'Feb', 北京: 0,  上海: 7, 广州: 16 },
];

// ✅ 正确：长表格式（每条记录一个系列的一个数据点）
const correctData = [
  { month: 'Jan', city: '北京', value: -3 },
  { month: 'Jan', city: '上海', value: 5 },
  // ...
];
chart.options({
  encode: { x: 'month', y: 'value', color: 'city' },  // ✅ color 绑定分类字段
});
```
