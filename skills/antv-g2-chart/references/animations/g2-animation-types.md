---
id: "g2-animation-types"
title: "G2 内置动画类型详解（fadeIn/scaleIn/growIn/pathIn/waveIn/zoomIn/morphing）"
description: |
  G2 v5 内置多种动画类型，每种适用于不同的 Mark 和坐标系：
  fadeIn/Out（渐显渐隐）、scaleInX/Y（缩放展开）、growInX/Y（生长入场）、
  pathIn（路径绘制）、waveIn（极坐标波浪入场）、zoomIn/Out（缩放点入场）、morphing（形变过渡）。
  通过 animate.enter.type 等配置使用。

library: "g2"
version: "5.x"
category: "animations"
tags:
  - "fadeIn"
  - "scaleInX"
  - "scaleInY"
  - "growInX"
  - "growInY"
  - "pathIn"
  - "waveIn"
  - "zoomIn"
  - "zoomOut"
  - "morphing"
  - "动画类型"

related:
  - "g2-animation-intro"
  - "g2-animation-keyframe"

use_cases:
  - "按图表类型选择最合适的入场动画"
  - "折线图路径绘制动画"
  - "饼图/玫瑰图波浪入场"
  - "数据更新时的形变过渡"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/animate"
---

## 动画类型与适用场景

| 动画名 | 方向 | 最适合 Mark | 特点 |
|--------|------|------------|------|
| `fadeIn` | - | 所有 Mark | 渐显，通用，最安全 |
| `fadeOut` | - | 所有 Mark | 渐隐，退场通用 |
| `scaleInX` | X 轴 | interval（柱状图） | 从左上角向右扩展 |
| `scaleInY` | Y 轴 | interval（柱状图） | 从底部向上缩放 |
| `scaleOutX` | X 轴 | interval | scaleInX 的退场版本 |
| `scaleOutY` | Y 轴 | interval | scaleInY 的退场版本 |
| `growInX` | X 轴 | line, area, interval（直角坐标） | 裁剪从左向右生长 |
| `growInY` | Y 轴 | interval, area（直角坐标） | 裁剪从底部向上生长；**极坐标/helix 禁用** |
| `pathIn` | 路径 | line, path, link | 路径线条逐步绘制 |
| `waveIn` | 波浪 | interval（极坐标） | 极坐标专用扇形展开 |
| `zoomIn` | 中心 | point, text | 从中心缩放放大 |
| `zoomOut` | 中心 | point, text | 向中心缩小消失 |
| `morphing` | 形变 | 所有 Mark | 形状平滑变形过渡 |

## fadeIn / fadeOut（渐显渐隐）

```javascript
// 最通用的动画，适合任何 mark
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  animate: {
    enter: { type: 'fadeIn', duration: 600 },
    exit: { type: 'fadeOut', duration: 300 },
  },
});
```

## scaleInY / growInY（柱状图入场）

```javascript
// scaleInY：缩放展开（有缩放感）
// growInY：裁剪生长（有"从地面长出来"的感觉，更自然）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  animate: {
    // 方式一：缩放
    enter: { type: 'scaleInY', duration: 800, easing: 'ease-out' },
    // 方式二：生长（推荐）
    // enter: { type: 'growInY', duration: 800 },
  },
});
```

## pathIn（折线图路径绘制）

```javascript
// pathIn：折线/路径从左向右逐步绘制
chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  animate: {
    enter: {
      type: 'pathIn',      // 路径逐步绘制
      duration: 1500,
      easing: 'linear',    // 匀速绘制效果更佳
    },
  },
});
```

## waveIn（极坐标/饼图专用）

```javascript
// waveIn：从外圈向内的波浪扫入，专为极坐标设计
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  animate: {
    enter: {
      type: 'waveIn',       // 极坐标专用
      duration: 1000,
    },
  },
});
```

## zoomIn / zoomOut（点图缩放）

