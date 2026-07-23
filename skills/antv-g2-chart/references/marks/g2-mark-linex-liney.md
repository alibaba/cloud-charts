---
id: "g2-mark-linex-liney"
title: "G2 LineX / LineY 参考线"
description: |
  lineX 绘制垂直参考线（指定 x 值），lineY 绘制水平参考线（指定 y 值）。
  常用于标注均值线、目标线、阈值线等，
  通常与主图放在同一 view 的 children 中。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "lineX"
  - "lineY"
  - "参考线"
  - "均值线"
  - "目标线"
  - "annotation"
  - "标注"

related:
  - "g2-comp-annotation"
  - "g2-mark-rangex"
  - "g2-mark-line-basic"

use_cases:
  - "在散点图中绘制 X/Y 均值线"
  - "添加目标值水平参考线"
  - "标注阈值警戒线"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/line/"
---

## 最小可运行示例（均值参考线）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 110 },
];

const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'view',
  data,
  children: [
    // 主柱状图
    {
      type: 'interval',
      encode: { x: 'month', y: 'value', color: 'month' },
    },
    // 水平均值参考线
    {
      type: 'lineY',
       [{ y: avg }],    // 参考线的 y 值
      encode: { y: 'y' },
      style: {
        stroke: '#F4664A',
        lineWidth: 1.5,
        lineDash: [6, 3],   // 虚线样式
      },
      labels: [
        {
          text: `均值: ${avg.toFixed(1)}`,
          position: 'right',
          style: { fill: '#F4664A', fontSize: 12 },
        },
      ],
    },
  ],
});

chart.render();
```

## lineX（垂直参考线）

```javascript
// 在散点图中添加 X 轴均值线
const meanX = data.reduce((sum, d) => sum + d.x, 0) / data.length;

{
  type: 'lineX',
  data: [{ x: meanX }],
  encode: { x: 'x' },
  style: { stroke: '#5B8FF9', lineWidth: 1.5, lineDash: [4, 4] },
  labels: [{ text: `x̄=${meanX.toFixed(1)}`, position: 'top' }],
}
```

## 目标线（固定数值）

```javascript
{
  type: 'lineY',
  data: [{ y: 100 }],    // 固定目标值 100
  encode: { y: 'y' },
  style: {
    stroke: '#52c41a',
    lineWidth: 2,
  },
  labels: [
    { text: '目标线 100', position: 'right', style: { fill: '#52c41a' } },
  ],
}
```

## 常见错误与修正

### ❌ 错误：使用不存在的 ruleX / ruleY 类型
```javascript
// ❌ 错误：ruleX、ruleY 是 Vega-Lite 的概念，G2 中不存在
chart.options({ type: 'ruleX', ... });
chart.options({ type: 'ruleY', ... });

// ✅ 正确：G2 中用 lineX / lineY
chart.options({ type: 'lineX', data: [{ x: 5 }], encode: { x: 'x' } });
chart.options({ type: 'lineY', data: [{ y: 100 }], encode: { y: 'y' } });
```

### 错误：data 中 y 字段名与 encode.y 不一致
```javascript
// ❌ 错误：数据中字段是 'value'，但 encode.y 写的是 'y'
chart.options({
  type: 'lineY',
  data: [{ value: 100 }],
  encode: { y: 'y' },     // ❌ 字段名不对，找不到 'y' 字段
});

// ✅ 正确：字段名与数据一致
chart.options({
  type: 'lineY',
  data: [{ value: 100 }],
  encode: { y: 'value' }, // ✅
});
// 或者直接用 'y' 字段名：
chart.options({
  type: 'lineY',
  data: [{ y: 100 }],
  encode: { y: 'y' },     // ✅ 字段名统一
});
```

### 错误：lineY 放在 view 外部——与主图比例尺不共享，位置偏移
```javascript
// ❌ 参考线与主图不在同一 view，y 轴范围不共享
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'month', y: 'sales' } },
  ],
});
// 单独添加 lineY（不在 children 中）——这样无法工作

// ✅ 参考线必须放在同一 view 的 children 数组中
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'month', y: 'sales' } },
    { type: 'lineY', data: [{ y: 100 }], encode: { y: 'y' } },  // ✅
  ],
});
```
