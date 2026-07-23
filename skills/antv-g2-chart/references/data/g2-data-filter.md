---
id: "g2-data-filter"
title: "G2 Filter 数据过滤"
description: |
  filter 数据变换在数据加载阶段根据条件过滤数据，只保留满足条件的行。
  与 JavaScript 的 Array.filter 类似，接受一个断言函数（predicate）。
  配置在 data.transform 中，在渲染前预处理数据。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "filter"
  - "过滤"
  - "数据筛选"
  - "条件过滤"
  - "data transform"

related:
  - "g2-data-fold"
  - "g2-data-sort"
  - "g2-interaction-brush"

use_cases:
  - "只展示满足条件的数据子集（如值大于阈值的数据）"
  - "排除异常值或空值"
  - "在数据加载阶段做分类筛选"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/filter"
---

## 核心概念

**filter 是数据变换（Data Transform），不是标记变换（Mark Transform）**

- 数据变换配置在 `data.transform` 中
- 在数据加载阶段执行，影响所有使用该数据的标记
- 与 mark transform 不同，数据变换是数据预处理，不涉及视觉通道

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'RPG', sold: 98 },
      { genre: 'Shooter', sold: 35 },
    ],
    transform: [
      {
        type: 'filter',
        callback: (d) => d.sold >= 100,  // 只保留销量 ≥ 100 的数据
      },
    ],
  },
  encode: { x: 'genre', y: 'sold', color: 'genre' },
});

chart.render();
```

## 排除空值 / 异常值

```javascript
chart.options({
  type: 'line',
   {
    type: 'inline',
    value: rawData,
    transform: [
      {
        type: 'filter',
        // 过滤掉 null、undefined、NaN
        callback: (d) => d.value != null && !isNaN(d.value) && d.value > 0,
      },
    ],
  },
  encode: { x: 'date', y: 'value' },
});
```

## 多条件过滤

```javascript
chart.options({
  type: 'point',
   {
    type: 'inline',
    value: allData,
    transform: [
      {
        type: 'filter',
        callback: (d) => d.category === 'A' && d.y > 50,
      },
    ],
  },
  encode: { x: 'x', y: 'y', color: 'category' },
});
```

## 与 fetch 连用

```javascript
chart.options({
  type: 'point',
   {
    type: 'fetch',
    value: 'https://example.com/data.json',
    transform: [
      {
        type: 'filter',
        callback: (d) => d.value > 100,
      },
    ],
  },
  encode: { x: 'x', y: 'y' },
});
```

## 多个数据变换组合

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: rawData,
    transform: [
      { type: 'filter', callback: (d) => d.value != null },
      { type: 'sort', callback: (a, b) => b.value - a.value },
      { type: 'slice', start: 0, end: 10 },  // 只取前 10 条
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## 配置项

| 属性     | 描述                                 | 类型                                           | 默认值                                                     |
| -------- | ------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------- |
| callback | 过滤函数，返回 true 保留该行数据     | `(d: any, idx: number, arr: any[]) => boolean` | `(d) => d !== undefined && d !== null && !Number.isNaN(d)` |

## 常见错误与修正

### 错误 1：filter 放在 mark transform 中

```javascript
// ❌ 错误：filter 是数据变换，不能放在 mark 的 transform 中
chart.options({
  type: 'interval',
   myData,
  transform: [{ type: 'filter', callback: (d) => d.value > 100 }],  // ❌ 错误位置
});

// ✅ 正确：filter 放在 data.transform 中
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: myData,
    transform: [{ type: 'filter', callback: (d) => d.value > 100 }],  // ✅ 正确
  },
});
```

### 错误 2：callback 不是函数

```javascript
// ❌ 错误：callback 必须是函数
data: {
  transform: [{ type: 'filter', callback: 'value > 100' }],  // ❌ 字符串
}

// ✅ 正确：使用箭头函数
 {
  transform: [{ type: 'filter', callback: (d) => d.value > 100 }],  // ✅
}
```

### 错误 3：简写 data 无法配置 transform

```javascript
// ❌ 错误：简写 data 无法配置 transform
chart.options({
  data: myData,  // 简写形式
  // 无法添加 transform
});

// ✅ 正确：使用完整 data 配置
chart.options({
  data: {
    type: 'inline',
    value: myData,
    transform: [{ type: 'filter', callback: (d) => d.value > 100 }],
  },
});
```