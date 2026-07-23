---
id: "g2-mark-boxplot"
title: "G2 boxplot 自动统计箱线图"
description: |
  boxplot 是 G2 v5 的复合 Mark，自动从原始数据计算 Q1/Q2/Q3/须/离群值，
  直接输入明细数据即可生成标准箱线图，无需手动计算五数摘要。
  与 box mark（需要手动提供 Q1/Q3 等统计值）不同，boxplot 内置统计计算逻辑。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "boxplot"
  - "箱线图"
  - "自动统计"
  - "分布"
  - "Q1"
  - "Q3"
  - "中位数"
  - "离群值"

related:
  - "g2-mark-box-boxplot"
  - "g2-mark-point-scatter"
  - "g2-transform-bin"

use_cases:
  - "直接用明细数据绘制箱线图（无需预计算）"
  - "多组数据分布对比"
  - "展示数据的分布形状和离群值"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/statistics/box/#boxplot"
---

## 与 box mark 的区别

| | `boxplot` | `box` |
|--|-----------|-------|
| 输入数据 | 明细数据（自动计算统计量） | 需要手动提供 Q1/Q3 等字段 |
| 复合性 | 复合 Mark（包含箱体+须+离群值） | 单一 Mark（只绘制箱体） |
| 适用场景 | 大多数场景（推荐） | 数据已预聚合时 |

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'boxplot',
  data: [
    { group: 'A', value: 10 },
    { group: 'A', value: 14 },
    { group: 'A', value: 12 },
    { group: 'A', value: 25 },   // 离群值
    { group: 'A', value: 11 },
    { group: 'A', value: 13 },
    { group: 'B', value: 20 },
    { group: 'B', value: 22 },
    { group: 'B', value: 18 },
    { group: 'B', value: 5 },    // 离群值
    { group: 'B', value: 21 },
  ],
  encode: {
    x: 'group',   // 分组字段
    y: 'value',   // 数值字段（自动计算统计量）
  },
});

