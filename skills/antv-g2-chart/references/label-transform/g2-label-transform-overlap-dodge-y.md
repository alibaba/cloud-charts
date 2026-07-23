---
id: "g2-label-transform-overlap-dodge-y"
title: "G2 OverlapDodgeY 标签变换"
description: |
  标签 Y 方向避让变换。当标签在 Y 方向重叠时自动调整位置，
  通过迭代算法避免标签重叠。

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "标签"
  - "label"
  - "重叠"
  - "避让"
  - "dodge"

related:
  - "g2-label-transform-overlap-hide"
  - "g2-label-transform-overflow-hide"
  - "g2-comp-label-config"

use_cases:
  - "密集数据点的标签显示"
  - "时间序列图表的标签避让"
  - "需要显示所有标签的场景"

anti_patterns:
  - "标签过多时可能导致布局混乱"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## 核心概念

OverlapDodgeY 标签变换通过迭代算法在 Y 方向调整标签位置：
- 检测相邻标签是否在 X 方向重叠
- 如果重叠，在 Y 方向分开
- 迭代直到无重叠或达到最大迭代次数

**算法特点：**
- 时间复杂度 O(n log n)
- 支持设置最大迭代次数
- 支持设置标签间距

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',
  data: [
    { date: '2024-01-01', value: 100, label: 'Event A' },
    { date: '2024-01-02', value: 120, label: 'Event B' },
    { date: '2024-01-02', value: 110, label: 'Event C' },  // 同一天，标签可能重叠
  ],
  encode: {
    x: 'date',
    y: 'value',
  },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [{ type: 'overlapDodgeY' }],
    },
  ],
});

chart.render();
```

## 常用变体

### 自定义间距

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [
        {
          type: 'overlapDodgeY',
          padding: 4,  // 标签之间的最小间距（像素）
        },
      ],
    },
  ],
});
```

### 控制迭代次数

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [
        {
          type: 'overlapDodgeY',
          maxIterations: 20,  // 最大迭代次数，默认 10
          maxError: 0.1,      // 最大误差，默认 0.1
        },
      ],
    },
  ],
});
```

### 结合其他变换

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [
        { type: 'overlapDodgeY' },
        { type: 'overflowHide' },  // 先避让，再处理溢出
      ],
    },
  ],
});
```

## 完整类型参考

```typescript
interface OverlapDodgeYTransform {
  type: 'overlapDodgeY';
  padding?: number;         // 标签间距，默认 1
  maxIterations?: number;   // 最大迭代次数，默认 10
  maxError?: number;        // 最大误差，默认 0.1
}
```

## 与其他标签变换的对比

| Transform | 功能 | 优点 | 缺点 |
|-----------|------|------|------|
| overlapDodgeY | Y 方向避让 | 保留所有标签 | 可能改变布局 |
| overlapHide | 隐藏重叠标签 | 布局稳定 | 丢失部分标签 |
| overflowHide | 隐藏溢出标签 | 避免溢出 | 可能丢失标签 |

## 工作原理图解

```
原始状态:
  Label A -------- Label B
      ↑ 重叠 ↑

处理后:
  Label B
      ↑
  Label A --------

  (Y 方向分开)
```

## 常见错误与修正

### 错误 1：transform 格式错误

```javascript
// ❌ 错误：transform 应该是数组
labels: [{ text: 'value', transform: { type: 'overlapDodgeY' } }]

// ✅ 正确
labels: [{ text: 'value', transform: [{ type: 'overlapDodgeY' }] }]
```

### 错误 2：迭代次数设置不当

```javascript
// ⚠️ 注意：迭代次数过多会影响性能
// 标签数量多时，建议减少迭代次数

// 标签较少时
transform: [{ type: 'overlapDodgeY', maxIterations: 20 }]

// 标签较多时
transform: [{ type: 'overlapDodgeY', maxIterations: 5 }]
```

### 错误 3：与其他变换顺序错误

```javascript
// ❌ 错误：先隐藏再避让，效果不佳
transform: [
  { type: 'overlapHide' },
  { type: 'overlapDodgeY' },
]

// ✅ 正确：先避让，再隐藏无法处理的
transform: [
  { type: 'overlapDodgeY' },
  { type: 'overlapHide' },
]
```