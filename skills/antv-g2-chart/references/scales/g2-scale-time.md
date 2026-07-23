---
id: "g2-scale-time"
title: "G2 Time 时间比例尺"
description: |
  Time 比例尺将时间数据（Date 对象或时间戳）映射到连续坐标轴，
  自动处理时间刻度间隔、格式化和排序。当 encode.x 映射 Date 类型数据时自动启用。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "time"
  - "时间比例尺"
  - "时间轴"
  - "Date"
  - "时间序列"
  - "scale"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-comp-axis-config"
  - "g2-scale-linear"

use_cases:
  - "绘制时间序列折线图、面积图"
  - "控制时间轴的刻度粒度和标签格式"
  - "设置时间轴的显示范围"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/time"
---

## 自动识别（推荐）

当数据字段为 `Date` 对象时，G2 自动使用 Time Scale，无需显式配置：

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'line',
  data: [
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 130 },
    { date: new Date('2024-03-01'), value: 110 },
    { date: new Date('2024-04-01'), value: 160 },
    { date: new Date('2024-05-01'), value: 145 },
  ],
  encode: { x: 'date', y: 'value' },   // Date 对象自动用 Time Scale
});

chart.render();
```

## 显式配置 Time Scale

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  scale: {
    x: {
      type: 'time',               // 显式指定（字符串日期时需要）
      domain: [                   // 限制显示范围
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      ],
      nice: true,                  // 将域扩展到整洁的时间边界
    },
  },
});
```

## 格式化时间轴标签

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  axis: {
    x: {
      // 使用 dayjs 格式字符串
      labelFormatter: 'YYYY-MM',           // 年-月：2024-01
      // labelFormatter: 'MM/DD',          // 月/日：01/15
      // labelFormatter: 'YYYY年MM月',     // 中文格式
      // labelFormatter: (d) => `Q${Math.ceil((d.getMonth()+1)/3)}`,  // 自定义
      tickCount: 6,
    },
  },
});
```

## 字符串日期（推荐转为 Date 对象）

G2 v5 对 `YYYY-MM-DD` 格式的字符串有一定自动识别能力，但行为依赖内部推断，**不稳定**。
推荐在数据预处理阶段统一转为 `Date` 对象，避免歧义：

```javascript
// ✅ 推荐：预处理时转为 Date 对象
const rawData = [
  { date: '2024-01-01', value: 100 },
  { date: '2024-02-01', value: 130 },
];
const data = rawData.map(d => ({ ...d, date: new Date(d.date) }));

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  // 无需 scale.x.type，G2 自动识别 Date 对象为 Time Scale
});
```

**不要**在字符串日期上显式写 `scale: { x: { type: 'time' } }`，这是多余的配置，
且在某些场景（如 fold 后数据类型变化）会引发渲染异常。

## 常见错误与修正

### 错误 1：显式声明 type: 'time'（不必要且有风险）
```javascript
// ❌ 不推荐：在字符串日期上显式写 type: 'time'
chart.options({
  type: 'line',
  data: [{ date: '2024-01-01', value: 100 }],
  encode: { x: 'date', y: 'value' },
  scale: { x: { type: 'time' } },   // ❌ 多余，可能引发异常
});

// ✅ 正确：转为 Date 对象，让 G2 自动处理
const data = rawData.map(d => ({ ...d, date: new Date(d.date) }));
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
});
```

### 错误 2：数据乱序导致折线错乱
```javascript
// ❌ 错误：数据顺序混乱，折线会连错
const data = [
  { date: new Date('2024-03-01'), value: 110 },
  { date: new Date('2024-01-01'), value: 100 },  // 时间倒序
];

// ✅ 正确：按时间排序后再传入
const data = rawData
  .map(d => ({ ...d, date: new Date(d.date) }))
  .sort((a, b) => a.date - b.date);
```
