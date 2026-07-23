---
id: "g2-coord-polar"
title: "G2 极坐标系（polar）"
description: |
  极坐标系将直角坐标系映射为圆形区域，x 通道映射为角度，y 通道映射为半径。
  常用于玫瑰图（极坐标柱状图）、极坐标面积图、环形图等。
  通过 startAngle / endAngle 控制角度范围，innerRadius 控制内孔大小。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "polar"
  - "极坐标"
  - "玫瑰图"
  - "nightingale"
  - "coxcomb"
  - "radial"
  - "coordinate"

related:
  - "g2-coord-transpose"
  - "g2-mark-arc-pie"
  - "g2-mark-interval-stacked"

use_cases:
  - "玫瑰图 / 南丁格尔玫瑰图（各分类用角度+半径双重编码）"
  - "极坐标面积图（周期性数据的环形展示）"
  - "环形进度条"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/polar"
---

## 最小可运行示例（玫瑰图）

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
    { month: 'Jun', value: 88 },
  ],
  encode: {
    x: 'month',   // 映射为角度（方向）
    y: 'value',   // 映射为半径（长度）
    color: 'month',
  },
  coordinate: { type: 'polar' },  // 关键：极坐标
});

chart.render();
```

## 配置项

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'month' },
  coordinate: {
    type: 'polar',
    startAngle: -Math.PI / 2,    // 起始角度，默认 -π/2（12点钟方向）
    endAngle: (Math.PI * 3) / 2, // 结束角度，默认 3π/2（顺时针一圈）
    innerRadius: 0,              // 内孔半径，0 = 无孔，0.5 = 半径50% 的孔
    outerRadius: 1,              // 外径比例，默认 1
  },
});
```

## 半圆玫瑰图

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'month' },
  coordinate: {
    type: 'polar',
    startAngle: -Math.PI / 2,   // 从顶部开始
    endAngle: Math.PI / 2,      // 只到底部，半圆
  },
});
```

## 极坐标堆叠面积图

```javascript
chart.options({
  type: 'area',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'polar', innerRadius: 0.2 },
  style: { fillOpacity: 0.65 },
});
```

## 常见错误与修正

### 错误 1：玫瑰图角度不均匀——x 通道数据类型不是分类
```javascript
// ❌ 错误：x 通道是数值，极坐标下角度不均匀
chart.options({
  encode: { x: 'timestamp', y: 'value' },  // ❌ 时间戳为数值
  coordinate: { type: 'polar' },
});

// ✅ 正确：x 通道应为分类字段（字符串）
chart.options({
  encode: { x: 'month', y: 'value' },  // ✅ 字符串类别
  coordinate: { type: 'polar' },
});
```

### 错误 2：与 theta 坐标系混淆
```javascript
// ❌ 饼图用 polar 无效——y 通道不会自动转为扇形角度
chart.options({
  type: 'interval',
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'polar' },  // ❌ 饼图应该用 theta，不是 polar
});

// ✅ 饼图必须用 theta 坐标系
chart.options({
  coordinate: { type: 'theta' },  // ✅
});
```
