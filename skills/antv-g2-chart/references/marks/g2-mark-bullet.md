---
id: "g2-mark-bullet"
title: "G2 Bullet Chart Mark"
description: |
  子弹图 Mark。使用 view 组合 interval 和 point 实现，展示实际值与目标值的对比。
  适用于业绩监控、KPI 展示、进度跟踪等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "子弹图"
  - "bullet"
  - "KPI"
  - "进度"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-gauge"

use_cases:
  - "业绩指标监控"
  - "KPI 仪表盘"
  - "预算执行跟踪"

anti_patterns:
  - "时间趋势分析应使用折线图"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/bullet"
---

## 核心概念

子弹图（Bullet Chart）是一种紧凑的指标展示图表，同时显示：
- **实际值条形**：当前实际达到的数值
- **目标值标记**：需要达成的目标
- **表现区间**：背景色带表示差/良/优等级

**适用场景：**
- 仪表盘 KPI 展示
- 业绩指标监控
- 资源利用率监控

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

const data = [
  { title: '销售完成率', ranges: 100, measures: 80, target: 85 },
];

chart.options({
  type: 'view',
  coordinate: { transform: [{ type: 'transpose' }] },
  children: [
    {
      type: 'interval',
      data,
      encode: { x: 'title', y: 'ranges', color: '#f0efff' },
      style: { maxWidth: 30 },
    },
    {
      type: 'interval',
      data,
      encode: { x: 'title', y: 'measures', color: '#5B8FF9' },
      style: { maxWidth: 20 },
    },
    {
      type: 'point',
      data,
      encode: {
        x: 'title',
        y: 'target',
        shape: 'line',
        color: '#3D76DD',
        size: 8,
      },
    },
  ],
});

chart.render();
```

## 常用变体

### 多指标子弹图

```javascript
const multiData = [
  { metric: 'CPU使用率', ranges: 100, measures: 65, target: 80 },
  { metric: '内存使用率', ranges: 100, measures: 45, target: 70 },
  { metric: '磁盘使用率', ranges: 100, measures: 88, target: 85 },
];

chart.options({
  type: 'view',
  coordinate: { transform: [{ type: 'transpose' }] },
  children: [
    { type: 'interval', data: multiData, encode: { x: 'metric', y: 'ranges', color: '#f5f5f5' } },
    { type: 'interval', data: multiData, encode: { x: 'metric', y: 'measures', color: '#52c41a' } },
    { type: 'point', data: multiData, encode: { x: 'metric', y: 'target', shape: 'line', size: 6 } },
  ],
});
```

### 带表现区间

```javascript
const transformedData = [
  { title: '项目进度', value: 40, level: '差' },
  { title: '项目进度', value: 30, level: '良' },
  { title: '项目进度', value: 30, level: '优' },
];

chart.options({
  type: 'view',
  coordinate: { transform: [{ type: 'transpose' }] },
  children: [
    {
      type: 'interval',
      data: transformedData,
      encode: { x: 'title', y: 'value', color: 'level' },
      transform: [{ type: 'stackY' }],
      scale: {
        color: { domain: ['差', '良', '优'], range: ['#ffebee', '#fff3e0', '#e8f5e8'] },
      },
    },
    // ... 实际值和目标值
  ],
});
```

### 垂直子弹图

```javascript
chart.options({
  type: 'view',
  // 不使用 transpose
  children: [
    { type: 'interval', data, encode: { x: 'metric', y: 'ranges', color: '#f0f0f0' } },
    { type: 'interval', data, encode: { x: 'metric', y: 'measures', color: '#52c41a' } },
    { type: 'point', data, encode: { x: 'metric', y: 'target', shape: 'line', size: 6 } },
  ],
});
```

## 完整类型参考

```typescript
interface BulletData {
  title: string;      // 指标名称
  ranges: number;     // 背景范围（通常为 100）
  measures: number;   // 实际值
  target: number;     // 目标值
}

// 子弹图由三个图层组成：
// 1. interval - 背景区间
// 2. interval - 实际值条形
// 3. point (shape: 'line') - 目标值标记
```

## 子弹图 vs 仪表盘

| 特性 | 子弹图 | 仪表盘 |
|------|--------|--------|
| 空间占用 | 紧凑 | 较大 |
| 信息量 | 多指标 | 单指标 |
| 适用场景 | 仪表盘 | 大屏展示 |

## 常见错误与修正

### 错误 1：缺少 transpose

```javascript
// ❌ 问题：默认是垂直方向
coordinate: {}

// ✅ 正确：水平子弹图需要 transpose
coordinate: { transform: [{ type: 'transpose' }] }
```

### 错误 2：目标值标记不明显

```javascript
// ❌ 问题：目标值使用默认 point 形状
encode: { shape: 'point' }

// ✅ 正确：使用 line 形状
encode: { shape: 'line', size: 8 }
```