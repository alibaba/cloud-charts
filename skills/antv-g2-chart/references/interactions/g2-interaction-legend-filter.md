---
id: "g2-interaction-legend-filter"
title: "G2 图例过滤交互（legendFilter）"
description: |
  legendFilter 让用户通过点击图例项来显示/隐藏对应的数据系列。
  在 G2 v5 中默认已启用，点击图例项即可切换对应系列的可见性。
  可通过配置关闭或自定义样式。legendHighlight 则是鼠标悬停时高亮对应系列。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "legendFilter"
  - "图例过滤"
  - "图例高亮"
  - "legendHighlight"
  - "交互"
  - "interaction"

related:
  - "g2-comp-legend-config"
  - "g2-interaction-element-highlight"

use_cases:
  - "多系列折线图中按需显示/隐藏特定系列"
  - "堆叠图中临时隐藏某个类别"
  - "大量系列时的选择性查看"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/legend-filter"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: '北京', temp: -3 },
  { month: 'Feb', city: '北京', temp: 0 },
  { month: 'Jan', city: '上海', temp: 5 },
  { month: 'Feb', city: '上海', temp: 7 },
  { month: 'Jan', city: '广州', temp: 15 },
  { month: 'Feb', city: '广州', temp: 16 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'temp', color: 'city' },
  // legendFilter 默认已启用，无需显式配置
  // 点击图例中的城市名称即可切换可见性
});

chart.render();
```

## 显式启用 legendFilter

```javascript
// 如果被禁用，可以显式重新启用
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  interaction: {
    legendFilter: true,   // 点击图例切换显示/隐藏
  },
});
```

## 同时启用 legendHighlight（悬停高亮）

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  interaction: {
    legendFilter: true,    // 点击：过滤数据
    legendHighlight: true, // 悬停：高亮系列
  },
});
```

## 禁用图例交互

```javascript
// 禁用图例过滤（图例仅用于展示，不可点击）
chart.options({
  interaction: {
    legendFilter: false,  // 禁用点击过滤
  },
});
```

## 常见错误与修正

### 错误：以为 legendFilter 需要手动配置——实际上 G2 v5 默认启用
```javascript
// ℹ️  G2 v5 默认已启用 legendFilter，无需额外配置
// 只有以下情况才需要显式配置：

// 1. 想要禁用时
chart.options({ interaction: { legendFilter: false } });

// 2. 想要自定义样式或行为时
chart.options({ interaction: { legendFilter: { /* 自定义选项 */ } } });
```

### 错误：legend: false 时仍想要 legendFilter——图例隐藏后无法交互
```javascript
// ❌ 隐藏了图例但还想要图例过滤——图例不可见就无法点击
chart.options({
  legend: false,
  interaction: { legendFilter: true },  // ❌ 没有图例，过滤无从触发
});

// ✅ legendFilter 需要可见图例配合
chart.options({
  legend: { color: { position: 'top' } },  // ✅ 保留图例
  interaction: { legendFilter: true },
});
```
