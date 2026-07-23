---
id: "g2-label-transform-overlap-hide"
title: "G2 OverlapHide 标签变换"
description: |
  标签重叠隐藏变换。当标签重叠时自动隐藏部分标签，
  避免视觉混乱。支持按优先级决定隐藏顺序。

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "标签"
  - "label"
  - "重叠"
  - "隐藏"
  - "overlap"

related:
  - "g2-label-transform-overlap-dodge-y"
  - "g2-label-transform-overflow-hide"
  - "g2-comp-label-config"

use_cases:
  - "密集数据点的标签显示"
  - "时间序列图表的标签处理"
  - "需要简洁显示的场景"

anti_patterns:
  - "必须显示所有标签的场景（改用 overlapDodgeY）"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## 核心概念

OverlapHide 标签变换通过检测标签重叠来隐藏部分标签：
- 按顺序检测每个标签是否与已显示的标签重叠
- 如果重叠，隐藏当前标签
- 支持设置优先级决定隐藏顺序

**工作原理：**
1. 获取所有标签
2. 按优先级排序（可选）
3. 依次检测每个标签是否与已显示标签重叠
4. 重叠则隐藏，否则显示

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
    { date: '2024-01-01', value: 100 },
    { date: '2024-01-02', value: 120 },
    { date: '2024-01-03', value: 110 },
    { date: '2024-01-04', value: 130 },
  ],
  encode: {
    x: 'date',
    y: 'value',
  },
  labels: [
    {
      text: 'value',
      position: 'top',
      transform: [{ type: 'overlapHide' }],
    },
  ],
});

chart.render();
```

## 常用变体

### 设置优先级

```javascript
chart.options({
  type: 'interval',
  data: [
    { category: 'A', value: 100, priority: 2 },
    { category: 'B', value: 50, priority: 1 },
    { category: 'C', value: 80, priority: 3 },
  ],
  encode: { x: 'category', y: 'value' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [
        {
          type: 'overlapHide',
          priority: (a, b) => a.priority - b.priority,  // 高优先级先显示
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
      text: 'value',
      position: 'top',
      transform: [
        { type: 'overlapDodgeY' },  // 先尝试避让
        { type: 'overlapHide' },    // 无法避让的隐藏
      ],
    },
  ],
});
```

## 完整类型参考

```typescript
interface OverlapHideTransform {
  type: 'overlapHide';
  priority?: (a: any, b: any) => number;  // 优先级比较函数
}
```

## 与其他标签变换的对比

| Transform | 功能 | 优点 | 缺点 |
|-----------|------|------|------|
| overlapHide | 隐藏重叠标签 | 布局稳定 | 丢失部分标签 |
| overlapDodgeY | Y 方向避让 | 保留所有标签 | 可能改变布局 |
| overflowHide | 隐藏溢出标签 | 避免溢出 | 可能丢失标签 |

## 优先级排序示例

```javascript
// 按数值大小排序：大值优先显示
labels: [{
  text: 'value',
  transform: [{
    type: 'overlapHide',
    priority: (a, b) => b.value - a.value
  }]
}]

// 按特定顺序排序
labels: [{
  text: 'value',
  transform: [{
    type: 'overlapHide',
    priority: (a, b) => {
      const order = ['A', 'B', 'C', 'D'];
      return order.indexOf(a.category) - order.indexOf(b.category);
    }
  }]
}]
```

## 常见错误与修正

### 错误 1：transform 格式错误

```javascript
// ❌ 错误：transform 应该是数组
labels: [{ text: 'value', transform: { type: 'overlapHide' } }]

// ✅ 正确
labels: [{ text: 'value', transform: [{ type: 'overlapHide' }] }]
```

### 错误 2：优先级函数返回值错误

```javascript
// ❌ 错误：优先级函数应该返回数字
priority: (a, b) => a.value > b.value

// ✅ 正确：返回正数表示 a 优先，负数表示 b 优先
priority: (a, b) => b.value - a.value
```

### 错误 3：与其他变换顺序错误

```javascript
// ❌ 错误：先隐藏再处理其他问题
transform: [
  { type: 'overlapHide' },
  { type: 'overlapDodgeY' },  // 已经隐藏的标签无法避让
]

// ✅ 正确：先尝试其他解决方案，最后隐藏
transform: [
  { type: 'overlapDodgeY' },
  { type: 'overlapHide' },
]
```