---
id: "g2-mark-text"
title: "G2 文字标注（text Mark）"
description: |
  G2 v5 内置 text Mark，用于在图表中绘制自定义文字标注，
  encode.x/y 确定位置，encode.text 或 style.text 提供内容，
  常与其他 Mark 叠加使用，实现数据标签、阈值标注和图表标题等效果。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "文字标注"
  - "text"
  - "标签"
  - "注释"
  - "annotation"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"
  - "g2-core-view-composition"
  - "g2-comp-annotation"

use_cases:
  - "在柱状图顶部显示数值标签"
  - "标注图表中的特殊事件或阈值"
  - "添加自定义图表标题或说明文字"
  - "高亮某个数据点的文字描述"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/annotation/#text"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 600,
  height: 400,
});

const data = [
  { month: '1月', value: 120 },
  { month: '2月', value: 180 },
  { month: '3月', value: 150 },
  { month: '4月', value: 210 },
  { month: '5月', value: 170 },
];

chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
    },
    {
      type: 'text',
      encode: {
        x: 'month',
        y: 'value',
        text: 'value',   // 数据字段名 → 显示该字段的值
      },
      style: {
        textAlign: 'center',
        dy: -8,           // 向上偏移
        fontSize: 12,
        fill: '#333',
      },
    },
  ],
});

chart.render();
```

## 固定位置文字标注（不绑定数据）

```javascript
// 在图表固定位置添加一行文字（如阈值说明）
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
    },
    {
      // 固定位置文字，使用单条数据
      type: 'text',
       [{ x: '3月', y: 200, label: '达标线' }],
      encode: { x: 'x', y: 'y', text: 'label' },
      style: {
        fill: '#ff4d4f',
        fontSize: 12,
        fontWeight: 'bold',
        dx: 5,
      },
    },
  ],
});
```

## 结合 lineY 标注水平阈值线

```javascript
// lineY + text 组合：标注阈值线
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
      style: { fill: '#1890ff' },
    },
    {
      // 水平阈值线
      type: 'lineY',
      data: [{ y: 160 }],
      encode: { y: 'y' },
      style: { stroke: '#ff4d4f', lineDash: [4, 4], lineWidth: 1.5 },
    },
    {
      // 阈值标注文字
      type: 'text',
       [{ month: '5月', value: 160, label: '目标 160' }],
      encode: { x: 'month', y: 'value', text: 'label' },
      style: {
        fill: '#ff4d4f',
        fontSize: 12,
        textAlign: 'right',
        dy: -6,
      },
    },
  ],
});
```

## 完整配置项

```javascript
chart.options({
  type: 'text',
  data,
  encode: {
    x: 'xField',      // x 位置（对应坐标轴字段）
    y: 'yField',      // y 位置（对应坐标轴字段）
    text: 'textField', // 显示的文字内容字段
    color: 'series',  // 按系列着色（可选）
  },
  style: {
    // 文字样式
    fontSize: 12,
    fontWeight: 'normal',
    fill: '#333',
    textAlign: 'center',    // 'left' | 'center' | 'right'
    textBaseline: 'bottom', // 'top' | 'middle' | 'bottom'

    // 位置偏移
    dx: 0,    // 水平偏移（px）
    dy: -8,   // 垂直偏移（px，负值向上）

    // 背景框（可选）
    background: true,
    backgroundFill: 'rgba(255,255,255,0.8)',
    backgroundPadding: [2, 4],
    backgroundRadius: 3,

    // 旋转
    rotate: 0,   // 旋转角度（度）
  },
});
```

## 散点图数据点标签

```javascript
const scatterData = [
  { x: 10, y: 80, name: '产品A' },
  { x: 20, y: 60, name: '产品B' },
  { x: 35, y: 90, name: '产品C' },
  { x: 50, y: 40, name: '产品D' },
  { x: 65, y: 75, name: '产品E' },
];

chart.options({
  type: 'view',
  data: scatterData,
  children: [
    {
      type: 'point',
      encode: { x: 'x', y: 'y' },
      style: { r: 6, fill: '#1890ff' },
    },
    {
      type: 'text',
      encode: { x: 'x', y: 'y', text: 'name' },
      style: {
        dy: -12,
        textAlign: 'center',
        fontSize: 11,
        fill: '#666',
      },
    },
  ],
});
```

## 常见错误与修正

### 错误 1：text Mark 独立使用时没有数据

```javascript
// ❌ 错误：text Mark 需要 data 或者从父 view 继承数据
chart.options({
  type: 'text',
  // 缺少 data，且无父 view 提供数据
  encode: { x: 'month', y: 'value', text: 'label' },
});

// ✅ 正确方式一：在父 view 中提供数据
chart.options({
  type: 'view',
  data,               // 父 view 提供数据，子 mark 自动继承
  children: [
    { type: 'interval', encode: { x: 'month', y: 'value' } },
    { type: 'text', encode: { x: 'month', y: 'value', text: 'value' } },
  ],
});

// ✅ 正确方式二：text Mark 自带数据（用于固定标注）
chart.options({
  type: 'text',
  data: [{ x: '3月', y: 200, label: '特殊标注' }],
  encode: { x: 'x', y: 'y', text: 'label' },
});
```

### 错误 2：encode.text 写成了字面量字符串而非字段名

```javascript
// ❌ 错误：encode.text 应该是数据中的字段名，不能写固定文字
chart.options({
  type: 'text',
  encode: {
    x: 'month',
    y: 'value',
    text: '固定文字',   // ❌ 这里写的是字面量，但数据中没有叫 '固定文字' 的字段
  },
});

// ✅ 正确：固定文字应用 style.text 或 transform 函数
chart.options({
  type: 'text',
  encode: { x: 'month', y: 'value' },
  style: {
    text: (d) => `${d.value}`,   // ✅ 通过函数返回文字内容
    textAlign: 'center',
    dy: -8,
  },
});

// 或者在 encode 中用函数
chart.options({
  type: 'text',
  encode: {
    x: 'month',
    y: 'value',
    text: (d) => d.value,   // ✅ encode.text 可以是函数
  },
});
```

### 错误 3：text 与 interval 叠加时忘记共用 view

```javascript
// ❌ 错误：两个独立 chart 无法叠加
const chart1 = new Chart({ container: 'c1' });
chart1.options({ type: 'interval', data, encode: { x: 'month', y: 'value' } });

const chart2 = new Chart({ container: 'c2' });
chart2.options({ type: 'text', data, encode: { x: 'month', y: 'value', text: 'value' } });

// ✅ 正确：用 view 的 children 叠加
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'interval', encode: { x: 'month', y: 'value' } },
    {
      type: 'text',
      encode: { x: 'month', y: 'value', text: 'value' },
      style: { textAlign: 'center', dy: -8 },
    },
  ],
});
```
