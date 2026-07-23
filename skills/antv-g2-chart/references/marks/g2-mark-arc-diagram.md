---
id: "g2-mark-arc-diagram"
title: "G2 Arc Diagram Mark"
description: |
  弧长连接图 Mark。使用 line 和 point 组合展示节点之间的链接关系。
  适用于关系网络分析、社交网络、知识图谱等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "弧长连接图"
  - "arc diagram"
  - "关系图"
  - "网络"

related:
  - "g2-mark-chord"
  - "g2-mark-sankey"

use_cases:
  - "关系网络分析"
  - "社交网络"
  - "知识图谱"

anti_patterns:
  - "层次结构应使用树图"
  - "节点过多不适合"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/arc-diagram"
---

## 核心概念

弧长连接图展示节点之间的链接关系：
- 节点沿线性轴或环形排列
- 用弧线表示节点之间的连接
- 支持线性布局和环形布局

**关键特点：**
- 一维布局方式
- 清晰呈现环和桥结构
- 节点排序影响视觉效果

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

// 数据预处理：计算弧线坐标
const processData = (nodes, links) => {
  const arcData = [];
  const nodePositions = {};

  nodes.forEach((node, i) => {
    nodePositions[node.id] = i * 15 + 50;
  });

  links.forEach((link) => {
    const sourceX = nodePositions[link.source];
    const targetX = nodePositions[link.target];
    const distance = Math.abs(targetX - sourceX);
    const arcHeight = Math.min(150, distance * 0.1);

    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      const x = sourceX + (targetX - sourceX) * t;
      const y = 600 - arcHeight * Math.sin(Math.PI * t);
      arcData.push({ x, y, linkId: `${link.source}-${link.target}` });
    }
  });

  return { arcData, nodePositions, nodes };
};

chart.options({
  type: 'view',
   data: { type: 'fetch', value: 'relationship.json' },
  // ... 数据处理和渲染
});

chart.render();
```

## 常用变体

### 环形布局

```javascript
chart.options({
  type: 'view',
  coordinate: { type: 'polar' },  // 极坐标系
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'x', y: 'y', series: 'linkId' },
    },
    {
      type: 'point',
      encode: { x: 'angle', y: 'radius', color: 'group' },
    },
  ],
});
```

### 带节点标签

```javascript
chart.options({
  type: 'view',
  children: [
    { type: 'line', data: arcData, encode: { x: 'x', y: 'y', series: 'linkId' } },
    { type: 'point', data: nodeData, encode: { x: 'x', y: 'y', color: 'group' } },
    { type: 'text',  nodeData, encode: { x: 'x', y: 'y', text: 'name' } },
  ],
});
```

### 带交互高亮

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
      data: arcData,
      encode: { x: 'x', y: 'y', series: 'linkId' },
      style: { strokeOpacity: 0.4 },
      state: {
        active: { strokeOpacity: 1, lineWidth: 2 },
      },
    },
  ],
  interactions: [{ type: 'elementHighlight' }],
});
```

## 完整类型参考

```typescript
interface ArcDiagramData {
  nodes: Array<{ id: string; label: string; group?: string }>;
  links: Array<{ source: string; target: string; value?: number }>;
}

// 弧长连接图由多个图层组成：
// 1. line - 弧线连接
// 2. point - 节点
// 3. text - 标签（可选）
```

## 弧长连接图 vs 和弦图

| 特性 | 弧长连接图 | 和弦图 |
|------|------------|--------|
| 节点布局 | 线性/环形 | 环形 |
| 连线方式 | 弧线重叠 | 平铺不重叠 |
| 适用场景 | 关系展示 | 流向展示 |

## 常见错误与修正

### 错误 1：节点未排序

```javascript
// ⚠️ 注意：节点排序影响视觉效果
// 建议按社区或度数排序
```

### 错误 2：连线过多

```javascript
// ⚠️ 注意：连线过多会导致视觉混乱
// 建议过滤或聚合部分连线
```

### 错误 3：缺少数据预处理

```javascript
// ❌ 问题：直接使用原始数据
 { nodes: [...], links: [...] }

// ✅ 正确：预处理计算坐标
data: { transform: [{ type: 'custom', callback: processData }] }
```