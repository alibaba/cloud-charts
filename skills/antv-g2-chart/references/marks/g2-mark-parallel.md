---
id: "g2-mark-parallel"
title: "G2 Parallel Coordinates Mark"
description: |
  平行坐标系 Mark。使用 line 标记配合 parallel 坐标系，展示多维数据之间的关系。
  适用于多维数据关系分析、数据聚类识别等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "平行坐标系"
  - "parallel"
  - "多维数据"
  - "关系分析"

related:
  - "g2-mark-radar"
  - "g2-mark-sankey"

use_cases:
  - "多维数据关系分析"
  - "数据聚类识别"
  - "特征工程"

anti_patterns:
  - "维度 <3 应使用散点图"
  - "数据量过大（>1000）不适合"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/parallel"
---

## 核心概念

平行坐标系展示多维数据关系：
- 使用 `line` 标记
- 配合 `parallel` 坐标系
- 每条线代表一个数据记录的多个维度值

**关键特点：**
- 每个轴代表不同维度
- 轴之间没有因果关系
- 轴顺序可以调整

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'line',
  autoFit: true,
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/cars3.json',
  },
  coordinate: { type: 'parallel' },
  encode: {
    position: [
      'economy (mpg)',
      'cylinders',
      'displacement (cc)',
      'power (hp)',
    ],
    color: 'weight (lb)',
  },
  style: {
    lineWidth: 1.5,
    strokeOpacity: 0.4,
  },
});

chart.render();
```

## 常用变体

### 水平布局

```javascript
chart.options({
  type: 'line',
  coordinate: {
    type: 'parallel',
    transform: [{ type: 'transpose' }],
  },
  encode: {
    position: ['dim1', 'dim2', 'dim3'],
    color: 'category',
  },
});
```

### 带交互刷选

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'parallel' },
  data,
  encode: { position: ['A', 'B', 'C', 'D'], color: 'group' },
  interaction: {
    brushAxisHighlight: {
      maskFill: '#d8d0c0',
      maskOpacity: 0.3,
    },
  },
  state: {
    active: { lineWidth: 3, strokeOpacity: 1 },
    inactive: { stroke: '#ccc', opacity: 0.3 },
  },
});
```

### 平滑曲线

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'parallel' },
  data,
  encode: {
    position: ['A', 'B', 'C'],
    color: 'category',
    shape: 'smooth',  // 平滑曲线
  },
});
```

## 完整类型参考

```typescript
interface ParallelOptions {
  type: 'line';
  coordinate: {
    type: 'parallel';
    transform?: [{ type: 'transpose' }];
  };
  encode: {
    position: string[];  // 多个维度字段
    color?: string;      // 分类字段
  };
  style: {
    lineWidth?: number;
    strokeOpacity?: number;
  };
}
```

## 平行坐标 vs 折线图

| 特性 | 平行坐标系 | 折线图 |
|------|------------|--------|
| 用途 | 多维关系 | 时间趋势 |
| 轴含义 | 不同维度 | 时间序列 |
| 线含义 | 一条记录 | 一个指标 |

## 常见错误与修正

### 错误 1：使用错误坐标系

```javascript
// ❌ 问题：使用默认坐标系
coordinate: {}

// ✅ 正确：使用 parallel 坐标系
coordinate: { type: 'parallel' }
```

### 错误 2：position 编码错误

```javascript
// ❌ 问题：使用 x/y 编码
encode: { x: 'dim1', y: 'dim2' }

// ✅ 正确：使用 position 数组
encode: { position: ['dim1', 'dim2', 'dim3'] }
```

### 错误 3：维度过少

```javascript
// ⚠️ 注意：维度数量建议 >= 4
// 2-3 个维度应使用散点图
```