---
id: "g2-interaction-element-highlight-by"
title: "G2 按颜色/X轴联动高亮（elementHighlightByColor / elementHighlightByX）"
description: |
  elementHighlightByColor：鼠标悬停时，高亮所有与该元素颜色通道值相同的元素。
  elementHighlightByX：鼠标悬停时，高亮所有与该元素 x 轴值相同的元素。
  两者都是 elementHighlight 的变体，区别在于高亮的分组依据不同，
  常用于多系列图表中同类别或同时间点的联动高亮。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementHighlightByColor"
  - "elementHighlightByX"
  - "联动高亮"
  - "分组高亮"
  - "interaction"

related:
  - "g2-interaction-element-highlight"
  - "g2-interaction-element-select"

use_cases:
  - "多系列图表中悬停某柱高亮同颜色（同类别）的所有柱"
  - "悬停某个时间点高亮同一时间点的所有系列"
  - "热力图按行/列联动高亮"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-highlight"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: '北京', value: 83 },
  { month: 'Feb', city: '北京', value: 60 },
  { month: 'Jan', city: '上海', value: 71 },
  { month: 'Feb', city: '上海', value: 55 },
  { month: 'Jan', city: '广州', value: 95 },
  { month: 'Feb', city: '广州', value: 88 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

// ── 按颜色（城市）联动高亮 ──
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlightByColor: true,   // 悬停某柱 → 高亮同城市所有柱
  },
});

chart.render();
```

## elementHighlightByX（同 X 轴值联动高亮）

```javascript
// 悬停某个月份的任意柱 → 高亮同月份所有城市的柱
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlightByX: true,   // 高亮同一 x 值的所有元素
  },
});
```

## 三种高亮模式对比

```javascript
// 1. elementHighlight（默认）：只高亮鼠标悬停的单个元素
interaction: { elementHighlight: true }

// 2. elementHighlightByColor：高亮同颜色分组的所有元素（同类别）
interaction: { elementHighlightByColor: true }

// 3. elementHighlightByX：高亮同 x 值的所有元素（同时间点/类别）
interaction: { elementHighlightByX: true }
```

## 自定义高亮样式

```javascript
chart.options({
  interaction: {
    elementHighlightByColor: {
      background: true,         // 高亮时显示背景（false 则只改透明度）
      link: false,              // 是否显示连线（仅对折线图等有效）
      offset: 0,                // 高亮时的偏移量
    },
  },
});
```

## 常见错误与修正

### 错误：在没有 color 通道的图表上用 elementHighlightByColor——所有元素都被高亮
```javascript
// ❌ 没有 color 通道时，所有元素视为同一颜色组，hover 时全部高亮
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value' },  // ❌ 没有 color
  interaction: { elementHighlightByColor: true },
});

// ✅ 需要有 color 通道才能按颜色分组高亮
chart.options({
  encode: { x: 'month', y: 'value', color: 'city' },  // ✅ 有 color 分组
  interaction: { elementHighlightByColor: true },
});
```
