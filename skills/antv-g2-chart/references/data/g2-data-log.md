---
id: "g2-data-log"
title: "G2 Log 数据日志"
description: |
  Log 数据变换将当前数据变换流中的数据打印到控制台，用于调试。
  配置在 data.transform 中，不影响数据流。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "log"
  - "调试"
  - "日志"
  - "数据变换"
  - "data transform"

related:
  - "g2-data-filter"

use_cases:
  - "调试数据处理流程"
  - "检查中间数据状态"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/log"
---

## 核心概念

**Log 是数据变换（Data Transform），不是标记变换（Mark Transform）**

- 数据变换配置在 `data.transform` 中
- 用于调试，将数据打印到控制台
- 不影响数据流，数据会原样传递给下一个 transform

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { a: 1, b: 2, c: 3 },
  { a: 4, b: 5, c: 6 },
  { a: 7, b: 8, c: 9 },
];

chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [
      { type: 'slice', start: 1 },  // 先切片
      { type: 'log' },               // 打印中间结果（调试用）
      { type: 'filter', callback: (d) => d.a < 5 },  // 再过滤
    ],
  },
  encode: { x: 'a', y: 'b' },
});

chart.render();
// 控制台会输出 slice 后的数据
```

## 调试数据处理流程

```javascript
chart.options({
   {
    type: 'fetch',
    value: 'https://example.com/data.json',
    transform: [
      { type: 'filter', callback: (d) => d.value > 100 },
      { type: 'log' },  // 检查过滤后的数据
      { type: 'sort', callback: (a, b) => b.value - a.value },
      { type: 'log' },  // 检查排序后的数据
      { type: 'slice', end: 10 },
    ],
  },
});
```

## 配置项

Log 变换没有配置项，直接使用即可。

```javascript
{ type: 'log' }
```

## 常见错误与修正

### 错误 1：log 放在 mark transform 中

```javascript
// ❌ 错误：log 是数据变换，不能放在 mark 的 transform 中
chart.options({
  type: 'interval',
  data,
  transform: [{ type: 'log' }],  // ❌ 错误位置
});

// ✅ 正确：log 放在 data.transform 中
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'log' }],  // ✅ 正确
  },
});
```

### 注意事项

```javascript
// ⚠️ 注意：生产环境应移除 log 变换，避免不必要的控制台输出
// 开发环境
 {
  transform: [
    { type: 'filter', callback: (d) => d.value > 0 },
    { type: 'log' },  // 调试用
  ],
}

// 生产环境
 {
  transform: [
    { type: 'filter', callback: (d) => d.value > 0 },
    // 移除 log
  ],
}
```