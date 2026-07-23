---
id: "g2-mark-rangex"
title: "G2 RangeX / RangeY 区间标注"
description: |
  rangeX 在 X 轴方向绘制竖向区域带（区间高亮），常用于标注特殊时间段或阈值区间。
  rangeY 在 Y 轴方向绘制横向区域带，用于标注某个数值范围（如目标区间、警戒线）。
  常与折线图组合使用，在背景添加时间区间标注。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "rangeX"
  - "rangeY"
  - "区间"
  - "标注"
  - "高亮区域"
  - "参考区域"
  - "时间区间"

related:
  - "g2-comp-annotation"
  - "g2-mark-line-basic"
  - "g2-comp-view"

use_cases:
  - "时间序列图中高亮特殊时间段（如历史事件、假期）"
  - "标注正常值区间（如绿色安全区间）"
  - "突出显示某个数据范围"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/range/"
---

## 最小可运行示例（时间段高亮）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'view',
  children: [
    // 主折线图
    {
      type: 'line',
       [
        { date: '2024-01', value: 100 },
        { date: '2024-02', value: 120 },
        { date: '2024-03', value: 150 },
        { date: '2024-04', value: 130 },
        { date: '2024-05', value: 160 },
      ],
      encode: { x: 'date', y: 'value' },
      style: { lineWidth: 2 },
    },
    // 高亮特殊区域
    {
      type: 'rangeX',
       [
        { x: '2024-02', x1: '2024-03', label: '活动期' },
      ],
      encode: { x: 'x', x1: 'x1' },
      style: { fill: '#FF6B35', fillOpacity: 0.15 },
      labels: [{ text: 'label', position: 'top', style: { fontSize: 11 } }],
    },
  ],
});

chart.render();
```

## 时间区间标注（折线图 + 历史事件背景）

使用 Date 对象和数组格式标注历史时间段：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

// 人口数据
const populationData = [
  { year: '1875', population: 1309 },
  { year: '1890', population: 1558 },
  { year: '1910', population: 4512 },
  { year: '1925', population: 8180 },
  { year: '1933', population: 15915 },
  { year: '1939', population: 24824 },
  { year: '1946', population: 28275 },
  { year: '1950', population: 29189 },
  { year: '1964', population: 29881 },
  { year: '1971', population: 26007 },
];

chart.options({
  type: 'view',
  autoFit: true,
  children: [
    // 背景区间标注（历史时期）
    {
      type: 'rangeX',
       [
        { year: [new Date('1933'), new Date('1945')], event: '纳粹统治时期' },
        { year: [new Date('1948'), new Date('1989')], event: '东德时期' },
      ],
      encode: { x: 'year', color: 'event' },
      scale: {
        color: {
          independent: true,  // 独立颜色比例尺，每个区间不同颜色
          range: ['#FAAD14', '#30BF78'],
        },
      },
      style: { fillOpacity: 0.75 },
      tooltip: false,
    },
    // 折线图
    {
      type: 'line',
      data: populationData,
      encode: {
        x: (d) => new Date(d.year),
        y: 'population',
      },
      style: { stroke: '#333', lineWidth: 2 },
    },
    // 数据点
    {
      type: 'point',
      data: populationData,
      encode: {
        x: (d) => new Date(d.year),
        y: 'population',
      },
      style: { fill: '#333', r: 3 },
    },
  ],
});

chart.render();
```

## 数据格式说明

rangeX 支持两种数据格式：

### 格式一：独立字段（x, x1）

```javascript
 [
  { x: '2024-01', x1: '2024-03', label: 'Q1' },
  { x: '2024-04', x1: '2024-06', label: 'Q2' },
],
encode: { x: 'x', x1: 'x1' },
```

### 格式二：数组字段

```javascript
data: [
  { year: [new Date('1933'), new Date('1945')], event: '事件A' },
  { year: [new Date('1948'), new Date('1989')], event: '事件B' },
],
encode: { x: 'year' },  // 数组自动解析为 [start, end]
```

## RangeY（水平参考区间）

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       data,
      encode: { x: 'date', y: 'temperature' },
    },
    // 标注正常温度区间（18~26°C）
    {
      type: 'rangeY',
       [{ y: 18, y1: 26, label: '舒适区间' }],
      encode: { y: 'y', y1: 'y1' },
      style: { fill: '#52c41a', fillOpacity: 0.1 },
      labels: [{ text: 'label', position: 'right', style: { fill: '#52c41a' } }],
    },
  ],
});
```

## 配置项

| 属性 | 说明 | 类型 |
|------|------|------|
| `encode.x` | 区间起点字段 | `string \| (d) => value` |
| `encode.x1` | 区间终点字段 | `string \| (d) => value` |
| `encode.color` | 颜色字段（区分不同区间） | `string` |
| `style.fill` | 填充颜色 | `string` |
| `style.fillOpacity` | 填充透明度 | `number` (0-1) |
| `scale.color.independent` | 独立颜色比例尺 | `boolean` |

## 常见错误与修正

### 错误 1：encode 中 x/x1 写成数组而不是独立字段名

```javascript
// ❌ 错误：rangeX 中 x 和 x1 是独立字段，不是数组
chart.options({
  type: 'rangeX',
  encode: { x: ['start', 'end'] },  // ❌ 不是这个用法
});

// ✅ 正确：x 和 x1 分别绑定起点和终点字段
chart.options({
  type: 'rangeX',
   [{ start: '2024-01', end: '2024-03' }],
  encode: {
    x: 'start',    // ✅ 起点字段
    x1: 'end',     // ✅ 终点字段
  },
});
```

### 错误 2：时间格式不一致导致区间不与主图对齐

```javascript
// ❌ 错误：折线图用 Date 对象，rangeX 用字符串，比例尺不一致
children: [
  { type: 'line', encode: { x: (d) => new Date(d.year) } },
  { type: 'rangeX', encode: { x: 'year' } },  // ❌ 格式不一致
]

// ✅ 正确：统一使用 Date 对象
children: [
  { type: 'line', encode: { x: (d) => new Date(d.year) } },
  { type: 'rangeX', encode: { x: 'year' }, data: [
    { year: [new Date('1933'), new Date('1945')] }  // ✅ 也用 Date
  ]},
]
```

### 错误 3：多个区间颜色相同

```javascript
// ❌ 问题：多个区间默认使用连续色板，颜色可能相近
{
  type: 'rangeX',
  data: [
    { year: [start1, end1], event: '事件A' },
    { year: [start2, end2], event: '事件B' },
  ],
  encode: { x: 'year', color: 'event' },
}

// ✅ 正确：使用 independent: true 让每个区间独立着色
{
  type: 'rangeX',
  data: [
    { year: [start1, end1], event: '事件A' },
    { year: [start2, end2], event: '事件B' },
  ],
  encode: { x: 'year', color: 'event' },
  scale: {
    color: {
      independent: true,  // ✅ 独立颜色
      range: ['#FAAD14', '#30BF78'],
    },
  },
}
```

### 错误 4：rangeX 放在折线图后面导致遮挡

```javascript
// ❌ 错误：rangeX 在后，会遮挡折线
children: [
  { type: 'line', ... },
  { type: 'rangeX', ... },  // ❌ 遮挡折线
]

// ✅ 正确：rangeX 放前面，作为背景层
children: [
  { type: 'rangeX', ... },  // ✅ 先渲染，作为背景
  { type: 'line', ... },
]
```