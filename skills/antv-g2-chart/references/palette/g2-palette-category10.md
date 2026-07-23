---
id: "g2-palette-category10"
title: "G2 Category10 调色板"
description: |
  AntV 经典 10 色调色板，用于分类数据的颜色映射。
  包含 10 种精心设计的颜色，适合大多数分类可视化场景。

library: "g2"
version: "5.x"
category: "palette"
tags:
  - "调色板"
  - "palette"
  - "颜色"
  - "分类"
  - "10色"

related:
  - "g2-palette-category20"
  - "g2-scale-ordinal"
  - "g2-theme-builtin"

use_cases:
  - "分类数据的默认颜色"
  - "柱状图、折线图的颜色映射"
  - "需要 10 种以内颜色的场景"

anti_patterns:
  - "超过 10 个类别时应考虑 Category20 或自定义调色板"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/palette"
---

## 核心概念

Category10 是 AntV 的默认分类调色板：
- 包含 10 种颜色
- 颜色经过精心设计，易于区分
- 适合大多数分类可视化场景

**颜色列表：**
```
#5B8FF9  - 蓝色
#5AD8A6  - 绿色
#5D7092  - 灰蓝色
#F6BD16  - 黄色
#6F5EF9  - 紫色
#6DC8EC  - 青色
#945FB9  - 深紫色
#FF9845  - 橙色
#1E9493  - 深青色
#FF99C3  - 粉色
```

## 最小可运行示例

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
    { category: 'A', value: 100 },
    { category: 'B', value: 150 },
    { category: 'C', value: 80 },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'category',
  },
  // Category10 是默认调色板，无需显式指定
});

chart.render();
```

## 常用变体

### 显式指定调色板

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: 'category10',  // 显式指定
    },
  },
});
```

### 自定义颜色范围

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#6F5EF9',
      ],
    },
  },
});
```

### 使用 Theme 配置

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  theme: {
    defaultCategory10: 'category10',
  },
});
```

## 完整颜色参考

| 索引 | 颜色值 | 颜色名 |
|------|--------|--------|
| 0 | #5B8FF9 | 蓝色 |
| 1 | #5AD8A6 | 绿色 |
| 2 | #5D7092 | 灰蓝色 |
| 3 | #F6BD16 | 黄色 |
| 4 | #6F5EF9 | 紫色 |
| 5 | #6DC8EC | 青色 |
| 6 | #945FB9 | 深紫色 |
| 7 | #FF9845 | 橙色 |
| 8 | #1E9493 | 深青色 |
| 9 | #FF99C3 | 粉色 |

## 与 Category20 的对比

| 特性 | Category10 | Category20 |
|------|------------|------------|
| 颜色数量 | 10 | 20 |
| 颜色风格 | 饱和度一致 | 饱和度交替 |
| 适用场景 | ≤10 类别 | 10-20 类别 |
| 默认使用 | 是 | 否 |

## 常见错误与修正

### 错误 1：类别超过 10 个

```javascript
// ⚠️ 注意：超过 10 个类别会循环使用颜色
// 类别 11 会使用与类别 1 相同的颜色

// ✅ 解决方案 1：使用 Category20
scale: {
  color: { type: 'ordinal', range: 'category20' }
}

// ✅ 解决方案 2：自定义更多颜色
scale: {
  color: {
    type: 'ordinal',
    range: [...customColors]
  }
}
```

### 错误 2：颜色值格式错误

```javascript
// ❌ 错误：颜色值格式不正确
range: ['rgb(91, 143, 249)', ...]

// ✅ 正确：使用标准 HEX 格式
range: ['#5B8FF9', ...]
```