chart.render();
```

## 配置样式

```javascript
chart.options({
  type: 'boxplot',
  data,
  encode: {
    x: 'category',
    y: 'score',
    color: 'category',   // 按类别着色
  },
  style: {
    boxFill: '#1890ff',          // 箱体填充色
    boxFillOpacity: 0.3,         // 箱体透明度
    boxStroke: '#1890ff',        // 箱体边框色
    medianStroke: '#ff4d4f',     // 中位数线颜色
    medianLineWidth: 2,          // 中位数线宽
    whiskerStroke: '#666',       // 须线颜色
    outlierFill: '#ff4d4f',      // 离群点颜色
    outlierR: 4,                 // 离群点半径
  },
});
```

## 水平箱线图

```javascript
chart.options({
  type: 'boxplot',
  data,
  encode: {
    x: 'score',      // x 轴为数值
    y: 'category',   // y 轴为分类
  },
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## 极坐标箱线图

```javascript
chart.options({
  type: 'box',
  data: [
    { x: "Oceania", y: [1, 9, 16, 22, 24] },
    { x: "East Europe", y: [1, 5, 8, 12, 16] },
    { x: "Australia", y: [1, 8, 12, 19, 26] },
    { x: "South America", y: [2, 8, 12, 21, 28] },
    { x: "North Africa", y: [1, 8, 14, 18, 24] },
    { x: "North America", y: [3, 10, 17, 28, 30] },
    { x: "West Europe", y: [1, 7, 10, 17, 22] },
    { x: "West Africa", y: [1, 6, 8, 13, 16] }
  ],
  encode: {
    x: 'x',
    y: 'y', // y 字段本身就是 [min, Q1, median, Q3, max] 数组
    color: 'x' // 用 x (地区) 映射颜色
  },
  coordinate: {
    type: 'polar', // 极坐标
    innerRadius: 0.2 // 可选：设置内半径避免中心过于拥挤
  },
  scale: {
    x: {
      paddingInner: 0.6,
      paddingOuter: 0.3
    },
    y: {
      zero: true
    }
  },
  style: {
    stroke: "black"
  },
  axis: {
    y: {
      tickCount: 5
    }
  },
  tooltip: {
    items: [
      { channel: 'y', name: 'min' },
      { channel: 'y1', name: 'q1' },
      { channel: 'y2', name: 'q2' },
      { channel: 'y3', name: 'q3' },
      { channel: 'y4', name: 'max' }
    ]
  },
  legend: false // 隐藏图例（因颜色与x轴一致）
});
```

## 小提琴图（Violin Shape）

```javascript
chart.options({
  type: 'boxplot',
  data,
  encode: {
    x: 'category',
    y: 'value',
    color: 'category',
    shape: 'violin',  // 设置 shape 为 violin 实现小提琴图效果
  },
  style: {
    opacity: 0.5,
    strokeOpacity: 0.5,
    point: false,     // 隐藏离群点
  },
});
```

## 常见错误与修正

### 错误：用 box 替代 boxplot 但不提供统计字段
```javascript
// ❌ 错误：box mark 需要手动提供 Q1/median/Q3/min/max 字段
chart.options({
  type: 'box',
  data: rawDetailData,   // 原始明细数据
  encode: { x: 'group', y: 'value' },  // ❌ box 需要 y 为 [min, Q1, median, Q3, max]
});

// ✅ 使用原始明细数据时，应该用 boxplot（自动计算统计量）
chart.options({
  type: 'boxplot',
  data: rawDetailData,
  encode: { x: 'group', y: 'value' },  // ✅ boxplot 自动计算
});
```

### 错误：绘制小提琴图时未正确组合 density 和 boxplot
```javascript
// ❌ 错误：单独使用 boxplot 并设置 shape: 'violin' 无法实现真正的密度轮廓
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'boxplot',
      encode: {
        x: 'x',
        y: 'y',
        color: 'species',
        shape: 'violin',
      },
      style: {
        opacity: 0.5,
        strokeOpacity: 0.5,
        point: false,
      },
    },
  ],
});

// ✅ 正确做法：使用 density + boxplot 组合实现小提琴图
chart.options({
  type: 'view',
  data,
  children: [
    // 密度估计曲线 (KDE)
    {
      type: 'density',
      data: {
        transform: [
          {
            type: 'kde',
            field: 'y',
            groupBy: ['x', 'species'],
          },
        ],
      },
      encode: {
        x: 'x',
        y: 'y',
        color: 'species',
        size: 'size',
        series: 'species',
      },
      style: {
        fillOpacity: 0.7,
      },
      tooltip: false,
    },
    // 小提琴形状的箱线图（仅显示统计信息）
    {
      type: 'boxplot',
      encode: {
        x: 'x',
        y: 'y',
        color: 'species',
        shape: 'violin',
      },
      style: {
        opacity: 0.8,
        strokeOpacity: 0.6,
        point: false,
      },
    },
  ],
});
```

### 错误：极坐标箱线图使用 boxplot 而不是 box
```javascript
// ❌ 错误：使用 boxplot 处理已聚合的五数概括数据
chart.options({
  type: 'boxplot',
  data: [
    { x: "Oceania", y: [1, 9, 16, 22, 24] },
    { x: "East Europe", y: [1, 5, 8, 12, 16] }
  ],
  encode: { x: 'x', y: 'y' }
});

// ✅ 正确：使用 box mark 处理已聚合的五数概括数据
chart.options({
  type: 'box',
  data: [
    { x: "Oceania", y: [1, 9, 16, 22, 24] },
    { x: "East Europe", y: [1, 5, 8, 12, 16] }
  ],
  encode: { x: 'x', y: 'y' }
});
```

### 错误：tooltip items 配置不正确
```javascript
// ❌ 错误：tooltip items 中使用不存在的 channel 名称
chart.options({
  type: 'box',
  data,
  encode: { x: 'x', y: 'y' },
  tooltip: {
    items: [
      { channel: 'y0', name: 'min' }, // 错误！y0 不是字段名而是通道名
      { channel: 'y1', name: 'Q1' },
      { channel: 'y2', name: 'median' },
      { channel: 'y3', name: 'Q3' },
      { channel: 'y4', name: 'max' }
    ]
  }
});

// ✅ 正确：使用正确的 channel 名称
chart.options({
  type: 'box',
  data,
  encode: { x: 'x', y: 'y' },
  tooltip: {
    items: [
      { channel: 'y', name: 'min' },
      { channel: 'y1', name: 'q1' },
      { channel: 'y2', name: 'q2' },
      { channel: 'y3', name: 'q3' },
      { channel: 'y4', name: 'max' }
    ]
  }
});
```
</skill>
```