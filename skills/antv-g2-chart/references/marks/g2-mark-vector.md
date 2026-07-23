---
id: "g2-mark-vector"
title: "G2 向量图（vector）"
description: |
  vector mark 在每个数据点绘制一个有方向和大小的箭头，
  用于展示风场、水流方向等具有方向和强度的场数据。
  encode 中用 rotate 通道控制方向（角度），size 通道控制长度。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "vector"
  - "向量"
  - "方向场"
  - "风场"
  - "箭头"
  - "流场"

related:
  - "g2-mark-point-scatter"
  - "g2-core-encode-channel"

use_cases:
  - "风场可视化（风向和风速）"
  - "流体力学模拟结果展示"
  - "梯度场、力场可视化"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#vector"
---

## 最小可运行示例（风场）

```javascript
import { Chart } from '@antv/g2';

// 模拟风场数据：每个格点有位置、风向（角度）和风速（大小）
const data = [];
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    const angle = (x * 30 + y * 15) % 360;  // 风向（度）
    const speed = 2 + Math.random() * 8;      // 风速
    data.push({ x, y, angle, speed });
  }
}

const chart = new Chart({ container: 'container', width: 600, height: 600 });

chart.options({
  type: 'vector',
  data,
  encode: {
    x: 'x',
    y: 'y',
    rotate: 'angle',   // 箭头旋转角度（度，0=向右，顺时针）
    size: 'speed',     // 箭头长度（映射到速度）
    color: 'speed',    // 颜色映射风速
  },
  scale: {
    color: { type: 'sequential', palette: 'viridis' },
    size: { range: [6, 24] },
  },
  style: {
    arrow: true,   // 显示箭头
  },
  legend: { color: { title: '风速 (m/s)' } },
});

chart.render();
```

## 配置项

```javascript
chart.options({
  type: 'vector',
  data,
  encode: {
    x: 'x',
    y: 'y',
    rotate: 'direction',  // 方向角度字段（0°=向右，顺时针增加）
    size: 'magnitude',    // 向量长度字段
    color: 'intensity',   // 颜色编码字段（可选）
  },
  style: {
    arrow: true,          // 是否显示箭头，默认 true
    arrowSize: 6,         // 箭头头部大小（px）
  },
});
```

## 常见错误与修正

### 错误：rotate 是弧度而不是角度
```javascript
// ❌ 如果原始数据是弧度，直接用 rotate 通道会导致方向错误
const data = [{ ..., direction: Math.PI / 4 }];  // 弧度
chart.options({ encode: { rotate: 'direction' } });  // ❌ G2 期望角度

// ✅ 将弧度转换为角度
const data = data.map(d => ({ ...d, dirDeg: (d.direction * 180) / Math.PI }));
chart.options({ encode: { rotate: 'dirDeg' } });  // ✅ 角度值
```
