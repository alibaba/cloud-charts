---
id: "g2-transform-select"
title: "G2 Select / SelectX / SelectY 筛选变换"
description: |
  select 系列变换从分组数据中筛选出特定的数据行用于标注。
  selectX 按 x 通道分组后筛选（常用于折线图末端标签），
  selectY 按 y 通道分组后筛选。
  selector 支持 'first'、'last'、'min'、'max' 等预设值或自定义函数。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "select"
  - "selectX"
  - "selectY"
  - "筛选"
  - "末端标签"
  - "极值标注"
  - "transform"

related:
  - "g2-mark-line-basic"
  - "g2-mark-text"
  - "g2-comp-annotation"

use_cases:
  - "在折线图末端显示最新数据标签"
  - "标注每条线的最大值或最小值"
  - "在特定 x 位置放置注释标签"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/select"
---

## 最小可运行示例（折线图末端标签）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', type: 'A', value: 83 },
  { month: 'Feb', type: 'A', value: 90 },
  { month: 'Mar', type: 'A', value: 76 },
  { month: 'Jan', type: 'B', value: 50 },
  { month: 'Feb', type: 'B', value: 65 },
  { month: 'Mar', type: 'B', value: 72 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

// 主折线图
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       data,
      encode: { x: 'month', y: 'value', color: 'type' },
    },
    // 末端标签：text mark + selectX（取每条线的最后一个点）
    {
      type: 'text',
       data,
      encode: { x: 'month', y: 'value', color: 'type', text: 'type' },
      transform: [
        {
          type: 'selectX',
          selector: 'last',   // 取每组（每条线）x 最大的点
        },
      ],
      style: { textAnchor: 'start', dx: 6 },
    },
  ],
});

chart.render();
```

## 标注最大值

```javascript
// 在折线图最高点添加标注
{
  type: 'point',
  data,
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [
    {
      type: 'selectY',
      selector: 'max',   // 每组取 y 值最大的点
    },
  ],
  style: { r: 6, lineWidth: 2 },
  labels: [{ text: (d) => `最高: ${d.value}`, position: 'top' }],
}
```

## selector 速查

```javascript
// 取最后一个点（常用于末端标签）
transform: [{ type: 'selectX', selector: 'last' }]

// 取第一个点
transform: [{ type: 'selectX', selector: 'first' }]

// 取 y 值最大的点
transform: [{ type: 'selectY', selector: 'max' }]

// 取 y 值最小的点
transform: [{ type: 'selectY', selector: 'min' }]

// 自定义：取第 N 个点
transform: [{ type: 'selectX', selector: (data) => data[Math.floor(data.length / 2)] }]
```

## 常见错误与修正

### 错误：select 用在 line mark 自身——应用在独立的 text/point mark
```javascript
// ❌ 在 line mark 上用 selectX，整条线只剩一个点
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },
  transform: [{ type: 'selectX', selector: 'last' }],  // ❌ 会把折线变成单点
});

// ✅ select 用在额外的 text 或 point mark，与 line 并列
chart.options({
  type: 'view',
  children: [
    { type: 'line', data, encode: { x: 'month', y: 'value' } },
    {
      type: 'text',
      data,
      encode: { x: 'month', y: 'value', text: 'value' },
      transform: [{ type: 'selectX', selector: 'last' }],  // ✅ 独立 mark
    },
  ],
});
```
