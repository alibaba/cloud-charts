---
id: "g2-mark-gauge"
title: "G2 仪表盘（gauge）"
description: |
  G2 v5 内置 gauge Mark，通过 type: 'gauge' 创建仪表盘，
  数据包含 target（当前值）和 total（最大值），
  支持分段配色（thresholds）、中心文字和自定义样式。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "仪表盘"
  - "gauge"
  - "表盘"
  - "KPI"
  - "进度"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-mark-arc-pie"

use_cases:
  - "展示 KPI 完成率/达成度"
  - "实时监控指标（如 CPU 使用率）"
  - "进度展示（分数、评级）"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/gauge"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 400,
  height: 300,
});

chart.options({
  type: 'gauge',
  data: {
    value: {
      target: 120,   // 当前值
      total: 400,    // 满分/最大值
      name: '评分',  // 中心标签
    },
  },
  legend: false,
});

chart.render();
```

## 分段配色仪表盘（阈值配色）

```javascript
chart.options({
  type: 'gauge',
  data: {
    value: {
      target: 159,
      total: 280,
      name: '速度',
      // thresholds：按百分比分段（0-1），每段用不同颜色
      thresholds: [100, 200, 280],   // 对应数值分段
    },
  },
  scale: {
    color: {
      // 对应每段的颜色
      range: ['#F4664A', '#FAAD14', '#30BF78'],
    },
  },
  style: {
    // 中心文字
    textContent: (target, total) =>
      `进度\n${((target / total) * 100).toFixed(0)}%`,
  },
  legend: false,
});
```

## 完整配置说明

```javascript
chart.options({
  type: 'gauge',
  data: {
    value: {
      target: 75,       // 当前值（必填）
      total: 100,       // 最大值（必填）
      name: 'score',    // 标签名称（可选）
      thresholds: [40, 70, 100],  // 分段阈值（可选）
    },
  },

  // 颜色比例尺（配合 thresholds 使用）
  scale: {
    color: {
      range: ['#F4664A', '#FAAD14', '#30BF78'],
    },
  },

  // 仪表盘样式
  style: {
    // 弧线端点形状：'round'（圆弧端）| 'butt'（直角端）
    arcShape: 'round',
    arcLineWidth: 1,
    arcStroke: '#fff',

    // 中心文字：签名固定为 (target, total)，无第三个 datum 参数
    textContent: (target, total) => `${target}/${total}`,
    textX: '50%',
    textY: '70%',
    textFontSize: 24,
    textFill: '#262626',

    // 指针（false 表示隐藏）
    pointerShape: false,
    pinShape: false,
  },

  legend: false,
});
```

## 自定义起止角度

```javascript
chart.options({
  type: 'gauge',
  data: { value: { target: 60, total: 100, name: '完成率' } },
  // gauge 内部使用 radial 坐标，可通过 coordinate 调整角度
  coordinate: {
    type: 'radial',
    innerRadius: 0.8,
    startAngle: (-10 / 12) * Math.PI,   // 约 -150°
    endAngle: (2 / 12) * Math.PI,        // 约 30°
  },
  legend: false,
});
```

## 多指标仪表盘组合

```javascript
// 用 facetRect 或 spaceFlex 并排多个仪表盘
chart.options({
  type: 'spaceFlex',
  children: [
    {
      type: 'gauge',
      data: { value: { target: 75, total: 100, name: 'CPU' } },
      legend: false,
    },
    {
      type: 'gauge',
      data: { value: { target: 60, total: 100, name: '内存' } },
      legend: false,
    },
    {
      type: 'gauge',
      data: { value: { target: 45, total: 100, name: '磁盘' } },
      legend: false,
    },
  ],
});
```

## 常见错误与修正

### 错误 0：textContent 函数签名错误——误传第三个 datum 参数

`textContent` 的签名是 `(target, total) => string`，G2 内部**只传两个数值**，不存在第三个参数。

```javascript
// ❌ 错误：datum 是 undefined，访问 datum.unit 会抛出 TypeError
style: {
  textContent: (target, total, datum) => `${target}${datum.unit}\n${datum.name}`,
  //                            ^^^^^ 始终是 undefined！
}

// ✅ 正确：用闭包捕获 data 中的额外字段
const gaugeData = {
  target: 48,
  total: 60,
  name: '响应时长',
  unit: 'min',
  thresholds: [15, 30, 45, 60],
};

chart.options({
  type: 'gauge',
  data: { value: gaugeData },
  style: {
    // 通过闭包引用外部变量
    textContent: (target, total) => `${target}${gaugeData.unit}\n${gaugeData.name}`,
  },
});
```

### 错误 1：数据格式不正确

```javascript
// ❌ 错误：gauge 数据需要嵌套在 value 对象内
chart.options({
  type: 'gauge',
  data: { target: 75, total: 100 },   // ❌ 顶层对象
});

// ✅ 正确：需要 { value: { target, total } } 结构
chart.options({
  type: 'gauge',
  data: {
    value: { target: 75, total: 100 },   // ✅
  },
});
```

### 错误 2：thresholds 与 color range 数量不匹配

```javascript
// ❌ 错误：3 个 thresholds 对应 3 段，但只给了 2 个颜色
chart.options({
  type: 'gauge',
  data: { value: { target: 60, total: 100, thresholds: [40, 70, 100] } },
  scale: {
    color: { range: ['#F4664A', '#30BF78'] },   // ❌ 应该有 3 个颜色
  },
});

// ✅ 正确：颜色数量 = 阈值段数（thresholds.length 段）
chart.options({
  scale: {
    color: { range: ['#F4664A', '#FAAD14', '#30BF78'] },   // ✅ 3 段 3 色
  },
});
```
