---
id: "g2-data-ema"
title: "G2 EMA 指数移动平均"
description: |
  EMA（Exponential Moving Average）数据变换对数据进行指数移动平均平滑处理。
  通过对最近的数据点赋予更高的权重，减少数据波动性，更清晰地观察趋势。
  配置在 data.transform 中。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "ema"
  - "指数移动平均"
  - "平滑"
  - "趋势"
  - "数据变换"
  - "data transform"

related:
  - "g2-mark-line"

use_cases:
  - "时间序列数据平滑"
  - "金融数据技术分析"
  - "训练指标平滑展示"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/ema"
---

## 核心概念

**EMA 是数据变换（Data Transform），不是标记变换（Mark Transform）**

- 数据变换配置在 `data.transform` 中
- 指数移动平均是一种数据平滑算法

**公式**：EMA_t = α × P_t + (1 - α) × EMA_{t-1}

**注意事项**：
- G2 中 `alpha` 越接近 1，平滑效果越明显
- `alpha` 越接近 0，EMA 越接近原始数据
- `field` 字段必须为数值型

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { t: 0, y: 100 },
  { t: 1, y: 180 },
  { t: 2, y: 120 },
  { t: 3, y: 200 },
  { t: 4, y: 150 },
  { t: 5, y: 250 },
];

chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       {
        type: 'inline',
        value: data,
        transform: [
          {
            type: 'ema',
            field: 'y',      // 要平滑的字段
            alpha: 0.6,      // 平滑因子
            as: 'emaY',      // 输出字段名
          },
        ],
      },
      encode: { x: 't', y: 'emaY' },
      style: { stroke: '#f90' },
    },
    {
      type: 'line',
       { type: 'inline', value: data },
      encode: { x: 't', y: 'y' },
      style: { stroke: '#ccc', lineDash: [4, 2] },
    },
  ],
});

chart.render();
```

## 配置项

| 属性  | 描述                                 | 类型     | 默认值     | 必选 |
| ----- | ------------------------------------ | -------- | ---------- | ---- |
| field | 需要平滑的字段名                     | `string` | `'y'`      | ✓    |
| alpha | 平滑因子，控制平滑程度（越大越平滑） | `number` | `0.6`      |      |
| as    | 生成的新字段名，若不指定将覆盖原字段 | `string` | 同 `field` |      |

## 金融行情平滑

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       {
        type: 'fetch',
        value: 'https://example.com/stock.csv',
        transform: [
          {
            type: 'ema',
            field: 'close',
            alpha: 0.7,
            as: 'emaClose',
          },
        ],
      },
      encode: { x: 'date', y: 'emaClose' },
      style: { stroke: '#007aff', lineWidth: 2 },
    },
    {
      type: 'line',
       { type: 'fetch', value: 'https://example.com/stock.csv' },
      encode: { x: 'date', y: 'close' },
      style: { stroke: '#bbb', lineDash: [4, 2] },
    },
  ],
});
```

## 常见错误与修正

### 错误 1：ema 放在 mark transform 中

```javascript
// ❌ 错误：ema 是数据变换，不能放在 mark 的 transform 中
chart.options({
  type: 'line',
  data,
  transform: [{ type: 'ema', field: 'y' }],  // ❌ 错误位置
});

// ✅ 正确：ema 放在 data.transform 中
chart.options({
  type: 'line',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'ema', field: 'y', as: 'emaY' }],  // ✅ 正确
  },
});
```

### 错误 2：字段不是数值型

```javascript
// ❌ 错误：field 字段必须为数值型
 {
  transform: [{ type: 'ema', field: 'name' }],  // ❌ name 是字符串
}

// ✅ 正确：使用数值型字段
 {
  transform: [{ type: 'ema', field: 'value' }],
}
```

### 错误 3：忘记设置 as 字段

```javascript
// ⚠️ 注意：不设置 as 会覆盖原字段
data: {
  transform: [{ type: 'ema', field: 'y' }],  // y 字段会被覆盖
}
encode: { y: 'y' },  // 使用的是平滑后的数据

// ✅ 推荐：设置 as 保留原字段
 {
  transform: [{ type: 'ema', field: 'y', as: 'emaY' }],
}
// 可以同时展示原始数据和平滑数据
```