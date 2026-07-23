---
id: "g2-comp-legend-continuous"
title: "G2 连续图例（legendContinuous）"
description: |
  连续图例用于展示连续数值到颜色的映射关系，常见于热力图、地理可视化等场景。
  支持色带（ribbon）和块状（block）两种形态，可配置标签格式化、范围等。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "legend"
  - "连续图例"
  - "色带"
  - "color legend"
  - "热力图"

related:
  - "g2-comp-legend-config"
  - "g2-comp-legend-category"
  - "g2-scale-sequential"

use_cases:
  - "热力图的颜色映射说明"
  - "地理可视化的数值范围图例"
  - "连续数值的颜色编码"

anti_patterns:
  - "分类数据应使用分类图例（legendCategory）"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/legend"
---

## 核心概念

连续图例（Continuous Legend）展示连续数值到视觉通道（通常是颜色）的映射：
- 当 `encode.color` 映射到连续数值字段时，图例自动变为连续图例
- 支持线性比例尺（linear）、阈值比例尺（threshold）、分位数比例尺（quantile/quantize）
- 默认显示为色带（ribbon）形式

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 100 }, (_, i) => ({
  x: i % 10,
  y: Math.floor(i / 10),
  value: Math.random() * 100,
}));

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },  // value 是连续数值
  scale: { color: { palette: 'Blues' } },
  legend: {
    color: {
      position: 'right',
      length: 200,
      labelFormatter: (v) => Number(v).toFixed(0),  // 注意：v 可能是 string，需先转换
    },
  },
});

chart.render();
```

## 完整配置项

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  legend: {
    color: {
      // ── 位置 ─────────────────────────────────
      position: 'right',       // 'top' | 'bottom' | 'left' | 'right'
      layout: {
        justifyContent: 'center',
      },

      // ── 尺寸 ─────────────────────────────────
      length: 200,             // 色带长度（px）
      size: 20,                // 色带宽度/高度（px）

      // ── 标题 ─────────────────────────────────
      title: '数值范围',
      titleFontSize: 12,

      // ── 标签 ─────────────────────────────────
      labelFormatter: (v) => Number(v).toFixed(1),  // 注意：v 可能是 string，需先转换
      labelAlign: 'value',     // 'value' | 'range'

      // ── 样式 ─────────────────────────────────
      style: {
        ribbonFill: 'black',   // 默认色带填充色（无颜色映射时）
      },
    },
  },
});
```

## 常用变体

### 阈值图例（分段色带）

```javascript
// 使用 threshold/quantize/quantile 比例尺时，图例自动变为分段
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  scale: {
    color: {
      type: 'quantize',       // 分段比例尺
      domain: [0, 100],
      range: ['#f7fbff', '#6baed6', '#08519c'],  // 3 段颜色
    },
  },
  legend: {
    color: {
      position: 'right',
    },
  },
});
```

### 水平色带

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  legend: {
    color: {
      position: 'bottom',
      length: 400,
      size: 15,
      layout: { justifyContent: 'center' },
    },
  },
});
```

### 自定义色带颜色

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  scale: {
    color: {
      type: 'linear',
      domain: [0, 100],
      range: ['#e6f5ff', '#0066cc'],  // 渐变范围
    },
  },
  legend: {
    color: {
      position: 'right',
      labelFormatter: (v) => `${Number(v)}°C`,  // 注意：v 可能是 string，需先转换
    },
  },
});
```

### size 通道图例

```javascript
// size 通道也会生成连续图例
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', size: 'value' },
  legend: {
    size: {
      position: 'right',
      title: '大小',
    },
  },
});
```

## 完整类型参考

```typescript
interface LegendContinuousOptions {
  position?: 'top' | 'bottom' | 'left' | 'right';
  layout?: FlexLayout;
  title?: string | string[];
  length?: number;           // 色带长度
  size?: number;             // 色带宽度
  labelFormatter?: string | ((value: number) => string);
  labelAlign?: 'value' | 'range';
  style?: {
    ribbonFill?: string;
    [key: string]: any;
  };
}
```

## 连续图例 vs 分类图例

| 特性 | 连续图例 | 分类图例 |
|------|----------|----------|
| 数据类型 | 连续数值 | 离散分类 |
| 视觉形式 | 色带/块状 | 图例项列表 |
| 比例尺 | linear, threshold, quantize | band, ordinal |
| 适用场景 | 热力图、地图、气泡图 | 柱状图、折线图 |

## 常见错误与修正

### 错误 1：分类数据使用连续图例

```javascript
// ❌ 问题：category 是分类字段，不应使用连续图例
encode: { color: 'category' }  // 分类数据
// 连续图例显示效果不佳

// ✅ 正确：分类数据自动使用分类图例
// G2 会根据数据类型自动选择图例类型
```

### 错误 2：labelFormatter 参数类型错误

```javascript
// ❌ 问题：labelFormatter 的参数 v 可能是 string 类型（不是 number）
// G2 连续图例传入的刻度值为字符串，直接调用 .toFixed() 会报错
labelFormatter: (v) => v.toFixed(1)   // ❌ TypeError: v.toFixed is not a function
labelFormatter: (v) => v * 100        // ❌ 返回数字而不是字符串

// ✅ 正确：先转换为数字，再格式化，最终返回字符串
labelFormatter: (v) => Number(v).toFixed(1)          // ✅ 保留 1 位小数
labelFormatter: (v) => `${(Number(v) * 100).toFixed(0)}%`  // ✅ 百分比格式
labelFormatter: (v) => `${parseFloat(v).toFixed(0)}m`      // ✅ 带单位
```

### 错误 3：length 设置过小

```javascript
// ❌ 问题：色带长度太小，标签重叠
legend: { color: { length: 50 } }  // 太短

// ✅ 正确：根据标签数量设置合适长度
legend: { color: { length: 200 } }  // 合适
```

## 与 legendCategory 的选择

- **使用连续图例**：当 color/size 通道映射到连续数值字段
- **使用分类图例**：当 color 通道映射到分类字段

G2 会根据比例尺类型自动选择正确的图例类型，无需手动指定。