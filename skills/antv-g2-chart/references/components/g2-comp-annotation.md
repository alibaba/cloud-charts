---
id: "g2-comp-annotation"
title: "G2 标注（Annotation）"
description: |
  在 G2 v5 中，标注通过额外的 Mark（text、line、image 等）叠加在图表上实现，
  常见的有文字标注、参考线（reference line）、参考区间（reference area）。
  本文采用 Spec 模式的 view + children 方式组合标注。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "annotation"
  - "标注"
  - "参考线"
  - "reference line"
  - "文字标注"
  - "lineX"
  - "lineY"
  - "spec"

related:
  - "g2-core-view-composition"
  - "g2-comp-axis-config"

use_cases:
  - "在图表中添加平均线、目标线"
  - "标注特殊数据点（最大值、最小值）"
  - "添加参考区间背景色"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/extra-topics/annotation"
---

## 水平参考线（lineY）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'view',
  data,
  children: [
    // 主图：折线图
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
    },
    // 标注：y=60 的水平参考线
    {
      type: 'lineY',
      data: [60],
      style: {
        stroke: '#f5222d',
        strokeDasharray: '4 4',
        lineWidth: 1.5,
      },
      labels: [
        {
          text: '目标值: 60',
          position: 'right',
          style: { fill: '#f5222d', fontSize: 11 },
        },
      ],
    },
  ],
});

chart.render();
```

## 垂直参考线（lineX）

```javascript
// 标记某个特殊时间点
{
  type: 'lineX',
  data: [new Date('2024-03-01')],
  style: { stroke: '#722ed1', strokeDasharray: '4 4', lineWidth: 1.5 },
  labels: [
    { text: '版本发布', position: 'top', style: { fill: '#722ed1' } },
  ],
}
```

## 标注最大值点

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'month', y: 'value' } },
    {
      // 用 point + text 标注最大值
      type: 'point',
      data,
      encode: { x: 'month', y: 'value' },
      transform: [{ type: 'select', channel: 'y', selector: 'max' }],  // 只选最大值点
      style: { fill: '#f5222d', r: 5 },
      labels: [
        {
          text: (d) => `最大值\n${d.value}`,
          position: 'top',
          style: { fill: '#f5222d', fontSize: 11 },
        },
      ],
    },
  ],
});
```

## 参考区间（rangeX）

```javascript
// 高亮某个 x 值范围（如正常区间）
{
  type: 'rangeX',
  data: [{ x: '6月', x1: '7月' }],
  encode: { x: 'x', x1: 'x1' },
  style: {
    fill: '#52c41a',
    fillOpacity: 0.08,
  },
  labels: [
    {
      text: '正常范围',
      position: 'top-right',
      style: { fill: '#52c41a', fontSize: 11 },
    },
  ],
}
```

## 参考区间（rangeY）

```javascript
// 高亮某个 y 值范围（如正常区间）
{
  type: 'rangeY',
  data: [{ y: 50, y1: 80 }],
  encode: { y: 'y', y1: 'y1' },
  style: {
    fill: '#52c41a',
    fillOpacity: 0.08,
  },
  labels: [
    {
      text: '正常范围',
      position: 'right',
      style: { fill: '#52c41a', fontSize: 11 },
    },
  ],
}
```

## 文字标注（text mark）

```javascript
// 在指定坐标处添加文字
{
  type: 'text',
  data: [{ x: 'Mar', y: 91, label: '最高点' }],
  encode: { x: 'x', y: 'y', text: 'label' },
  style: {
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: '#1890ff',
    fontSize: 12,
    dy: -6,
  },
}
```

## 图片标注（image mark）

```javascript
// 在图表中心添加图片标注
{
  type: 'image',
  data: [{
    src: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    x: '50%',
    y: '50%'
  }],
  encode: { 
    x: 'x', 
    y: 'y', 
    src: 'src' 
  },
  style: {
    width: 80,
    height: 80,
    textAlign: 'center',
    textBaseline: 'middle'
  }
}
```

## 常见错误与修正

### 错误：在非 view 容器中直接叠加标注
```javascript
// ❌ 错误：多个 chart.options() 会互相覆盖
chart.options({ type: 'line', ... });
chart.options({ type: 'lineY', ... });  // 覆盖了折线图！

// ✅ 正确：用 type: 'view' + children 数组叠加
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', ... },
    { type: 'lineY', ... },
  ],
});
```

### 错误：image 标注未正确设置位置和编码
```javascript
// ❌ 错误：使用函数返回固定坐标，未绑定到数据通道
{
  type: 'image',
  data: [{ url: 'https://example.com/image.png' }],
  encode: {
    x: () => 0, // 固定在中心
    y: () => 0  // 固定在中心
  },
  style: {
    img: (d) => d.url,
    width: 80,
    height: 80
  }
}

// ✅ 正确：使用相对百分比坐标并正确映射 src 通道
{
  type: 'image',
  data: [{
    src: 'https://example.com/image.png',
    x: '50%',
    y: '50%'
  }],
  encode: { 
    x: 'x', 
    y: 'y', 
    src: 'src' 
  },
  style: {
    width: 80,
    height: 80
  }
}
```