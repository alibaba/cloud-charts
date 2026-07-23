---
id: "g2-comp-geo-map"
title: "G2 地理地图（geoView / geoPath / d3Projection）"
description: |
  G2 v5 通过 geoView、geoPath 组合类型以及 d3Projection 地图投影实现地理可视化。
  geoView 是地理视图容器，geoPath 是地理路径 Mark（绘制行政区域等 GeoJSON）。
  支持 geoMercator、geoNaturalEarth1 等多种地图投影。
  数据格式为 GeoJSON 的 FeatureCollection。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "geoView"
  - "geoPath"
  - "地图"
  - "GeoJSON"
  - "地理可视化"
  - "d3Projection"
  - "choropleth"
  - "choropleth map"

related:
  - "g2-comp-geoview"
  - "g2-core-view-composition"

use_cases:
  - "省份/城市分布热力地图（choropleth map）"
  - "世界地图可视化"
  - "地理数据的空间分布展示"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/geo/geo/#choropleth"
---

## 核心概念

G2 地理可视化的三个核心组件：

| 组件 | 类型 | 说明 |
|------|------|------|
| `geoView` | composition | 地理视图容器，配置投影和视口 |
| `geoPath` | mark（在 geoView 内） | 绘制 GeoJSON 地理路径 |
| `d3Projection` | 投影函数 | 从 d3-geo 导出的投影函数（geoMercator 等） |

## 最小可运行示例（世界地图）

```javascript
import { Chart } from '@antv/g2';

async function renderMap() {
  // 加载 GeoJSON 数据
  const world = await fetch(
    'https://assets.antv.antgroup.com/g2/world.json',
  ).then((res) => res.json());

  const chart = new Chart({ container: 'container', width: 900, height: 500 });

  chart.options({
    type: 'geoView',       // 地理视图容器
    data: {
      type: 'fetch',
      value: 'https://assets.antv.antgroup.com/g2/world.json',
    },
    children: [
      {
        type: 'geoPath',   // 地理路径 Mark
        style: {
          fill: '#ccc',
          stroke: '#fff',
          lineWidth: 0.5,
        },
      },
    ],
  });

  chart.render();
}
renderMap();
```

## Choropleth Map（着色地图）

```javascript
import { Chart } from '@antv/g2';

const populationData = [
  { province: '广东', value: 12601 },
  { province: '山东', value: 10169 },
  // ...
];

const chart = new Chart({ container: 'container', width: 900, height: 600 });

chart.options({
  type: 'geoView',
  children: [
    {
      type: 'geoPath',
      data: {
        type: 'fetch',
        value: 'https://assets.antv.antgroup.com/g2/china.json',
      },
      // 将 GeoJSON 属性与业务数据 join
      join: {
         populationData,
        on: ['properties.name', 'province'],   // GeoJSON 属性字段 → 业务数据字段
      },
      encode: {
        color: 'value',   // 按 value 字段着色
      },
      style: {
        stroke: '#fff',
        lineWidth: 0.5,
      },
      scale: {
        color: {
          type: 'sequential',
          range: ['#eaf4d3', '#006d2c'],   // 颜色渐变范围
        },
      },
    },
  ],
});

chart.render();
```

## 自定义地图投影

```javascript
import { Chart } from '@antv/g2';
import { geoMercator, geoNaturalEarth1 } from '@antv/g2';  // 从 g2 导出 d3-geo 投影

const chart = new Chart({ container: 'container', width: 900, height: 500 });

chart.options({
  type: 'geoView',
  projection: {
    type: 'mercator',       // 内置投影名
    // type: 'naturalEarth1', // 自然地球投影
    // type: 'orthographic',  // 正射投影
  },
  children: [
    {
      type: 'geoPath',
       { type: 'fetch', value: 'https://assets.antv.antgroup.com/g2/world.json' },
      style: { fill: '#ccc', stroke: '#fff' },
    },
  ],
});

chart.render();
```

## 内置投影类型

```javascript
// G2 内置的 d3-geo 投影（在 projection.type 中指定）
// 'mercator'         - 墨卡托投影（适合局部区域）
// 'naturalEarth1'    - 自然地球投影（适合世界地图）
// 'orthographic'     - 正射投影（球形效果）
// 'equalEarth'       - 等面积地球投影
// 'albersUsa'        - 美国阿尔伯斯投影
```

## 常见错误与修正

### 错误：geoPath 没有放在 geoView 里
```javascript
// ❌ 错误：geoPath 必须在 geoView 内使用
chart.options({
  type: 'geoPath',   // ❌ 不能直接作为顶层类型
   geojson,
});

// ✅ 正确：geoPath 在 geoView children 中
chart.options({
  type: 'geoView',
  children: [
    { type: 'geoPath', data: { type: 'fetch', value: '...' } },  // ✅
  ],
});
```

### 错误：数据不是 GeoJSON 格式
```javascript
// ❌ 错误：geoPath 需要 GeoJSON FeatureCollection 格式
chart.options({
  type: 'geoView',
  children: [{
    type: 'geoPath',
     [{ province: '广东', lng: 113, lat: 23 }],  // ❌ 普通经纬度数据不行
  }],
});

// ✅ 正确：使用标准 GeoJSON FeatureCollection
// GeoJSON 格式：{ type: 'FeatureCollection', features: [...] }
chart.options({
  type: 'geoView',
  children: [{
    type: 'geoPath',
     { type: 'fetch', value: 'china.geojson' },  // ✅ GeoJSON 文件
  }],
});
```
