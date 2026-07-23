---
id: "g2-coord-radial"
title: "G2 径向坐标系（radial）"
description: |
  radial（径向坐标系）是 G2 v5 中极坐标系的一种变体，
  将转置后的直角坐标映射为圆形布局：x 轴映射为半径，y 轴映射为角度。
  与 polar（极坐标）相反（polar 是 x→角度，y→半径），
  radial 适合绘制径向柱状图（向心柱状图）、径向折线图等。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "radial"
  - "径向坐标"
  - "向心柱状图"
  - "径向图"
  - "coordinate"
  - "圆形布局"

related:
  - "g2-coord-polar"
  - "g2-coord-theta"
  - "g2-mark-interval-basic"

use_cases:
  - "径向柱状图（向外辐射的柱状图）"
  - "环形条形图（各类别从圆心向外延伸）"
  - "时间序列的圆形布局展示"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/radial"
---

## 核心概念

径向坐标系（radial）与极坐标系（polar）的映射关系相反：

| 坐标系 | x 通道 | y 通道 | 典型图表 |
|--------|--------|--------|----------|
| `polar` | → 角度（圆周方向） | → 半径（距中心距离） | 玫瑰图 |
| `radial` | → 半径（距中心距离） | → 角度（圆周方向） | 径向柱状图 |

## 最小可运行示例（径向柱状图）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 500, height: 500 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', value: 83 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 95 },
    { month: 'Apr', value: 72 },
    { month: 'May', value: 110 },
    { month: 'Jun', value: 85 },
  ],
  encode: {
    x: 'month',    // x 通道 → 角度（圆周位置）
    y: 'value',    // y 通道 → 半径（柱子长度）
    color: 'month',
  },
  coordinate: { type: 'radial', innerRadius: 0.1, outerRadius: 0.8 },
});

chart.render();
```

## 配置项

```javascript
chart.options({
  coordinate: {
    type: 'radial',
    innerRadius: 0.1,            // 内环半径（0=从中心开始），默认 0
    outerRadius: 1,              // 外环半径比例，默认 1
    startAngle: -Math.PI / 2,   // 起始角度，默认 -π/2（12点钟方向）
    endAngle: (Math.PI * 3) / 2, // 结束角度，默认 3π/2（顺时针一圈）
  },
});
```

## 带内孔的径向柱状图（环形）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  coordinate: {
    type: 'radial',
    innerRadius: 0.3,   // 留出中心空间
    outerRadius: 0.9,
  },
  style: { fillOpacity: 0.85 },
});
```

## 与 polar 坐标系的区别

```javascript
// polar：x→角度，y→半径（玫瑰图效果）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },  // x 为分类（角度），y 为数值（半径）
  coordinate: { type: 'polar' },
});

// radial：x→半径，y→角度（径向柱状图效果）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },  // x 为分类（角度），y 为数值（半径）
  coordinate: { type: 'radial' },
});
```

## 常见错误与修正

### 错误：encode x/y 与预期方向相反
```javascript
// ❌ 错误：radial 中 x 应该是角度方向（类别），y 是半径方向（数值）
chart.options({
  type: 'interval',
  encode: { x: 'value', y: 'month' },  // ❌ 数值作为角度，月份作为半径
  coordinate: { type: 'radial' },
});

// ✅ 正确：将分类字段作为 x（映射为角度），数值字段作为 y（映射为半径）
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value' },  // ✅ 月份→角度，数值→半径
  coordinate: { type: 'radial' },
});
```

### 错误：中心图片未正确显示
```javascript
// ❌ 错误：使用固定坐标 (0,0) 显示图片无法保证其位于中心
chart.options({
  type: 'image',
  data: [{ url: 'https://example.com/logo.png' }],
  encode: {
    x: () => 0,
    y: () => 0
  },
  style: {
    img: (d) => d.url,
    width: 80,
    height: 80
  }
});

// ✅ 正确：使用 style.x 和 style.y 设置相对位置，确保图片居中
chart.options({
  type: 'image',
  data: [{ src: 'https://example.com/logo.png' }],
  style: {
    x: '50%',      // 相对于容器宽度的 50%
    y: '50%',      // 相对于容器高度的 50%
    width: 80,
    height: 80
  }
});
```

### 错误：多个视图叠加导致坐标系冲突
```javascript
// ❌ 错误：在 view 中重复定义 coordinate 导致渲染异常
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
      coordinate: { type: 'radial' }  // 子视图中定义坐标系可能导致冲突
    },
    {
      type: 'image',
      coordinate: { type: 'radial' }  // 图片标记不需要坐标系
    }
  ]
});

// ✅ 正确：在顶层 view 定义 coordinate，子元素继承即可
chart.options({
  type: 'view',
  coordinate: { type: 'radial', innerRadius: 0.3 },
  children: [
    {
      type: 'interval',
      data,
      encode: { x: 'type', y: 'value' }
    },
    {
      type: 'image',
      data: [{ src: 'https://example.com/logo.png' }],
      style: {
        x: '50%',
        y: '50%',
        width: 80,
        height: 80
      }
    }
  ]
});
```