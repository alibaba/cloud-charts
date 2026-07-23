---
id: "g2-label-transform-exceed-adjust"
title: "G2 ExceedAdjust 标签变换"
description: |
  标签超出调整变换。当标签超出指定范围时自动调整位置，
  确保标签在可视区域内显示。

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "标签"
  - "label"
  - "超出"
  - "调整"
  - "exceed"

related:
  - "g2-label-transform-overflow-hide"
  - "g2-label-transform-overlap-dodge-y"
  - "g2-comp-label-config"

use_cases:
  - "图表边缘标签调整"
  - "小尺寸元素标签"
  - "需要保持标签完整的场景"

anti_patterns:
  - "标签可以隐藏的场景（改用 overflowHide）"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## 核心概念

ExceedAdjust 标签变换会检测标签是否超出可视区域：
- 如果超出，自动调整标签位置
- 确保标签完整显示

**工作原理：**
1. 计算标签的边界框
2. 检测是否超出图表边界
3. 如果超出，向内调整位置

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'point',
  data: [
    { x: 10, y: 100 },
    { x: 20, y: 150 },
    { x: 30, y: 200 },  // 可能在图表顶部边缘
  ],
  encode: {
    x: 'x',
    y: 'y',
  },
  labels: [
    {
      text: 'y',
      position: 'top',
      transform: [{ type: 'exceedAdjust' }],
    },
  ],
});

chart.render();
```

## 常用变体

### 结合其他变换

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  labels: [
    {
      text: 'y',
      position: 'top',
      transform: [
        { type: 'exceedAdjust' },
        { type: 'overlapDodgeY' },
      ],
    },
  ],
});
```

## 完整类型参考

```typescript
interface ExceedAdjustTransform {
  type: 'exceedAdjust';
  // 无额外配置参数
}
```

## 与其他标签变换的对比

| Transform | 功能 | 处理方式 |
|-----------|------|---------|
| exceedAdjust | 超出调整 | 移动位置 |
| overflowHide | 溢出隐藏 | 隐藏标签 |
| overlapDodgeY | 重叠避让 | Y 方向分开 |

## 常见错误与修正

### 错误 1：transform 格式错误

```javascript
// ❌ 错误：transform 应该是数组
labels: [{ text: 'value', transform: { type: 'exceedAdjust' } }]

// ✅ 正确
labels: [{ text: 'value', transform: [{ type: 'exceedAdjust' }] }]
```

### 错误 2：与其他变换顺序错误

```javascript
// ⚠️ 注意：变换顺序影响结果
// 建议先处理超出，再处理重叠

// ✅ 正确顺序
transform: [
  { type: 'exceedAdjust' },
  { type: 'overlapDodgeY' },
]
```