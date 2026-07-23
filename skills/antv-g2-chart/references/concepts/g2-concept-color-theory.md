---
id: "g2-concept-color-theory"
title: "G2 配色理论"
description: |
  数据可视化中颜色的三种使用模式：分类色板（区分类别）、
  顺序色阶（表示数值大小）、发散色阶（表示正负偏差）。
  覆盖 G2 scale.color 配置方法和常见配色误用。

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "配色"
  - "color"
  - "色板"
  - "顺序色阶"
  - "发散色阶"
  - "分类色板"
  - "palette"
  - "scale.color"

related:
  - "g2-concept-visual-channels"
  - "g2-core-encode-channel"
  - "g2-theme-builtin"

use_cases:
  - "为不同数据类型选择正确的颜色模式"
  - "配置 G2 scale.color 实现正确的颜色映射"
  - "避免颜色误导数据读者"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
---

## 三种颜色使用模式

### 1. 分类色板（Categorical Palette）

**用途**：区分不同类别（定性数据），颜色之间**没有大小关系**

```javascript
// 场景：多系列折线图，用颜色区分产品线
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'sales', color: 'product' },
  // 默认就是分类色板，无需配置
  // 如需自定义：
  scale: {
    color: {
      type: 'ordinal',
      range: ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1'],
    },
  },
});
```

**规则**：
- 最多 **8 个**颜色，超过则难以区分
- 颜色之间亮度相近（避免某类特别突出）
- 考虑色盲友好性（红绿色盲常见，避免仅用红/绿区分）

### 2. 顺序色阶（Sequential Scale）

**用途**：表示数值从小到大，颜色从浅到深（或一种色调变化）

```javascript
// 场景：热力图、地图、气泡图的颜色深度
chart.options({
  type: 'cell',
  data,
  encode: { x: 'weekday', y: 'hour', color: 'count' },
  scale: {
    color: {
      type: 'sequential',     // 顺序比例尺
      palette: 'blues',        // 单色系：whites → blues
      // 常用内置色阶：'blues' | 'greens' | 'oranges' | 'reds' | 'purples'
      // 多色系：'YlOrRd' | 'YlGnBu' | 'BuPu' | 'GnBu'
    },
  },
});
```

**规则**：
- 数值越大 → 颜色越深（感知自然）
- 使用**单色系**（同色调深浅变化）或**多色系渐变**
- 不要用分类色板表示数值（红/绿没有大小感）

### 3. 发散色阶（Diverging Scale）

**用途**：表示以零（或某基准值）为中心的正负偏差

```javascript
// 场景：盈亏热力图、同比增减、差异对比
chart.options({
  type: 'cell',
  data,
  encode: { x: 'product', y: 'region', color: 'growth' },
  scale: {
    color: {
      type: 'diverging',      // 发散比例尺
      palette: 'RdBu',        // 红（负）→ 白（零）→ 蓝（正）
      // 常用：'RdBu' | 'RdYlGn' | 'BrBG' | 'PuOr'
      domain: [-100, 0, 100], // 对称范围（中间是 0）
    },
  },
});
```

**规则**：
- 中性值（零/平均值）映射为**白色或浅灰**
- 两端颜色**感知强度相当**（避免一端视觉更突出）
- 定义对称的 domain（如 `[-50, 0, 50]`）

## 颜色通道与比例尺配置

```javascript
// G2 完整颜色配置
scale: {
  color: {
    // ── 比例尺类型 ────────────────────────
    type: 'ordinal',     // 分类：'ordinal'
    // type: 'sequential', // 连续顺序
    // type: 'diverging',  // 发散
    // type: 'threshold',  // 分段阈值

    // ── 颜色范围（分类色板）────────────────
    range: ['#1890ff', '#52c41a', '#fa8c16'],   // 自定义颜色列表

    // ── 内置色板名称 ──────────────────────
    palette: 'tableau10',   // 'tableau10' | 'category10' | 'blues' 等

    // ── 域（分类的显示顺序）───────────────
    domain: ['产品A', '产品B', '产品C'],

    // ── 未知值颜色 ────────────────────────
    unknown: '#f0f0f0',
  },
}
```

## 内置色板完整参考

**⚠️ 重要：只能使用下表中列出的名称**。G2 的 `palette` 通过 d3-scale-chromatic 查找，不在此列表中的名称（如 `'blueOrange'`、`'redGreen'`、`'heatmap'`、`'hot'`、`'jet'`）会在运行时报错 `Unknown palette`，图表无法渲染。名称大小写不敏感（`'blues'` 和 `'Blues'` 均可）。

### 分类色板（ordinal scale 用，区分类别）

| 色板名 | 颜色数 | 风格 |
|-------|--------|------|
| `'tableau10'` | 10 | Tableau 经典配色（柔和，默认） |
| `'category10'` | 10 | D3 经典分类色 |
| `'set2'` | 8 | 粉彩风格，温和 |
| `'paired'` | 12 | 成对颜色（浅+深） |
| `'dark2'` | 8 | 深色调，高对比 |
| `'set1'` | 9 | 高饱和度 |
| `'set3'` | 12 | 中等饱和度 |
| `'pastel1'` | 9 | 淡彩色 |
| `'pastel2'` | 8 | 淡彩色 |
| `'accent'` | 8 | 强调色 |

### 顺序色阶（sequential scale 用，正值数值映射）

