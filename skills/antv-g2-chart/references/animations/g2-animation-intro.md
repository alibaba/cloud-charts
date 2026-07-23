---
id: "g2-animation-intro"
title: "G2 动画系统总览（animate 配置）"
description: |
  G2 v5 动画系统通过 animate 属性配置，支持入场（enter）、更新（update）、退场（exit）三种时机。
  内置动画类型包括 fadeIn/Out、scaleInX/Y、growInX/Y、waveIn、zoomIn/Out、morphing、pathIn。
  每种动画可配置 duration（时长）、delay（延迟）、easing（缓动函数）。

library: "g2"
version: "5.x"
category: "animations"
tags:
  - "animation"
  - "动画"
  - "animate"
  - "入场动画"
  - "fadeIn"
  - "scaleInX"
  - "waveIn"

related:
  - "g2-animation-keyframe"
  - "g2-core-chart-init"

use_cases:
  - "图表首次渲染时添加入场动画提升视觉体验"
  - "数据更新时添加过渡动画"
  - "退场时添加淡出效果"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/animate"
---

## 内置动画类型速查

| 动画名 | 效果 | 适合场景 |
|--------|------|---------|
| `fadeIn` | 从透明到不透明 | 通用入场 |
| `fadeOut` | 从不透明到透明 | 通用退场 |
| `scaleInX` | 从 X 轴起点缩放展开 | 柱状图入场 |
| `scaleInY` | 从 Y 轴底部缩放展开 | 柱状图入场（竖向） |
| `scaleOutX` | 向 X 轴收缩消失 | 柱状图退场 |
| `scaleOutY` | 向 Y 轴收缩消失 | 柱状图退场 |
| `growInX` | 从左向右生长 | 条形图、折线图入场 |
| `growInY` | 从下向上生长 | 柱状图入场 |
| `waveIn` | 波浪扫描入场 | 极坐标图（玫瑰图、饼图） |
| `zoomIn` | 从中心缩放放大 | 点图入场 |
| `zoomOut` | 向中心缩小消失 | 点图退场 |
| `pathIn` | 路径逐步绘制 | 折线图、路径图 |
| `morphing` | 形状变形过渡 | 图表类型切换 |

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'RPG', sold: 98 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  animate: {
    enter: {
      type: 'growInY',    // 入场动画：从下向上生长
      duration: 800,      // 持续时间（毫秒）
      delay: 0,           // 延迟
      easing: 'ease-out', // 缓动函数
    },
  },
});

chart.render();
```

## 配置动画的三个时机

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  animate: {
    // 入场：图表首次渲染时
    enter: {
      type: 'scaleInY',
      duration: 1000,
      easing: 'ease-out-bounce',
    },
    // 更新：数据变化时
    update: {
      type: 'morphing',
      duration: 500,
    },
    // 退场：图元被移除时
    exit: {
      type: 'fadeOut',
      duration: 300,
    },
  },
});
```

## 禁用动画

```javascript
// 禁用所有动画
chart.options({
  animate: false,
});

// 仅禁用入场动画
chart.options({
  animate: {
    enter: false,
  },
});
```

## 常见动画组合推荐

```javascript
// 柱状图：growInY 入场
animate: { enter: { type: 'growInY', duration: 800 } }

// 折线图：pathIn 入场（路径绘制效果）
animate: { enter: { type: 'pathIn', duration: 1200 } }

// 饼图（极坐标）：waveIn 入场
animate: { enter: { type: 'waveIn', duration: 1000 } }

// 散点图：zoomIn 入场
animate: { enter: { type: 'zoomIn', duration: 600 } }

// 通用淡入
animate: { enter: { type: 'fadeIn', duration: 500 } }
```

## 常见错误与修正

### 错误 1：animate.enter 写成字符串
```javascript
// ❌ 错误：enter 不是字符串，是对象
chart.options({
  animate: { enter: 'fadeIn' },  // ❌
});

// ✅ 正确
chart.options({
  animate: { enter: { type: 'fadeIn', duration: 600 } },  // ✅
});
```

### 错误 2：在极坐标图用非极坐标动画
```javascript
// ❌ scaleInX/Y 在极坐标中效果不对
chart.options({
  coordinate: { type: 'theta' },
  animate: { enter: { type: 'scaleInY' } },  // ❌ 饼图应该用 waveIn
});

// ✅ 极坐标图推荐 waveIn
chart.options({
  coordinate: { type: 'theta' },
  animate: { enter: { type: 'waveIn', duration: 1000 } },  // ✅
});
```
