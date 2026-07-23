---
id: "g2-concept-visual-channels"
title: "G2 视觉通道（Visual Channels）"
description: |
  视觉通道是数据属性到视觉属性的映射方式，包括位置、颜色、大小、形状、方向等。
  理解各通道的感知效率和适用数据类型，有助于设计更准确、更有效的数据可视化。
  这是 G2 encode 配置设计的理论基础。

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "视觉通道"
  - "visual channels"
  - "encode"
  - "感知效率"
  - "数据映射"
  - "可视化设计"
  - "颜色"
  - "大小"
  - "位置"

related:
  - "g2-core-encode-channel"
  - "g2-concept-color-theory"

use_cases:
  - "理解 G2 encode 各通道的设计原理"
  - "为不同数据类型选择合适的视觉通道"
  - "避免感知效率低的通道误用"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
---

## 核心概念

视觉通道（Visual Channel）是将**数据属性**映射到**视觉属性**的媒介。G2 中通过 `encode` 字段完成这种映射：

```javascript
chart.options({
  encode: {
    x: 'month',      // 位置通道（x轴）← 分类字段
    y: 'revenue',    // 位置通道（y轴）← 数值字段
    color: 'product',// 颜色通道 ← 分类字段
    size: 'amount',  // 大小通道 ← 数值字段
  },
});
```

## 主要视觉通道及其感知效率

### 定量数据（连续数值）

按感知精确度从高到低排序：

| 排名 | 通道 | G2 对应 | 说明 |
|------|------|---------|------|
| ★★★★★ | **位置（x/y轴）** | `encode.x`, `encode.y` | 最精确，人眼可精确比较 |
| ★★★★ | **长度/高度** | `encode.y`（柱状图） | 次精确，需共同基线 |
| ★★★ | **面积/大小** | `encode.size` | 中等，适合气泡图相对比较 |
| ★★ | **颜色深浅** | `encode.color`（连续色阶）| 较难精确比较，仅适合粗略趋势 |
| ★ | **角度** | 饼图扇区角度 | 人眼对角度判断不精确，慎用 |

### 分类数据（离散类别）

| 通道 | G2 对应 | 适用场景 |
|------|---------|---------|
| **位置分组** | `encode.x`（分类轴） | 柱状图、折线图的分类 |
| **颜色（色相）** | `encode.color` | 区分≤8个类别，超过易混淆 |
| **形状** | `encode.shape` | 散点图区分类别，≤6个 |
| **纹理/图案** | `encode.shape`（自定义）| 无色环境或辅助区分 |

## 通道适配规则

```
定量数据（数值）→ 优先：位置轴（x/y）> 大小（size）> 颜色深度（连续色）
分类数据（类别）→ 优先：位置轴（x/y）> 颜色色相（color）> 形状（shape）
有序数据（排名）→ 优先：位置轴（顺序）> 大小（递减）> 颜色（渐变色）
```

## 通道组合示例

### 气泡图：3个数值通道

```javascript
// x位置 + y位置 + 大小（size） = 三维数值编码
// 颜色映射表：scale.color.range 和 fill 回调共用
const COLOR_MAP = { 'Asia': '#fb7678', 'Europe': '#81e7ee', 'Americas': '#5B8FF9' };

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'GDP',          // 定量 → 位置（最精确）
    y: 'LifeExpectancy',// 定量 → 位置
    size: 'Population', // 定量 → 大小（第三维度）
    color: 'Region',    // 分类 → 颜色色相（第四维度）
    shape: 'point',
  },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },   // sqrt 比例尺，确保面积与数值成正比
    color: { range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,
    lineWidth: 0,
    // 径向渐变：从白色中心到映射色边缘，模拟 3D 球体质感
    // 通过 COLOR_MAP[datum.Region] 获取颜色，与 scale.color.range 保持一致
    fill: (datum) => {
      const color = COLOR_MAP[datum.Region];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },  // 不要用 stroke:'#fff'
  legend: { size: false },
});
```

### 热力图：颜色深度编码数值

```javascript
// 颜色用于定量数据时，应使用顺序色阶（浅→深），不用分类色板
chart.options({
  type: 'cell',
  data,
  encode: {
    x: 'weekday',
    y: 'hour',
    color: 'value',     // 定量 → 颜色深浅（连续色阶）
  },
  scale: {
    color: {
      type: 'sequential',
      palette: 'blues',  // 顺序色阶（而非分类色板）
    },
  },
});
```

## 常见通道误用

### 误用 1：用颜色色相表示数值大小

```javascript
// ❌ 误用：颜色色相（红/绿/蓝）不能表达数值大小关系
chart.options({
  encode: { color: 'temperature' },   // temperature 是数值，用色相无法体现大小
  scale: { color: { type: 'ordinal' } },   // ❌ 分类色板用于数值
});

// ✅ 正确：数值用连续色阶
chart.options({
  encode: { color: 'temperature' },
  scale: {
    color: {
      type: 'sequential',   // 顺序比例尺
      palette: 'reds',      // 浅→深的顺序色
    },
  },
});
```

### 误用 2：颜色类别过多导致难以区分

```javascript
// ❌ 超过 8 个颜色类别，人眼难以区分
chart.options({
  encode: { color: 'province' },   // 如果有 31 个省份，颜色无法有效区分
});

// ✅ 超过 8 类时的替代方案：
// 1. 合并次要类别为"其他"
// 2. 改用位置通道（分组柱状图/分面）
// 3. 使用交互过滤（点击图例显示/隐藏）
```

### 误用 3：饼图扇区过多

```javascript
// ❌ 角度通道感知精度低，超过 5 个扇区难以比较
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  // 如果有 10+ 个分类，饼图效果很差
});

// ✅ 分类多时改用柱状图（位置通道感知更精确）
chart.options({
  type: 'interval',
  encode: { x: 'category', y: 'value' },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],
});
```
