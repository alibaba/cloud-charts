---
id: "g2-comp-title"
title: "G2 图表标题配置（title）"
description: |
  G2 v5 通过顶层 title 字段为图表添加标题和副标题。
  支持自定义标题文本、字体样式、对齐方式和与绘图区的间距。
  title 字段可在 Chart 构造函数或 options 中配置。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "title"
  - "图表标题"
  - "subtitle"
  - "副标题"
  - "标题样式"

related:
  - "g2-core-chart-init"
  - "g2-comp-axis-config"
  - "g2-comp-legend-config"

use_cases:
  - "为图表添加主标题和副标题"
  - "自定义标题字体、颜色和大小"
  - "控制标题对齐方式（左对齐/居中/右对齐）"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/title"
---

## 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
  title: {
    title: '月度销售额',        // 主标题
    subtitle: '单位：万元',     // 副标题
  },
});

chart.render();
```

## 完整配置项

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
  title: {
    // ── 文本内容 ────────────────────────────
    title: '月度销售趋势分析',        // 主标题文本
    subtitle: '数据来源：2024年度报告',  // 副标题文本（可选）

    // ── 对齐 ─────────────────────────────────
    align: 'left',    // 'left'（默认）| 'center' | 'right'

    // ── 间距 ─────────────────────────────────
    spacing: 4,       // 主标题与副标题之间的间距，默认 2

    // ── 主标题样式 ────────────────────────────
    titleFontSize: 16,
    titleFontWeight: 'bold',
    titleFill: '#1d1d1d',
    titleSpacing: 8,     // 标题与图表内容区域之间的间距

    // ── 副标题样式 ────────────────────────────
    subtitleFontSize: 12,
    subtitleFill: '#8c8c8c',
    subtitleFontWeight: 'normal',
  },
});
```

## 居中标题

```javascript
chart.options({
  title: {
    title: '季度对比报告',
    subtitle: 'Q1-Q4 各季度销售数据',
    align: 'center',          // 居中对齐
    titleFontSize: 18,
    titleFontWeight: 600,
    subtitleFontSize: 13,
    subtitleFill: '#999',
  },
});
```

## 在构造函数中配置

```javascript
// title 也可以在 Chart 构造函数的选项中配置
const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
  title: {
    title: '销售趋势',
    align: 'center',
  },
});
```

## 常见错误与修正

### 错误：title 写成字符串而不是对象
```javascript
// ❌ 错误：title 字段必须是配置对象，不能直接写字符串
chart.options({
  title: '月度销售额',   // ❌ 不支持字符串
});

// ✅ 正确：title 字段是对象，主标题文本在 title.title 中
chart.options({
  title: {
    title: '月度销售额',   // ✅ 正确写法
  },
});
```

### 错误：把图表标题与坐标轴标题混淆
```javascript
// ❌ 错误：在 axis 里写整体图表标题
chart.options({
  axis: { x: { title: '月度销售额' } },  // ❌ 这是 X 轴标题，不是图表标题
});

// ✅ 图表标题用顶层 title 字段
chart.options({
  title: { title: '月度销售额' },     // ✅ 图表标题
  axis: { x: { title: '月份' } },     // ✅ X 轴标题
});
```
