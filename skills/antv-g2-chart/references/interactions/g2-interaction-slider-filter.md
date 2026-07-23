---
id: "g2-interaction-slider-filter"
title: "G2 缩略轴过滤（slider filter）"
description: |
  G2 v5 缩略轴通过 slider: { x: true } 或 interaction: [{ type: 'sliderFilter' }] 启用，
  拖动滑块过滤 x/y 轴数据范围，常用于时序图的局部时间段筛选。
library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "缩略轴"
  - "slider"
  - "过滤"
  - "时序"
  - "范围筛选"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-interaction-tooltip"
  - "g2-scale-time"

use_cases:
  - "时序折线图拖动查看局部时间段"
  - "大数据量图表局部放大查看"
  - "联动多图表的时间范围"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/slider"
---

## 基本用法（时序折线图 + x 轴缩略轴）

在折线图底部添加缩略轴，拖动滑块筛选时间范围：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 720,
  height: 480,
});

// 生成 30 天时序数据
const data = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toISOString().slice(0, 10),
  value: Math.round(200 + Math.random() * 300),
}));

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: true,   // 在 x 轴下方显示缩略轴
  },
});

chart.render();
```

## 设置初始显示范围

`values` 接受 `[0, 1]` 区间的比例值，控制缩略轴初始选中范围：

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: {
      values: [0.6, 1.0],   // 初始只显示后 40% 的数据
    },
  },
});
```

## 双轴缩略轴（x 轴 + y 轴同时过滤）

同时在 x 轴和 y 轴添加缩略轴，适合散点图等二维数据探索：

```javascript
chart.options({
  type: 'point',
  data: [
    { price: 12000, score: 85, brand: 'A' },
    { price: 8500,  score: 72, brand: 'B' },
    { price: 23000, score: 91, brand: 'C' },
    { price: 5000,  score: 60, brand: 'D' },
    { price: 18000, score: 88, brand: 'E' },
    { price: 31000, score: 95, brand: 'F' },
    { price: 9500,  score: 78, brand: 'G' },
  ],
  encode: { x: 'price', y: 'score', color: 'brand' },
  slider: {
    x: {
      values: [0, 0.7],   // x 轴初始显示 0-70%
    },
    y: {
      values: [0.2, 1.0], // y 轴初始显示 20%-100%
    },
  },
});
```

## 自定义 label 格式

通过 `labelFormatter` 格式化缩略轴两端的标签显示：

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: {
      values: [0.4, 1.0],
      labelFormatter: (value) => {
        // value 是实际数据值（经过比例换算后的原始数据）
        const date = new Date(value);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      },
    },
  },
});
```

## 使用 interaction 方式启用

也可以通过 `interaction` 数组启用 sliderFilter，两种写法效果相同：

```javascript
// 方式一：slider 属性（推荐，更简洁）
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: { x: true },
});

// 方式二：interaction 数组
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  interaction: [
    { type: 'sliderFilter' },
  ],
});
```

## 常见错误与修正

### 错误：values 超出 [0, 1] 范围

```javascript
// ❌ values 必须在 [0, 1] 区间，代表数据比例
chart.options({
  slider: {
    x: { values: [10, 80] },   // 错误：不是像素或索引，是 0-1 比例
  },
});

// ✅ 正确：使用 0-1 之间的小数
chart.options({
  slider: {
    x: { values: [0.1, 0.8] },   // 显示 10% 到 80% 的数据
  },
});
```

### 错误：在离散分类轴上使用 sliderFilter

```javascript
// ❌ slider 主要适合连续轴（时间轴、数值轴），
// 在纯分类 x 轴上效果不佳，过滤逻辑可能不符合预期
chart.options({
  type: 'interval',
  data: [{ genre: 'Sports', sold: 275 }, { genre: 'Action', sold: 120 }],
  encode: { x: 'genre', y: 'sold' },   // genre 是离散分类
  slider: { x: true },
});

// ✅ sliderFilter 最适合时序数据或大量连续数值数据
chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value' },   // date 是时间轴
  slider: { x: true },
});
```

### 错误：slider 写成数组

```javascript
// ❌ slider 是对象，不是数组
chart.options({
  slider: [{ x: true }],
});

// ✅ slider 是对象，x/y 是其属性
chart.options({
  slider: { x: true },
  // 或同时启用双轴
  // slider: { x: true, y: true },
});
```

### 错误：values 顺序写反（起始值大于结束值）

```javascript
// ❌ 起始值不能大于结束值
chart.options({
  slider: {
    x: { values: [0.8, 0.2] },
  },
});

// ✅ 第一个值为起始位置，第二个值为结束位置（均为 0-1 比例）
chart.options({
  slider: {
    x: { values: [0.2, 0.8] },
  },
});
```
