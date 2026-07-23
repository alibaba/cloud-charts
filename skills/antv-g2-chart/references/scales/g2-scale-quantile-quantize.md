---
id: "g2-scale-quantile-quantize"
title: "G2 分位数比例尺（quantile）与分段比例尺（quantize）"
description: |
  quantile：按数据实际分布的分位数分组，每组数量相等（等频分组）。
  quantize：按数值范围等分，每段区间宽度相等（等距分组）。
  两者都将连续数值映射到离散输出（如颜色），常用于地图分级着色。
  与 threshold 的区别是：threshold 手动指定断点，quantile/quantize 自动计算。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "quantile"
  - "quantize"
  - "分位数"
  - "等频"
  - "等距"
  - "比例尺"
  - "scale"
  - "分级着色"

related:
  - "g2-scale-threshold"
  - "g2-scale-ordinal"
  - "g2-mark-cell-heatmap"

use_cases:
  - "地图分级着色：按数据分布自动分组（quantile）"
  - "等距分级着色（quantize）"
  - "热力图的颜色分级"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/quantile"
---

## quantile vs quantize vs threshold 对比

| 比例尺 | 分组方式 | 适合场景 |
|--------|---------|---------|
| `threshold` | 手动指定断点 | 有业务含义的固定分级（如 60分=及格） |
| `quantize` | 数值范围等距分段 | 均匀分布数据的等距分级 |
| `quantile` | 数据实际分位数分组 | 偏斜分布数据的等频分级（每组数量相等） |

## quantile 比例尺

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 300 });

chart.options({
  type: 'cell',
  data,
  encode: { x: 'week', y: 'day', color: 'count' },
  scale: {
    color: {
      type: 'quantile',
      // 自动按数据分位数分组，每组记录数量相等
      range: ['#ebedf0', '#c6e48b', '#7bc96f', '#196127'],
      // domain 不需要指定，自动从数据中计算
    },
  },
  style: { lineWidth: 2, stroke: '#fff' },
});
```

## quantize 比例尺

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'hour', y: 'day', color: 'value' },
  scale: {
    color: {
      type: 'quantize',
      domain: [0, 100],  // 明确指定数值范围（会被等距分为 N 段）
      range: ['#fee0d2', '#fc9272', '#de2d26'],  // 3 种颜色 = 3 段
    },
  },
});
```

## 常见错误与修正

### 错误：quantile 数据极度偏斜时视觉效果差——用 threshold 手动设置
```javascript
// ⚠️  数据高度偏斜（如 95% 数据集中在低值），quantile 分组合理但视觉上
// 大部分区域颜色相近，少数高值区域颜色鲜艳，不直观
chart.options({ scale: { color: { type: 'quantile' } } });  // ⚠️  偏斜数据效果差

// ✅ 偏斜数据改用 log 比例尺配合 sequential，或用 threshold 手动设置关键节点
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [10, 100, 1000],  // 按对数级设置断点
      range: ['#eee', '#fee', '#f66', '#c00'],
    },
  },
});
```

### 错误：quantize 不指定 domain——自动从数据中推断，可能有边界问题
```javascript
// ⚠️  不指定 domain 时，quantize 从数据 min/max 推断，
// 新数据超出范围时会超出色阶
chart.options({ scale: { color: { type: 'quantize' } } });  // ⚠️  依赖数据范围

// ✅ 明确指定业务含义的 domain
chart.options({
  scale: { color: { type: 'quantize', domain: [0, 100] } },  // ✅ 明确 0~100
});
```
