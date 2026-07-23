---
id: "g2-mark-path"
title: "G2 路径标注（path）"
description: |
  path mark 通过 SVG 路径字符串（d 属性）绘制任意形状，
  适合自定义图形、地图轮廓、流程图箭头等无法用标准 mark 表达的形状。
  与 line mark 区别：line 连接数据点坐标，path 直接使用 SVG d 路径字符串。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "path"
  - "路径"
  - "SVG"
  - "自定义形状"
  - "annotation"

related:
  - "g2-mark-polygon"
  - "g2-mark-link"
  - "g2-mark-connector"

use_cases:
  - "绘制自定义 SVG 路径形状"
  - "地图轮廓（非 GeoJSON）标注"
  - "自定义箭头和流程图元素"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/path"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

// path mark 通过 d 字段提供 SVG 路径字符串
const pathData = [
  {
    d: 'M 100 200 C 100 100 400 100 400 200 S 700 300 700 200',
    color: '#5B8FF9',
    label: '曲线路径',
  },
  {
    d: 'M 100 350 L 250 300 L 400 350 L 550 300 L 700 350',
    color: '#FF6B6B',
    label: '折线路径',
  },
];

chart.options({
  type: 'view',
  width: 640,
  height: 480,
  children: [
    {
      type: 'path',
      data: pathData,
      encode: {
        d: 'd',          // SVG 路径字符串字段
        color: 'color',
      },
      style: {
        lineWidth: 2,
        fillOpacity: 0,  // 路径通常只显示描边
      },
    },
  ],
});

chart.render();
```

## 带填充的封闭路径

```javascript
// 封闭路径（Z 命令）可以填充颜色
const shapes = [
  {
    d: 'M 200 100 L 300 300 L 100 300 Z',  // 三角形
    category: 'triangle',
  },
  {
    d: 'M 450 100 L 550 150 L 550 250 L 450 300 L 350 250 L 350 150 Z',  // 六边形
    category: 'hexagon',
  },
];

chart.options({
  type: 'path',
  data: shapes,
  encode: {
    d: 'd',
    color: 'category',
  },
  style: {
    fillOpacity: 0.3,
    lineWidth: 2,
  },
});
```

## 常见错误与修正

### 错误：path mark 使用 x/y encode——path 不支持坐标编码
```javascript
// ❌ path mark 不使用 x/y，而是使用 d（SVG 路径字符串）
chart.options({
  type: 'path',
  encode: { x: 'x', y: 'y' },  // ❌ path mark 不支持坐标编码
});

// ✅ path mark 使用 d 字段提供完整的 SVG 路径
chart.options({
  type: 'path',
  encode: { d: 'd' },           // ✅ d 字段为 SVG 路径字符串
  style: { lineWidth: 2 },
});
```

### 错误：path 与 line 混淆——连接数据点应用 line
```javascript
// 连接多个数据坐标点 → 用 line mark
chart.options({ type: 'line', encode: { x: 'date', y: 'value' } });

// 自定义 SVG 路径形状 → 用 path mark
chart.options({ type: 'path', encode: { d: 'pathString' } });
```
