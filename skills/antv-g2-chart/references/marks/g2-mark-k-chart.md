---
id: "g2-mark-k-chart"
title: "G2 K-Chart (Candlestick) Mark"
description: |
  K线图 Mark。使用 link 和 interval 组合，展示股票等金融数据的价格走势。
  适用于股票分析、期货交易、数字货币分析等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "K线图"
  - "蜡烛图"
  - "candlestick"
  - "股票"

related:
  - "g2-mark-line-basic"
  - "g2-mark-boxplot"

use_cases:
  - "股票价格分析"
  - "期货交易"
  - "数字货币分析"

anti_patterns:
  - "非时间序列数据不适合"
  - "单一数值展示应使用折线图"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/candlestick"
---

## 核心概念

K线图展示金融数据的价格走势：
- 使用 `link` 标记表示影线（最高/最低价）
- 使用 `interval` 标记表示实体（开盘/收盘价）
- 颜色区分涨跌

**四价数据：**
- 开盘价（start）
- 收盘价（end）
- 最高价（max）
- 最低价（min）

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

const data = [
  { time: '2015-11-19', start: 8.18, max: 8.33, min: 7.98, end: 8.32 },
  { time: '2015-11-18', start: 8.37, max: 8.6, min: 8.03, end: 8.09 },
  { time: '2015-11-17', start: 8.7, max: 8.78, min: 8.32, end: 8.37 },
  { time: '2015-11-16', start: 8.48, max: 8.85, min: 8.43, end: 8.7 },
];

chart.options({
  type: 'view',
  data,
  encode: {
    x: 'time',
    color: (d) => (d.start > d.end ? '下跌' : '上涨'),
  },
  scale: {
    color: { domain: ['下跌', '上涨'], range: ['#4daf4a', '#e41a1c'] },
  },
  children: [
    // 影线（最高/最低价）
    {
      type: 'link',
      encode: { y: ['min', 'max'] },
    },
    // 实体（开盘/收盘价）
    {
      type: 'interval',
      encode: { y: ['start', 'end'] },
      style: { fillOpacity: 1 },
    },
  ],
});

chart.render();
```

## 常用变体

### 带成交量

```javascript
// K线图
const kChart = new Chart({ container: 'kChart' });
kChart.options({
  type: 'view',
  data,
  encode: { x: 'time', color: (d) => d.start > d.end ? '下跌' : '上涨' },
  children: [
    { type: 'link', encode: { y: ['min', 'max'] } },
    { type: 'interval', encode: { y: ['start', 'end'] } },
  ],
});

// 成交量图
const volumeChart = new Chart({ container: 'volumeChart' });
volumeChart.options({
  type: 'interval',
  data,
  encode: {
    x: 'time',
    y: 'volume',
    color: (d) => d.start > d.end ? '下跌' : '上涨',
  },
});
```

### Spec 模式

```javascript
chart.options({
  type: 'view',
  data,
  encode: {
    x: 'time',
    color: (d) => d.start > d.end ? '下跌' : '上涨',
  },
  scale: {
    color: { domain: ['下跌', '上涨'], range: ['#4daf4a', '#e41a1c'] },
  },
  children: [
    {
      type: 'link',
      encode: { y: ['min', 'max'] },
    },
    {
      type: 'interval',
      encode: { y: ['start', 'end'] },
      style: { fillOpacity: 1 },
    },
  ],
});
```

### 带坐标轴标题

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'link', encode: { y: ['min', 'max'] } },
    {
      type: 'interval',
      encode: { y: ['start', 'end'] },
      axis: {
        y: { title: '价格' },
      },
    },
  ],
});
```

## 完整类型参考

```typescript
interface KChartData {
  time: string;      // 时间
  start: number;     // 开盘价
  end: number;       // 收盘价
  max: number;       // 最高价
  min: number;       // 最低价
  volume?: number;   // 成交量（可选）
}

// K线图由两个图层组成：
// 1. link - 影线（最高/最低价）
// 2. interval - 实体（开盘/收盘价）
```

## K线图 vs 折线图

| 特性 | K线图 | 折线图 |
|------|-------|--------|
| 信息量 | 四价数据 | 单一价格 |
| 用途 | 技术分析 | 趋势展示 |
| 复杂度 | 较高 | 简单 |

## 常见错误与修正

### 错误 1：缺少 link 标记

```javascript
// ❌ 问题：只有实体，没有影线
chart.options({
  type: 'interval',
  encode: { y: ['start', 'end'] },
});

// ✅ 正确：使用 view 组合 link 和 interval
chart.options({
  type: 'view',
  children: [
    { type: 'link', encode: { y: ['min', 'max'] } },
    { type: 'interval', encode: { y: ['start', 'end'] } },
  ],
});
```

### 错误 2：颜色编码错误

```javascript
// ❌ 问题：颜色字段不正确
encode: { color: 'time' }

// ✅ 正确：根据涨跌设置颜色
encode: { color: (d) => d.start > d.end ? '下跌' : '上涨' }
```

### 错误 3：数据顺序错误

```javascript
// ⚠️ 注意：时间数据需要正确排序
scale: {
  x: {
    compare: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  },
}
```