---
id: "g2-interaction-chart-index"
title: "G2 ChartIndex 联动游标线"
description: |
  chartIndex 在图表上渲染一条随鼠标移动的垂直游标线（参考线），
  并可联动多个图表的游标，用于多图表横向对比同一时间点的数据。
  适合时序数据多图联动、Dashboard 中多指标同步查看场景。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "chartIndex"
  - "游标线"
  - "联动"
  - "参考线"
  - "多图联动"
  - "interaction"
  - "crosshair"

related:
  - "g2-interaction-tooltip"
  - "g2-mark-linex-liney"
  - "g2-recipe-dashboard"

use_cases:
  - "多折线图联动查看同一时间点各指标值"
  - "时序数据 Dashboard 中的十字游标"
  - "对比两个时间序列的同期数据"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/chart-index"
---

## 核心概念

`chartIndex` 在绘图区域渲染一条垂直参考线，随鼠标 X 轴位置移动。
与 `shared: true` 的 Tooltip 配合，可实现多系列同时刻数据的联动高亮。

## 单图游标线

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  interaction: {
    chartIndex: true,          // 启用游标线
    tooltip: { shared: true }, // 配合共享 Tooltip
  },
});

chart.render();
```

## 配置项

```javascript
chart.options({
  interaction: {
    chartIndex: {
      // 游标线样式
      ruleStroke: '#aaa',          // 游标线颜色，默认 '#aaa'
      ruleLineWidth: 1,            // 游标线宽度，默认 1
      ruleLineDash: [4, 4],        // 游标线虚线样式
      // 标签配置
      labelDy: -8,                 // 标签垂直偏移
      labelBackground: true,       // 是否显示标签背景
      labelBackgroundFill: '#fff', // 标签背景色
      // 性能控制
      wait: 50,                    // 防抖时间（毫秒），默认 50
      leading: true,               // 防抖前缘触发
      trailing: false,             // 防抖后缘触发
    },
  },
});
```

## 多图联动（相同容器父元素）

```javascript
// 通过共享 emit 事件实现多图游标联动
// 两个图表使用同一 emitter（需要手动实现或使用 G2 的 on/emit API）
const chart1 = new Chart({ container: 'container1', width: 800, height: 200 });
const chart2 = new Chart({ container: 'container2', width: 800, height: 200 });

[chart1, chart2].forEach((chart) => {
  chart.options({
    type: 'line',
    data: timeSeriesData,
    encode: { x: 'date', y: 'value' },
    interaction: {
      chartIndex: true,
    },
  });
  chart.render();
});
```

## 常见错误与修正

### 错误：游标线出现但 Tooltip 不显示同时刻数据
```javascript
// ❌ 多系列图表，Tooltip 只显示当前鼠标最近的元素
chart.options({
  interaction: {
    chartIndex: true,
    // 缺少 tooltip shared 配置
  },
});

// ✅ 开启 shared Tooltip，所有系列同时刻数据一起显示
chart.options({
  interaction: {
    chartIndex: true,
    tooltip: { shared: true },   // 必须配合
  },
});
```
