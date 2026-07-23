---
id: "g2-coord-fisheye"
title: "G2 鱼眼坐标系（fisheye）"
description: |
  鱼眼坐标系在焦点附近放大，远离焦点区域压缩，
  用于在大量密集数据中同时保留局部细节和全局概览。
  通常配合鱼眼交互（fisheye interaction）实现鼠标跟随的动态放大效果。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "fisheye"
  - "鱼眼"
  - "焦点上下文"
  - "focus+context"
  - "coordinate"
  - "密集数据"

related:
  - "g2-mark-point-scatter"
  - "g2-coord-transpose"

use_cases:
  - "密集散点图的局部细节查看"
  - "时间序列密集区域的细节探索"
  - "需要同时看全局和局部细节的场景"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/fisheye"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
   Array.from({ length: 200 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    group: i % 5,
  })),
  encode: { x: 'x', y: 'y', color: 'group', shape: 'point' },
  scale: { color: { type: 'ordinal' } },
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        focusX: 0.5,       // 焦点 X 位置（0~1 相对坐标）
        focusY: 0.5,       // 焦点 Y 位置
        distortionX: 2,    // X 方向放大系数（越大放大越强）
        distortionY: 2,    // Y 方向放大系数
      }
    ]
  },
  // 通常配合鱼眼交互，让焦点跟随鼠标
  interaction: { fisheye: true },
});

chart.render();
```

## 配置项

```javascript
coordinate: {
  transform: [
    {
      type: 'fisheye',
      focusX: 0,        // 焦点 X（相对坐标 0~1），默认 0
      focusY: 0,        // 焦点 Y（相对坐标 0~1），默认 0
      distortionX: 2,   // X 方向扭曲强度，默认 2
      distortionY: 2,   // Y 方向扭曲强度，默认 2
      visual: false,    // 是否启用视觉效果，默认 false
    }
  ]
}
```

## 仅 X 方向鱼眼（时间序列）

```javascript
chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        distortionX: 3,   // 仅放大 X 方向
        distortionY: 0,   // Y 方向不变形
      }
    ]
  },
  interaction: { fisheye: true },
});
```

## 常见错误与修正

### 错误：单独使用鱼眼坐标系但不加交互——效果是静态的
```javascript
// ⚠️  可以用，但焦点固定，无法响应鼠标
chart.options({
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        focusX: 0.3,
        focusY: 0.5,
      }
    ]
  },
  // 没有 interaction.fisheye
});

// ✅ 推荐：配合交互实现动态鱼眼
chart.options({
  coordinate: { transform: [ { type: 'fisheye' } ] },
  interaction: { fisheye: true },  // 焦点跟随鼠标
});
```