```javascript
// zoomIn：散点从中心缩放出现
chart.options({
  type: 'point',
  data: scatterData,
  encode: { x: 'x', y: 'y', size: 'value' },
  animate: {
    enter: { type: 'zoomIn', duration: 500 },
    exit: { type: 'zoomOut', duration: 300 },
  },
});
```

## morphing（形变更新动画）

```javascript
// morphing：数据更新时图形平滑变形
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  animate: {
    update: {
      type: 'morphing',    // 数据更新时形变过渡
      duration: 600,
    },
  },
});

// 也可以在 timingKeyframe 中自动触发形变
chart.options({
  type: 'timingKeyframe',
  children: [
    { type: 'interval', data, encode: { x: 'x', y: 'y' } },
    { type: 'line',     data, encode: { x: 'x', y: 'y' } },
  ],
});
```

## 按图表类型推荐的动画

```javascript
// 柱状图（推荐 growInY）
{ type: 'interval', animate: { enter: { type: 'growInY', duration: 800 } } }

// 条形图（推荐 growInX）
{ type: 'interval', coordinate: { transform: [{ type: 'transpose' }] },
  animate: { enter: { type: 'growInX', duration: 800 } } }

// 折线图（推荐 pathIn）
{ type: 'line', animate: { enter: { type: 'pathIn', duration: 1200 } } }

// 散点图（推荐 zoomIn 或 fadeIn）
{ type: 'point', animate: { enter: { type: 'zoomIn', duration: 400 } } }

// 饼图/环形图（推荐 waveIn）
{ type: 'interval', coordinate: { type: 'theta' },
  animate: { enter: { type: 'waveIn', duration: 1000 } } }

// 面积图（推荐 fadeIn 或 growInX）
{ type: 'area', animate: { enter: { type: 'fadeIn', duration: 800 } } }

// 螺旋图 helix 坐标系（必须用 fadeIn，禁止用 growInX/Y）
{ type: 'interval', coordinate: { type: 'helix', ... },
  animate: { enter: { type: 'fadeIn', duration: 800 } } }
```

## 常见错误与修正

### 错误 1：在条形图（转置）上用 scaleInY
```javascript
// ❌ 条形图是水平方向，用 scaleInY（竖向缩放）效果不对
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  animate: { enter: { type: 'scaleInY' } },  // ❌ 应该用 growInX 或 scaleInX
});

// ✅ 条形图用 X 方向动画
chart.options({
  animate: { enter: { type: 'growInX', duration: 800 } },  // ✅
});
```

### 错误 2：在 helix（螺旋）坐标系上用 growInX/growInY

`growInX` / `growInY` 的实现是沿直角坐标轴方向做 **clipPath 裁剪**。在 `helix` 坐标系中，坐标轴被重映射为螺旋路径，屏幕上不存在"底部"或"左侧"基线，裁剪矩形会横穿螺旋形，导致部分螺旋区域被切掉或渲染残缺，动画结束后图表也可能显示不完整。

**同样问题适用于所有非直角坐标系**（`polar`、`theta`、`helix`）——这些坐标系均应使用 `waveIn`（极坐标专用）或 `fadeIn`（通用），不能使用 `growInX/Y`。

```javascript
// ❌ 错误：helix 坐标系用 growInY → 裁剪矩形横穿螺旋，图表渲染残缺
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
    enter: { type: 'growInY', duration: 2000 },  // ❌ 螺旋被裁剪，部分区域缺失
  },
});

// ✅ 正确：helix 坐标系用 fadeIn
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
    enter: { type: 'fadeIn', duration: 1000 },   // ✅ 渐显，无裁剪副作用
  },
});

// ✅ 极坐标（theta/polar）用 waveIn
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  animate: {
    enter: { type: 'waveIn', duration: 1000 },   // ✅ 极坐标专用扇形展开
  },
});
```

**根本原因**：`growInX/Y` 假设存在固定的直角基线（X=0 或 Y=0）作为裁剪起点，这在笛卡尔坐标系中成立；但 `helix` / `polar` 将坐标重映射到极坐标或螺旋路径后，该基线不再对应可见边界，裁剪结果是任意截断螺旋形状。
