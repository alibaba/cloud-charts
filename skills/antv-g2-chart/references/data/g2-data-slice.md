---
id: "g2-data-slice"
title: "G2 Slice 数据切片"
description: |
  Slice 数据变换对数据进行分片，获得子集。
  类似于 Array.prototype.slice，配置在 data.transform 中。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "slice"
  - "切片"
  - "分页"
  - "数据变换"
  - "data transform"

related:
  - "g2-data-filter"
  - "g2-data-sort"

use_cases:
  - "数据分页展示"
  - "只取前 N 条数据"
  - "截取特定范围的数据"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/slice"
---

## 核心概念

**Slice 是数据变换（Data Transform），不是标记变换（Mark Transform）**

- 数据变换配置在 `data.transform` 中
- 类似于 [Array.prototype.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 120 },
  { month: 'Mar', value: 150 },
  { month: 'Apr', value: 180 },
  { month: 'May', value: 200 },
];

chart.options({
  type: 'line',
   {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'slice',
        start: 0,
        end: 3,  // 只取前 3 条数据
      },
    ],
  },
  encode: { x: 'month', y: 'value' },
});

chart.render();
```

## 配置项

| 属性  | 描述           | 类型     | 默认值           |
| ----- | -------------- | -------- | ---------------- |
| start | 分片的起始索引 | `number` | `0`              |
| end   | 分片的结束索引 | `number` | `arr.length - 1` |

## 取前 N 条数据

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: largeData,
    transform: [
      { type: 'sort', callback: (a, b) => b.value - a.value },  // 先排序
      { type: 'slice', end: 10 },  // 取前 10 条
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## 分页效果

```javascript
// 第 2 页，每页 10 条
const page = 2;
const pageSize = 10;

chart.options({
  data: {
    transform: [
      { type: 'slice', start: (page - 1) * pageSize, end: page * pageSize },
    ],
  },
});
```

## 常见错误与修正

### 错误 1：slice 放在 mark transform 中

```javascript
// ❌ 错误：slice 是数据变换，不能放在 mark 的 transform 中
chart.options({
  type: 'interval',
  data,
  transform: [{ type: 'slice', end: 10 }],  // ❌ 错误位置
});

// ✅ 正确：slice 放在 data.transform 中
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'slice', end: 10 }],  // ✅ 正确
  },
});
```

### 错误 2：索引超出范围

```javascript
// ⚠️ 注意：如果索引超出范围，G2 会自动处理，不会报错
data: {
  transform: [{ type: 'slice', start: 100, end: 200 }],  // 数据只有 50 条
}
// 结果：返回空数组
```