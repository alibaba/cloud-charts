---
id: "g2-mark-histogram"
title: "G2 Histogram Mark"
description: |
  直方图 Mark。使用 rect 标记配合 binX 转换，展示连续数值数据的分布情况。
  适用于统计分析、数据分布探索等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "直方图"
  - "histogram"
  - "分布"
  - "统计"

related:
  - "g2-mark-boxplot"
  - "g2-transform-binx"

use_cases:
  - "数据分布分析"
  - "统计分析"
  - "频数统计"

anti_patterns:
  - "分类数据比较应使用柱状图"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/histogram"
---

## 核心概念

直方图用于展示连续数值数据的分布情况。与柱状图不同：
- 直方图使用 `rect` 标记，支持 `x` 和 `x1` 通道表示区间
- 必须配合 `binX` 转换，自动分箱统计
- 柱子之间无间隔，表示数据连续

**关键要素：**
- `rect` 标记：支持区间表示
- `binX` 转换：自动分箱统计
- `x1` 通道：表示区间结束位置

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'rect',
  data: {
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/diamond.json',
  },
  encode: {
    x: 'carat',
    y: 'count',
  },
  transform: [
    { type: 'binX', y: 'count' },
  ],
  style: {
    fill: '#1890FF',
    fillOpacity: 0.9,
  },
});

chart.render();
```

## 常用变体

### 指定分箱数量

```javascript
chart.options({
  type: 'rect',
  data,
  encode: { x: 'value', y: 'count' },
  transform: [
    { type: 'binX', y: 'count', thresholds: 30 },  // 指定分箱数量
  ],
});
```

### 多分布对比

```javascript
chart.options({
  type: 'rect',
  data,
  encode: {
    x: 'price',
    y: 'count',
    color: 'group',
  },
  transform: [
    { type: 'binX', y: 'count', groupBy: ['group'] },
  ],
  style: { fillOpacity: 0.7 },
});
```

### 带坐标轴标题

```javascript
chart.options({
  type: 'rect',
  data,
  encode: { x: 'carat', y: 'count' },
  transform: [{ type: 'binX', y: 'count' }],
  axis: {
    x: { title: '钻石重量（克拉）' },
    y: { title: '频数' },
  },
});
```

## 完整类型参考

```typescript
interface HistogramOptions {
  type: 'rect';
  encode: {
    x: string;           // 连续数值字段
    y: 'count';          // 统计数量
    color?: string;      // 分组字段
  };
  transform: [
    {
      type: 'binX';
      y: 'count';
      thresholds?: number;  // 分箱数量
      groupBy?: string[];   // 分组字段
    }
  ];
}
```

## 直方图 vs 柱状图

| 特性 | 直方图 | 柱状图 |
|------|--------|--------|
| 数据类型 | 连续数值 | 分类数据 |
| Mark 类型 | `rect` | `interval` |
| 柱子间隔 | 无间隔 | 有间隔 |
| X 轴 | 连续区间 | 离散类别 |

## 常见错误与修正

### 错误 1：使用 interval 标记

```javascript
// ❌ 问题：interval 不支持区间表示
type: 'interval'

// ✅ 正确：使用 rect 标记
type: 'rect'
```

### 错误 2：缺少 binX 转换

```javascript
// ❌ 问题：没有分箱统计
encode: { x: 'value', y: 'count' }

// ✅ 正确：添加 binX 转换
transform: [{ type: 'binX', y: 'count' }]
```

### 错误 3：数据量过少

```javascript
// ⚠️ 注意：直方图需要足够的数据量
// 建议数据量 >= 50 条
```