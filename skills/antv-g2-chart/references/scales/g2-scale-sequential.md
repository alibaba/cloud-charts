---
id: "g2-scale-sequential"
title: "G2 顺序比例尺（sequential）"
description: |
  sequential 比例尺将连续数值映射到颜色渐变，
  专为颜色通道设计，常配合 palette（内置色板）或自定义颜色插值函数使用。
  适合热力图、地图着色、连续数值颜色编码场景。
  与 linear 的区别：sequential 专为颜色输出优化，linear 支持任意数值输出。
  ⚠️ 约束：仅当 encode.color 映射的字段为连续类型（数值型）时使用。
  分类字段（字符串/枚举）和间断字段（ordinal/band）禁止使用 sequential，
  否则会产生错误的颜色渐变，应改用 ordinal 比例尺。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "sequential"
  - "顺序比例尺"
  - "颜色渐变"
  - "连续颜色"
  - "palette"
  - "scale"

related:
  - "g2-scale-linear"
  - "g2-scale-quantile-quantize"
  - "g2-scale-threshold"
  - "g2-mark-cell-heatmap"

use_cases:
  - "热力图颜色渐变（低值→高值）"
  - "地图按数值着色（choropleth）"
  - "散点图气泡颜色按数值渐变"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/sequential"
---

## ⚠️ 使用约束

**sequential 仅适用于 `encode.color` 字段为连续类型（数值型）的场景。**

| 字段类型 | 示例 | 是否可用 sequential |
|--------|------|------------------|
| 连续数值（quantitative） | `temp_max`、`sales`、`score` | ✅ 允许 |
| 分类（categorical / ordinal） | `city`、`category`、`name` | ❌ 禁止，用 `ordinal` |
| 间断（band / point） | 离散的坐标轴字段 | ❌ 禁止，用 `ordinal` |

分类或间断字段使用 sequential 会导致所有数据映射到渐变色的两端，颜色区分度极差。

## 最小可运行示例（热力图）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'cell',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/seattle-weather.json',
  },
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  transform: [{ type: 'group', color: 'max' }],
  scale: {
    color: {
      type: 'sequential',
      palette: 'gnBu',   // 内置色板：从浅蓝到深蓝
    },
  },
  style: { inset: 0.5 },
});

chart.render();
```

## 合法 palette 完整列表

G2 的 `palette` 值通过 d3-scale-chromatic 查找，**只有以下名称合法**（大小写不敏感），不在此列表中的名称（如 `'blueOrange'`、`'redGreen'`、`'heatmap'`）会导致运行时报错 `Unknown palette`。

### 单色系顺序渐变（适合 sequential — 正值数据）

| palette 名称 | 效果 |
|------------|------|
| `'blues'` | 白→蓝 |
| `'greens'` | 白→绿 |
| `'reds'` | 白→红 |
| `'oranges'` | 白→橙 |
| `'purples'` | 白→紫 |
| `'greys'` | 白→灰 |
| `'orRd'` | 橙→红 |
| `'buGn'` | 蓝→绿 |
| `'buPu'` | 蓝→紫 |
| `'gnBu'` | 绿→蓝 |
| `'puBu'` | 紫→蓝 |
| `'puBuGn'` | 紫→蓝→绿 |
| `'puRd'` | 紫→红 |
| `'rdPu'` | 红→紫 |
| `'ylGn'` | 黄→绿 |
| `'ylGnBu'` | 黄→绿→蓝（sequential 默认值） |
| `'ylOrBr'` | 黄→橙→棕 |
| `'ylOrRd'` | 黄→橙→红 |

### 多色感知均匀渐变（适合 sequential — 推荐色盲友好）

| palette 名称 | 效果 |
|------------|------|
| `'viridis'` | 紫→蓝→绿→黄（感知均匀，色盲友好） |
| `'plasma'` | 蓝紫→橙黄 |
| `'magma'` | 黑→紫→橙→白 |
| `'inferno'` | 黑→紫→红→黄 |
| `'cividis'` | 蓝→黄（对所有色盲类型友好） |
| `'turbo'` | 蓝→绿→黄→红（彩虹改进版） |
| `'rainbow'` | 彩虹（不建议，感知不均匀） |
| `'sinebow'` | 平滑彩虹 |
| `'warm'` | 暖色（橙→红→紫） |
| `'cool'` | 冷色（青→蓝→紫） |
| `'cubehelixDefault'` | 螺旋渐变（黑→白） |

### 发散色阶（适合 diverging — 正负值对比）

| palette 名称 | 效果 |
|------------|------|
| `'rdBu'` | 红→白→蓝（最常用） |
| `'rdYlBu'` | 红→黄→蓝 |
| `'rdYlGn'` | 红→黄→绿（涨跌热力图） |
| `'rdGy'` | 红→白→灰 |
| `'pRGn'` | 紫→白→绿 |
| `'piYG'` | 粉红→白→黄绿 |
| `'puOr'` | 紫→白→橙 |
| `'brBG'` | 棕→白→蓝绿 |
| `'spectral'` | 红→橙→黄→绿→蓝（多色发散） |

```javascript
// ✅ 合法示例
scale: { color: { type: 'sequential', palette: 'blues' } }
scale: { color: { type: 'sequential', palette: 'viridis' } }
scale: { color: { type: 'sequential', palette: 'ylOrRd' } }
scale: { color: { type: 'diverging',  palette: 'rdBu' } }
scale: { color: { type: 'diverging',  palette: 'rdYlGn' } }

