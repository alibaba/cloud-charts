---
id: "g2-transform-dodgex"
title: "G2 DodgeX 分组变换"
description: |
  DodgeX 是 G2 v5 中用于分组展示的 Transform，
  将同一 x 位置的多系列元素在水平方向上错开排列，
  是分组柱状图的核心依赖。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "dodgeX"
  - "分组"
  - "并排"
  - "transform"
  - "分组柱状图"
  - "spec"

related:
  - "g2-mark-interval-grouped"
  - "g2-transform-stacky"

use_cases:
  - "创建分组柱状图（并排展示多系列）"
  - "分组散点图"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/dodge-x"
---

## 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});

chart.render();
```

## 配置项

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    {
      type: 'dodgeX',
      padding: 0,          // 组内各柱之间的间距（相对于每组宽度，0-1），默认 0
      paddingOuter: 0.1,   // 整组与相邻组的外边距
      reverse: false,      // 是否反转分组顺序
    },
  ],
});
```

## 与 stackY 的区别

```javascript
// dodgeX：各系列并排展示，便于直接对比绝对值
chart.options({ transform: [{ type: 'dodgeX' }] });

// stackY：各系列堆叠展示，便于对比总量和占比
chart.options({ transform: [{ type: 'stackY' }] });
```

## 分组 + 堆叠组合

同时分组和堆叠：先 dodgeX 再 stackY，实现「组内堆叠、组间并排」。

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'quarter', y: 'value', color: 'type', series: 'group' },
  transform: [
    { type: 'dodgeX', groupBy: 'x' },   // 按 series 分组，指定 groupBy: 'x' 避免 color 参与分组
    { type: 'stackY' },                 // 组内按 color 堆叠
  ],
});
```

## 水平分组条形图

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## 常见错误与修正

### 错误 1：transform 写成对象
```javascript
// ❌ chart.options({ transform: { type: 'dodgeX' } });
// ✅ chart.options({ transform: [{ type: 'dodgeX' }] });
```

### 错误 2：多系列 interval 没有分组/堆叠变换
```javascript
// ❌ 错误：多系列数据无 transform，柱体重叠在同一位置
chart.options({
  type: 'interval',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
});

// ✅ 正确：添加 dodgeX 分组展示
chart.options({
  type: 'interval',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});
```

### 错误 3：dodgeX 放在 data.transform 中
```javascript
// ❌ 错误：dodgeX 是 Mark Transform，不是 Data Transform
chart.options({
  data: { type: 'inline', value: data, transform: [{ type: 'dodgeX' }] },
});

// ✅ 正确：与 data/encode 同级
chart.options({
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});
```
