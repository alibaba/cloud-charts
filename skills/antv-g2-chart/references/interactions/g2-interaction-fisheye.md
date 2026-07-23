---
id: "g2-interaction-fisheye"
title: "G2 鱼眼交互（fisheye interaction）"
description: |
  fisheye 交互让鱼眼效果的焦点跟随鼠标移动，实现动态的焦点+上下文放大。
  需要配合 fisheye 坐标系使用，或独立启用（会自动在 coordinate.transform 中添加 fisheye）。
  鼠标移出图表区域时自动恢复正常视图。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "fisheye"
  - "鱼眼"
  - "焦点上下文"
  - "focus context"
  - "interaction"

related:
  - "g2-coord-fisheye"
  - "g2-mark-point-scatter"

use_cases:
  - "密集散点图的动态局部放大"
  - "大量数据点的交互式细节查看"
  - "时间序列密集区域的探索"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/fisheye"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 300 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  group: i % 5,
}));

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'group', shape: 'point' },
  scale: { color: { type: 'ordinal' } },
  coordinate: { transform: [ { type: 'fisheye' } ] },  // 配合鱼眼坐标系
  interaction: {
    fisheye: true,   // 焦点跟随鼠标
  },
});

chart.render();
```

## 配置鱼眼强度

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'group' },
  coordinate: { transform: [ { type: 'fisheye' } ] },
  interaction: {
    fisheye: {
      wait: 30,       // 节流等待时间（毫秒），默认 30，值越小越灵敏
      leading: true,  // 节流 leading edge 执行，默认 undefined
      trailing: false, // 节流 trailing edge 执行，默认 false
    },
  },
});
```

## 仅 X 方向鱼眼（折线图密集区域探索）

```javascript
chart.options({
  type: 'line',
  data: denseTimeData,
  encode: { x: 'date', y: 'value', color: 'type' },
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        distortionX: 4,   // X 方向放大强度
        distortionY: 0,   // Y 方向不变形
      }
    ]
  },
  interaction: { fisheye: true },
});
```

## 常见错误与修正

### 错误：只设置 interaction.fisheye 没有设置坐标系——鱼眼效果不生效
```javascript
// ⚠️  interaction.fisheye 会自动添加 fisheye coordinate.transform
// 但如果 coordinate 有其他设置，可能需要显式配置
chart.options({
  coordinate: { type: 'cartesian' },  // ⚠️  明确设置了笛卡尔坐标，fisheye 会追加变换
  interaction: { fisheye: true },     // 会自动在 coordinate.transform 中插入 fisheye
});

// ✅ 最简洁的写法：直接指定 fisheye 坐标系
chart.options({
  coordinate: { transform: [ { type: 'fisheye' } ] },
  interaction: { fisheye: true },
});
```
