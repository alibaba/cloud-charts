---
id: "g2-interaction-brushx-filter"
title: "G2 BrushXFilter Interaction"
description: |
  X 轴方向刷选过滤交互。用户可以通过拖拽选择 X 轴范围，
  过滤显示该范围内的数据。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "刷选"
  - "过滤"
  - "brush"
  - "X轴"
  - "数据筛选"

related:
  - "g2-interaction-brush-filter"
  - "g2-interaction-brushy-filter"
  - "g2-interaction-brushx-highlight"

use_cases:
  - "时间范围筛选"
  - "X 轴区间选择"
  - "数据缩放查看"

anti_patterns:
  - "需要 Y 轴方向筛选时改用 BrushYFilter"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## 核心概念

BrushXFilter 交互允许用户在 X 轴方向拖拽选择一个区间，图表会自动过滤并只显示该区间内的数据。

**特点：**
- 只能在 X 轴方向选择
- 选择后自动过滤数据
- 支持重置选择

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',
  data: [
    { date: '2024-01', value: 100 },
    { date: '2024-02', value: 120 },
    { date: '2024-03', value: 150 },
    { date: '2024-04', value: 130 },
    { date: '2024-05', value: 160 },
  ],
  encode: {
    x: 'date',
    y: 'value',
  },
  interaction: {
    brushXFilter: true,
  },
});

chart.render();
```

## 常用变体

### 自定义样式

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  interaction: {
    brushXFilter: {
      brushStyle: {
        fill: '#1890ff',
        fillOpacity: 0.2,
        stroke: '#1890ff',
      },
    },
  },
});
```

### 设置初始选区

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  interaction: {
    brushXFilter: {
      selection: [0.2, 0.8],  // 初始选区比例 [start, end]
    },
  },
});
```

## 完整类型参考

```typescript
interface BrushXFilterInteraction {
  brushXFilter: boolean | {
    brushStyle?: {
      fill?: string;
      fillOpacity?: number;
      stroke?: string;
      lineWidth?: number;
    };
    selection?: [number, number];  // [startRatio, endRatio]
    // 其他配置继承自 BrushFilter
  };
}
```

## 与 BrushFilter/BrushYFilter 的对比

| Interaction | 选择方向 | 常用场景 |
|-------------|---------|---------|
| brushFilter | 任意方向 | 通用筛选 |
| brushXFilter | 仅 X 方向 | 时间范围筛选 |
| brushYFilter | 仅 Y 方向 | 数值范围筛选 |

## 常见错误与修正

### 错误 1：与其他 brush 交互冲突

```javascript
// ❌ 错误：同时启用多个 brush 交互可能冲突
interaction: {
  brushXFilter: true,
  brushYFilter: true,
}

// ✅ 正确：根据需求选择一个
interaction: {
  brushXFilter: true,
}
```

### 错误 2：selection 参数格式错误

```javascript
// ❌ 错误：selection 应该是比例值 [0-1]
interaction: {
  brushXFilter: { selection: ['2024-01', '2024-03'] }
}

// ✅ 正确：使用比例值
interaction: {
  brushXFilter: { selection: [0.2, 0.6] }
}
```