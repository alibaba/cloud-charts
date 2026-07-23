---
id: "g2-scale-linear"
title: "G2 线性比例尺（linear scale）"
description: |
  G2 v5 线性比例尺用于连续数值字段的映射，通过 scale.y 或 scale.color 配置，
  支持自定义 domain（数据范围）和 range（视觉范围），
  nice/clamp/tickCount 控制轴刻度显示。
library: "g2"
version: "5.x"
category: "scales"
tags:
  - "线性比例尺"
  - "linear"
  - "连续"
  - "数值"
  - "domain"
  - "range"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-mark-line-basic"
  - "g2-comp-annotation"

use_cases:
  - "控制 Y 轴的显示范围（不从 0 开始）"
  - "设置颜色映射为连续色板"
  - "clamp 截断超出范围的数据"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale"
---

## 基本用法（自定义 Y 轴 domain）

折线图默认 y 轴从 0 开始。使用 `scale.y.domain` 指定精确范围，让折线细节更清晰：

> **注意**：`linear` 是数值字段的默认 scale 类型，**不需要手动指定 `type: 'linear'`**。

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',
  data: [
    { month: 'Jan', value: 4200 },
    { month: 'Feb', value: 4500 },
    { month: 'Mar', value: 4100 },
    { month: 'Apr', value: 4800 },
    { month: 'May', value: 5200 },
    { month: 'Jun', value: 4900 },
  ],
  encode: { x: 'month', y: 'value' },
  scale: {
    y: {
      domain: [3800, 5500],   // 显式指定 y 轴范围，不从 0 开始
      nice: true,             // 自动扩展到"好看"的整数刻度
    },
  },
});

chart.render();
```

## 对数比例尺（log scale）

当数据跨越多个数量级时，使用 `type: 'log'` 将 y 轴压缩为对数尺度：

```javascript
chart.options({
  type: 'line',
  data: [
    { year: '2018', revenue: 1200 },
    { year: '2019', revenue: 8500 },
    { year: '2020', revenue: 32000 },
    { year: '2021', revenue: 210000 },
    { year: '2022', revenue: 1500000 },
  ],
  encode: { x: 'year', y: 'revenue' },
  scale: {
    y: {
      type: 'log',      // 对数比例尺，适合跨量级数据
      base: 10,         // 对数底数，默认 10
      nice: true,
    },
  },
});
```

> 注意：log scale 不能包含 0 或负数，否则会导致渲染异常。

## 颜色映射：连续色板（sequential color scale）

将数值字段映射为连续颜色，适合热力图或气泡图着色：

```javascript
chart.options({
  type: 'point',
  data: [
    { x: 10, y: 20, density: 0.1 },
    { x: 30, y: 50, density: 0.5 },
    { x: 60, y: 80, density: 0.9 },
    { x: 45, y: 35, density: 0.3 },
    { x: 75, y: 60, density: 0.7 },
  ],
  encode: { x: 'x', y: 'y', color: 'density', size: 12 },
  scale: {
    color: {
      type: 'linear',
      domain: [0, 1],                           // 数据范围
      range: ['#d0e8ff', '#0050b3'],            // 从浅蓝到深蓝
    },
  },
});
```

## 配置参考

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'linear'` \| `'log'` \| `'pow'` \| `'sqrt'` | `'linear'` | 比例尺类型 |
| `domain` | `[number, number]` | 数据的 min/max | 数据映射范围（输入域） |
| `range` | `[number, number]` \| `string[]` | 取决于通道 | 视觉映射范围（输出域） |
| `nice` | `boolean` | `false` | 自动将 domain 扩展到整数刻度 |
| `clamp` | `boolean` | `false` | 超出 domain 的值截断到边界 |
| `tickCount` | `number` | 自动 | 期望的刻度数量（近似值） |
| `tickInterval` | `number` | 自动 | 相邻刻度的固定间隔 |
| `tickMethod` | `function` | 内置方法 | 自定义刻度生成方法 |
| `base` | `number` | `10` | 仅 `type: 'log'` 时有效，对数底数 |
| `exponent` | `number` | `2` | 仅 `type: 'pow'` 时有效，指数 |
| `zero` | `boolean` | `true` | 是否强制 domain 包含 0 |

```javascript
// 完整配置示例
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    y: {
      // type: 'linear',  // 可省略，数值字段默认就是 linear
      domain: [0, 1000],
      nice: true,
      clamp: true,
      tickCount: 5,
      // tickInterval: 200,  // 与 tickCount 二选一
      zero: false,           // 不强制从 0 开始
    },
  },
});
```

## tickMethod 自定义刻度

`tickMethod` 用于自定义刻度生成，签名是 `(min, max, count) => number[]`：

```javascript
scale: {
  y: {
    tickCount: 5,
    tickMethod: (min, max, count) => {
      // 参数说明：
      // min - 数据最小值
      // max - 数据最大值
      // count - 推荐的刻度数量

      // 自定义刻度生成逻辑
      const step = (max - min) / (count - 1);
      const ticks = [];
      for (let i = 0; i < count; i++) {
        ticks.push(min + i * step);
      }
      return ticks;  // 返回数值数组
    },
  },
}
```

**注意**：如果只需要格式化刻度标签文本，使用 `axis.labelFormatter`：

```javascript
axis: {
  y: {
    labelFormatter: (v) => `${v}万`,  // 格式化标签
  },
}
```

## 常见错误与修正

### 错误：忘记设置 `nice: true` 导致刻度不整齐

```javascript
// ❌ 刻度可能出现 3827、4183 等非整数
chart.options({
  scale: { y: { domain: [3827, 5243] } },
});

// ✅ nice: true 自动扩展为 3800、5400 等整数刻度
chart.options({
  scale: { y: { domain: [3827, 5243], nice: true } },
});
```

### 错误：domain 最小值大于最大值（反转轴）

```javascript
// ❌ domain 反转会导致轴方向翻转（通常不是预期效果）
chart.options({
  scale: { y: { domain: [1000, 0] } },
});

// ✅ 正确：最小值在前，最大值在后
chart.options({
  scale: { y: { domain: [0, 1000] } },
});
```

### 错误：对 0 或负值使用 log scale

```javascript
// ❌ log(0) = -Infinity，图表会出现渲染异常或空白
chart.options({
  data: [{ x: 'A', y: 0 }, { x: 'B', y: 100 }],
  scale: { y: { type: 'log' } },
});

// ✅ 确保所有 y 值 > 0，或对数据做预处理过滤
chart.options({
  data: data.filter(d => d.y > 0),
  scale: { y: { type: 'log', domain: [1, 1000000] } },
});
```

### 错误：tickCount 和 tickInterval 同时设置

```javascript
// ❌ 两者同时设置时 tickInterval 优先，tickCount 被忽略
chart.options({
  scale: { y: { tickCount: 5, tickInterval: 200 } },
});

// ✅ 根据需求二选一
chart.options({
  scale: { y: { tickCount: 5 } },      // 约 5 个刻度
  // 或
  // scale: { y: { tickInterval: 200 } },  // 每隔 200 一个刻度
});
```
