---
id: "g2-theme-custom"
title: "G2 自定义主题创建（register + create）"
description: |
  G2 v5 支持通过 register('theme.xxx', themeConfig) 注册自定义主题。
  自定义主题可以覆盖配色、字体、各 Mark 的默认样式等。
  也可以用 theme 字段传入对象，局部覆盖当前主题的特定属性。
  内置主题包括 classic、classicDark、academy（详见 g2-theme-builtin）。

library: "g2"
version: "5.x"
category: "themes"
tags:
  - "theme"
  - "自定义主题"
  - "register"
  - "主题注册"
  - "colors10"
  - "colors20"
  - "配色方案"

related:
  - "g2-theme-builtin"
  - "g2-core-chart-init"

use_cases:
  - "企业品牌定制化图表主题"
  - "统一多图表的配色风格"
  - "局部覆盖某几项默认样式"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/theme"
---

## 方式一：局部覆盖主题（theme 对象）

最简单的方式是在 options 的 theme 字段中直接传对象，覆盖部分属性：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  theme: {
    // 覆盖分类色板
    colors10: [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#F97316', '#06B6D4', '#84CC16',
      '#EC4899', '#6B7280',
    ],
    // 覆盖默认颜色
    defaultColor: '#3B82F6',
  },
});

chart.render();
```

## 方式二：注册全局自定义主题

```javascript
import { Chart, register } from '@antv/g2';

// 注册自定义主题（基于 classic 主题扩展）
register('theme.brand', {
  // 基础颜色
  defaultColor: '#e63946',
  defaultStrokeColor: '#1d1d1d',

  // 分类色板（10色 / 20色）
  colors10: [
    '#e63946', '#457b9d', '#1d3557', '#a8dadc',
    '#f1faee', '#e9c46a', '#f4a261', '#e76f51',
    '#264653', '#2a9d8f',
  ],
  colors20: [
    '#e63946', '#457b9d', '#1d3557', '#a8dadc',
    '#f1faee', '#e9c46a', '#f4a261', '#e76f51',
    '#264653', '#2a9d8f',
    // 后 10 种（渐变或变体）
    '#ff6b6b', '#74b9ff', '#55efc4', '#ffeaa7',
    '#dfe6e9', '#fab1a0', '#fd79a8', '#6c5ce7',
    '#00b894', '#00cec9',
  ],
});

// 使用自定义主题
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  theme: 'brand',   // 使用注册的自定义主题名
});

chart.render();
```

## 主题配置项速查

```javascript
// 以下是可覆盖的主要配置项
const themeConfig = {
  // ── 基础颜色 ─────────────────────────────
  defaultColor: '#1890ff',        // 默认颜色（单系列时）
  defaultStrokeColor: '#ffffff',  // 默认描边颜色

  // ── 色板 ──────────────────────────────────
  colors10: [...],   // 10 色分类色板
  colors20: [...],   // 20 色分类色板

  // ── 背景 ──────────────────────────────────
  background: '#ffffff',    // 图表背景色

  // ── 字体 ──────────────────────────────────
  fontFamily: 'sans-serif',  // 全局字体

  // ── 动画默认时长 ───────────────────────────
  enter: { duration: 300 },
  update: { duration: 300 },
  exit: { duration: 300 },
};
```

## 深色主题（基于 classicDark 局部覆盖）

```javascript
// 在 classicDark 基础上修改
const chart = new Chart({
  container: 'container',
  theme: 'classicDark',
});

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'type' },
  // 局部覆盖：修改配色但保留深色背景
  theme: {
    colors10: ['#60a5fa', '#34d399', '#f87171', '#a78bfa',
               '#fbbf24', '#22d3ee', '#f472b6', '#4ade80',
               '#fb923c', '#e879f9'],
  },
});
```

## 常见错误与修正

### 错误：register 主题名忘加 'theme.' 前缀
```javascript
// ❌ 错误：注册时必须用 'theme.xxx' 格式
register('brandTheme', { colors10: [...] });    // ❌
chart.options({ theme: 'brandTheme' });          // 不生效

// ✅ 正确：必须加 'theme.' 前缀
register('theme.brandTheme', { colors10: [...] });  // ✅
chart.options({ theme: 'brandTheme' });              // ✅ 使用时不带前缀
```

### 错误：theme 和 style 混用
```javascript
// ❌ 错误：主题配色和单个 mark 的样式混淆
chart.options({
  type: 'interval',
  style: { colors10: [...] },  // ❌ colors10 不在 style 里
});

// ✅ 颜色主题在 theme 字段
chart.options({
  type: 'interval',
  theme: { colors10: [...] },  // ✅
  style: { fillOpacity: 0.8 }, // ✅ 单 mark 样式在 style 里
});
```
