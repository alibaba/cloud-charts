---
id: "g2-coord-transpose"
title: "G2 转置坐标系（将柱状图转为条形图）"
description: |
  通过 coordinate: { transform: [{ type: 'transpose' }] } 将直角坐标系的 x/y 轴对调，
  最常见的用途是将竖向柱状图转换为水平条形图，
  适合分类名称较长或类别较多的场景。

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "transpose"
  - "转置"
  - "条形图"
  - "horizontal"
  - "水平"
  - "coordinate"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-grouped"
  - "g2-mark-interval-stacked"

use_cases:
  - "分类名称较长时，水平条形图标签更清晰"
  - "类别数量较多（> 8 个）时水平排列更美观"
  - "排名图（横向从大到小排列）"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/transpose"
---

## 最小可运行示例（柱状图转条形图）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { city: '北京',   gdp: 3.6 },
    { city: '上海',   gdp: 4.3 },
    { city: '广州',   gdp: 2.8 },
    { city: '深圳',   gdp: 3.2 },
    { city: '杭州',   gdp: 1.8 },
  ],
  encode: {
    x: 'city',   // 转置后，city 在 y 轴（垂直方向）
    y: 'gdp',    // 转置后，gdp 在 x 轴（水平方向）
  },
  coordinate: { transform: [{ type: 'transpose' }] },   // 关键：转置坐标系
});

chart.render();
```

## 排名条形图（排序 + 转置）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'city', y: 'gdp', color: 'city' },
  transform: [
    { type: 'sortX', by: 'y', reverse: true },   // 先按值降序排列
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    x: { title: 'GDP（万亿元）' },
    y: { title: null },
  },
  labels: [
    {
      text: (d) => d.gdp.toFixed(1),
      position: 'outside',
      style: { fontSize: 12 },
    },
  ],
});
```

## 水平堆叠条形图

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## 横向区间图（甘特图风格）

```javascript
chart.options({
  type: 'interval',
  autoFit: true,
  data: [
    { stage: 'Phase 1', task: '原型', start: 1, end: 3 },
    { stage: 'Phase 1', task: '验证', start: 3, end: 5 },
    { stage: 'Phase 2', task: '开发', start: 4, end: 10 },
    { stage: 'Phase 2', task: '单元测试', start: 8, end: 11 },
    { stage: 'Phase 3', task: '集成', start: 10, end: 13 },
    { stage: 'Phase 3', task: '压测', start: 12, end: 15 }
  ],
  encode: {
    x: (d) => `${d.stage} - ${d.task}`,  // 组合标签字段
    y: 'start',                          // 起始时间映射到 y 轴
    y1: 'end',                           // 结束时间映射到 y1 通道
    color: 'stage'                       // 阶段映射到颜色
  },
  coordinate: { transform: [{ type: 'transpose' }] },  // 转置坐标系
  axis: {
    x: {
      title: '阶段与任务',
      labelTransform: 'rotate(30)'       // 标签倾斜防止重叠
    },
    y: { title: '时间（周）' }            // 时间轴标题
  }
});

chart.render();
```

## 常见错误与修正

### 错误：转置后轴标题配置未调整
```javascript
// ❌ 注意：转置后，原 x 配置作用于竖轴，原 y 配置作用于横轴
// 如果需要水平轴显示数值单位，应配置 axis.x（而非 axis.y）
chart.options({
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    y: { title: 'GDP（万亿）' },   // ❌ 转置后 y 轴是分类轴，不是数值轴
  },
});

// ✅ 正确：转置后的"水平轴"对应配置中的 axis.x
chart.options({
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    x: { title: 'GDP（万亿）' },   // ✅ 数值轴
    y: { title: null },             // ✅ 分类轴（分类名已经在左侧，无需标题）
  },
});
```

### 错误：横向区间图标签处理不当
```javascript
// ❌ 错误示例：使用 labelFormatter 处理组合标签易出错
chart.options({
  encode: {
    x: 'task',
    y: 'start',
    y1: 'end'
  },
  axis: {
    x: {
      labelFormatter: (task, item) => {
        const datum = item.data;
        return `${datum.stage}\n${task}`;
      }
    }
  }
});

// ✅ 正确做法：在数据预处理阶段构造组合字段
chart.options({
  encode: {
    x: (d) => `${d.stage} - ${d.task}`,  // 使用函数构造组合标签
    y: 'start',
    y1: 'end'
  },
  axis: {
    x: {
      title: '阶段与任务',
      labelTransform: 'rotate(30)'        // 适当旋转标签避免重叠
    }
  }
});
```