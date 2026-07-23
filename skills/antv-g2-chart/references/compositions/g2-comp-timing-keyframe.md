---
id: "g2-comp-timing-keyframe"
title: "G2 timingKeyframe 关键帧动画组合"
description: |
  timingKeyframe 是 G2 v5 的组合类型，将多个图表视图按时序播放形成关键帧动画。
  各子视图依次渲染并在相邻帧之间自动插值过渡，实现数据故事讲述效果。
  参见 g2-animation-keyframe 获取详细配置和示例。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "timingKeyframe"
  - "关键帧动画"
  - "数据故事"
  - "morphing"
  - "composition"
  - "动画组合"

related:
  - "g2-animation-keyframe"
  - "g2-animation-intro"
  - "g2-core-view-composition"

use_cases:
  - "图表类型间的形变动画（柱状图→折线图）"
  - "数据随时间演变的动画展示"
  - "可视化数据故事讲述"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/timing-keyframe"
---

## 核心概念

`timingKeyframe` 是 composition 类型，每个 child 是一个"关键帧"视图。
系统自动在相邻关键帧之间进行数据和图形的插值过渡动画。

详细配置和示例请参见 [g2-animation-keyframe](./g2-animation-keyframe.md)。

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'timingKeyframe',
  duration: 1000,
  iterationCount: 'infinite',
  direction: 'alternate',
  children: [
    {
      type: 'interval',
      data,
      encode: { x: 'month', y: 'value', color: 'month' },
    },
    {
      type: 'line',
      data,
      encode: { x: 'month', y: 'value' },
    },
  ],
});

chart.render();
```

## 配置项速查

```javascript
chart.options({
  type: 'timingKeyframe',
  duration: 1000,                  // 关键帧间过渡时长（毫秒）
  iterationCount: 1,               // 循环次数（'infinite' = 无限）
  direction: 'normal',             // 'normal' | 'reverse' | 'alternate' | 'reverse-alternate'
  easing: 'ease-in-out-sine',     // 缓动函数
  children: [/* 各关键帧视图 */],
});
```
