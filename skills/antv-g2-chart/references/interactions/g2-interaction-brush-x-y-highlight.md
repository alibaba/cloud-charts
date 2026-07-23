---
id: "g2-interaction-brush-x-highlight"
title: "G2 BrushXHighlight / BrushYHighlight 单轴框选高亮"
description: |
  brushXHighlight 和 brushYHighlight 是 G2 v5 的交互，
  限制框选范围在 X 轴方向（或 Y 轴方向），高亮选中区域内的图元，非选中区域半透明淡出。
  适用于时间序列对比、趋势局部聚焦等场景。
  若需要过滤数据而非高亮，请使用 brushXFilter / brushYFilter。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brushXHighlight"
  - "brushYHighlight"
  - "框选高亮"
  - "X轴框选"
  - "Y轴框选"
  - "interaction"
  - "highlight"

related:
  - "g2-interaction-brush"
  - "g2-interaction-brush-filter"
  - "g2-interaction-brush-xy"

use_cases:
  - "时间轴上圈选某段时间段，高亮对应数据点"
  - "横向对比图表中选取某几个分类高亮"
  - "散点图中按 Y 轴范围高亮异常值区域"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-x-highlight"
---

## 核心概念

- `brushXHighlight`：仅在 X 轴方向框选，选中元素高亮，其余淡出
- `brushYHighlight`：仅在 Y 轴方向框选，选中元素高亮，其余淡出
- 高亮效果不过滤数据，所有数据仍然可见（与 `brushXFilter` 区别）

## BrushXHighlight 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  interaction: {
    brushXHighlight: true,   // 启用 X 轴框选高亮
  },
});

chart.render();
```

## BrushYHighlight 基本用法

```javascript
chart.options({
  type: 'point',
  data: scatterData,
  encode: { x: 'x', y: 'y', color: 'category' },
  interaction: {
    brushYHighlight: true,   // 启用 Y 轴框选高亮
  },
});
```

## 配置项

```javascript
chart.options({
  interaction: {
    brushXHighlight: {
      series: true,      // 高亮同系列所有点（折线图中选中一点则整条线高亮），默认 true
      state: {
        // 自定义高亮/非高亮状态样式
        selected: {
          lineWidth: 2,
          opacity: 1,
        },
        unselected: {
          opacity: 0.2,
        },
      },
    },
  },
});
```

## X/Y 同时框选（自由框选）

```javascript
// 如需自由框选（同时限制 X 和 Y），使用 brushHighlight
chart.options({
  interaction: {
    brushHighlight: true,    // 自由矩形框选高亮
  },
});
```

## 常见错误与修正

### 错误：把高亮和过滤混淆
```javascript
// ❌ 以为 brushXHighlight 会过滤掉非选中数据
// brushXHighlight 只改变透明度，数据仍然全部显示

// ✅ 如果需要过滤数据（非选中区域从图表中移除），使用：
chart.options({
  interaction: { brushXFilter: true },   // 过滤模式，非选中数据消失
});

// ✅ 如果只需要高亮不过滤，使用：
chart.options({
  interaction: { brushXHighlight: true },   // 高亮模式，非选中数据淡出
});
```
