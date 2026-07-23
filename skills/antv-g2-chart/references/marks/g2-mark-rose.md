---
id: "g2-mark-rose"
title: "G2 Rose Chart Mark"
description: |
  南丁格尔玫瑰图 Mark。使用 interval 标记配合 polar 坐标系，通过扇形半径表示数值大小。
  适用于分类数据对比、周期性数据展示等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "玫瑰图"
  - "rose"
  - "南丁格尔图"
  - "极坐标"

related:
  - "g2-mark-arc-pie"
  - "g2-coord-polar"

use_cases:
  - "分类数据对比"
  - "周期性数据展示"
  - "多维度比较"

anti_patterns:
  - "分类过少应使用饼图"
  - "数值差异悬殊不适合"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/rose"
---

## 核心概念

南丁格尔玫瑰图在极坐标系下绘制柱状图：
- 使用 `interval` 标记
- 配合 `polar` 坐标系
- 扇形半径表示数值大小

**与饼图的区别：**
- 饼图：弧度表示数值
- 玫瑰图：半径表示数值

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'interval',
  autoFit: true,
  coordinate: { type: 'polar' },
  data: [
    { country: '中国', cost: 96 },
    { country: '德国', cost: 121 },
    { country: '美国', cost: 100 },
    { country: '日本', cost: 111 },
  ],
  encode: {
    x: 'country',
    y: 'cost',
    color: 'country',
  },
  style: {
    stroke: 'white',
    lineWidth: 1,
  },
});

chart.render();
```

## 常用变体

### 堆叠玫瑰图

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'polar', innerRadius: 0.1 },
  data,
  encode: { x: 'year', y: 'count', color: 'type' },
  transform: [{ type: 'stackY' }],
});
```

### 扇形玫瑰图

```javascript
chart.options({
  type: 'interval',
  coordinate: {
    type: 'polar',
    startAngle: Math.PI,
    endAngle: Math.PI * (3 / 2),
  },
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
});
```

### 带标签

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  labels: [
    {
      text: 'value',
      style: { textAlign: 'center', fontSize: 10 },
    },
  ],
});
```

## 完整类型参考

```typescript
interface RoseOptions {
  type: 'interval';
  coordinate: {
    type: 'polar';
    innerRadius?: number;    // 内半径
    startAngle?: number;     // 起始角度
    endAngle?: number;       // 结束角度
  };
  encode: {
    x: string;    // 分类字段
    y: string;    // 数值字段
    color?: string;
  };
  transform?: [{ type: 'stackY' }];  // 堆叠
}
```

## 玫瑰图 vs 饼图

| 特性 | 玫瑰图 | 饼图 |
|------|--------|------|
| 数值映射 | 半径 | 弧度 |
| 分类数量 | 较多 | 较少 |
| 对比方式 | 半径对比 | 面积对比 |

## 常见错误与修正

### 错误 1：使用 theta 坐标系

```javascript
// ❌ 问题：theta 是饼图坐标系
coordinate: { type: 'theta' }

// ✅ 正确：使用 polar 坐标系
coordinate: { type: 'polar' }
```

### 错误 2：数据未排序

```javascript
// ⚠️ 注意：玫瑰图建议数据排序后使用
// 可以使用 sortX transform
transform: [{ type: 'sortX', by: 'y' }]
```

### 错误 3：分类过多

```javascript
// ⚠️ 注意：分类数量建议不超过 30 个
// 过多分类会导致扇形过窄难以阅读
```