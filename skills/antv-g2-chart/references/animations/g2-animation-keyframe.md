---
id: "g2-animation-keyframe"
title: "G2 关键帧动画（timingKeyframe）"
description: |
  timingKeyframe 是 G2 v5 的组合类型，将多个图表视图按时序播放，
  实现数据故事讲述（data storytelling）效果。
  每个子视图是一个"关键帧"，系统自动在帧间插值过渡，支持形变动画（morphing）。

library: "g2"
version: "5.x"
category: "animations"
tags:
  - "timingKeyframe"
  - "关键帧"
  - "数据故事"
  - "keyframe"
  - "morphing"
  - "动画"
  - "composition"

related:
  - "g2-animation-intro"
  - "g2-core-view-composition"

use_cases:
  - "演示数据如何从一种图表类型变为另一种（柱状图 → 折线图）"
  - "展示数据随时间的演变过程"
  - "数据新闻和可视化故事讲述"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/timing-keyframe"
---

## 最小可运行示例（柱状图 → 折线图）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 110 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'timingKeyframe',   // 关键帧组合类型
  duration: 1000,           // 每帧过渡时长（毫秒）
  iterationCount: 2,        // 循环次数（'infinite' 为无限循环）
  direction: 'alternate',   // 'normal' | 'reverse' | 'alternate' | 'reverse-alternate'
  easing: 'ease-in-out-sine',
  children: [
    // 关键帧 1：柱状图
    {
      type: 'interval',
      data,
      encode: { x: 'month', y: 'value', color: 'month' },
      axis: { y: { title: '月份销量' } },
    },
    // 关键帧 2：折线图（自动在两者之间插值动画）
    {
      type: 'line',
      data,
      encode: { x: 'month', y: 'value' },
      style: { lineWidth: 3 },
    },
  ],
});

chart.render();
```

## 多关键帧（数据更新动画）

```javascript
chart.options({
  type: 'timingKeyframe',
  duration: 800,
  iterationCount: 'infinite',
  direction: 'alternate',
  children: [
    // 关键帧 1：2022 年数据
    {
      type: 'interval',
       data2022,
      encode: { x: 'city', y: 'gdp', color: 'city' },
      title: '2022 年 GDP',
    },
    // 关键帧 2：2023 年数据（相同字段，自动形变过渡）
    {
      type: 'interval',
      data: data2023,
      encode: { x: 'city', y: 'gdp', color: 'city' },
      title: '2023 年 GDP',
    },
  ],
});
```

## 配置项

```javascript
chart.options({
  type: 'timingKeyframe',
  duration: 1000,                  // 关键帧间过渡时长（毫秒），默认 1000
  iterationCount: 1,               // 循环次数，默认 1；'infinite' 无限循环
  direction: 'normal',             // 播放方向：
                                   //   'normal' - 正向
                                   //   'reverse' - 反向
                                   //   'alternate' - 正反交替
                                   //   'reverse-alternate' - 反正交替
  easing: 'ease-in-out-sine',     // 缓动函数，默认 'ease-in-out-sine'
  children: [/* 各关键帧视图配置 */],
});
```

## 常见错误与修正

### 错误 1：children 帧的 encode 字段名不一致——无法形变
```javascript
// ❌ 字段名不一致，无法识别对应关系，形变效果丢失
children: [
  { type: 'interval', encode: { x: 'month', y: 'sales' } },   // sales
  { type: 'line',     encode: { x: 'month', y: 'revenue' } }, // revenue ❌ 名字不同
]

// ✅ 相同字段名才能实现平滑形变
children: [
  { type: 'interval', encode: { x: 'month', y: 'value' } },
  { type: 'line',     encode: { x: 'month', y: 'value' } },  // ✅ 同名字段
]
```

### 错误 2：iterationCount 写成数字字符串
```javascript
// ❌ 错误：应该是字符串 'infinite'，不是数字
chart.options({ iterationCount: Infinity });  // ❌

// ✅ 正确
chart.options({ iterationCount: 'infinite' });  // ✅
chart.options({ iterationCount: 3 });           // ✅ 或具体数字
```
