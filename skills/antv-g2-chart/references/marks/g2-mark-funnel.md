---
id: "g2-mark-funnel"
title: "G2 漏斗图（funnel）"
description: |
  漏斗图使用 interval mark 配合 shape: 'funnel' 或 'pyramid'，
  展示业务流程中数据在不同阶段的流转和转化率。
  必须配合 symmetryY transform 和 transpose coordinate 使用。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "漏斗图"
  - "funnel"
  - "pyramid"
  - "转化率"
  - "流程"
  - "symmetryY"

related:
  - "g2-mark-interval-basic"
  - "g2-transform-symmetryy"
  - "g2-coord-transpose"

use_cases:
  - "销售流程转化率分析"
  - "用户注册/购买漏斗"
  - "金字塔层级结构展示"
  - "双漏斗对比（两渠道对比）"

anti_patterns:
  - "无序数据不适合漏斗图"
  - "数值有增有减的流程不适合"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/funnel"
---

## 核心概念

**漏斗图 = interval mark + shape: 'funnel' + symmetryY transform + transpose coordinate**

- `encode.shape: 'funnel'`：启用漏斗形状
- `transform: [{ type: 'symmetryY' }]`：使漏斗左右对称（**必须**）
- `coordinate: { transform: [{ type: 'transpose' }] }`：横向展示（推荐）
- `axis: false`：漏斗图通常隐藏坐标轴

**金字塔变体**：`shape: 'pyramid'` + `style: { reverse: true }`

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'interval',
  data: [
    { stage: '访问', value: 8043 },
    { stage: '咨询', value: 2136 },
    { stage: '报价', value: 908 },
    { stage: '议价', value: 691 },
    { stage: '成交', value: 527 },
  ],
  encode: {
    x: 'stage',
    y: 'value',
    color: 'stage',
    shape: 'funnel',
  },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'symmetryY' }],
  scale: {
    color: { palette: 'spectral' },
  },
  animate: { enter: { type: 'fadeIn' } },
  axis: false,
  labels: [
    {
      text: (d) => `${d.stage}\n${d.value}`,
      position: 'inside',
      transform: [{ type: 'contrastReverse' }],
    },
  ],
  legend: false,
});

