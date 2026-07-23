---
id: "g2-core-encode-channel"
title: "G2 encode 通道系统详解"
description: |
  encode 是 G2 v5 的核心数据映射机制，将数据字段映射到视觉通道（位置、颜色、大小、形状等）。
  在 Spec 模式中，encode 是 options 对象中的一个字段；在链式 API 中通过 .encode() 方法调用。

library: "g2"
version: "5.x"
category: "core"
tags:
  - "encode"
  - "通道"
  - "channel"
  - "数据映射"
  - "x"
  - "y"
  - "color"
  - "size"
  - "shape"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-scale-linear"
  - "g2-scale-ordinal"
  - "g2-core-data-binding"

use_cases:
  - "将数据字段映射到图表的视觉属性"
  - "理解 Spec 模式中 encode 对象的结构"
  - "配置多通道映射"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/encode"
---

## 核心概念

**通道（Channel）** 是图形属性的抽象。在 Spec 模式中，`encode` 是 `options` 对象的一个字段，
其中每个 key 是通道名，value 是数据字段名（字符串）或常量。

## 通用通道列表

| 通道 | 说明 | 常见 Mark |
|------|------|-----------|
| `x` | X 轴位置 | 所有 Mark |
| `y` | Y 轴位置 | 所有 Mark |
| `color` | 颜色（fill + stroke） | 所有 Mark |
| `size` | 大小/粗细 | Point、Link、Line |
| `shape` | 形状 | Point、Interval |
| `opacity` | 透明度 | 所有 Mark |
| `series` | 系列分组（不影响颜色） | Line、Area |
| `key` | 动画时元素匹配键 | 所有 Mark |

## 基本用法（Spec 模式）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { city: '北京', gdp: 3.6 },
    { city: '上海', gdp: 4.0 },
    { city: '广州', gdp: 2.8 },
  ],
  encode: {
    x: 'city',      // 分类轴：自动使用 Band Scale
    y: 'gdp',       // 数值轴：自动使用 Linear Scale
    color: 'city',  // 颜色区分
  },
});

chart.render();
```

## 典型场景示例

### 时间 x 轴（折线图）

```javascript
chart.options({
  type: 'line',
  data: [
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 130 },
    { date: new Date('2024-03-01'), value: 110 },
  ],
  encode: {
    x: 'date',      // Date 对象自动使用 Time Scale
    y: 'value',
    color: 'series', // 多系列折线
  },
});
```

### 双数值轴 + 气泡图（多通道映射）

```javascript
// 颜色映射表：scale.color.range 和 fill 回调共用
const COLOR_MAP = { 'China': '#5B8FF9', 'USA': '#fb7678', 'Japan': '#81e7ee' };

chart.options({
  type: 'point',
  data: [
    { income: 30000, lifeExpect: 72, population: 1400, country: 'China' },
    { income: 60000, lifeExpect: 79, population: 330,  country: 'USA' },
    { income: 45000, lifeExpect: 84, population: 125,  country: 'Japan' },
  ],
  encode: {
    x: 'income',
    y: 'lifeExpect',
    size: 'population',    // 气泡大小
    color: 'country',
    shape: 'point',
  },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },    // sqrt 比例尺 + 合适的气泡范围
    color: { range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,            // 不要用 stroke: '#fff'，浅色主题下像错误图表
    lineWidth: 0,
    // 径向渐变：从白色中心到映射色边缘，模拟 3D 球体质感
    // 通过 COLOR_MAP[datum.country] 获取颜色，与 scale.color.range 保持一致
    fill: (datum) => {
      const color = COLOR_MAP[datum.country];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },
  legend: { size: false },        // size 图例意义不大，建议隐藏
});
```

### 函数映射（高级）

```javascript
chart.options({
  type: 'point',
  data: [...],
  encode: {
    x: 'date',
    y: 'value',
    // value 是函数时：动态计算通道值
    color: (d) => d.value > 100 ? 'red' : 'blue',
    size: (d) => Math.sqrt(d.count),
  },
});
```

## encode 字段值类型说明

| 值类型 | 含义 | 示例 |
|--------|------|------|
| `string`（字段名）| 映射数据字段 | `'genre'` |
| `string`（颜色/形状常量）| 所有元素相同值 | `'#1890ff'`、`'circle'` |
| `number` | 所有元素相同数值 | `10`（size 常量） |
| `function` | 动态计算 | `(d) => d.val * 2` |

> **判断规则**：`encode.color` 传入 `'genre'` → 视为字段名；传入 `'#1890ff'` → 视为颜色常量（以 `#` 开头或合法 CSS 颜色名）。`encode.size` 传入 `10`（数字）→ 常量。

## G2 v4 → v5 Spec 迁移对照

| G2 v4 链式 | G2 v5 Spec encode 字段 |
|-----------|------------------------|
| `.position('x*y')` | `encode: { x: 'x', y: 'y' }` |
| `.color('type')` | `encode: { color: 'type' }` |
| `.size('count')` | `encode: { size: 'count' }` |
| `.shape('circle')` | `encode: { shape: 'circle' }` |
| `.opacity('rate')` | `encode: { opacity: 'rate' }` |

## Mark 特有通道

不同 mark 类型支持额外的通道：

| Mark | 特有通道 | 说明 |
|------|---------|------|
| `interval` | `y1` | 区间终点（甘特图、范围柱）|
| `line` | `shape` | 线型：`'line'`\|`'smooth'`\|`'hv'`\|`'vh'`\|`'hvh'`\|`'vhv'` |
| `point` | `shape` | 点形：`'circle'`\|`'square'`\|`'diamond'`\|`'triangle'`\|... |
| `area` | `shape` | 区域：`'area'`\|`'smooth'`\|`'hvh'` |
| `text` | `text` | 文本内容（字段名或函数）|
| `image` | `src` | 图片 URL 字段 |
| `vector` | `rotate`, `size` | 方向角度和长度 |
| `sankey`/`chord` | `source`, `target`, `value` | 关系图的起终点和权重 |

## encode 常量 vs 字段名判定

```javascript
encode: {
  color: 'type',       // 字段名 → 按 type 字段分色
  color: '#1890ff',    // # 开头 → 颜色常量，所有元素同色
  color: 'steelblue',  // CSS 颜色名 → 颜色常量
  color: () => 'red',  // 函数 → 常量（返回固定值时等同常量）
  size: 'population',  // 字段名 → 按 population 映射大小
  size: 10,            // 数字 → 大小常量
}
```

## 常见错误与修正

### 错误 1：encode 写在了 style 里
```javascript
// ❌ 错误：style 不做数据映射
chart.options({
  type: 'interval',
  data: [...],
  style: { color: 'genre' },  // 无效！genre 是字段名，不是颜色值
});

// ✅ 正确：数据映射用 encode，固定样式用 style
chart.options({
  type: 'interval',
  data: [...],
  encode: { color: 'genre' },   // 数据驱动颜色
  style: { fillOpacity: 0.8 },  // 固定透明度
});
```

### 错误 2：color 与 series 通道混淆
```javascript
// 说明：color 既分组又改颜色；series 只分组不改颜色
// 多系列折线图推荐用 color：
chart.options({
  type: 'line',
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',    // ✅ 推荐：每条线不同颜色
    // series: 'type', // 只分组，颜色相同（少用）
  },
});
```
