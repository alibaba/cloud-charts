---
id: "g2-transform-pack"
title: "G2 Pack Transform"
description: |
  打包布局 Transform，将多个图形元素均匀排列避免重叠。
  常用于 Treemap、气泡图等需要自动布局的场景。

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "打包"
  - "pack"
  - "布局"
  - "防重叠"
  - "网格"

related:
  - "g2-mark-pack"
  - "g2-mark-treemap"

use_cases:
  - "多个图形元素的自动排列"
  - "小多图网格布局"
  - "避免图形重叠"

anti_patterns:
  - "单个图形不需要打包"
  - "已有明确位置信息的数据"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## 核心概念

Pack Transform 通过变换（translate + scale）将多个图形元素均匀排列，避免重叠。它会自动计算每个元素的位置和缩放比例。

**工作原理：**
1. 计算每个元素的边界框
2. 根据容器尺寸计算网格布局
3. 对每个元素应用 translate 和 scale 变换

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'pack',
   {
    nodes: [
      { name: 'A', value: 100 },
      { name: 'B', value: 80 },
      { name: 'C', value: 60 },
    ],
  },
  encode: {
    value: 'value',
    color: 'value',
  },
});

chart.render();
```

## 常用变体

### 作为 Transform 使用

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'pack',
      padding: 5,        // 元素间距
      direction: 'col',  // 排列方向: 'col' | 'row'
    },
  ],
});
```

### 自定义间距

```javascript
chart.options({
  type: 'pack',
  data,
  encode: { value: 'value', color: 'value' },
  transform: [
    {
      type: 'pack',
      padding: 10,  // 元素之间的间距
    },
  ],
});
```

### 按行排列

```javascript
chart.options({
  type: 'pack',
  data,
  encode: { value: 'value', color: 'value' },
  transform: [
    {
      type: 'pack',
      direction: 'row',  // 按行排列
    },
  ],
});
```

## 完整类型参考

```typescript
interface PackTransform {
  type: 'pack';
  padding?: number;       // 元素间距，默认 0
  direction?: 'col' | 'row';  // 排列方向，默认 'col'
}
```

## 与 Pack Mark 的关系

Pack Mark 内部使用 Pack Transform 进行布局：
- **Pack Mark**：用于创建圆形打包图（Circle Packing）
- **Pack Transform**：用于任意图形元素的网格排列

## 常见错误与修正

### 错误 1：padding 值过大

```javascript
// ❌ 错误：padding 过大会导致元素被过度压缩
transform: [{ type: 'pack', padding: 50 }]

// ✅ 正确：合理的 padding 值
transform: [{ type: 'pack', padding: 5 }]
```

### 错误 2：direction 参数错误

```javascript
// ❌ 错误
transform: [{ type: 'pack', direction: 'horizontal' }]

// ✅ 正确
transform: [{ type: 'pack', direction: 'row' }]
```