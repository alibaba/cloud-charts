---
id: "g2-interaction-slider-wheel"
title: "G2 SliderWheel 滚轮缩放交互"
description: |
  sliderWheel 是 G2 v5 的交互，通过鼠标滚轮（或触控板双指滚动）对图表的 slider 组件进行缩放操作。
  鼠标滚轮向上缩小时间窗口（放大），向下扩大时间窗口（缩小），
  缩放以鼠标位置为中心。需配合 slider 组件和 sliderFilter 交互使用。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "sliderWheel"
  - "滚轮缩放"
  - "wheel"
  - "zoom"
  - "缩放"
  - "interaction"
  - "slider"

related:
  - "g2-interaction-slider-filter"
  - "g2-comp-slider"
  - "g2-mark-line-basic"

use_cases:
  - "时序图表用滚轮快速缩放时间范围"
  - "替代手动拖拽 slider 的快速缩放操作"
  - "触控板双指捏合缩放图表时间轴"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/slider-wheel"
---

## 核心概念

`sliderWheel` 监听图表容器的 `wheel` 事件，将滚轮 delta 转换为 slider 值域的缩放变化。
- 滚轮向上（delta < 0）：缩小窗口（放大数据）
- 滚轮向下（delta > 0）：扩大窗口（缩小数据）
- 缩放以鼠标位置为中心，保持鼠标下的数据点不动

## 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: { values: [0, 0.3] },   // 初始显示前 30%
  },
  interaction: {
    sliderFilter: true,    // 必须先启用 sliderFilter
    sliderWheel: true,     // 再启用 sliderWheel
  },
});

chart.render();
```

## 配置项

```javascript
chart.options({
  interaction: {
    sliderWheel: {
      x: true,               // X 轴 slider 响应滚轮，默认 true
      y: true,               // Y 轴 slider 响应滚轮，默认 true
      // x: 'shift',         // 仅在按住 Shift 时响应
      // y: 'ctrl',          // 仅在按住 Ctrl 时响应
      wheelSensitivity: 0.05,  // 滚轮灵敏度，默认 0.05
      minRange: 0.01,          // 最小缩放范围（防止过度放大），默认 0.01
    },
  },
});
```

## 修饰键控制（避免与页面滚动冲突）

```javascript
// 按住 Ctrl 时才缩放图表（避免与页面滚动冲突）
chart.options({
  interaction: {
    sliderWheel: {
      x: 'ctrl',    // 仅 Ctrl+滚轮 触发 X 轴缩放
      y: false,     // Y 轴不响应滚轮
    },
  },
});
```

## 常见错误与修正

### 错误：忘记同时启用 sliderFilter
```javascript
// ❌ 只有 sliderWheel 没有 sliderFilter，滚轮滚动无效果
chart.options({
  slider: { x: true },
  interaction: {
    sliderWheel: true,   // ❌ 缺少 sliderFilter
  },
});

// ✅ 必须配合 sliderFilter
chart.options({
  slider: { x: true },
  interaction: {
    sliderFilter: true,   // ✅ 先启用过滤
    sliderWheel: true,    // ✅ 再启用滚轮缩放
  },
});
```

### 错误：没有 slider 组件但启用了 sliderWheel
```javascript
// ❌ 没有 slider 组件时 sliderWheel 不起作用
chart.options({
  // 没有 slider 配置
  interaction: { sliderWheel: true },  // 无效
});

// ✅ 必须有 slider 组件
chart.options({
  slider: { x: { values: [0, 0.5] } },
  interaction: {
    sliderFilter: true,
    sliderWheel: true,
  },
});
```
