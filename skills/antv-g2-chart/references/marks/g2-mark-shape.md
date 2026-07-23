---
id: "g2-mark-shape"
title: "G2 shape 自定义图形 Mark"
description: |
  shape mark 是 G2 v5 中用于绘制完全自定义图形的 Mark，
  通过注册自定义 Shape 函数来渲染任意 SVG/Canvas 图形。
  与 image mark（使用图片）不同，shape mark 使用代码绘制矢量图形，
  可响应状态变化（高亮、选中等）。
  适用于需要特殊图形符号、自定义标记的可视化场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "shape"
  - "自定义图形"
  - "register"
  - "custom shape"
  - "矢量图形"

related:
  - "g2-mark-image"
  - "g2-mark-point-scatter"
  - "g2-core-chart-init"

use_cases:
  - "散点图中使用自定义图标代替默认圆形"
  - "地图上绘制自定义地标符号"
  - "特殊业务场景的定制化图形标记"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/extra-topics/custom-mark"
---

## 核心概念

`shape` mark 需要先用 `register('shape.xxx', renderFn)` 注册自定义图形，
再在 mark 的 `style.shape` 中指定图形名称。

自定义 Shape 渲染函数接收 `(style, context)` 参数：
- `style`：包含 x/y 坐标、颜色、大小等样式属性
- `context`：G 渲染上下文，包含 document 等

## 最小可运行示例

```javascript
import { Chart, register } from '@antv/g2';
import { Circle } from '@antv/g';

// 1. 注册自定义图形（绘制带十字的圆）
register('shape.crossCircle', (style, context) => {
  const { x, y, r = 10, fill, stroke } = style;
  const group = new context.document.createElement('g', {});
  const circle = new Circle({ style: { cx: x, cy: y, r, fill, stroke } });
  group.appendChild(circle);
  return group;
});

// 2. 使用自定义图形
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'category', size: 'value' },
  style: {
    shape: 'crossCircle',   // 使用注册的自定义图形名
  },
});

chart.render();
```

## 完整自定义形状（使用 @antv/g 图形）

```javascript
import { Chart, register } from '@antv/g2';
import { Path, Group } from '@antv/g';

// 注册星形图标
register('shape.star', (style, context) => {
  const { x, y, r = 10, fill = '#1890ff', opacity = 1 } = style;

  // 计算五角星的路径
  const path = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    path.push(i === 0 ? `M ${px} ${py}` : `L ${px} ${py}`);
  }
  path.push('Z');

  const shape = new Path({
    style: {
      d: path.join(' '),
      fill,
      opacity,
    },
  });
  return shape;
});

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  style: {
    shape: 'star',
    r: 12,
  },
});

chart.render();
```

## 与 image mark 的选择

```javascript
// 使用图片文件作为标记点
chart.options({
  type: 'image',
  data,
  encode: { x: 'x', y: 'y', src: 'iconUrl' },  // src 为图片 URL
  style: { width: 24, height: 24 },
});

// 使用代码绘制矢量图形
register('shape.myIcon', (style) => { /* ... */ });
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  style: { shape: 'myIcon' },
});
```

## 常见错误与修正

### 错误：使用自定义图形前忘记注册
```javascript
// ❌ 错误：未注册就使用，图形不会渲染
chart.options({
  type: 'point',
  style: { shape: 'myCustomShape' },  // ❌ myCustomShape 未注册
});

// ✅ 先注册再使用
register('shape.myCustomShape', (style) => { /* 返回 G 图形 */ });
chart.options({
  type: 'point',
  style: { shape: 'myCustomShape' },  // ✅
});
```
