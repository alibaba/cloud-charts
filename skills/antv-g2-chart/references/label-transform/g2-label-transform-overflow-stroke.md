---
id: "g2-label-transform-overflow-stroke"
title: "G2 OverflowStroke 标签变换"
description: |
  标签溢出描边变换。当标签超出元素边界时自动添加描边，
  增强标签的可读性。

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "标签"
  - "label"
  - "溢出"
  - "描边"
  - "stroke"

related:
  - "g2-label-transform-overflow-hide"
  - "g2-label-transform-contrast-reverse"
  - "g2-comp-label-config"

use_cases:
  - "饼图外部标签"
  - "需要增强可读性的标签"
  - "复杂背景下的标签显示"

anti_patterns:
  - "简单场景不需要描边"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## 核心概念

OverflowStroke 标签变换会检测标签是否超出元素边界：
- 如果超出，为标签添加描边
- 增强标签在复杂背景上的可读性

**工作原理：**
1. 计算元素和标签的边界框
2. 检测标签是否超出元素边界
3. 如果超出，添加描边样式

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
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [{ type: 'overflowStroke' }],
    },
  ],
});

chart.render();
```

## 常用变体

### 结合其他变换

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [
        { type: 'overflowStroke' },
        { type: 'contrastReverse' },
      ],
    },
  ],
});
```

## 完整类型参考

```typescript
interface OverflowStrokeTransform {
  type: 'overflowStroke';
  // 无额外配置参数
}
```

## 与其他标签变换的对比

| Transform | 功能 | 处理方式 |
|-----------|------|---------|
| overflowStroke | 溢出描边 | 添加描边 |
| overflowHide | 溢出隐藏 | 隐藏标签 |
| contrastReverse | 对比度反转 | 改变颜色 |

## 常见错误与修正

### 错误 1：transform 格式错误

```javascript
// ❌ 错误：transform 应该是数组
labels: [{ text: 'value', transform: { type: 'overflowStroke' } }]

// ✅ 正确
labels: [{ text: 'value', transform: [{ type: 'overflowStroke' }] }]
```

### 错误 2：与其他变换顺序错误

```javascript
// ⚠️ 注意：描边应该在颜色调整之后
// 建议顺序：contrastReverse → overflowStroke

// ✅ 正确顺序
transform: [
  { type: 'contrastReverse' },
  { type: 'overflowStroke' },
]
```