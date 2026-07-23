---
id: "g2-mark-arc-donut"
title: "G2 环形图（Donut Chart）"
description: |
  在饼图基础上通过设置 coordinate.innerRadius 创建环形图（甜甜圈图），
  中间空白区域可放置汇总数字或说明文字，在保留占比展示的同时减少视觉重量。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "arc"
tags:
  - "环形图"
  - "甜甜圈"
  - "donut"
  - "innerRadius"
  - "占比"
  - "饼图变体"
  - "spec"

related:
  - "g2-mark-arc-pie"
  - "g2-transform-stacky"

use_cases:
  - "展示各类别占比，中心区域显示汇总数据"
  - "比饼图更现代的占比展示方式"
  - "KPI 卡片中的占比环"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/donut"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 480,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '其他',   value: 15 },
  ],
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: {
    type: 'theta',
    outerRadius: 0.8,
    innerRadius: 0.5,    // 关键：设置内径产生空心效果
  },
});

chart.render();
```

## 带中心文字的环形图

```javascript
import { Chart } from '@antv/g2';

const data = [
  { type: '已完成', value: 75 },
  { type: '未完成', value: 25 },
];
const total = data.reduce((s, d) => s + d.value, 0);

const chart = new Chart({ container: 'container', width: 400, height: 400 });

chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
       data,
      encode: { y: 'value', color: 'type' },
      transform: [{ type: 'stackY' }],
      coordinate: { type: 'theta', outerRadius: 0.85, innerRadius: 0.6 },
      scale: {
        color: { range: ['#1890ff', '#f0f0f0'] },
      },
      legend: false,
    },
    {
      // 中心文字用 text mark 在极坐标中心绘制
      type: 'text',
       [{ value: data[0].value }],
      encode: { text: (d) => `${d.value}%` },
      style: {
        x: '50%', y: '50%',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        fill: '#1890ff',
      },
    },
  ],
});

chart.render();
```

## 带外部标签的环形图

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8, innerRadius: 0.5 },
  labels: [
    {
      text: (d) => `${d.type}: ${d.value}`,
      position: 'outside',
      connector: true,
    },
  ],
});
```

## 常见错误与修正

### 错误：innerRadius 大于 outerRadius
```javascript
// ❌ 错误：内径大于外径，圆环消失
chart.options({
  coordinate: { type: 'theta', outerRadius: 0.5, innerRadius: 0.8 },
});

// ✅ 正确：innerRadius < outerRadius，推荐比例 0.5-0.7
chart.options({
  coordinate: { type: 'theta', outerRadius: 0.8, innerRadius: 0.5 },
});
```
