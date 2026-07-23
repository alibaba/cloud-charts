---
id: "g2-mark-heatmap"
title: "G2 渐变热力图（heatmap mark）"
description: |
  heatmap mark（区别于 cell mark 的色块热力图）使用高斯核密度渐变绘制热力分布，
  每个点产生向外扩散的热晕效果，适合展示地理空间密度或二维密度分布。
  通过 color 通道指定强度，size 控制热晕半径。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "heatmap"
  - "热力图"
  - "密度热力"
  - "渐变热力"
  - "高斯核"
  - "空间密度"

related:
  - "g2-mark-cell-heatmap"
  - "g2-mark-density"
  - "g2-mark-point-scatter"

use_cases:
  - "地图上的用户点击/访问热力图"
  - "二维空间中的密度分布可视化"
  - "大量重叠点的密度展示（比散点图更清晰）"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/heatmap/"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 带密度权重的二维数据
const data = Array.from({ length: 500 }, () => ({
  x: Math.random() * 100 + (Math.random() > 0.5 ? 20 : 60),
  y: Math.random() * 100 + (Math.random() > 0.5 ? 20 : 70),
  weight: Math.random(),
}));

const chart = new Chart({ container: 'container', width: 600, height: 500 });

chart.options({
  type: 'heatmap',   // 渐变热力图（不是 cell 热力图）
  data,
  encode: {
    x: 'x',
    y: 'y',
    color: 'weight',  // 热力强度（0~1）
    size: 30,         // 热晕半径（px），固定值或字段名
  },
  style: {
    opacity: 0.8,
  },
  scale: {
    color: {
      type: 'sequential',
      palette: ['blue', 'cyan', 'lime', 'yellow', 'red'],  // 冷色→热色
    },
  },
  axis: false,
  legend: false,
});

chart.render();
```

## 配置项

```javascript
chart.options({
  type: 'heatmap',
  data,
  encode: {
    x: 'lng',
    y: 'lat',
    color: 'intensity',    // 强度字段（默认 0~1）
    size: 'radius',        // 热晕半径，可以是字段名或固定数字
                           // 默认 40（px）
  },
  style: {
    opacity: 1,            // 整体透明度
  },
});
```

## heatmap vs cell 热力图

```javascript
// heatmap mark：高斯渐变，连续热晕效果，适合点数据密度
chart.options({ type: 'heatmap', ... });

// cell mark：离散色块，适合矩阵数据（如时间×类别的二维表格）
chart.options({ type: 'cell', ... });
```

## 常见错误与修正

### 错误 1：color 通道值域不在 0~1——热力颜色映射异常
```javascript
// ❌ 如果 color 值是原始计数（如 500、1000），颜色映射可能不准确
chart.options({
  encode: { color: 'rawCount' },  // ⚠️  rawCount 值可能是 0~10000
});

// ✅ 归一化到 0~1，或设置 scale.color.domain
chart.options({
  encode: { color: 'intensity' },  // intensity 已归一化为 0~1
  // 或配置 domain
  scale: { color: { domain: [0, 1000] } },  // 显式指定范围
});
```

### 错误 2：与 cell mark 混淆——cell 是矩阵格子，heatmap 是连续渐变
```javascript
// ❌ 用 cell 展示空间密度——格子状，缺乏连续渐变感
chart.options({ type: 'cell', encode: { x: 'lng', y: 'lat', color: 'density' } });

// ✅ 空间密度用 heatmap（连续渐变热晕效果）
chart.options({ type: 'heatmap', encode: { x: 'lng', y: 'lat', color: 'density', size: 30 } });
```
