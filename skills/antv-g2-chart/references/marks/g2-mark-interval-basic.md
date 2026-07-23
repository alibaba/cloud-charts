---
id: "g2-mark-interval-basic"
title: "G2 基础柱状图（Interval Mark）"
description: |
  使用 Interval Mark 创建基础柱状图。Interval Mark 是 G2 中
  用于绘制柱形、条形、直方图的核心标记类型。
  本文采用 Spec 模式（chart.options({})），通过 encode 映射 x/y/color 通道。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "柱状图"
  - "条形图"
  - "分类数据"
  - "比较"
  - "Interval"
  - "bar chart"
  - "bar"
  - "spec"
  - "options"

related:
  - "g2-mark-interval-grouped"
  - "g2-mark-interval-stacked"
  - "g2-mark-interval-normalized"
  - "g2-core-chart-init"
  - "g2-core-encode-channel"
  - "g2-scale-band"

use_cases:
  - "比较不同类别的数值大小"
  - "展示各项目的完成量、销量等指标"
  - "显示排名数据"
  - "对比多个维度的指标值"

anti_patterns:
  - "不适合展示连续数值的趋势变化（改用 Line 或 Area Mark）"
  - "类别超过 20 个时可读性差，考虑分页或过滤"
  - "不适合展示部分与整体的关系（改用堆叠柱状图或饼图）"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/basic"
---

## 核心概念

Interval Mark 将数据映射为矩形区间：
- 在直角坐标系中：柱形（竖向）或条形（横向）
- 在极坐标系中：扇形（饼图）或玫瑰图
- 在径向坐标系中：玉珏图（Radial Bar Chart）

**关键 encode 通道：**
- `x`：分类轴，通常映射分类字段，自动使用 Band Scale
- `y`：数值轴，映射数值字段，使用 Linear Scale
- `y1`：区间终点，用于表示区间范围（如甘特图）
- `color`：颜色，用于视觉区分

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
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: {
    x: 'genre',
    y: 'sold',
    color: 'genre',
  },
});

chart.render();
```

## 常用变体

### 水平条形图（转置坐标系）

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  coordinate: { transform: [{ type: 'transpose' }] },   // 关键：转置坐标系
});
```

### 带数据标签的柱状图

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  labels: [
    {
      text: 'sold',            // 显示哪个字段的值
      position: 'outside',     // 'inside' | 'outside' | 'top-left' | 'top-right'
      style: { fontSize: 12, fill: '#333' },
    },
  ],
});
```

### 圆角柱状图

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  style: {
    radius: 4,               // 统一圆角
    // 或单独设置：
    // radiusTopLeft: 4,
    // radiusTopRight: 4,
  },
});
```

### 自定义颜色

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  scale: {
    color: {
      range: ['#1890ff', '#2fc25b', '#facc14', '#223273', '#8543e0'],
    },
  },
});
```

### 带 Tooltip 配置

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  tooltip: {
    title: 'genre',
    items: [{ field: 'sold', name: '销量' }],
  },
});
```

### Y 轴从指定值开始

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  scale: {
    y: { domain: [50, 400] },  // 手动设置 y 轴范围
  },
});
```

### 自定义坐标轴标题

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  axis: {
    x: { title: '游戏类型' },
    y: { title: '销量（万份）' },
  },
});
```

### 径向柱状图（玉珏图）

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  coordinate: { type: 'radial', innerRadius: 0.2 },  // 径向坐标系
});
```

### 带交互效果的柱状图

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  interaction: {
    elementHighlight: true,  // 元素高亮交互
  },
});
```

## Spec 完整结构速查

```javascript
chart.options({
  // Mark 类型
  type: 'interval',

  // 数据
  data: [...],

  // 通道映射
  encode: {
    x: 'genre',           // x 轴字段
    y: 'sold',            // y 轴字段
    y1: 'endValue',       // 区间终点字段（如甘特图）
    color: 'genre',       // 颜色字段
    shape: 'rect',        // 形状：'rect' | 'hollow'
  },

  // 比例尺
  scale: {
    y: { domain: [0, 500] },
    color: { range: ['#f00', '#00f'] },
  },

  // 坐标系变换
  coordinate: { 
    type: 'radial', 
    innerRadius: 0.2,
    transform: [{ type: 'transpose' }] 
  },

  // 样式
  style: {
    radius: 4,
    fillOpacity: 0.9,
  },

  // 数据标签（注意是 labels 复数）
  labels: [
    {
      text: 'sold',
      position: 'outside', // 'inside' | 'outside' | 'top-left' | 'top-right'
    }
  ],

  // Tooltip
  tooltip: { title: 'genre', items: [{ field: 'sold' }] },

  // 坐标轴
  axis: {
    x: { title: '游戏类型' },
    y: { title: '销量' },
  },

  // 图例
  legend: {
    color: { position: 'right' }
  },

  // 交互
  interaction: {
    elementHighlight: true
  }
});
```

## 完整类型参考

