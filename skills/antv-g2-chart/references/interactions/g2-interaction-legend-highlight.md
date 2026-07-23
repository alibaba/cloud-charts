---
id: "g2-interaction-legend-highlight"
title: "G2 图例高亮（legendHighlight）"
description: |
  legendHighlight 交互让用户悬停图例项时，图表中对应分组的元素高亮显示，
  其他分组元素变为半透明（inactive 状态）。
  与 legendFilter 的区别：legendHighlight 只改变视觉状态，不过滤数据；
  legendFilter 点击后真正隐藏数据项。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "legendHighlight"
  - "图例高亮"
  - "交互"
  - "highlight"
  - "interaction"

related:
  - "g2-interaction-legend-filter"
  - "g2-interaction-element-highlight-by"
  - "g2-comp-legend-config"

use_cases:
  - "多系列折线图悬停图例突出显示某一系列"
  - "分组柱状图图例悬停时高亮对应分组"
  - "散点图按颜色分类悬停高亮"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/legend-highlight"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: '北京', value: 5 },
  { month: 'Jan', city: '上海', value: 12 },
  { month: 'Feb', city: '北京', value: 8 },
  { month: 'Feb', city: '上海', value: 15 },
  { month: 'Mar', city: '北京', value: 12 },
  { month: 'Mar', city: '上海', value: 18 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  interaction: {
    legendHighlight: true,  // 悬停图例时高亮对应系列
  },
});

chart.render();
```

## legendHighlight vs legendFilter 对比

```javascript
// legendHighlight：悬停图例 → 高亮对应元素，其余变半透明（不隐藏数据）
chart.options({
  interaction: { legendHighlight: true },
});

// legendFilter：点击图例 → 切换显示/隐藏对应数据项（数据从图表中移除）
chart.options({
  interaction: { legendFilter: true },
});

// 同时开启两种交互：悬停高亮 + 点击过滤
chart.options({
  interaction: {
    legendHighlight: true,
    legendFilter: true,
  },
});
```

## 自定义高亮样式

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  state: {
    active: {
      // 激活（高亮）状态样式
      lineWidth: 2,
      stroke: '#000',
    },
    inactive: {
      // 非激活（背景）状态样式
      fillOpacity: 0.2,
      strokeOpacity: 0.2,
    },
  },
  interaction: {
    legendHighlight: true,
  },
});
```

## 常见错误与修正

### 错误：图例没有 color encode 时高亮无效
```javascript
// ❌ 没有 color encode，图例不会与元素关联，高亮无效
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value' },   // ❌ 缺少 color encode
  interaction: { legendHighlight: true },
});

// ✅ 需要 color encode 来建立图例与元素的关联
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value', color: 'city' },  // ✅ 有 color encode
  interaction: { legendHighlight: true },
});
```
