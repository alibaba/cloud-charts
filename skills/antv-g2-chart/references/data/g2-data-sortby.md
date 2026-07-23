---
id: "g2-data-sortby"
title: "G2 SortBy 字段排序"
description: |
  SortBy 数据变换按照指定字段对数据进行排序。
  与 sort 不同，sortBy 通过字段名指定排序，更简洁直观。
  配置在 data.transform 中。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "sortBy"
  - "字段排序"
  - "排序"
  - "数据变换"
  - "data transform"

related:
  - "g2-data-sort"
  - "g2-transform-sortx"

use_cases:
  - "按字段值排序"
  - "多字段组合排序"
  - "升序/降序排列"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/sortBy"
---

## 核心概念

**SortBy 是数据变换（Data Transform），不是标记变换（Mark Transform）**

- 数据变换配置在 `data.transform` 中
- 按字段名指定排序，比 sort 更简洁

**与 sort 的区别：**
- `sort`: 使用 callback 比较函数
- `sortBy`: 通过字段名指定，更简洁

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sortBy',
        fields: ['sold'],  // 按 sold 字段升序排序
      },
    ],
  },
  encode: { x: 'genre', y: 'sold' },
});

chart.render();
```

## 配置项

| 属性   | 描述       | 类型                              | 默认值 |
| ------ | ---------- | --------------------------------- | ------ |
| fields | 排序的字段 | `(string \| [string, boolean])[]` | `[]`   |

## 降序排列

```javascript
chart.options({
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sortBy',
        fields: [['sold', false]],  // false 表示降序
      },
    ],
  },
});
```

## 多字段排序

```javascript
// 先按 name 升序，name 相同时按 age 降序
chart.options({
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sortBy',
        fields: [
          ['name', true],   // name 升序
          ['age', false],   // age 降序
        ],
      },
    ],
  },
});
```

## 与 sort 的对比

```javascript
// 使用 sortBy（推荐，更简洁）
data: {
  transform: [{ type: 'sortBy', fields: ['value'] }],
}

// 使用 sort（更灵活）
data: {
  transform: [{ type: 'sort', callback: (a, b) => a.value - b.value }],
}

// sortBy 降序
data: {
  transform: [{ type: 'sortBy', fields: [['value', false]] }],
}

// sort 降序
data: {
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
}
```

## 常见错误与修正

### 错误 1：sortBy 放在 mark transform 中

```javascript
// ❌ 错误：sortBy 是数据变换，不能放在 mark 的 transform 中
chart.options({
  type: 'interval',
  data,
  transform: [{ type: 'sortBy', fields: ['value'] }],  // ❌ 错误位置
});

// ✅ 正确：sortBy 放在 data.transform 中
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: data,
    transform: [{ type: 'sortBy', fields: ['value'] }],  // ✅ 正确
  },
});
```

### 错误 2：字段名不存在

```javascript
// ❌ 错误：字段名不存在，排序无效
data: {
  transform: [{ type: 'sortBy', fields: ['nonexistent'] }],
}

// ✅ 正确：确保字段名存在
data: {
  transform: [{ type: 'sortBy', fields: ['value'] }],
}
```