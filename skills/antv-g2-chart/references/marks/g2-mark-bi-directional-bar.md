---
id: "g2-mark-bi-directional-bar"
title: "G2 Bi-Directional Bar Mark"
description: |
  双向柱状图 Mark。使用 interval 标记展示正向和反向的数据对比。
  适用于正负数据对比、收入支出对比、完成/未完成对比等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "双向柱状图"
  - "正负条形图"
  - "bi-directional"
  - "对比"
  - "人口金字塔"
  - "butterfly chart"
  - "对称条形图"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-stacked"

use_cases:
  - "正负分类数据对比"
  - "收入支出对比"
  - "完成/未完成对比"
  - "人口金字塔（男女对比）"
  - "butterfly chart（左右对称条形图）"

anti_patterns:
  - "不含相反含义的数据不适合"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/bi-directional-bar"
---

## 核心概念

双向柱状图展示正向和反向的数据对比：
- 使用 `interval` 标记
- 通过负值表示反向数据
- 配合 `transpose` 坐标变换

**适用场景：**
- 完成/未完成对比
- 收入/支出对比
- 正负数据对比

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
});

const data = [
  { department: '部门1', people: 37, type: 'completed' },
  { department: '部门1', people: 9, type: 'uncompleted' },
  { department: '部门2', people: 27, type: 'completed' },
  { department: '部门2', people: 10, type: 'uncompleted' },
];

chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: {
    x: 'department',
    y: (d) => (d.type === 'completed' ? d.people : -d.people),
    color: 'department',
  },
  style: {
    fill: ({ type }) => type === 'uncompleted' ? 'transparent' : undefined,
    stroke: ({ type }) => type === 'uncompleted' ? '#1890ff' : undefined,
    lineWidth: 2,
  },
});

chart.render();
```

## 常用变体

### 堆叠双向柱状图

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  transform: [{ type: 'stackY' }],
  encode: {
    x: 'question',
    y: (d) =>
      d.type === 'Disagree' || d.type === 'Strongly disagree'
        ? -d.percentage
        : d.percentage,
    color: 'type',
  },
});
```

### 自定义 Y 轴标签

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'category', y: (d) => d.type === 'A' ? d.value : -d.value },
  axis: {
    y: {
      labelFormatter: (d) => Math.abs(d),  // 显示绝对值
    },
  },
});
```

### 分组显示

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: {
    x: 'group',
    y: (d) => d.direction === 'forward' ? d.value : -d.value,
    color: 'category',
  },
  style: {
    maxWidth: 20,
  },
});
```

## 完整类型参考

```typescript
interface BiDirectionalData {
  category: string;      // 分类字段
  value: number;         // 数值
  direction: 'forward' | 'backward';  // 方向
}

interface BiDirectionalOptions {
  type: 'interval';
  coordinate: {
    transform: [{ type: 'transpose' }];
  };
  encode: {
    x: string;           // 分类字段
    y: (d) => number;    // 根据方向返回正/负值
    color?: string;
  };
}
```

## 双向柱状图 vs 柱状图

| 特性 | 双向柱状图 | 柱状图 |
|------|------------|--------|
| 数据方向 | 正反两个方向 | 单一方向 |
| 用途 | 对比相反含义 | 数值对比 |
| 视觉效果 | 双向对称 | 单向 |

## 人口金字塔（butterfly chart）

人口金字塔是双向柱状图的典型场景——男女两侧数据方向相反，通过负值技巧实现，**无需 `createView`**。

```javascript
const data = [
  { age: '0-4',   male: 5.3, female: 5.1 },
  { age: '5-9',   male: 5.6, female: 5.4 },
  { age: '10-14', male: 5.8, female: 5.5 },
  // ...
];

// 宽表转长表：将 male/female 合并为一列
const longData = data.flatMap((d) => [
  { age: d.age, sex: 'Male',   population: d.male },
  { age: d.age, sex: 'Female', population: d.female },
]);

chart.options({
  type: 'interval',
  data: longData,
  coordinate: { transform: [{ type: 'transpose' }] },  // 横向条形图
  encode: {
    x: 'age',
    // 关键：男性用负值，女性用正值 → 形成左右对称
    y: (d) => d.sex === 'Male' ? -d.population : d.population,
    color: 'sex',
  },
  axis: {
    y: {
      labelFormatter: (d) => Math.abs(d),  // 显示绝对值（不显示负号）
      title: '人口占比 (%)',
    },
    x: { title: '年龄段' },
  },
  scale: {
    color: { range: ['#5B8FF9', '#FF7875'] },
  },
});
```

## 常见错误与修正

### 错误 1：缺少负值转换

```javascript
// ❌ 问题：所有值都是正值
encode: { y: 'value' }

// ✅ 正确：根据类型返回正/负值
encode: { y: (d) => d.type === 'A' ? d.value : -d.value }
```

### 错误 2：缺少 transpose

```javascript
// ❌ 问题：默认是垂直方向
coordinate: {}

// ✅ 正确：添加 transpose
coordinate: { transform: [{ type: 'transpose' }] }
```

### 错误 3：Y 轴标签显示负值

```javascript
// ❌ 问题：负值显示为负数
axis: {}

// ✅ 正确：格式化为绝对值
axis: {
  y: { labelFormatter: (d) => Math.abs(d) },
}
```

### 错误 4：用 `chart.createView()` 实现人口金字塔

这是最常见的错误——V4 时代用 `createView` 创建左右两个独立视图，V5 已移除此 API。正确做法是**负值技巧**（单一 `interval` + 负值编码）或 `spaceLayer`。

```javascript
// ❌ 禁止：V4 createView，V5 中不存在
const leftView = chart.createView();
leftView.options({
  type: 'interval',
  data: usData,
  encode: { x: 'age', y: 'male' },
});
const rightView = chart.createView();
rightView.options({ ... });

// ✅ 方案一（推荐）：负值技巧——单一 interval，男性取负值
chart.options({
  type: 'interval',
  data: combinedData,   // male/female 合并到一个数组
  coordinate: { transform: [{ type: 'transpose' }] },
  encode: {
    x: 'age',
    y: (d) => d.sex === 'Male' ? -d.population : d.population,
    color: 'sex',
  },
  axis: { y: { labelFormatter: (d) => Math.abs(d) } },
});

// ✅ 方案二：spaceLayer（两侧需完全独立比例尺时使用）
chart.options({
  type: 'spaceLayer',
  children: [
    {
      type: 'interval',
      data: leftData,
      coordinate: { transform: [{ type: 'transpose' }, { type: 'reflectX' }] },
      encode: { x: 'age', y: 'male' },
      axis: { y: { position: 'right' } },
    },
    {
      type: 'interval',
      data: rightData,
      coordinate: { transform: [{ type: 'transpose' }] },
      encode: { x: 'age', y: 'female' },
      axis: { y: false },
    },
  ],
});
```