---
id: "g2-interaction-element-hover-scale"
title: "G2 悬停缩放交互（elementHoverScale）"
description: |
  elementHoverScale 在鼠标悬停时对元素进行缩放放大，提供立体感和视觉反馈。
  适合饼图、点图等独立元素的交互增强，比普通高亮更有视觉冲击力。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementHoverScale"
  - "悬停缩放"
  - "hover"
  - "缩放"
  - "interaction"

related:
  - "g2-interaction-element-highlight"
  - "g2-mark-arc-pie"

use_cases:
  - "饼图/环形图悬停时扇形外弹放大"
  - "散点图悬停时数据点放大"
  - "仪表盘卡片悬停放大效果"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-hover-scale"
---

## 最小可运行示例（饼图悬停放大）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 480, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { type: '电子', value: 40 },
    { type: '服装', value: 25 },
    { type: '食品', value: 20 },
    { type: '其他', value: 15 },
  ],
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.85 },
  interaction: {
    elementHoverScale: true,   // 悬停时扇形外弹放大
  },
});

chart.render();
```

## 配置缩放比例

```javascript
chart.options({
  interaction: {
    elementHoverScale: {
      scale: 1.1,    // 缩放倍数，默认约 1.1（放大 10%）
    },
  },
});
```

## 与其他交互组合

```javascript
// 饼图：悬停放大 + tooltip
chart.options({
  type: 'interval',
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  interaction: {
    elementHoverScale: true,   // 放大
    tooltip: true,             // 同时显示 tooltip
  },
});
```

## 常见错误与修正

### 错误：与 elementHighlight 同时使用——视觉效果冲突
```javascript
// ❌ 两者同时启用，被悬停元素既放大又改透明度，效果混乱
chart.options({
  interaction: {
    elementHoverScale: true,
    elementHighlight: true,   // ❌ 与 hoverScale 冲突
  },
});

// ✅ 只选一种悬停交互
chart.options({
  interaction: {
    elementHoverScale: true,  // ✅ 缩放效果
    // 或
    // elementHighlight: true,  // ✅ 暗淡效果
  },
});
```
