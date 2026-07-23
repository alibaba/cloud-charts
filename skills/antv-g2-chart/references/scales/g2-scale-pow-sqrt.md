---
id: "g2-scale-pow-sqrt"
title: "G2 幂次比例尺（pow）和平方根比例尺（sqrt）"
description: |
  pow 比例尺将数值按幂函数（y = x^exponent）映射，exponent=0.5 时等同于 sqrt 比例尺。
  sqrt 是 pow 的特例（exponent=0.5），将数值映射为平方根，
  常用于面积编码（如气泡大小）确保视觉面积与数值成线性比例。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "pow"
  - "sqrt"
  - "幂次"
  - "平方根"
  - "比例尺"
  - "scale"
  - "气泡图"

related:
  - "g2-scale-log"
  - "g2-scale-linear"
  - "g2-mark-point-bubble"

use_cases:
  - "气泡图 size 通道用 sqrt 比例尺（确保面积线性）"
  - "数据轻微偏斜时用 pow 拉伸/压缩数值范围"
  - "视觉编码中面积与数值的线性映射"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/pow"
---

## 最小可运行示例（气泡图 sqrt 比例尺）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { country: '中国', gdp: 17.7, population: 141 },
  { country: '美国', gdp: 25.5, population: 33 },
  { country: '印度', gdp: 3.4,  population: 142 },
  { country: '日本', gdp: 4.2,  population: 13 },
  { country: '巴西', gdp: 1.8,  population: 22 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'gdp',
    y: 'country',
    size: 'population',
    color: 'country',
  },
  scale: {
    size: {
      type: 'sqrt',        // 平方根比例尺：面积与 population 成线性比例
      range: [8, 60],      // 半径范围
    },
  },
  style: { fillOpacity: 0.7 },
});

chart.render();
```

## pow 比例尺（自定义指数）

```javascript
// exponent = 2：数值越大差异越被放大（适合展示小差异）
scale: {
  y: {
    type: 'pow',
    exponent: 2,    // y = x^2，放大大值之间的差异
  },
}

// exponent = 0.5：等同于 sqrt（压缩大值）
scale: {
  y: {
    type: 'pow',
    exponent: 0.5,  // 等同于 type: 'sqrt'
  },
}
```

## 为什么气泡大小要用 sqrt

```javascript
// ❌ 错误：用 linear 比例尺映射半径
// 半径 r 与数值成线性，则面积 = πr²，面积与数值呈平方关系
// 人口 100 和 400，视觉面积比是 1:16，误导读者
scale: { size: { type: 'linear', range: [8, 60] } }  // ❌

// ✅ 正确：用 sqrt 比例尺映射半径
// 半径 r = sqrt(数值)，面积 = πr² = π×数值，面积与数值成线性
// 人口 100 和 400，视觉面积比是 1:4，符合实际比例
scale: { size: { type: 'sqrt', range: [8, 60] } }  // ✅
```

## 常见错误与修正

### 错误：数据包含 0 或负数且 exponent < 1——sqrt(0) = 0 正常，但负数会得到 NaN
```javascript
// ❌ sqrt(-1) = NaN，数据中有负数时会报错
chart.options({
  scale: { y: { type: 'sqrt' } },
   [{ y: -10 }],  // ❌ 负数
});

// ✅ sqrt 比例尺只适用于非负数
// 如果有负数，先用 Math.abs 处理，或改用 linear
chart.options({
  scale: { y: { type: 'sqrt', domain: [0, 200] } },  // ✅ 确保 domain 非负
});
```
