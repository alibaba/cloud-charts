---
id: "g2-label-transform-overflow-hide"
title: "G2 OverflowHide 标签变换"
description: |
  标签溢出隐藏变换。当标签超出其所属元素的边界时自动隐藏，
  避免标签溢出造成的视觉混乱。

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "标签"
  - "label"
  - "溢出"
  - "隐藏"
  - "overflow"

related:
  - "g2-label-transform-overlap-hide"
  - "g2-label-transform-overlap-dodge-y"
  - "g2-comp-label-config"

use_cases:
  - "饼图标签溢出处理"
  - "柱状图数据标签"
  - "小尺寸元素的标签显示"

anti_patterns:
  - "标签必须全部显示的场景"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## 核心概念

OverflowHide 标签变换会检测标签是否超出其所属元素的边界：
- 如果标签在元素边界内，正常显示
- 如果标签超出边界，自动隐藏

**工作原理：**
1. 计算元素的边界框
2. 计算标签的边界框
3. 检测标签是否溢出元素边界
4. 溢出则隐藏标签

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
    { category: 'A', value: 10 },
    { category: 'B', value: 50 },
    { category: 'C', value: 5 },  // 小柱子，标签可能溢出
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [{ type: 'overflowHide' }],
    },
  ],
});

chart.render();
```

## 常用变体

### 饼图标签溢出处理

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  data,
  encode: { y: 'value', color: 'category' },
  labels: [
    {
      text: 'category',
      position: 'inside',
      transform: [{ type: 'overflowHide' }],
    },
  ],
});
```

### 结合其他标签变换

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [
        { type: 'overflowHide' },
        { type: 'overlapHide' },  // 先处理溢出，再处理重叠
      ],
    },
  ],
});
```

## 完整类型参考

```typescript
interface OverflowHideTransform {
  type: 'overflowHide';
  // 无额外配置参数
}
```

## 与其他标签变换的对比

| Transform | 功能 | 适用场景 |
|-----------|------|---------|
| overflowHide | 隐藏溢出标签 | 标签超出元素边界 |
| overlapHide | 隐藏重叠标签 | 标签之间重叠 |
| overlapDodgeY | Y 方向避让 | 标签垂直重叠 |

## 常见错误与修正

### 错误 1：transform 格式错误

```javascript
// ❌ 错误：transform 应该是数组
labels: [{ text: 'value', transform: { type: 'overflowHide' } }]

// ✅ 正确
labels: [{ text: 'value', transform: [{ type: 'overflowHide' }] }]
```

### 错误 2：position 设置不当

```javascript
// ⚠️ 注意：outside 位置的标签通常不会溢出
// overflowHide 主要用于 inside 位置

// 对于 inside 标签
labels: [{
  text: 'value',
  position: 'inside',
  transform: [{ type: 'overflowHide' }]
}]

// 对于 outside 标签，考虑使用 overlapHide
labels: [{
  text: 'value',
  position: 'outside',
  transform: [{ type: 'overlapHide' }]
}]
```

### 错误 3：与其他变换顺序错误

```javascript
// ⚠️ 注意：变换顺序影响结果

// 推荐：先处理溢出，再处理重叠
transform: [
  { type: 'overflowHide' },
  { type: 'overlapHide' },
]
```