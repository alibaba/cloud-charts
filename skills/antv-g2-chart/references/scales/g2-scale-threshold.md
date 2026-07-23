---
id: "g2-scale-threshold"
title: "G2 阈值比例尺（threshold）"
description: |
  阈值比例尺将连续数值按指定的阈值切分为若干区间，每个区间映射到一个离散输出（如颜色）。
  常用于热力图、地图分级着色等场景，用几个关键阈值划分数据等级。
  与 quantize（等分）不同，threshold 支持自定义不均匀的分割点。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "threshold"
  - "阈值"
  - "比例尺"
  - "分级"
  - "choropleth"
  - "热力"
  - "scale"

related:
  - "g2-scale-linear"
  - "g2-scale-ordinal"
  - "g2-mark-cell-heatmap"

use_cases:
  - "地图分级着色（choropleth map）"
  - "热力图数据分级（低/中/高/极高）"
  - "自定义区间的颜色映射"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/threshold"
---

## 最小可运行示例（热力图分级着色）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { week: 'Mon', hour: '08:00', count: 5 },
  { week: 'Mon', hour: '09:00', count: 45 },
  { week: 'Mon', hour: '12:00', count: 120 },
  { week: 'Tue', hour: '09:00', count: 85 },
  { week: 'Wed', hour: '12:00', count: 200 },
  // ...
];

const chart = new Chart({ container: 'container', width: 640, height: 300 });

chart.options({
  type: 'cell',
  data,
  encode: {
    x: 'hour',
    y: 'week',
    color: 'count',
  },
  scale: {
    color: {
      type: 'threshold',
      domain: [30, 80, 150],          // 3 个阈值，划分为 4 个区间
      range: ['#ebedf0', '#c6e48b', '#7bc96f', '#196127'],  // 对应 4 个颜色
    },
  },
  style: { lineWidth: 2, stroke: '#fff' },
});

chart.render();
```

## 配置项

```javascript
scale: {
  color: {
    type: 'threshold',
    domain: [30, 80, 150],    // N 个阈值，产生 N+1 个区间
    range: ['#low', '#mid-low', '#mid-high', '#high'],  // N+1 个输出值
  },
}
```

## 风险等级着色示例

```javascript
// 将连续风险分数映射到 4 个风险等级颜色
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [25, 50, 75],     // 低/中/高/极高 分界线
      range: [
        '#52c41a',  // 0~25：低风险（绿）
        '#faad14',  // 25~50：中风险（黄）
        '#ff7a45',  // 50~75：高风险（橙）
        '#ff4d4f',  // 75+：极高风险（红）
      ],
    },
  },
});
```

## 常见错误与修正

### 错误：domain 和 range 数量不匹配
```javascript
// ❌ 错误：2 个 domain 阈值产生 3 个区间，但只有 2 个 range 颜色
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [50, 100],     // 2 个阈值 → 3 个区间
      range: ['#green', '#red'],  // ❌ 只有 2 个颜色，应该是 3 个
    },
  },
});

// ✅ 正确：domain N 个阈值 → range 需要 N+1 个颜色
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [50, 100],
      range: ['#52c41a', '#faad14', '#ff4d4f'],  // ✅ 3 个颜色
    },
  },
});
```
