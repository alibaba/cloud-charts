---
id: "g2-data-sort"
title: "G2 Sort 数据排序"
description: |
  sort 数据变换对数据进行排序，类似于 Array.prototype.sort。
  配置在 data.transform 中，在渲染前预处理数据顺序。
  常用于饼图、排行榜条形图等需要按数据大小排列的场景。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "sort"
  - "排序"
  - "数据顺序"
  - "data transform"

related:
  - "g2-data-filter"
  - "g2-data-fold"
  - "g2-transform-sortx"
  - "g2-transform-sorty"

use_cases:
  - "饼图按大小排列扇区"
  - "条形图按数值排序"
  - "排行榜数据展示"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/sort"
---

## 核心概念

**sort 是数据变换（Data Transform），不是标记变换（Mark Transform）**

- 数据变换配置在 `data.transform` 中
- 使用 callback 比较函数（类似 Array.sort）
- 在数据加载阶段执行，影响所有使用该数据的标记

**与 mark transform sortX/sortY/sortColor 的区别：**
- 数据 sort：直接对原始数据数组排序
- mark sortX/sortY/sortColor：按视觉通道值排序，可聚合后排序

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: [
      { category: 'A', value: 30 },
      { category: 'B', value: 50 },
      { category: 'C', value: 20 },
      { category: 'D', value: 40 },
    ],
    transform: [
      {
        type: 'sort',
        callback: (a, b) => b.value - a.value,  // 降序排列
      },
    ],
  },
  encode: { x: 'category', y: 'value' },
});

chart.render();
```

## 升序排列

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sort',
        callback: (a, b) => a.value - b.value,  // 升序
      },
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## 饼图按大小排序

```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: [
      { item: 'A', count: 40 },
      { item: 'B', count: 20 },
      { item: 'C', count: 30 },
    ],
    transform: [
      {
        type: 'sort',
        callback: (a, b) => b.count - a.count,  // 从大到小
      },
    ],
  },
  encode: { y: 'count', color: 'item' },
  coordinate: { type: 'theta' },
  transform: [{ type: 'stackY' }],
});
```

## 与其他数据变换组合

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: rawData,
    transform: [
      { type: 'filter', callback: (d) => d.value > 0 },  // 先过滤
      { type: 'sort', callback: (a, b) => b.value - a.value },  // 再排序
      { type: 'slice', start: 0, end: 10 },  // 取前 10 条
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## 按字符串排序

```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sort',
        callback: (a, b) => a.name.localeCompare(b.name),  // 按名称字母排序
      },
    ],
  },
  encode: { x: 'name', y: 'value' },
});
```

## 配置项

| 属性     | 描述                                               | 类型                         | 默认值        |
| -------- | -------------------------------------------------- | ---------------------------- | ------------- |
| callback | Array.sort 的 comparator，返回 1，0，-1 代表 > = < | `(a: any, b: any) => number` | `(a, b) => 0` |

## 与 Mark Transform sortX/sortY 的对比

| 特性 | 数据 sort | mark sortX/sortY |
|------|----------|------------------|
| 配置位置 | `data.transform` | `transform` (mark 层级) |
| 排序依据 | 原始数据字段 | 视觉通道值 |
| 聚合支持 | 不支持 | 支持按聚合值排序 |
| 切片支持 | 需配合 slice | 内置 slice 参数 |

```javascript
// 数据 sort：直接对数据排序
data: {
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
}

// mark sortX：按 Y 通道聚合值排序
transform: [{ type: 'sortX', by: 'y', reducer: 'sum' }]
```

## 常见错误与修正

### 错误 1：sort 放在 mark transform 中

```javascript
// ❌ 错误：数据 sort 不能放在 mark 的 transform 中
chart.options({
  data: myData,
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],  // ❌ 错误位置
});

// ✅ 正确：sort 放在 data.transform 中
chart.options({
   {
    type: 'inline',
    value: myData,
    transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],  // ✅ 正确
  },
});
```

### 错误 2：混淆数据 sort 和 mark sortX

```javascript
// ❌ 错误：数据 sort 不支持 channel/by/reducer 参数
data: {
  transform: [{ type: 'sort', channel: 'x', by: 'value' }],  // ❌ 这是 mark transform 语法
}

// ✅ 正确：数据 sort 使用 callback
 {
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
}

// 如果需要按聚合值排序，应使用 mark transform
transform: [{ type: 'sortX', by: 'y', reducer: 'sum' }]
```

### 错误 3：callback 返回值错误

```javascript
// ❌ 错误：返回布尔值
callback: (a, b) => a.value > b.value  // ❌ 返回布尔值

// ✅ 正确：返回数字（正数、负数、零）
callback: (a, b) => a.value - b.value  // ✅ 升序
callback: (a, b) => b.value - a.value  // ✅ 降序
```

### 错误 4：简写 data 无法配置 transform

```javascript
// ❌ 错误：简写 data 无法配置 transform
chart.options({
  data: myData,  // 简写形式
  // 无法添加 sort transform
});

// ✅ 正确：使用完整 data 配置
chart.options({
   {
    type: 'inline',
    value: myData,
    transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
  },
});
```