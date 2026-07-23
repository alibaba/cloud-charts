---
id: "g2-comp-geoview"
title: "G2 地理视图（geoView）"
description: |
  geoView 基于 D3 地理投影，在 G2 中绘制地图可视化。
  支持多种投影方式（mercator、equalEarth、orthographic 等），
  数据需为 GeoJSON 格式，通过 geoPath mark 渲染地理形状。

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "geoView"
  - "地图"
  - "地理"
  - "GeoJSON"
  - "choropleth"
  - "地理投影"
  - "composition"

related:
  - "g2-mark-cell-heatmap"
  - "g2-scale-threshold"

use_cases:
  - "世界地图着色（choropleth map）"
  - "国家/省份数据地图展示"
  - "地理空间数据可视化"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/geo/geo/#choropleth"
---

## 最小可运行示例（世界地图）

```javascript
import { Chart } from '@antv/g2';

// 需要提前加载 world.geo.json 数据
fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(res => res.json())
  .then(world => {
    // 将 TopoJSON 转换为 GeoJSON（需要 topojson-client）
    const countries = topojson.feature(world, world.objects.countries);

    const chart = new Chart({ container: 'container', width: 900, height: 500 });

    chart.options({
      type: 'geoView',
      coordinate: {
        type: 'projection',
        projection: 'equalEarth',   // 投影方式
      },
      children: [
        {
          type: 'geoPath',
           countries,
          encode: { color: 'id' },   // 按国家 id 着色
          style: {
            stroke: '#fff',
            lineWidth: 0.5,
            fillOpacity: 0.85,
          },
        },
      ],
    });

    chart.render();
  });
```

## 数据关联着色（choropleth）

```javascript
// 将 GeoJSON 与数据表格按 name 关联，实现数据着色
const gdpData = {
  CN: 17.7, US: 25.5, JP: 4.2, DE: 4.1,
  // ...
};

chart.options({
  type: 'geoView',
  coordinate: { type: 'projection', projection: 'mercator' },
  children: [
    {
      type: 'geoPath',
       geoJsonFeatures,
      encode: {
        color: (d) => gdpData[d.properties.iso_a2] || 0,  // 关联 GDP 数据
      },
      scale: {
        color: {
          type: 'sequential',
          palette: 'blues',
          unknown: '#eee',   // 无数据国家颜色
        },
      },
      tooltip: {
        items: [
          { field: 'properties.name', name: '国家' },
          { callback: (d) => gdpData[d.properties.iso_a2], name: 'GDP（万亿美元）' },
        ],
      },
    },
  ],
});
```

## 支持的投影方式

```javascript
// 常用投影
coordinate: { type: 'projection', projection: 'mercator' }       // 墨卡托（Web地图标准）
coordinate: { type: 'projection', projection: 'equalEarth' }     // 等面积地球投影
coordinate: { type: 'projection', projection: 'orthographic' }   // 正交（球形）
coordinate: { type: 'projection', projection: 'naturalEarth1' }  // 自然地球
coordinate: { type: 'projection', projection: 'albersUsa' }      // 美国阿尔伯斯
```

## 常见错误与修正

### 错误：数据不是 GeoJSON 格式——直接传统计数据
```javascript
// ❌ geoPath mark 需要 GeoJSON Feature/FeatureCollection 数据
chart.options({
  children: [{
    type: 'geoPath',
     [{ country: 'China', gdp: 17.7 }],  // ❌ 不是 GeoJSON
  }],
});

// ✅ 需要 GeoJSON 格式
chart.options({
  children: [{
    type: 'geoPath',
     { type: 'FeatureCollection', features: [...] },  // ✅ GeoJSON
  }],
});
```
