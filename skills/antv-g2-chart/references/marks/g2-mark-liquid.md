---
id: "g2-mark-liquid"
title: "G2 水波图（liquid）"
description: |
  liquid mark 用波浪填充的圆形展示单一百分比数值，
  常用于展示完成率、健康指标、KPI 达成率等。
  数据为 0~1 的小数（百分比），内置波浪动画效果。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "liquid"
  - "水波图"
  - "进度"
  - "百分比"
  - "KPI"
  - "完成率"

related:
  - "g2-mark-gauge"
  - "g2-core-chart-init"

use_cases:
  - "展示目标完成率 / KPI 达成率"
  - "展示占比指标（如内存使用率）"
  - "仪表盘中的核心指标可视化"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#liquid"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 300, height: 300 });

chart.options({
  type: 'liquid',
  data: 0.72,    // 0~1 之间的百分比数值
  style: {
    outlineBorder: 4,       // 外框边框宽度
    outlineDistance: 8,     // 外框与内圆的间距
    waveLength: 128,        // 波浪长度
  },
});

chart.render();
```

## 自定义样式

```javascript
chart.options({
  type: 'liquid',
  data: 0.6,
  style: {
    outlineBorder: 4,
    outlineDistance: 8,
    waveLength: 128,
    // 波浪颜色
    fill: '#5B8FF9',
    fillOpacity: 0.85,
    // 背景圆颜色
    background: {
      fill: '#E8F0FE',
    },
    // 中心文字样式
    text: {
      style: {
        fontSize: 28,
        fontWeight: 'bold',
        fill: '#fff',
        // 自定义文字内容（默认显示百分比）
        formatter: (v) => `${(v * 100).toFixed(1)}%`,
      },
    },
  },
  // 不显示坐标轴和图例
  axis: false,
  legend: false,
  tooltip: false,
});
```

## 常见错误与修正

### 错误 1：数值超出 0~1 范围——波浪位置异常
```javascript
// ❌ 错误：液位值是 72（应该是 0.72）
chart.options({
  type: 'liquid',
  data: 72,   // ❌ 应该是 0.72
});

// ✅ 正确：0~1 的小数
chart.options({
  data: 0.72,  // ✅
});
```

### 错误 2：设置了坐标轴——坐标轴在水波图中无意义
```javascript
// ❌ 液位图默认会显示坐标轴，通常需要关闭
chart.options({
  type: 'liquid',
  data: 0.7,
  // ❌ 没有关闭 axis/legend/tooltip
});

// ✅ 推荐关闭多余组件
chart.options({
  type: 'liquid',
  data: 0.7,
  axis: false,     // ✅ 关闭坐标轴
  legend: false,   // ✅ 关闭图例
  tooltip: false,  // ✅ 关闭 tooltip
});
```
