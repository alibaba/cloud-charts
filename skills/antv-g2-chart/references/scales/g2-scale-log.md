---
id: "g2-scale-log"
title: "G2 对数比例尺（log）"
description: |
  对数比例尺将数值映射为对数刻度，适合数据跨越多个数量级（如 1 到 1,000,000）的场景。
  使用 base 参数设置对数底数（默认 10），可以有效展示指数增长或数量级差异悬殊的数据。

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "log"
  - "对数"
  - "比例尺"
  - "数量级"
  - "scale"
  - "指数增长"

related:
  - "g2-scale-linear"
  - "g2-scale-pow"

use_cases:
  - "展示数量级差异悬殊的数据（如 GDP 对比：100 万到 1 万亿）"
  - "病毒传播等指数增长数据"
  - "频率分布的幂律特征"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/log"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 数量级差异悬殊的数据
const data = [
  { country: '卢森堡',     gdp: 135000 },
  { country: '美国',       gdp: 65000 },
  { country: '中国',       gdp: 12000 },
  { country: '巴西',       gdp: 7500 },
  { country: '印度',       gdp: 2100 },
  { country: '埃塞俄比亚', gdp: 900 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'country', y: 'gdp', color: 'country' },
  scale: {
    y: {
      type: 'log',    // 对数比例尺
      base: 10,       // 底数，默认 10
      domain: [100, 200000],
    },
  },
  axis: {
    y: {
      title: '人均 GDP（美元，对数轴）',
      tickCount: 5,
    },
  },
});

chart.render();
```

## 配置项

```javascript
scale: {
  y: {
    type: 'log',
    base: 10,          // 对数底数，常用 2 或 10，默认 10
    domain: [1, 1e6],  // 数值范围（注意：不能包含 0 或负数！）
    nice: true,        // 将刻度扩展到整数幂次
    tickCount: 5,      // 推荐的刻度数量
    tickMethod: (min, max, count, base) => {
      // 自定义刻度生成方法
      // 返回刻度值数组
      return [1, 10, 100, 1000, 10000];
    },
  },
}
```

## 刻度控制：tickMethod vs labelFormatter vs tickFormatter

三者职责完全不同，不能混用：

| 配置项 | 位置 | 签名 | 职责 |
|--------|------|------|------|
| `tickMethod` | `scale.y` 或 `axis.y` | `(min, max, count, base?) => number[]` | 决定**哪些数值**显示刻度 |
| `labelFormatter` | `axis.y` | `(value, index, array) => string` | 决定刻度的**显示文字** ⭐ 最常用 |
| `tickFormatter` | `axis.y` | `(datum, index, array, vector) => DisplayObject` | 自定义刻度线的**图形对象**（极少用） |

### 只格式化刻度标签文字（最常见）

```javascript
// ✅ 只需改显示文字 → 用 axis.labelFormatter，不需要 tickMethod
chart.options({
  scale: { y: { type: 'log', base: 10 } },
  axis: {
    y: {
      labelFormatter: (v) => v >= 1e6 ? `${v/1e6}M` : v >= 1e3 ? `${v/1e3}K` : String(v),
    },
  },
});
```

### 同时自定义刻度位置 + 标签文字

```javascript
// ✅ tickMethod 控制"打哪些刻度"，labelFormatter 控制"显示什么文字"
chart.options({
  scale: {
    y: {
      type: 'log',
      base: 10,
      domain: [0.1, 1000],
      // 签名：(min, max, count, base) => number[]，必须返回数值数组
      tickMethod: (min, max, count, base) => [0.1, 1, 10, 100, 1000],
    },
  },
  axis: {
    y: {
      labelFormatter: (v) => `10^${Math.log10(v)}`,
    },
  },
});
```

## 折线图的对数轴（指数增长数据）

```javascript
chart.options({
  type: 'line',
  data: covidData,
  encode: { x: 'date', y: 'cases', color: 'country' },
  scale: {
    y: { type: 'log', base: 10, nice: true },
  },
  axis: {
    y: {
      title: '累计病例数（对数轴）',
      labelFormatter: (v) => v >= 1e6 ? `${v / 1e6}M` : v >= 1e3 ? `${v / 1e3}K` : String(v),
    },
  },
});
```

## 常见错误与修正

### 错误 1：tickMethod 签名错误，且混淆了刻度位置与标签格式化

`tickMethod` 有两处可配置，**签名不同，职责不同**：

| 位置 | 签名 | 职责 |
|------|------|------|
| `scale.y.tickMethod` | `(min, max, n?, base?) => number[]` | 控制刻度的**数值位置** |
| `axis.y.tickMethod` | `(start, end, tickCount) => number[]` | 同上，也是返回数值数组 |
| `axis.y.labelFormatter` | `(value) => string` | 控制刻度的**显示文字** |

```javascript
// ❌ 三重错误：
// 1. 参数写成了 scale 对象（实际是 min/max/count/base 四个数值）
// 2. 调用了不存在的 scale.ticks() 方法
// 3. 返回了 {value, text} 对象数组（应返回 number[]）
scale: {
  y: {
    type: 'log',
    tickMethod: (scale) => {
      const ticks = scale.ticks();
      return ticks.map(tick => ({ value: tick, text: `log10(${tick}) + 1` }));
    },
  },
}

// ✅ 正确拆分：tickMethod 控制位置，labelFormatter 控制文字
scale: {
  y: {
    type: 'log',
    base: 10,
    domain: [0.1, 1000],
    tickMethod: (min, max, count, base) => [0.1, 1, 10, 100, 1000],  // ✅ 返回 number[]
  },
},
axis: {
  y: {
    labelFormatter: (v) => `${Math.log10(v) + 1}`,  // ✅ 格式化文字
  },
}
```

### 错误 2：数据包含 0 或负数——对数比例尺无法处理
```javascript
// ❌ 对数 log(0) = -∞，数据中有 0 会导致渲染异常
const data = [{ x: 'A', y: 0 }, { x: 'B', y: 100 }];
chart.options({
  scale: { y: { type: 'log' } },  // ❌ y=0 无法在对数轴上显示
});

// ✅ 对数轴要求所有值 > 0，可以过滤掉 0 或加微小偏移
const data = [{ x: 'B', y: 100 }];  // ✅ 过滤掉 0
// 或使用 domain 强制起点 > 0
chart.options({
  scale: { y: { type: 'log', domain: [0.1, 1000] } },
});
```

### 错误 3：对线性数据使用对数轴——视觉失真
```javascript
// ❌ 数据范围是 50~200，没有数量级差异，对数轴没有意义且会误导读者
const data = [/* 50~200 之间的均匀分布 */];
chart.options({ scale: { y: { type: 'log' } } });  // ❌ 不必要

// ✅ 线性数据用默认线性比例尺
chart.options({ scale: { y: { type: 'linear' } } });  // ✅ 或直接省略（默认）
```
