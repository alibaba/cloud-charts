---
id: "g2-mark-venn"
title: "G2 Venn Diagram Mark"
description: |
  韦恩图 Mark。使用 path 标记配合 venn 转换，展示集合之间的交集、并集关系。
  适用于用户群体分析、产品功能对比、技能重叠分析等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "韦恩图"
  - "venn"
  - "集合关系"
  - "交集"

related:
  - "g2-mark-chord"
  - "g2-mark-sankey"

use_cases:
  - "用户群体重叠分析"
  - "产品功能对比"
  - "技能重叠分析"

anti_patterns:
  - "集合数量 >4 应使用其他图表"
  - "数值差异过大不适合"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/venn"
---

## 核心概念

韦恩图展示集合之间的交集关系：
- 使用 `path` 标记
- 配合 `venn` 数据转换
- 重叠区域表示交集

**数据格式：**
- `sets`：集合名称数组
- `size`：集合大小
- `label`：显示标签

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'path',
  data: {
    type: 'inline',
    value: [
      { sets: ['微信'], size: 1200, label: '微信' },
      { sets: ['微博'], size: 800, label: '微博' },
      { sets: ['微信', '微博'], size: 300, label: '重叠' },
    ],
    transform: [{ type: 'venn' }],
  },
  encode: {
    d: 'path',
    color: 'key',
  },
  labels: [
    { position: 'inside', text: (d) => d.label || '' },
  ],
  style: {
    opacity: (d) => (d.sets.length > 1 ? 0.3 : 0.7),
  },
});

chart.render();
```

## 常用变体

### 三集合韦恩图

```javascript
chart.options({
  type: 'path',
  data: {
    type: 'inline',
    value: [
      { sets: ['前端'], size: 12, label: '前端' },
      { sets: ['后端'], size: 15, label: '后端' },
      { sets: ['设计'], size: 8, label: '设计' },
      { sets: ['前端', '后端'], size: 5, label: '全栈' },
      { sets: ['前端', '设计'], size: 3 },
      { sets: ['后端', '设计'], size: 2 },
      { sets: ['前端', '后端', '设计'], size: 1 },
    ],
    transform: [{ type: 'venn' }],
  },
  encode: { d: 'path', color: 'key' },
});
```

### 空心韦恩图

```javascript
chart.options({
  type: 'path',
  data: {
    type: 'inline',
    value: [...],
    transform: [{ type: 'venn' }],
  },
  encode: {
    d: 'path',
    color: 'key',
    shape: 'hollow',  // 空心样式
  },
  style: {
    lineWidth: 3,
  },
});
```

### 带交互

```javascript
chart.options({
  type: 'path',
  data: { type: 'inline', value: [...], transform: [{ type: 'venn' }] },
  encode: { d: 'path', color: 'key' },
  state: {
    inactive: { opacity: 0.2 },
    active: { opacity: 0.9 },
  },
  interactions: [{ type: 'elementHighlight' }],
});
```

## 完整类型参考

```typescript
interface VennData {
  sets: string[];    // 集合名称数组
  size: number;      // 集合大小
  label?: string;    // 显示标签
}

interface VennOptions {
  type: 'path';
  data: {
    type: 'inline';
    value: VennData[];
    transform: [{ type: 'venn' }];
  };
  encode: {
    d: 'path';
    color: 'key';
  };
}
```

## 韦恩图 vs 其他图表

| 场景 | 推荐图表 |
|------|----------|
| 集合交集关系 | 韦恩图 |
| 层次结构 | 旭日图 |
| 流向关系 | 桑基图 |

## 常见错误与修正

### 错误 1：缺少 venn 转换

```javascript
// ❌ 问题：没有 venn 转换
data: { type: 'inline', value: [...] }

// ✅ 正确：添加 venn 转换
data: { type: 'inline', value: [...], transform: [{ type: 'venn' }] }
```

### 错误 2：集合数量过多

```javascript
// ⚠️ 注意：集合数量建议不超过 4 个
// 5 个以上集合会导致视觉混乱
```

### 错误 3：encode 配置错误

```javascript
// ❌ 问题：使用 x/y 编码
encode: { x: 'sets', y: 'size' }

// ✅ 正确：使用 d 编码 path
encode: { d: 'path', color: 'key' }
```