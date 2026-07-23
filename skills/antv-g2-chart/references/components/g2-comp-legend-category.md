---
id: "g2-comp-legend-category"
title: "G2 分类图例（LegendCategory）"
description: |
  分类图例组件，用于展示离散类别的图例项。
  是最常用的图例类型，适用于分类数据的可视化。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "图例"
  - "legend"
  - "分类"
  - "category"

related:
  - "g2-comp-legend-config"
  - "g2-scale-ordinal"
  - "g2-interaction-legend-filter"

use_cases:
  - "柱状图的分类图例"
  - "折线图的系列图例"
  - "散点图的分组图例"

anti_patterns:
  - "连续数据应使用连续图例（LegendContinuous）"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/component/legend"
---

## 核心概念

LegendCategory 是分类图例组件：
- 显示离散类别的图例项
- 每项包含图标和标签
- 支持交互（点击筛选、hover 高亮）

**特点：**
- 自动从 color/shape 通道推断
- 支持水平和垂直布局
- 支持自定义图标

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { category: 'A', type: 'X', value: 100 },
    { category: 'A', type: 'Y', value: 150 },
    { category: 'B', type: 'X', value: 120 },
    { category: 'B', type: 'Y', value: 180 },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'type',
  },
  legend: {
    color: {
      position: 'top',
      layout: {
        justifyContent: 'center',
      },
    },
  },
});

chart.render();
```

## 常用变体

### 垂直布局

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      position: 'right',
      layout: {
        flexDirection: 'column',
      },
    },
  },
});
```

### 自定义标签格式

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      labelFormatter: (val) => `类型: ${val}`,
    },
  },
});
```

### 添加标题

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      title: '类型',
      position: 'top',
    },
  },
});
```

### 自定义图标

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      itemMarker: 'square',  // 'circle' | 'square' | 'line' | ...
      itemMarkerSize: 12,
    },
  },
});
```

### 网格布局

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      cols: 3,  // 每行显示 3 项
      layout: { justifyContent: 'center' },
    },
  },
});
```

### 禁用交互

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      itemMarker: 'circle',
    },
  },
  interaction: {
    legendFilter: false,  // 禁用点击筛选
  },
});
```

## 完整类型参考

```typescript
interface LegendCategoryOptions {
  // 位置和布局
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  layout?: {
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end';
    flexWrap?: 'wrap' | 'nowrap';
  };
  cols?: number;  // 网格布局列数

  // 标题
  title?: string | string[];

  // 图标
  itemMarker?: string | ((id: any, index: number) => string);
  itemMarkerSize?: number;
  itemMarkerLineWidth?: number;
  itemSpacing?: number;

  // 标签
  labelFormatter?: string | ((val: any) => string);
  maxItemWidth?: number;

  // 样式
  style?: {
    fill?: string;
    fontSize?: number;
    // 更多样式...
  };

  // 其他
  dx?: number;
  dy?: number;
}
```

## 与连续图例的区别

| 特性 | 分类图例 | 连续图例 |
|------|---------|---------|
| 数据类型 | 离散类别 | 连续数值 |
| 显示方式 | 图标 + 标签列表 | 色带 + 刻度 |
| 交互 | 点击筛选 | 无筛选 |
| 适用场景 | 分类数据 | 数值映射 |

## 常见错误与修正

### 错误 1：position 参数错误

```javascript
// ❌ 错误：position 应该是预定义值
legend: { color: { position: 'top-left' } }

// ✅ 正确
legend: { color: { position: 'top' } }
```

### 错误 2：未映射 color 通道

```javascript
// ❌ 错误：没有 color 通道，图例不会显示
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  legend: { color: { position: 'top' } },
});

// ✅ 正确：添加 color 通道
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: { color: { position: 'top' } },
});
```

### 错误 3：itemMarker 类型错误

```javascript
// ❌ 错误：itemMarker 应该是预定义形状名或函数
legend: { color: { itemMarker: 'triangle-up' } }

// ✅ 正确：使用支持的形状
legend: { color: { itemMarker: 'triangle' } }
// 或
legend: { color: { itemMarker: (id, i) => i === 0 ? 'circle' : 'square' } }
```