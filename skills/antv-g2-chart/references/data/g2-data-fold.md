---
id: "g2-data-fold"
title: "G2 Fold 宽表转长表"
description: |
  Fold 数据变换将宽格式数据（多列）转换为长格式数据（单列+分类列），
  使多个字段可以映射到同一个 color/series 通道。
  配置在 data.transform 中，是在 G2 中实现多系列图表的常用数据预处理手段。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "fold"
  - "宽表转长表"
  - "pivot"
  - "多系列"
  - "数据变换"
  - "data transform"

related:
  - "g2-data-filter"
  - "g2-data-sort"
  - "g2-mark-line-basic"
  - "g2-mark-area-stacked"

use_cases:
  - "将宽表多列数据转换为多系列折线图"
  - "将同类指标的多个字段合并为一个系列字段"
  - "减少手动 flatMap 数据预处理代码"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/fold"
---

## 核心概念

**Fold 是数据变换（Data Transform），不是标记变换（Mark Transform）**

- 数据变换配置在 `data.transform` 中
- 在数据加载阶段执行，影响所有使用该数据的标记

**宽表（Wide）**：每个指标占一列
```
month | revenue | cost | profit
Jan   | 320     | 200  | 120
Feb   | 450     | 230  | 220
```

**长表（Long/Tidy）**：所有指标值合并到一列，增加分类列
```
month | key     | value
Jan   | revenue | 320
Jan   | cost    | 200
Jan   | profit  | 120
Feb   | revenue | 450
...
```

G2 的 `fold` 数据变换自动完成这个转换，无需手动 `flatMap`。

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

// 宽表数据（每个指标是独立的列）
const wideData = [
  { month: 'Jan', revenue: 320, cost: 200, profit: 120 },
  { month: 'Feb', revenue: 450, cost: 230, profit: 220 },
  { month: 'Mar', revenue: 380, cost: 210, profit: 170 },
  { month: 'Apr', revenue: 510, cost: 260, profit: 250 },
];

chart.options({
  type: 'line',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      {
        type: 'fold',
        fields: ['revenue', 'cost', 'profit'],  // 要折叠的列名
        key: 'key',      // 生成的键列名（默认 'key'）
        value: 'value',  // 生成的值列名（默认 'value'）
      },
    ],
  },
  encode: {
    x: 'month',
    y: 'value',     // fold 后的值列
    color: 'key',   // fold 后的键列
  },
});

chart.render();
```

## 堆叠面积图中使用 fold

```javascript
chart.options({
  type: 'area',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      { type: 'fold', fields: ['revenue', 'cost', 'profit'] },
    ],
  },
  encode: { x: 'month', y: 'value', color: 'key' },
  transform: [{ type: 'stackY' }],  // mark transform
});
```

## 等价的手动方式（作为对比）

```javascript
// 不用 fold，手动 flatMap（代码较冗长）
const longData = wideData.flatMap((d) => [
  { month: d.month, metric: 'revenue', value: d.revenue },
  { month: d.month, metric: 'cost',    value: d.cost    },
  { month: d.month, metric: 'profit',  value: d.profit  },
]);

chart.options({
  type: 'line',
   longData,
  encode: { x: 'month', y: 'value', color: 'metric' },
});
```

## 配置项

| 属性   | 描述                           | 类型       | 默认值  |
| ------ | ------------------------------ | ---------- | ------- |
| fields | 需要展开的字段列表             | `string[]` |         |
| key    | 展开之后，字段枚举值对应字段名 | `string`   | `key`   |
| value  | 展开之后，数据值对应字段名     | `string`   | `value` |

## 常见错误与修正

### 错误 1：fold 放在 mark transform 中

```javascript
// ❌ 错误：fold 是数据变换，不能放在 mark 的 transform 中
chart.options({
  type: 'line',
   wideData,
  transform: [{ type: 'fold', fields: ['a', 'b'] }],  // ❌ 错误位置
});

// ✅ 正确：fold 放在 data.transform 中
chart.options({
  type: 'line',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['a', 'b'] }],  // ✅ 正确
  },
});
```

### 错误 2：fields 里的字段名拼写错误

```javascript
// ❌ 错误：字段名与数据不匹配，fold 后得到 undefined 值
data: {
  transform: [{ type: 'fold', fields: ['Revenue', 'Cost'] }],  // 大写，但数据是小写
}

// ✅ 正确：字段名必须与数据对象的 key 完全一致（区分大小写）
data: {
  transform: [{ type: 'fold', fields: ['revenue', 'cost'] }],
}
```

### 错误 3：encode 中 y/color 字段名与 as 配置不匹配

```javascript
// ❌ 错误：fold 默认生成 'key'/'value' 列，但 encode 用了别的名字
chart.options({
  data: {
    transform: [{ type: 'fold', fields: ['a', 'b'] }],  // 默认生成 key/value
  },
  encode: { y: 'metric', color: 'series' },  // 错误：字段名不存在
});

// ✅ 正确：encode 名字与 fold 的 key/value 配置一致
chart.options({
  data: {
    transform: [{ type: 'fold', fields: ['a', 'b'], key: 'metric', value: 'amount' }],
  },
  encode: { y: 'amount', color: 'metric' },
});
```

### 错误 4：简写 data 无法配置 transform

```javascript
// ❌ 错误：简写 data 无法配置 transform
chart.options({
   wideData,  // 简写形式
  // 无法添加 fold transform
});

// ✅ 正确：使用完整 data 配置
chart.options({
   {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['revenue', 'cost'] }],
  },
});
```

### 错误 5：`` 关键字丢失——SyntaxError

这是代码生成时极常见的错误：`data` 属性值是一个多行嵌套对象，容易忘记写 `data:` 键名，导致 JavaScript 语法错误（`Unexpected token '{'`），图表完全无法运行。

```javascript
// ❌ 错误： 键名丢失，{ type: 'inline', ... } 是孤立对象字面量 → SyntaxError
chart.options({
  type: 'interval',
  {                          // ❌ 语法错误！缺少 data: 前缀
    type: 'inline',
    value: populationData,
    transform: [{
      type: 'fold',
      fields: ['Under 5 Years', '5 to 13 Years'],
      key: 'AgeGroup',
      value: 'Population',
    }]
  },
  encode: { x: 'State', y: 'Population', color: 'AgeGroup' },
});

// ✅ 正确：必须写 data: 键名
chart.options({
  type: 'interval',
   {                    // ✅  不能省略
    type: 'inline',
    value: populationData,
    transform: [{
      type: 'fold',
      fields: ['Under 5 Years', '5 to 13 Years'],
      key: 'AgeGroup',
      value: 'Population',
    }]
  },
  encode: { x: 'State', y: 'Population', color: 'AgeGroup' },
});
```

**为什么容易漏写**：`data` 值是一个多行嵌套对象，在生成时容易把它当作独立的「块」而非 `chart.options({})` 的属性，导致漏写 `` 前缀。同样问题也出现在 `coordinate:`、`children:` 等多行对象属性上——凡是值为复杂对象的属性，都要确认键名写全。