chart.render();
```

## 金字塔图

```javascript
chart.options({
  type: 'interval',
  data: [
    { text: '顶层', value: 5 },
    { text: '中上层', value: 10 },
    { text: '中等', value: 20 },
    { text: '中下层', value: 25 },
    { text: '底层', value: 40 },
  ],
  encode: {
    x: 'text',
    y: 'value',
    color: 'text',
    shape: 'pyramid',   // 金字塔形状
  },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'symmetryY' }],
  style: {
    reverse: true,    // 反转，使小值在顶部（金字塔形）
  },
  scale: {
    x: { paddingOuter: 0, paddingInner: 0 },
    color: { type: 'ordinal' },
  },
  axis: false,
  labels: [
    { text: (d) => d.text, position: 'inside' },
    { text: (d) => `${d.value}%`, position: 'inside', style: { dy: 15 } },
  ],
});
```

## 对比漏斗图（双漏斗）

两个漏斗镜像对比，通过 y 轴负值实现下方漏斗反向展示：

```javascript
chart.options({
  type: 'view',
  autoFit: true,
  data: [
    { action: '访问', visitor: 500, site: '站点1' },
    { action: '浏览', visitor: 400, site: '站点1' },
    { action: '交互', visitor: 300, site: '站点1' },
    { action: '下单', visitor: 200, site: '站点1' },
    { action: '完成', visitor: 100, site: '站点1' },
    { action: '访问', visitor: 550, site: '站点2' },
    { action: '浏览', visitor: 420, site: '站点2' },
    { action: '交互', visitor: 280, site: '站点2' },
    { action: '下单', visitor: 150, site: '站点2' },
    { action: '完成', visitor: 80, site: '站点2' },
  ],
  scale: {
    x: { padding: 0 },
    color: { range: ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF'] },
  },
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: false,
  children: [
    {
      type: 'interval',
      data: {
        transform: [{ type: 'filter', callback: (d) => d.site === '站点1' }],
      },
      encode: { x: 'action', y: 'visitor', color: 'action', shape: 'funnel' },
      style: { stroke: '#FFF' },
      animate: { enter: { type: 'fadeIn' } },
      labels: [
        {
          text: 'visitor',
          position: 'inside',
          transform: [{ type: 'contrastReverse' }],
        },
        { text: 'action', position: 'right' },
      ],
    },
    {
      type: 'interval',
      data: {
        transform: [{ type: 'filter', callback: (d) => d.site === '站点2' }],
      },
      encode: {
        x: 'action',
        y: (d) => -d.visitor,  // 负值实现镜像对称
        color: 'action',
        shape: 'funnel',
      },
      style: { stroke: '#FFF' },
      animate: { enter: { type: 'fadeIn' } },
      labels: [
        {
          text: 'visitor',
          position: 'inside',
          transform: [{ type: 'contrastReverse' }],
        },
      ],
    },
  ],
  legend: false,
});
```

## 百分比漏斗 + 转化率标注

`normalizeY` 使各阶段高度等比，`symmetryY` 使其对称——**顺序不能颠倒**：

```javascript
const data = [
  { stage: '访问', count: 10000 },
  { stage: '注册', count: 6200 },
  { stage: '激活', count: 3800 },
  { stage: '付费', count: 1500 },
];

const dataWithRate = data.map((d, i) => ({
  ...d,
  rate: i === 0 ? '100%' : `${((d.count / data[i - 1].count) * 100).toFixed(1)}%`,
}));

chart.options({
  type: 'interval',
  data: dataWithRate,
  encode: {
    x: 'stage',
    y: 'count',
    color: 'stage',
    shape: 'funnel',
  },
  transform: [
    { type: 'normalizeY' },   // ① 先归一化（统一高度比例）
    { type: 'symmetryY' },    // ② 再对称（形成漏斗形状）
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: false,
  legend: false,
  labels: [
    {
      text: (d) => d.stage,
      position: 'inside',
      style: { fill: 'white', fontSize: 13, fontWeight: 'bold' },
    },
    {
      text: (d) => `转化率 ${d.rate}`,
      position: 'right',
      style: { fill: '#666', fontSize: 11 },
      dx: 8,
    },
  ],
});
```

## 常见错误与修正

### 错误 1：缺少 symmetryY transform

```javascript
// ❌ 错误：没有 symmetryY，漏斗形状不对称，会变成普通柱状图
chart.options({
  type: 'interval',
  data,
  encode: { x: 'stage', y: 'value', shape: 'funnel' },
  coordinate: { transform: [{ type: 'transpose' }] },
  // ❌ 缺少 transform: [{ type: 'symmetryY' }]
});

// ✅ 正确：必须加 symmetryY
chart.options({
  type: 'interval',
  data,
  encode: { x: 'stage', y: 'value', shape: 'funnel' },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'symmetryY' }],  // ✅ 必须
});
```

### 错误 2：shape 值错误

```javascript
// ❌ 错误：shape 应在 encode 中，不是 style 中
chart.options({
  type: 'interval',
  encode: { x: 'stage', y: 'value' },
  style: { shape: 'funnel' },  // ❌ shape 不在 style 中
});

// ✅ 正确：shape 是 encode 通道
chart.options({
  type: 'interval',
  encode: { x: 'stage', y: 'value', shape: 'funnel' },  // ✅
});
```

### 错误 3：coordinate 语法错误

```javascript
// ❌ 错误：coordinate 不是数组
chart.options({
  coordinate: [{ type: 'transpose' }],  // ❌ 错误语法
});

// ✅ 正确：coordinate 是对象，transpose 放在 transform 数组中
chart.options({
  coordinate: { transform: [{ type: 'transpose' }] },  // ✅
});
```

### 错误 4：金字塔不反转

```javascript
// ❌ 错误：pyramid 默认宽端在顶部（不是金字塔形状）
chart.options({
  encode: { shape: 'pyramid' },
  // ❌ 缺少 style.reverse: true
});

// ✅ 正确：加 reverse: true 使小值在顶部
chart.options({
  encode: { shape: 'pyramid' },
  style: { reverse: true },  // ✅ 使最小值在顶（金字塔形）
});
```

## encode.shape 可选值

| shape 值    | 效果                     |
|------------|--------------------------|
| `'funnel'` | 标准漏斗形状（默认梯形）  |
| `'pyramid'`| 等腰三角形（金字塔）      |
