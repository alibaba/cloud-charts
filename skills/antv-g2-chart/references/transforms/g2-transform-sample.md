---
id: "g2-transform-sample"
title: "G2 Sample 数据采样变换"
description: |
  sample 变换在数据超过阈值（默认 2000 条）时自动对数据降采样，
  避免大数据集渲染过慢或视觉过于密集。
  支持 first、last、min、max、median、lttb（最大三角形，保留趋势）等多种策略。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sample"
  - "采样"
  - "大数据"
  - "性能优化"
  - "lttb"
  - "降采样"
  - "transform"

related:
  - "g2-mark-line-basic"
  - "g2-transform-filter"

use_cases:
  - "折线图数据超过 2000 条时保留视觉趋势的采样"
  - "实时数据流的性能优化"
  - "股票K线等大时间序列可视化"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sample"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 模拟 5000 条时间序列数据
const data = Array.from({ length: 5000 }, (_, i) => ({
  time: new Date(2020, 0, 1 + Math.floor(i / 10)).toISOString(),
  value: Math.sin(i / 50) * 100 + Math.random() * 20,
}));

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'time', y: 'value' },
  transform: [
    {
      type: 'sample',
      thresholds: 500,     // 超过 500 条才触发采样
      strategy: 'lttb',   // 最大三角形采样，最佳保留视觉趋势
    },
  ],
});

chart.render();
```

## 采样策略对比

```javascript
// lttb（推荐）：最大三角形三桶算法，视觉保真度最高
transform: [{ type: 'sample', strategy: 'lttb', thresholds: 500 }]

// median：取每桶中位数，平滑但可能丢失极值
transform: [{ type: 'sample', strategy: 'median', thresholds: 1000 }]

// min/max：保留每桶最小/最大值，适合保留极值场景
transform: [{ type: 'sample', strategy: 'max', thresholds: 800 }]

// first/last：取每桶第一/最后一条，性能最好但精度最低
transform: [{ type: 'sample', strategy: 'first', thresholds: 2000 }]
```

## 多系列分组采样

```javascript
// groupBy 指定分组字段，每个系列独立采样
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'time', y: 'value', color: 'series' },
  transform: [
    {
      type: 'sample',
      thresholds: 300,
      strategy: 'lttb',
      groupBy: ['series', 'color'],  // 按系列分组，每组独立降采样
    },
  ],
});
```

## 配置项

```javascript
transform: [
  {
    type: 'sample',
    strategy: 'median',   // 采样策略：'first'|'last'|'min'|'max'|'median'|'lttb'|function
                          // 默认 'median'
    thresholds: 2000,     // 触发采样的数据量阈值，默认 2000
    groupBy: ['series', 'color'],  // 分组字段，默认 ['series', 'color']
  },
]
```

## 常见错误与修正

### 错误 1：thresholds 设置太高——数据虽大但不触发采样
```javascript
// ❌ 10000 条数据，thresholds 是默认的 2000，但策略不对
transform: [{ type: 'sample' }]  // 默认 thresholds: 2000，strategy: 'median'
// ⚠️  对 10000 条数据只降到 2000 条，可能还是太多

// ✅ 根据渲染目标明确设置 thresholds
transform: [{ type: 'sample', thresholds: 300, strategy: 'lttb' }]
```

### 错误 2：对柱状图使用 sample——破坏完整分类
```javascript
// ❌ 柱状图采样后，某些分类会消失，视觉上有断层
chart.options({
  type: 'interval',
  encode: { x: 'category', y: 'value' },
  transform: [{ type: 'sample' }],  // ❌ 柱状图通常不需要采样
});

// ✅ sample 主要用于折线图等连续数据
chart.options({
  type: 'line',
  encode: { x: 'time', y: 'value' },
  transform: [{ type: 'sample', strategy: 'lttb' }],  // ✅
});
```