```typescript
// chart.options() 传入的 Spec 类型（interval 部分）
interface IntervalSpec {
  type: 'interval';
  data?: DataOption;
  encode?: {
    x?: string | ((d: any) => any);
    y?: string | ((d: any) => any);
    y1?: string | ((d: any) => any); // 区间终点通道
    color?: string | ((d: any) => any);
    shape?: 'rect' | 'hollow' | 'funnel' | 'pyramid' | string;
    size?: string | number | ((d: any) => any);
    series?: string;
  };
  transform?: Array<{ type: string; [key: string]: any }>;
  scale?: {
    x?: ScaleOption;
    y?: ScaleOption;
    color?: ScaleOption;
  };
  coordinate?: { 
    type?: 'polar' | 'cartesian' | 'radial';
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    transform?: Array<{ type: string; [key: string]: any }>;
  };
  style?: {
    radius?: number;
    radiusTopLeft?: number;
    radiusTopRight?: number;
    radiusBottomLeft?: number;
    radiusBottomRight?: number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    lineWidth?: number;
  };
  labels?: LabelOption[];
  tooltip?: TooltipOption;
  axis?: { x?: AxisOption; y?: AxisOption };
  legend?: { color?: LegendOption };
  interaction?: { 
    elementHighlight?: boolean | { background?: boolean; region?: boolean }; 
  };
}
```

## 常见错误与修正

### 错误 1：使用 V4 链式 API（详见核心约束 Forbidden Patterns）
```javascript
// ❌ chart.interval().encode('x', 'genre');
// ✅ chart.options({ type: 'interval', data, encode: { x: 'genre', y: 'sold' } });
```

### 错误 2：缺少 container 参数
```javascript
// ❌ 错误
const chart = new Chart({ width: 640, height: 480 });

// ✅ 正确
const chart = new Chart({ container: 'container', width: 640, height: 480 });
```

### 错误 3：encode 和 style 混淆
```javascript
// ❌ 错误：style 不接受数据字段名
chart.options({ type: 'interval',  [...], style: { color: 'genre' } });

// ✅ 正确：数据映射用 encode，固定样式用 style
chart.options({
  type: 'interval',
  data: [...],
  encode: { color: 'genre' },   // 数据驱动
  style: { fill: '#1890ff' },   // 固定颜色时才用 style
});
```

### 错误 4：labels 写成 label（单数）
```javascript
// ❌ 错误：Spec 模式中标签字段是 labels（复数）
chart.options({ type: 'interval',  data: [...], label: { text: 'sold' } });

// ✅ 正确
chart.options({ type: 'interval', data: [...], labels: [{ text: 'sold' }] });
```

### 错误 5：y 轴负值处理
```javascript
// ❌ 潜在问题：负值柱体可能超出绘图区域
chart.options({ type: 'interval',  dataWithNegatives, encode: { y: 'value' } });

// ✅ 正确：通过 scale.y.domain 显式包含负值范围
chart.options({
  type: 'interval',
  data: dataWithNegatives,
  encode: { x: 'genre', y: 'value' },
  scale: { y: { domain: [-100, 300] } },
});
```

### 错误 6：径向坐标系使用不当
```javascript
// ❌ 错误：在径向坐标系中 x/y 映射顺序颠倒
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'value', y: 'genre' },  // 应该是 x: genre, y: value
  coordinate: { type: 'radial' }
});

// ✅ 正确：径向坐标系中 x 对应角度方向，y 对应半径方向
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'value' },
  coordinate: { type: 'radial' }
});
```

### 错误 7：多 mark 需要 view+children（详见核心约束 #3）
```javascript
// ❌ 多次 chart.options() → 只有最后一次生效
// ✅ chart.options({ type: 'view', children: [{ type: 'interval', ... }, { type: 'image', ... }] });
```

### 错误 8：image mark 使用错误的编码字段
```javascript
// ❌ 错误：image mark 使用了 x/y 映射图像 URL
chart.options({
  type: 'image',
  data: [{ url: 'https://example.com/image.png' }],
  encode: { x: () => 0, y: () => 0, src: 'url' }  // 不应该用 x/y 来定位图像
});

// ✅ 正确：image mark 使用 src 字段映射图像地址，配合 style 设置尺寸和位置
chart.options({
  type: 'image',
  data: [{ url: 'https://example.com/image.png' }],
  encode: { src: 'url' },
  style: {
    x: '50%',   // 相对于容器的位置
    y: '50%',
    width: 80,
    height: 80
  }
});
```

### 错误 9：交互配置位置错误
```javascript
// ❌ 错误：将交互配置放在 mark 级别之外
chart.options({
  type: 'interval',
  data: [...],
  encode: {...},
  elementHighlight: true  // 放错位置
});

// ✅ 正确：交互配置应放在 interaction 对象中
chart.options({
  type: 'interval',
  data: [...],
  encode: {...},
  interaction: {
    elementHighlight: true
  }
});
```

### 错误 10：区间图未正确使用 y1 通道
```javascript
// ❌ 错误：将区间起点和终点都映射到 y 通道
chart.options({
  type: 'interval',
  data: [{ start: 1, end: 5 }],
  encode: { x: 'name', y: ['start', 'end'] }  // 错误方式
});

// ✅ 正确：使用 y 和 y1 通道分别映射起点和终点
chart.options({
  type: 'interval',
  data: [{ start: 1, end: 5 }],
  encode: { x: 'name', y: 'start', y1: 'end' }
});
```

### 错误 11：坐标轴标签格式化配置错误
```javascript
// ❌ 错误：使用不存在的 axis.labelFormatter 配置
chart.options({
  type: 'interval',
  data: [...],
  axis: {
    x: {
      labelFormatter: (task, item) => {
        const datum = item.data;
        return `${datum.stage}\n${task}`;
      }
    }
  }
});

// ✅ 正确：使用正确的 label 配置方式
chart.options({
  type: 'interval',
  data: [...],
  axis: {
    x: {
      labelTransform: 'rotate(30)',
      labelAutoWrap: true
    }
  }
});
```