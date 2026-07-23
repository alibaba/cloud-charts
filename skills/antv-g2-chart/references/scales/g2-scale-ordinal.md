---
id: "g2-scale-ordinal"
title: "G2 序数比例尺（ordinal）"
description: |
  序数比例尺将离散的分类值映射到离散的输出值（如颜色）。
  主要用于 color 通道，将字符串类别映射到颜色数组。
  通过 range 指定自定义颜色列表，或通过 palette 使用内置调色板。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "ordinal"
  - "序数"
  - "比例尺"
  - "颜色"
  - "分类色"
  - "scale"
  - "palette"

related:
  - "g2-scale-linear"
  - "g2-theme-builtin"

use_cases:
  - "自定义分类颜色映射"
  - "指定特定类别对应特定颜色"
  - "使用内置或自定义调色板"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/ordinal"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data: [
    { genre: '运动', sold: 275 },
    { genre: '策略', sold: 115 },
    { genre: '动作', sold: 120 },
    { genre: 'RPG',  sold: 98 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  scale: {
    color: {
      type: 'ordinal',
      // 自定义颜色列表（顺序对应 domain 中的分类）
      range: ['#F4664A', '#FAAD14', '#5B8FF9', '#30BF78'],
    },
  },
});

chart.render();
```

## 指定类别到颜色的映射（domain + range）

```javascript
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      domain: ['通过', '失败', '跳过'],   // 指定分类顺序
      range: ['#52c41a', '#ff4d4f', '#faad14'],  // 对应颜色
    },
  },
});
```

## 使用内置调色板

```javascript
// G2 内置调色板名称：'tableau10', 'category10', 'set2', 'pastel', 'blues', etc.
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      palette: 'tableau10',   // 使用 Tableau 10 色调色板
    },
  },
});
```

## 常见错误与修正

### 错误 1：range 颜色数量少于分类数量——后面的类别颜色循环重用
```javascript
// ⚠️  5 个分类只有 3 个颜色，第 4/5 个类别颜色与前两个相同
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      domain: ['A', 'B', 'C', 'D', 'E'],
      range: ['red', 'blue', 'green'],  // ⚠️  只有 3 个颜色，D/E 会循环
    },
  },
});

// ✅ range 颜色数量应 ≥ 分类数量
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      range: ['#F4664A', '#FAAD14', '#5B8FF9', '#30BF78', '#9254DE'],  // ✅ 5 个
    },
  },
});
```

### 错误 2：连续数值通道误用 ordinal——应用 linear 或 sequential
```javascript
// ❌ 对数值 y 轴使用 ordinal（Y 轴会变成离散）
chart.options({
  scale: {
    y: { type: 'ordinal' },  // ❌ y 是数值，应用 linear
  },
});

// ✅ 数值比例尺用 linear
chart.options({
  scale: {
    y: { type: 'linear' },  // ✅
  },
});
```
