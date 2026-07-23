---
id: "g2-palette-category20"
title: "G2 Category20 调色板"
description: |
  AntV 经典 20 色调色板，用于分类数据的颜色映射。
  包含 20 种颜色，采用饱和度交替的设计，适合更多类别的可视化场景。

library: "g2"
version: "5.x"
category: "palette"
tags:
  - "调色板"
  - "palette"
  - "颜色"
  - "分类"
  - "20色"

related:
  - "g2-palette-category10"
  - "g2-scale-ordinal"
  - "g2-theme-builtin"

use_cases:
  - "超过 10 个类别的颜色映射"
  - "需要更多颜色区分的场景"
  - "复杂分类数据可视化"

anti_patterns:
  - "类别较少时建议使用 Category10"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/palette"
---

## 核心概念

Category20 是 AntV 的扩展分类调色板：
- 包含 20 种颜色
- 采用饱和度交替的设计模式
- 适合 10-20 个类别的场景

**设计特点：**
- 前半部分为饱和色（与 Category10 一致）
- 后半部分为低饱和度色
- 交替使用可增加区分度

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
    // ... 更多类别
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'category',
  },
  scale: {
    color: {
      type: 'ordinal',
      range: 'category20',
    },
  },
});

chart.render();
```

## 常用变体

### 显式指定颜色范围

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        '#5B8FF9', '#CDDDFD',
        '#5AD8A6', '#CDF3E4',
        '#5D7092', '#CED4DE',
        '#F6BD16', '#FCEBB9',
        '#6F5EF9', '#D3CEFD',
        '#6DC8EC', '#D3EEF9',
        '#945FB9', '#DECFEA',
        '#FF9845', '#FFE0C7',
        '#1E9493', '#BBDEDE',
        '#FF99C3', '#FFE0ED',
      ],
    },
  },
});
```

### 结合自定义颜色

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        ...customColors.slice(0, 10),
        '#5B8FF9', '#CDDDFD', // 补充 Category20 的颜色
        // ...
      ],
    },
  },
});
```

## 完整颜色参考

| 索引 | 颜色值 | 饱和度 |
|------|--------|--------|
| 0 | #5B8FF9 | 高 |
| 1 | #CDDDFD | 低 |
| 2 | #5AD8A6 | 高 |
| 3 | #CDF3E4 | 低 |
| 4 | #5D7092 | 高 |
| 5 | #CED4DE | 低 |
| 6 | #F6BD16 | 高 |
| 7 | #FCEBB9 | 低 |
| 8 | #6F5EF9 | 高 |
| 9 | #D3CEFD | 低 |
| 10 | #6DC8EC | 高 |
| 11 | #D3EEF9 | 低 |
| 12 | #945FB9 | 高 |
| 13 | #DECFEA | 低 |
| 14 | #FF9845 | 高 |
| 15 | #FFE0C7 | 低 |
| 16 | #1E9493 | 高 |
| 17 | #BBDEDE | 低 |
| 18 | #FF99C3 | 高 |
| 19 | #FFE0ED | 低 |

## 与 Category10 的对比

| 特性 | Category10 | Category20 |
|------|------------|------------|
| 颜色数量 | 10 | 20 |
| 颜色风格 | 饱和度一致 | 饱和度交替 |
| 适用场景 | ≤10 类别 | 10-20 类别 |
| 默认使用 | 是 | 否 |
| 区分难度 | 较易 | 需注意相邻色 |

## 设计建议

### 类别数量建议

| 类别数量 | 推荐调色板 |
|---------|-----------|
| 1-5 | Category10 |
| 6-10 | Category10 |
| 11-15 | Category20 |
| 16-20 | Category20 |
| >20 | 自定义或分组 |

### 使用技巧

```javascript
// 技巧：利用饱和度交替增加区分度
// 将重要类别放在高饱和度位置（偶数索引）

// 例如：高亮重要类别
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        '#5B8FF9',  // 高饱和 - 类别 A
        '#CDDDFD',  // 低饱和 - 类别 B
        '#5AD8A6',  // 高饱和 - 类别 C（重要）
        // ...
      ],
    },
  },
});
```

## 常见错误与修正

### 错误 1：类别超过 20 个

```javascript
// ⚠️ 注意：超过 20 个类别会循环使用颜色

// ✅ 解决方案 1：自定义更多颜色
scale: {
  color: {
    type: 'ordinal',
    range: [...30colors]
  }
}

// ✅ 解决方案 2：合并小类别
// 将小类别合并为"其他"类别
```

### 错误 2：相邻颜色区分度不够

```javascript
// ⚠️ 注意：相邻的低饱和度颜色可能难以区分

// ✅ 解决方案：调整 domain 顺序
scale: {
  color: {
    type: 'ordinal',
    domain: ['A', 'C', 'E', 'B', 'D'],  // 交替高/低饱和度
    range: 'category20'
  }
}
```