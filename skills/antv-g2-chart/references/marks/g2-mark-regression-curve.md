---
id: "g2-mark-regression-curve"
title: "G2 回归曲线图（regression curve）"
description: |
  回归曲线图在散点图基础上叠加回归趋势线。使用 type: 'view' 组合
  type: 'point'（原始数据）和 type: 'line'（回归曲线），
  回归计算通过 data.transform 中的 custom callback 接入 d3-regression 等库。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "回归曲线图"
  - "regression"
  - "线性回归"
  - "趋势线"
  - "d3-regression"
  - "散点图"

related:
  - "g2-mark-point-scatter"
  - "g2-mark-line-basic"

use_cases:
  - "展示两变量间的线性/非线性关系"
  - "趋势预测"
  - "相关性分析"

anti_patterns:
  - "数据点少于 10 条时回归不可靠"
  - "变量间无相关关系时不适合加回归线"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/regressioncurve"
---

## 核心概念

**回归曲线图 = `type: 'view'` 组合 `point`（散点）+ `line`（回归线）**

- 散点 (`type: 'point'`)：展示原始数据
- 回归线 (`type: 'line'`)：通过 `data.transform` 中的 `custom` callback 调用回归函数
- 常用回归库：`d3-regression`（`regressionLinear`, `regressionQuad`, `regressionExp`, `regressionLog`, `regressionPoly`）

**回归函数输出格式**：返回一个点数组 `[[x0, y0], [x1, y1], ...]`，encode 时用 `(d) => d[0]` 和 `(d) => d[1]`

## 线性回归（最小可运行示例）

```javascript
import { Chart } from '@antv/g2';
import { regressionLinear } from 'd3-regression';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'view',
  autoFit: true,
   {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/linear-regression.json',
  },
  children: [
    // 散点：原始数据
    {
      type: 'point',
      encode: { x: (d) => d[0], y: (d) => d[1] },
      scale: { x: { domain: [0, 1] }, y: { domain: [0, 5] } },
      style: { fillOpacity: 0.75, fill: '#1890ff' },
    },
    // 折线：回归曲线
    {
      type: 'line',
       {
        transform: [
          {
            type: 'custom',
            callback: regressionLinear(),  // d3-regression 回归函数
          },
        ],
      },
      encode: { x: (d) => d[0], y: (d) => d[1] },
      style: { stroke: '#30BF78', lineWidth: 2 },
      labels: [
        {
          text: 'y = 1.7x + 3.01',
          selector: 'last',
          position: 'right',
          textAlign: 'end',
          dy: -8,
        },
      ],
      tooltip: false,
    },
  ],
  axis: {
    x: { title: '自变量 X' },
    y: { title: '因变量 Y' },
  },
});

chart.render();
```

## 多项式回归（二次回归）

```javascript
import { regressionQuad } from 'd3-regression';

chart.options({
  type: 'view',
  autoFit: true,
   [
    { x: -4, y: 5.2 }, { x: -3, y: 2.8 }, { x: -2, y: 1.5 },
    { x: -1, y: 0.8 }, { x: 0, y: 0.5 }, { x: 1, y: 0.8 },
    { x: 2, y: 1.5 }, { x: 3, y: 2.8 }, { x: 4, y: 5.2 },
  ],
  children: [
    {
      type: 'point',
      encode: { x: 'x', y: 'y' },
      style: { fillOpacity: 0.75, fill: '#1890ff' },
    },
    {
      type: 'line',
       {
        transform: [
          {
            type: 'custom',
            callback: regressionQuad()
              .x((d) => d.x)
              .y((d) => d.y)
              .domain([-4, 4]),
          },
        ],
      },
      encode: { x: (d) => d[0], y: (d) => d[1] },
      style: { stroke: '#30BF78', lineWidth: 2 },
      labels: [
        {
          text: 'y = 0.3x² + 0.5',
          selector: 'last',
          textAlign: 'end',
          dy: -8,
        },
      ],
      tooltip: false,
    },
  ],
});
```

## 指数回归

```javascript
import { regressionExp } from 'd3-regression';

// 在 line 子 mark 中
{
  type: 'line',
  data: {
    transform: [
      {
        type: 'custom',
        callback: regressionExp(),
      },
    ],
  },
  encode: { x: (d) => d[0], y: (d) => d[1], shape: 'smooth' },
  style: { stroke: '#30BF78', lineWidth: 2 },
  tooltip: false,
}
```

## d3-regression 常用函数

| 函数 | 回归类型 | 适用场景 |
|------|---------|---------|
| `regressionLinear()` | 线性 y = ax + b | 线性相关 |
| `regressionQuad()` | 二次 y = ax² + bx + c | 抛物线关系 |
| `regressionPoly()` | 多项式 | 复杂弯曲 |
| `regressionExp()` | 指数 y = ae^(bx) | 指数增长/衰减 |
| `regressionLog()` | 对数 y = a·ln(x) + b | 增长率递减 |
| `regressionPow()` | 幂律 y = ax^b | 幂律关系 |

## 常见错误与修正

### 错误 1：回归函数放在错误位置

```javascript
// ❌ 错误：custom 回归应放在 line 子 mark 的 data.transform 中
chart.options({
  type: 'view',
   {
    transform: [{ type: 'custom', callback: regressionLinear() }],  // ❌ 放在父 view 数据上
  },
  children: [{ type: 'point', encode: { x: 'x', y: 'y' } }],
});

// ✅ 正确：每个子 mark 有独立数据来源
chart.options({
  type: 'view',
  data,  // 散点数据
  children: [
    { type: 'point', encode: { x: 'x', y: 'y' } },  // 散点用父数据
    {
      type: 'line',
      data: {
        transform: [{ type: 'custom', callback: regressionLinear().x(d=>d.x).y(d=>d.y) }],
      },                                               // ✅ 回归线有独立数据
      encode: { x: (d) => d[0], y: (d) => d[1] },
    },
  ],
});
```

### 错误 2：encode 字段访问方式错误

```javascript
// ❌ 错误：d3-regression 输出 [[x,y],...] 数组，不是对象
{
  type: 'line',
  encode: { x: 'x', y: 'y' },  // ❌ d[0] 不是 d.x
}

// ✅ 正确：用函数访问数组索引
{
  type: 'line',
  encode: { x: (d) => d[0], y: (d) => d[1] },  // ✅
}
```

### 错误 3：不指定 .x()/.y() 时数据格式不匹配

```javascript
// ❌ 问题：默认情况下 d3-regression 假设数据是 [x, y] 数组格式
const data = [{ x: 1, y: 2 }, { x: 3, y: 4 }];  // 对象格式
// regressionLinear() 默认读 d[0], d[1]，不匹配对象格式

// ✅ 正确：显式指定字段读取方式
callback: regressionLinear()
  .x((d) => d.x)   // ✅ 指定 x 字段
  .y((d) => d.y),  // ✅ 指定 y 字段
```

### 错误 4：data 关键字缺失

```javascript
// ❌ 错误
children: [
  {
    type: 'line',
    {
      transform: [{ type: 'custom', callback: regressionLinear() }],
    },                             // ❌ 孤立 {} 语法错误，缺少 data: 键
    encode: { x: (d) => d[0], y: (d) => d[1] },
  },
]

// ✅ 正确
children: [
  {
    type: 'line',
     {                        // ✅ 必须有 data: 键
      transform: [{ type: 'custom', callback: regressionLinear() }],
    },
    encode: { x: (d) => d[0], y: (d) => d[1] },
  },
]
```
