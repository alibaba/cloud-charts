---
id: "g2-mark-image"
title: "G2 Image 图片标记"
description: |
  image mark 在图表的指定位置渲染图片，可用于图标型散点图（以图标代替点）、
  地图上的图标标注、带图片的标签等场景。
  通过 src 通道绑定图片 URL，x/y 通道确定位置，size 通道控制大小。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "image"
  - "图片"
  - "图标"
  - "icon"
  - "图片散点图"

related:
  - "g2-mark-point-scatter"
  - "g2-mark-text"

use_cases:
  - "以品牌 logo / 图标代替散点（图标散点图）"
  - "在特定坐标位置插入说明图片"
  - "结合地图的图标标注"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#image"
---

## 最小可运行示例（图标散点图）

```javascript
import { Chart } from '@antv/g2';

const data = [
  { country: '中国',    gdp: 17.7, icon: 'https://example.com/flags/cn.png' },
  { country: '美国',    gdp: 25.5, icon: 'https://example.com/flags/us.png' },
  { country: '日本',    gdp: 4.2,  icon: 'https://example.com/flags/jp.png' },
  { country: '德国',    gdp: 4.1,  icon: 'https://example.com/flags/de.png' },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'image',
  data,
  encode: {
    x: 'country',  // x 位置（分类轴）
    y: 'gdp',      // y 位置（数值轴）
    src: 'icon',   // 图片 URL 字段
    size: 40,      // 图片大小（px），固定值或字段名
  },
});

chart.render();
```

## image + point 叠加（图标 + 数据点）

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'image',
      encode: { x: 'x', y: 'y', src: 'icon', size: 32 },
    },
    {
      type: 'text',
      encode: { x: 'x', y: 'y', text: 'label' },
      style: { textAnchor: 'middle', dy: 20, fontSize: 12 },
    },
  ],
});
```

## 配置项

```javascript
chart.options({
  type: 'image',
  data,
  encode: {
    x: 'xField',       // x 坐标
    y: 'yField',       // y 坐标
    src: 'imageUrl',   // 图片 URL 字段（或固定 URL 字符串）
    size: 'sizeField', // 图片大小（px），可以是字段名或固定数值
  },
  style: {
    preserveAspectRatio: 'xMidYMid meet',  // 图片缩放策略（SVG 标准）
  },
});
```

## 常见错误与修正

### 错误 1：src 通道写的是图片数据本身，不是 URL
```javascript
// ❌ 错误：src 应该是 URL 字段名，不是 base64 或 blob
chart.options({
  encode: { src: btoa(imageData) },  // ❌ 不能传 base64 字符串（需要完整的 data: URL）
});

// ✅ 正确：传 URL 字段名，数据中是完整 URL
chart.options({
  encode: { src: 'iconUrl' },  // ✅ 数据中 iconUrl 字段是 'https://...' 格式
});
```

### 错误 2：没有设置 size——图片默认大小可能过大或过小
```javascript
// ❌ 未设置 size，图片可能太大覆盖其他元素
chart.options({
  type: 'image',
  encode: { x: 'x', y: 'y', src: 'icon' },  // ❌ 没有 size
});

// ✅ 明确设置合适的 size
chart.options({
  encode: { x: 'x', y: 'y', src: 'icon', size: 36 },  // ✅
});
```
