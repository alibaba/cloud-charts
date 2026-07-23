---
id: "g2-mark-gantt"
title: "G2 Gantt Chart Mark"
description: |
  甘特图 Mark。使用 interval 标记配合 transpose 坐标系，展示项目任务的时间安排。
  适用于项目管理、任务调度、进度跟踪等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "甘特图"
  - "gantt"
  - "项目管理"
  - "进度"

related:
  - "g2-mark-interval-basic"
  - "g2-comp-slider"

use_cases:
  - "项目进度管理"
  - "任务调度"
  - "资源管理"

anti_patterns:
  - "非时间维度数据不适合"
  - "连续数值变化应使用折线图"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/gantt"
---

## 核心概念

甘特图展示项目任务的时间安排：
- 使用 `interval` 标记
- 配合 `transpose` 坐标变换
- `y` 和 `y1` 表示开始和结束时间

**关键要素：**
- 任务名称：映射到横轴
- 开始时间：映射到 `y`
- 结束时间：映射到 `y1`

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'interval',
  autoFit: true,
  data: [
    { name: '活动策划', startTime: 1, endTime: 4 },
    { name: '场地规划', startTime: 3, endTime: 13 },
    { name: '选择供应商', startTime: 5, endTime: 8 },
  ],
  encode: {
    x: 'name',
    y: 'startTime',
    y1: 'endTime',
    color: 'name',
  },
  coordinate: {
    transform: [{ type: 'transpose' }],
  },
});

chart.render();
```

## 常用变体

### 带项目阶段

```javascript
chart.options({
  type: 'interval',
  data: [
    { name: '需求分析', startTime: 1, endTime: 5, phase: '规划' },
    { name: '系统设计', startTime: 4, endTime: 10, phase: '设计' },
    { name: '前端开发', startTime: 8, endTime: 20, phase: '开发' },
  ],
  encode: {
    x: 'name',
    y: 'startTime',
    y1: 'endTime',
    color: 'phase',  // 按阶段着色
  },
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

### 带时序动画

```javascript
chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'name',
    y: 'startTime',
    y1: 'endTime',
    color: 'name',
    enterDuration: (d) => (d.endTime - d.startTime) * 200,
    enterDelay: (d) => d.startTime * 100,
  },
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

### 带里程碑

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
      data: tasks,
      encode: { x: 'name', y: 'startTime', y1: 'endTime' },
      coordinate: { transform: [{ type: 'transpose' }] },
    },
    {
      type: 'point',
      data: milestones,
      encode: {
        x: 'name',
        y: 'time',
        shape: 'diamond',
        size: 8,
      },
      coordinate: { transform: [{ type: 'transpose' }] },
    },
  ],
});
```

## 完整类型参考

```typescript
interface GanttData {
  name: string;        // 任务名称
  startTime: number;   // 开始时间
  endTime: number;     // 结束时间
  phase?: string;      // 项目阶段
}

interface GanttOptions {
  type: 'interval';
  encode: {
    x: string;         // 任务名称字段
    y: string;         // 开始时间字段
    y1: string;        // 结束时间字段
    color?: string;    // 颜色字段
  };
  coordinate: {
    transform: [{ type: 'transpose' }];
  };
}
```

## 甘特图 vs 柱状图

| 特性 | 甘特图 | 柱状图 |
|------|--------|--------|
| 用途 | 任务时间安排 | 数值对比 |
| 数据维度 | 时间区间 | 单一数值 |
| 视觉形式 | 水平条形 | 垂直柱形 |

## 常见错误与修正

### 错误 1：缺少 transpose

```javascript
// ❌ 问题：默认是垂直方向
coordinate: {}

// ✅ 正确：添加 transpose
coordinate: { transform: [{ type: 'transpose' }] }
```

### 错误 2：缺少 y1 编码

```javascript
// ❌ 问题：只有开始时间
encode: { x: 'name', y: 'startTime' }

// ✅ 正确：添加结束时间
encode: { x: 'name', y: 'startTime', y1: 'endTime' }
```

### 错误 3：任务过多

```javascript
// ⚠️ 注意：任务数量建议不超过 20 个
// 过多任务会导致图表拥挤
```