---
id: "g2-interaction-element-select-by"
title: "G2 分组选择（elementSelectByColor / elementSelectByX）"
description: |
  elementSelectByColor：点击某个元素时，选中所有相同颜色（color encode 值）的元素，
  常用于多系列折线图中点击一条线选中整条。
  elementSelectByX：点击某个元素时，选中所有相同 X 值的元素，
  常用于分组柱状图中选中同一 X 分类下所有柱。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementSelectByColor"
  - "elementSelectByX"
  - "分组选择"
  - "批量选中"
  - "interaction"

related:
  - "g2-interaction-element-highlight-by"
  - "g2-interaction-element-select"
  - "g2-interaction-legend-filter"

use_cases:
  - "多系列折线图：点击一个数据点选中整条折线"
  - "分组柱状图：点击某柱选中同 X 分类的所有柱"
  - "散点图按颜色分组批量选中"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-select"
---

## elementSelectByColor（按颜色分组选中）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: '北京', value: 5 },
  { month: 'Feb', city: '北京', value: 8 },
  { month: 'Jan', city: '上海', value: 12 },
  { month: 'Feb', city: '上海', value: 15 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  interaction: {
    elementSelectByColor: true,  // 点击任意数据点，选中同色的所有点
  },
});

chart.render();
```

## elementSelectByX（按 X 分组选中）

```javascript
// 分组柱状图：点击某柱，选中该 X 值下所有分组柱
chart.options({
  type: 'interval',
  data: groupedData,
  encode: { x: 'month', y: 'value', color: 'city' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementSelectByX: true,  // 点击某柱，选中同月份所有分组柱
  },
});
```

## 多重交互组合

```javascript
// 结合高亮和选中：悬停高亮同色系列，点击选中
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'series' },
  interaction: {
    elementHighlightByColor: true,  // 悬停：高亮同色系列
    elementSelectByColor: true,     // 点击：选中同色系列
  },
});
```

## 获取选中事件

```javascript
chart.on('element:select', (event) => {
  const { data } = event.detail;
  console.log('选中的数据：', data.datum);
});

chart.on('element:unselect', (event) => {
  console.log('取消选中');
});
```

## 常见错误与修正

### 错误：elementSelectByColor 在无 color encode 时无效
```javascript
// ❌ 没有 color encode，无法按颜色分组选中
chart.options({
  type: 'line',
  encode: { x: 'month', y: 'value' },   // ❌ 没有 color
  interaction: { elementSelectByColor: true },  // 无效
});

// ✅ 需要 color encode
chart.options({
  type: 'line',
  encode: { x: 'month', y: 'value', color: 'city' },  // ✅
  interaction: { elementSelectByColor: true },
});
```

### 错误：elementSelectByColor 与 elementSelect 混淆
```javascript
// elementSelect：只选中点击的单个元素
chart.options({ interaction: { elementSelect: true } });

// elementSelectByColor：选中所有相同 color 值的元素（批量选中）
chart.options({ interaction: { elementSelectByColor: true } });
```
