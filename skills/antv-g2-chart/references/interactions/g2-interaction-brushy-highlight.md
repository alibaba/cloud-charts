---
id: "g2-interaction-brushy-highlight"
title: "G2 BrushYHighlight Interaction"
description: |
  Y 轴方向刷选高亮交互。用户可以通过拖拽选择 Y 轴范围，
  高亮显示该范围内的数据元素。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "刷选"
  - "高亮"
  - "brush"
  - "Y轴"
  - "数据探索"

related:
  - "g2-interaction-brush"
  - "g2-interaction-brushx-highlight"
  - "g2-interaction-brushy-filter"

use_cases:
  - "数值范围高亮"
  - "Y 轴区间选择高亮"
  - "异常值识别"

anti_patterns:
  - "需要过滤数据时改用 BrushYFilter"
  - "需要 X 轴方向选择时改用 BrushXHighlight"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## 核心概念

BrushYHighlight 交互允许用户在 Y 轴方向拖拽选择一个区间，选区内的数据元素会被高亮显示，其他元素变暗。

**特点：**
- 只能在 Y 轴方向选择
- 高亮而非过滤数据
- 适合数值范围的数据探索

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'point',
  data: [
    { x: 10, y: 100 },
    { x: 20, y: 150 },
    { x: 30, y: 80 },
    { x: 40, y: 200 },
    { x: 50, y: 120 },
  ],
  encode: {
    x: 'x',
    y: 'y',
  },
  interaction: {
    brushYHighlight: true,
  },
});

chart.render();
```

## 常用变体

### 自定义刷选样式

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushYHighlight: {
      brushStyle: {
        fill: '#52c41a',
        fillOpacity: 0.3,
      },
    },
  },
});
```

### 自定义高亮状态

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushYHighlight: {
      selectedHandles: ['handle-n', 'handle-s'],  // 显示的拖拽手柄
    },
  },
  state: {
    active: {
      fill: '#52c41a',
      r: 8,
    },
    inactive: {
      fillOpacity: 0.3,
    },
  },
});
```

## 完整类型参考

```typescript
interface BrushYHighlightInteraction {
  brushYHighlight: boolean | {
    brushStyle?: {
      fill?: string;
      fillOpacity?: number;
      stroke?: string;
    };
    selectedHandles?: string[];  // ['handle-n', 'handle-s']
    // 其他配置继承自 BrushHighlight
  };
}
```

## 与 BrushHighlight/BrushXHighlight 的对比

| Interaction | 选择方向 | 常用场景 |
|-------------|---------|---------|
| brushHighlight | 任意方向 | 通用高亮 |
| brushXHighlight | 仅 X 方向 | 分类/时间范围高亮 |
| brushYHighlight | 仅 Y 方向 | 数值范围高亮 |

## 与 BrushYFilter 的区别

| 特性 | BrushYHighlight | BrushYFilter |
|------|-----------------|--------------|
| 数据处理 | 高亮显示 | 过滤隐藏 |
| 非选区数据 | 变暗但可见 | 完全隐藏 |
| 适用场景 | 数据探索、对比 | 数据筛选、缩放 |

## 常见错误与修正

### 错误 1：与 Filter 交互混淆

```javascript
// ❌ 错误：想要过滤数据却用了 highlight
interaction: { brushYHighlight: true }

// ✅ 正确：根据需求选择
// 需要高亮：brushYHighlight
// 需要过滤：brushYFilter
```

### 错误 2：未配置 state 样式

```javascript
// ⚠️ 注意：默认高亮效果可能不明显
// 建议配置 state 以获得更好的视觉效果
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: { brushYHighlight: true },
  state: {
    active: { fill: '#52c41a', r: 8 },
    inactive: { fillOpacity: 0.2 },
  },
});
```