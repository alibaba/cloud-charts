---
id: "g2-comp-axis-radar"
title: "G2 雷达图坐标轴（AxisRadar）"
description: |
  雷达图专用的坐标轴组件。在极坐标系中显示多个维度的轴线和刻度，
  是雷达图的核心组件之一。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "坐标轴"
  - "雷达图"
  - "极坐标"
  - "axis"

related:
  - "g2-coord-polar"
  - "g2-mark-radar"
  - "g2-comp-axis-config"

use_cases:
  - "雷达图的多维度展示"
  - "极坐标系下的坐标轴"
  - "性能评估图表"

anti_patterns:
  - "直角坐标系图表不适用"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/component/axis"
---

## 核心概念

AxisRadar 是雷达图专用的坐标轴组件：
- 在极坐标系中显示放射状的轴线
- 支持多个维度的轴标签
- 自动计算轴的角度和位置

**特点：**
- 自动连接各轴形成网格
- 支持自定义轴样式
- 与极坐标系配合使用

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
  coordinate: { type: 'polar' },
  data: [
    { item: 'Design', score: 70 },
    { item: 'Development', score: 60 },
    { item: 'Marketing', score: 50 },
    { item: 'Sales', score: 80 },
    { item: 'Support', score: 90 },
  ],
  encode: {
    x: 'item',
    y: 'score',
  },
  axis: {
    x: {
      // 雷达图 X 轴配置
      title: false,
      tickLine: null,
    },
    y: {
      // 雷达图 Y 轴（放射状轴）
      title: 'Score',
      grid: true,
      gridConnect: 'line',  // 网格连接方式
    },
  },
});

chart.render();
```

## 常用变体

### 自定义网格样式

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: {
    y: {
      grid: true,
      gridConnect: 'line',
      gridLineWidth: 1,
      gridStroke: '#e8e8e8',
      gridType: 'line',
    },
  },
});
```

### 隐藏轴线

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: {
    x: { line: null },
    y: { line: null },
  },
});
```

### 自定义标签

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: {
    x: {
      labelFormatter: (val) => val.toUpperCase(),
      labelSpacing: 10,
    },
    y: {
      labelFormatter: (val) => `${val}%`,
    },
  },
});
```

## 完整类型参考

```typescript
interface AxisRadarOptions {
  // 基础配置
  title?: string | { text: string; style?: object };
  tickLine?: null | { length?: number; style?: object };
  line?: null | { style?: object };

  // 标签配置
  labelFormatter?: string | ((val: any) => string);
  labelSpacing?: number;
  labelStyle?: object;

  // 网格配置
  grid?: boolean;
  gridConnect?: 'line' | 'curve';  // 网格连接方式
  gridLineWidth?: number;
  gridStroke?: string;
  gridType?: 'line' | 'circle';

  // 雷达图特有
  radar?: {
    count: number;   // 轴的数量
    index: number;   // 当前轴的索引
  };
}
```

## 与普通坐标轴的区别

| 特性 | 普通坐标轴 | 雷达图坐标轴 |
|------|-----------|-------------|
| 坐标系 | 直角坐标 | 极坐标 |
| 轴方向 | 水平/垂直 | 放射状 |
| 网格 | 矩形 | 多边形/圆形 |
| 标签位置 | 轴两端 | 轴末端外侧 |

## 常见错误与修正

### 错误 1：未使用极坐标系

```javascript
// ❌ 错误：雷达图轴需要极坐标系
chart.options({
  type: 'line',
  data,
  encode: { x: 'item', y: 'score' },
  axis: { y: { gridConnect: 'line' } },
});

// ✅ 正确：添加极坐标系
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: { y: { gridConnect: 'line' } },
});
```

### 错误 2：gridConnect 参数错误

```javascript
// ❌ 错误：gridConnect 只支持 'line' 或 'curve'
axis: { y: { gridConnect: 'polygon' } }

// ✅ 正确
axis: { y: { gridConnect: 'line' } }
```

---

## 雷达图描边不显示问题

雷达图通过 `coordinate: { type: 'polar' }` + `area` + `line` Mark 组合实现。`line` Mark 在极坐标下的 stroke 依赖 color scale 推导——如果未显式设置 `lineWidth`，部分主题/场景下描边可能不可见。

```javascript
// ❌ 错误：line mark 未设置 lineWidth，在某些主题下描边不可见
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },
  children: [
    { type: 'area', encode: { x: 'item', y: 'score', color: 'type' }, style: { fillOpacity: 0.2 } },
    { type: 'line', encode: { x: 'item', y: 'score', color: 'type' } },  // ❌ 缺少 lineWidth
  ],
});

// ✅ 正确：显式设置 lineWidth
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },
  children: [
    { type: 'area', encode: { x: 'item', y: 'score', color: 'type' }, style: { fillOpacity: 0.2 } },
    { type: 'line', encode: { x: 'item', y: 'score', color: 'type' }, style: { lineWidth: 2 } },
  ],
});
```

## 雷达图主题默认值

G2 主题中雷达图坐标轴（`axisRadar`）的默认值：

| 属性 | 默认值 | 说明 |
|------|--------|------|
| `gridStrokeOpacity` | `0.3` | 网格线透明度 |
| `gridType` | `'surround'` | 环绕式网格 |
| `tick` | `false` | 不显示刻度线 |
| `titlePosition` | `'start'` | 标题在轴起始位置 |
| `gridClosed` | `true` | 网格闭合 |

> **深色背景适配**：雷达图在深色背景下轴标签不可见时，使用 `theme: 'classicDark'` 一行解决，或手动设置各轴 `labelFill`/`gridStroke`。详见 [深色主题适配](../concepts/g2-concept-dark-theme-adaptation.md)