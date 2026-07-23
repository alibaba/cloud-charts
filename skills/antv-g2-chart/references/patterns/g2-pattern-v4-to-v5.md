---
id: "g2-pattern-v4-to-v5"
title: "G2 v4 → v5 迁移指南"
description: |
  G2 v5 相对 v4 有重大 API 变更。
  本文梳理最常见的 v4 写法及对应的 v5 正确写法，
  帮助避免 LLM 生成旧版废弃 API 的最常见错误。

library: "g2"
version: "5.x"
category: "patterns"
tags:
  - "v4"
  - "v5"
  - "迁移"
  - "migration"
  - "废弃API"
  - "升级"

related:
  - "g2-core-chart-init"
  - "g2-core-encode-channel"

use_cases:
  - "将旧 G2 v4 代码迁移到 v5"
  - "识别和修正 LLM 生成的 v4 废弃 API"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-27"
author: "antv-team"
---

## 变更 1：导入方式

```javascript
// ❌ G2 v4 写法
import G2 from '@antv/g2';
const chart = new G2.Chart({ container: 'container' });

// ✅ G2 v5 写法
import { Chart } from '@antv/g2';
const chart = new Chart({ container: 'container' });
```

## 变更 2：数据绑定

```javascript
// ❌ G2 v4：单独调用 .data()
chart.data(data);

// ✅ G2 v5（方式一）：在 mark 上传入
chart.options({ type: 'interval',  data, encode: {...} });

// ✅ G2 v5（方式二）：options 的 data 字段
chart.options({
  type: 'interval',
   data,    // data 作为 options 的一个字段
  encode: { x: 'month', y: 'value' },
});
```

## 变更 3：字段编码 API

```javascript
// ❌ G2 v4：链式 .encode() 方法
chart.interval()
  .encode('x', 'month')
  .encode('y', 'value')
  .encode('color', 'product');

// ✅ G2 v5：encode 作为对象字段
chart.options({
  type: 'interval',
  encode: {
    x: 'month',
    y: 'value',
    color: 'product',
  },
});
```

## 变更 4：数据变换（transform）

```javascript
// ❌ G2 v4：方法名和参数不同
chart.interval().adjust('stack');     // 堆叠
chart.interval().adjust('dodge');     // 分组

// ✅ G2 v5：使用 transform 数组
chart.options({
  type: 'interval',
  transform: [{ type: 'stackY' }],   // 堆叠
  // transform: [{ type: 'dodgeX' }],  // 分组
});
```

## 变更 5：坐标系配置

```javascript
// ❌ G2 v4
chart.coordinate('polar');
chart.coordinate('theta');
chart.coordinate().transpose();

// ✅ G2 v5：通过 coordinate 字段对象配置
chart.options({
  coordinate: { type: 'polar' },
  // coordinate: { type: 'theta' },
  // coordinate: { transform: [{ type: 'transpose' }] },
});
```

## 变更 6：辅助标注（guide → annotation）

```javascript
// ❌ G2 v4：guide API
chart.guide().line({ start: ['min', 50], end: ['max', 50] });
chart.guide().text({ position: ['median', 'median'], content: '中位线' });

// ✅ G2 v5：使用 lineY/lineX mark（在 view + children 中）
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'month', y: 'value' } },
    {
      type: 'lineY',
       [{ threshold: 50 }],
      encode: { y: 'threshold' },
      style: { stroke: 'red', lineDash: [4, 4] },
      labels: [{ text: '目标线', position: 'right' }],
    },
  ],
});
```

## 变更 7：标签配置

```javascript
// ❌ G2 v4：.label() 方法
chart.interval().label('value');
chart.interval().label({ fields: ['value'], formatter: (v) => `${v}万` });

// ✅ G2 v5：labels 数组（注意是复数）
chart.options({
  type: 'interval',
  labels: [
    {
      // 推荐：直接用 text 函数访问完整 datum
      text: (d) => `${d.value}万`,
      // 或：text: 'value'  配合 formatter 格式化
      // formatter: (val) => `${val}万`,  // val 是 text 映射的值，不是 datum
    },
  ],
});
```

## 变更 8：Tooltip 配置

```javascript
// ❌ G2 v4
chart.tooltip({
  showTitle: false,
  itemTpl: '<li>{name}: {value}</li>',
});

// ✅ G2 v5
chart.options({
  tooltip: {
    title: (d) => d.month,
    items: [
      { field: 'value', name: '数值', valueFormatter: (v) => `${v}万` },
    ],
  },
  interaction: [{ type: 'tooltip' }],
});
```

## 变更 9：多 Mark 叠加

```javascript
// ❌ G2 v4：多次调用 chart 方法直接叠加
chart.line().encode('x', 'month').encode('y', 'value');
chart.point().encode('x', 'month').encode('y', 'value');

// ✅ G2 v5：使用 type: 'view' + children
chart.options({
  type: 'view',
  data,
  encode: { x: 'month', y: 'value' },
  children: [
    { type: 'line' },
    { type: 'point' },
  ],
});
```

## 变更 10：动画配置

```javascript
// ❌ G2 v4
chart.animate(true);

// ✅ G2 v5
chart.options({
  animate: {
    enter: { type: 'fadeIn', duration: 300 },
    update: { type: 'morphing', duration: 500 },
  },
});
```

## v4 错误特征快速检查

在审查 LLM 生成的代码时，检查以下常见 v4 错误特征：

- [ ] `import G2 from '@antv/g2'`（应为命名导入）
- [ ] `chart.source(data)` 或 `chart.data(data)`（应在 options 中）
- [ ] `.position('x*y')`（v4 写法）
- [ ] `.adjust('stack')` / `.adjust('dodge')`（应为 transform 数组）
- [ ] `chart.guide().line()`（应为 lineY/lineX mark）
- [ ] `.label()` 方法（应为 `labels` 数组）
- [ ] 多次 `chart.options()` 调用（应用 view + children）