// ❌ 非法示例（不存在，会报 Unknown palette 错误）
scale: { color: { type: 'sequential', palette: 'blueOrange' } }  // ❌ 不存在
scale: { color: { type: 'sequential', palette: 'redGreen' } }    // ❌ 不存在
scale: { color: { type: 'sequential', palette: 'heatmap' } }     // ❌ 不存在
scale: { color: { type: 'sequential', palette: 'rainbow2' } }    // ❌ 不存在
scale: { color: { type: 'sequential', palette: 'blue-orange' } } // ❌ 不存在
```

## 自定义颜色范围

```javascript
// 使用 range 指定首尾颜色（两端插值）
chart.options({
  scale: {
    color: {
      type: 'sequential',
      range: ['#ebedf0', '#196127'],  // 从浅灰到深绿（GitHub 贡献图风格）
    },
  },
});

// 使用 domain 控制映射范围
chart.options({
  scale: {
    color: {
      type: 'sequential',
      palette: 'blues',
      domain: [0, 100],   // 明确指定数值范围
    },
  },
});
```

## sequential vs 其他颜色比例尺

```javascript
// sequential：连续颜色渐变（连续数值 → 连续颜色）
scale: { color: { type: 'sequential', palette: 'blues' } }

// quantile：自动分位数分组（连续数值 → 离散颜色，等频分组）
scale: { color: { type: 'quantile', range: ['#eee', '#aaa', '#666', '#000'] } }

// quantize：等距分段（连续数值 → 离散颜色，等距分组）
scale: { color: { type: 'quantize', domain: [0, 100], range: ['#fee', '#f99', '#f00'] } }

// threshold：手动断点分级（连续数值 → 离散颜色，自定义断点）
scale: { color: { type: 'threshold', domain: [25, 75], range: ['#0f0', '#ff0', '#f00'] } }
```

## 常见错误与修正

### 错误：使用不存在的 palette 名称

G2 的 palette 值来自 d3-scale-chromatic，不存在的名称会在运行时抛出 `Error: Unknown palette: XxxXxx`，图表无法渲染。

```javascript
// ❌ 这些名称看起来合理，但 G2 中不存在
scale: { color: { type: 'sequential', palette: 'blueOrange' } }   // ❌ → Error: Unknown palette
scale: { color: { type: 'sequential', palette: 'blueGreen' } }    // ❌ → 应用 'buGn' 或 'gnBu'
scale: { color: { type: 'sequential', palette: 'redBlue' } }      // ❌ → 应用 'rdBu'（发散）
scale: { color: { type: 'diverging',  palette: 'greenRed' } }     // ❌ → 应用 'rdYlGn'（注意顺序）
scale: { color: { type: 'sequential', palette: 'hot' } }          // ❌ → 不存在，用 'ylOrRd' 代替
scale: { color: { type: 'sequential', palette: 'jet' } }          // ❌ → 不存在，用 'turbo' 代替
scale: { color: { type: 'sequential', palette: 'coolwarm' } }     // ❌ → 应用 'rdBu'（发散）

// ✅ 不确定时，从下列可信名称选择
// 单色顺序：'blues' | 'greens' | 'reds' | 'oranges' | 'purples' | 'ylOrRd' | 'ylGnBu'
// 感知均匀：'viridis' | 'plasma' | 'magma' | 'inferno' | 'cividis' | 'turbo'
// 发散：    'rdBu' | 'rdYlGn' | 'rdYlBu' | 'pRGn' | 'brBG' | 'spectral'
```

### 错误：sequential 用于分类数据
```javascript
// ❌ sequential 只适合连续数值，分类数据应用 ordinal
chart.options({
  encode: { color: 'city' },   // city 是分类字段
  scale: { color: { type: 'sequential' } },  // ❌ 会产生奇怪的渐变
});

// ✅ 分类数据用 ordinal
chart.options({
  encode: { color: 'city' },
  scale: { color: { type: 'ordinal', range: ['#5B8FF9', '#61DDAA', '#FFD666'] } },  // ✅
});
```

### 错误：未使用 transform 导致数据聚合异常

在使用 `cell` 类型图表时，若原始数据包含多个相同 `(x, y)` 坐标的记录，必须使用 `transform` 对其进行聚合，否则可能导致颜色映射不准确甚至图表渲染失败。

```javascript
// ❌ 未聚合相同坐标的 temp_max 值
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  scale: { color: { type: 'sequential', palette: 'gnBu' } },
});

// ✅ 使用 group transform 聚合相同坐标的数据
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  transform: [{ type: 'group', color: 'max' }],  // 对每个格子取 temp_max 的最大值
  scale: { color: { type: 'sequential', palette: 'gnBu' } },
});
```
```