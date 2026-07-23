---
id: "g2-interaction-element-point-move"
title: "G2 ElementPointMove 数据点拖拽编辑"
description: |
  elementPointMove 是 G2 v5 的交互，允许用户通过鼠标拖拽图表中的数据点来修改数值。
  支持折线图、柱状图、饼图、面积图等，拖拽后触发 'element-point:moved' 事件回调新数据。
  适用于可视化数据编辑、交互式预算调整、预测值手动修正等场景。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementPointMove"
  - "数据编辑"
  - "拖拽"
  - "可交互"
  - "数据修改"
  - "interaction"

related:
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"
  - "g2-interaction-element-select"

use_cases:
  - "预算分配可视化编辑（拖拽柱体调整数值）"
  - "折线图手动调整预测趋势"
  - "饼图交互式调整各类别占比"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-point-move"
---

## 核心概念

`elementPointMove` 在图表元素上渲染可拖拽的控制点，鼠标按下拖拽时实时更新数据并重绘图表。
拖拽结束后触发 `element-point:moved` 事件，回调参数包含修改后的数据。

支持的 Mark 类型：
- `line`（折线图）：每个数据点均可拖拽
- `area`（面积图）：每个顶点可拖拽
- `interval`（柱状图/条形图/饼图）：柱顶点可拖拽

## 折线图数据点拖拽

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 110 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },
  interaction: {
    elementPointMove: true,   // 启用数据点拖拽
  },
});

// 监听数据变更事件
chart.on('element-point:moved', (event) => {
  const { changeData, data } = event.data;
  console.log('修改后的单条数据:', changeData);
  console.log('完整新数据:', data);
});

chart.render();
```

## 柱状图数据点拖拽

```javascript
chart.options({
  type: 'interval',
  data: budgetData,
  encode: { x: 'department', y: 'budget', color: 'department' },
  interaction: {
    elementPointMove: {
      precision: 0,   // 拖拽提示精度（小数位数），默认 2
    },
  },
});
```

## 配置项

```javascript
chart.options({
  interaction: {
    elementPointMove: {
      precision: 2,             // 实时提示标签的小数位数，默认 2
      selection: [],            // 初始选中的数据点索引 [elementIndex, pointIndex]
      // 控制点样式
      pointR: 6,                // 控制点半径，默认 6
      pointStroke: '#888',      // 控制点描边颜色
      pointActiveStroke: '#f5f5f5',  // 激活时描边颜色
      // 辅助线样式
      pathStroke: '#888',
      pathLineDash: [3, 4],
      // 提示标签样式
      labelFontSize: 12,
      labelFill: '#888',
    },
  },
});
```

## 监听事件

```javascript
// 拖拽结束事件（数据已更新）
chart.on('element-point:moved', ({  { changeData, data } }) => {
  // changeData: 被修改的单条记录 { month: 'Feb', value: 75 }
  // data: 修改后的完整数据数组
  syncToServer(changeData);
});

// 选中控制点事件
chart.on('element-point:select', ({  { selection } }) => {
  // selection: [elementIndex, pointIndex]
  console.log('选中点索引:', selection);
});
```

## 常见错误与修正

### 错误：在 scatter 点图上使用（不支持）
```javascript
// ❌ point mark 不支持 elementPointMove
chart.options({
  type: 'point',
  interaction: { elementPointMove: true },  // 无效
});

// ✅ 支持的类型：line、area、interval
chart.options({
  type: 'line',
  interaction: { elementPointMove: true },  // ✅
});
```