| 色板名 | 效果 |
|-------|------|
| `'blues'` | 白→蓝 |
| `'greens'` | 白→绿 |
| `'reds'` | 白→红 |
| `'oranges'` | 白→橙 |
| `'purples'` | 白→紫 |
| `'greys'` | 白→灰 |
| `'ylOrRd'` | 黄→橙→红（热力图常用） |
| `'ylGnBu'` | 黄→绿→蓝（sequential 默认值） |
| `'ylOrBr'` | 黄→橙→棕 |
| `'buGn'` | 蓝→绿 |
| `'buPu'` | 蓝→紫 |
| `'gnBu'` | 绿→蓝 |
| `'orRd'` | 橙→红 |
| `'puBu'` | 紫→蓝 |
| `'puBuGn'` | 紫→蓝→绿 |
| `'puRd'` | 紫→红 |
| `'rdPu'` | 红→紫 |
| `'ylGn'` | 黄→绿 |
| `'viridis'` | 紫→蓝→绿→黄（感知均匀，**色盲友好**，推荐）|
| `'plasma'` | 蓝紫→橙黄 |
| `'magma'` | 黑→紫→橙→白 |
| `'inferno'` | 黑→紫→红→黄 |
| `'cividis'` | 蓝→黄（对所有色盲类型友好） |
| `'turbo'` | 蓝→绿→黄→红（彩虹改进版） |
| `'warm'` | 橙→红→紫（暖色） |
| `'cool'` | 青→蓝→紫（冷色） |
| `'rainbow'` | 彩虹（感知不均匀，不推荐） |
| `'sinebow'` | 平滑彩虹 |
| `'cubehelixDefault'` | 螺旋渐变 |

### 发散色阶（diverging scale 用，正负值对比）

| 色板名 | 效果 |
|-------|------|
| `'rdBu'` | 红→白→蓝（**最常用**，涨跌/正负） |
| `'rdYlBu'` | 红→黄→蓝 |
| `'rdYlGn'` | 红→黄→绿（同比增减） |
| `'rdGy'` | 红→白→灰 |
| `'pRGn'` | 紫→白→绿 |
| `'piYG'` | 粉红→白→黄绿 |
| `'puOr'` | 紫→白→橙 |
| `'brBG'` | 棕→白→蓝绿 |
| `'spectral'` | 红→橙→黄→绿→蓝（多色发散） |

## 色盲友好配色

约 8% 的男性有红绿色盲，应避免仅用红/绿区分数据：

```javascript
// ❌ 不友好：红/绿区分（色盲用户无法区分）
scale: { color: { range: ['#ff4d4f', '#52c41a'] } }

// ✅ 友好：使用蓝/橙（色盲可区分）
scale: { color: { range: ['#1890ff', '#fa8c16'] } }

// ✅ 也可以同时用颜色+形状双通道编码
chart.options({
  type: 'point',
  encode: {
    color: 'category',
    shape: 'category',   // 同时用形状区分（不依赖颜色）
  },
});
```

## 常见颜色错误

### 错误 1：用分类色板表示数值（热力图）

```javascript
// ❌ 用分类色（红/蓝/绿）表示数值大小，毫无规律感
chart.options({
  type: 'cell',
  encode: { color: 'temperature' },
  scale: { color: { type: 'ordinal' } },   // ❌ 数值用了分类色板
});

// ✅ 数值用顺序色阶
chart.options({
  type: 'cell',
  encode: { color: 'temperature' },
  scale: { color: { type: 'sequential', palette: 'YlOrRd' } },   // ✅
});
```

### 错误 2：发散色阶域不对称

```javascript
// ❌ 域不对称，零点不在颜色中点
scale: {
  color: {
    type: 'diverging',
    palette: 'RdBu',
    domain: [-20, 100],   // ❌ 负值范围小，零点偏左
  },
}

// ✅ 对称的域，零点在中心
scale: {
  color: {
    type: 'diverging',
    palette: 'RdBu',
    domain: [-100, 0, 100],   // ✅ 明确指定三个控制点
  },
}
```

### 错误 3：颜色过多导致混淆

```javascript
// ❌ 12 个颜色，读者无法区分
chart.options({
  encode: { color: 'province' },   // 31个省份
});

// ✅ 分组或合并，保持 ≤ 8 个颜色类别
// 方案：取 Top 7 + "其他"
const processedData = aggregateTopN(data, 'province', 7);
```

### 错误 4：把 hex 色值放在数据中作为颜色字段

```javascript
// ❌ 错误：数据中的 hex 字符串被 Ordinal scale 当作类别 key
// 最终渲染颜色是 G2 默认调色板，图例显示无意义的 '#1e3a5f' 等字符串
const barData = [
  { group: '法律界', value: 85, color: '#1e3a5f' },
  { group: '公司治理专家', value: 78, color: '#2d4a6f' },
];
chart.options({
  type: 'interval',
  data: barData,
  encode: { x: 'group', y: 'value', color: 'color' },
  scale: { color: { type: 'ordinal' } },
});

// ✅ 正确：将 hex 色值放入 scale.color.range，encode.color 指向业务字段
chart.options({
  type: 'interval',
  data: [
    { group: '法律界', value: 85 },
    { group: '公司治理专家', value: 78 },
  ],
  encode: { x: 'group', y: 'value', color: 'group' },
  scale: {
    color: { type: 'ordinal', domain: ['法律界', '公司治理专家'], range: ['#1e3a5f', '#2d4a6f'] },
  },
});
```
