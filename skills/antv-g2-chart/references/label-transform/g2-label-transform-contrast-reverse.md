---
id: "g2-label-transform-contrast-reverse"
title: "G2 ContrastReverse 标签变换"
description: |
  标签对比度反转变换。根据背景颜色自动调整标签颜色，
  确保标签在深色背景上显示浅色，在浅色背景上显示深色。

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "标签"
  - "label"
  - "对比度"
  - "颜色"
  - "contrast"

related:
  - "g2-label-transform-overflow-hide"
  - "g2-comp-label-config"

use_cases:
  - "柱状图内部标签"
  - "饼图标签"
  - "需要根据背景调整颜色的标签"

anti_patterns:
  - "固定颜色标签不需要此变换"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## 核心概念

ContrastReverse 标签变换会根据元素的颜色自动调整标签颜色：
- 深色背景 → 浅色标签
- 浅色背景 → 深色标签

**工作原理：**
1. 获取元素的填充颜色
2. 计算颜色的亮度
3. 根据亮度选择对比色

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
      transform: [{ type: 'contrastReverse' }],
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
        { type: 'contrastReverse' },
        { type: 'overflowHide' },
      ],
    },
  ],
});
```

### 自定义对比色

```javascript
// 注意：contrastReverse 通常使用默认的黑白对比
// 如需自定义，可以在 style 中设置
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      style: {
        fill: '#fff',  // 固定白色
        stroke: '#000',  // 描边增加对比度
        lineWidth: 1,
      },
    },
  ],
});
```

## 完整类型参考

```typescript
interface ContrastReverseTransform {
  type: 'contrastReverse';
  // 无额外配置参数
}
```

## 与固定颜色的对比

| 方式 | 优点 | 缺点 |
|------|------|------|
| contrastReverse | 自动适应 | 可能不符合设计风格 |
| 固定颜色 | 风格统一 | 可能对比度不足 |
| 描边 | 增加对比度 | 可能影响清晰度 |

## 常见错误与修正

### 错误 1：transform 格式错误

```javascript
// ❌ 错误：transform 应该是数组
labels: [{ text: 'value', transform: { type: 'contrastReverse' } }]

// ✅ 正确
labels: [{ text: 'value', transform: [{ type: 'contrastReverse' }] }]
```

### 错误 2：position 设置不当

```javascript
// ⚠️ 注意：contrastReverse 主要用于 inside 位置
// outside 位置的标签不在元素上，无法获取背景色

// ✅ 正确：用于 inside 标签
labels: [{
  text: 'value',
  position: 'inside',
  transform: [{ type: 'contrastReverse' }]
}]
```