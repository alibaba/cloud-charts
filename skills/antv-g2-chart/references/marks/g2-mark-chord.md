---
id: "g2-mark-chord"
title: "G2 和弦图（Chord Mark）"
description: |
  使用 Chord Mark 创建和弦图。和弦图用于展示节点之间的流向关系，
  常见于贸易流向、迁移数据、资金流动等场景。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "和弦图"
  - "Chord"
  - "关系图"
  - "流向图"
  - "矩阵可视化"

related:
  - "g2-mark-sankey"
  - "g2-mark-link"
  - "g2-coord-polar"

use_cases:
  - "展示国家/地区间的贸易流向"
  - "可视化人口迁移数据"
  - "分析资金流动关系"
  - "展示部门间的协作关系"

anti_patterns:
  - "节点过多（>20个）时可视化效果差"
  - "不适合展示单向简单关系（改用 Sankey）"
  - "不适合展示层级结构数据"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/relationship/chord"
---

## 核心概念

Chord Mark 是 G2 v5 中用于绘制和弦图的复合标记：
- **节点（Node）**：圆弧上的多边形，表示实体
- **连线（Link）**：连接节点的带状区域，表示流向关系
- **布局**：自动计算节点位置和连线形状

**关键配置：**
- `encode.source`：边的起始节点字段
- `encode.target`：边的目标节点字段
- `encode.value`：边的权重字段
- `layout`：布局配置（节点宽度、间距等）

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

// 和弦图数据：节点 + 边
const data = {
  nodes: [
    { key: 'A', name: '产品A' },
    { key: 'B', name: '产品B' },
    { key: 'C', name: '产品C' },
  ],
  links: [
    { source: 'A', target: 'B', value: 100 },
    { source: 'B', target: 'C', value: 80 },
    { source: 'C', target: 'A', value: 60 },
  ],
};

chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
  },
});

chart.render();
```

## 常用变体

### 带节点标签

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
    nodeKey: 'key',  // 节点标识字段
  },
  nodeLabels: [
    { text: 'name', position: 'outside', fontSize: 12 },
  ],
});
```

### 自定义布局

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
  },
  layout: {
    nodeWidthRatio: 0.05,    // 节点宽度比例 (0, 1)
    nodePaddingRatio: 0.1,   // 节点间距比例 [0, 1)
    sortBy: 'weight',        // 排序方式: 'id' | 'weight' | 'frequency' | null
  },
});
```

### 自定义样式

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
    nodeColor: 'key',        // 节点颜色映射
    linkColor: 'source',     // 连线颜色映射
  },
  style: {
    node: {
      opacity: 1,
      lineWidth: 1,
    },
    link: {
      opacity: 0.5,
      lineWidth: 1,
    },
  },
});
```

### 带 Tooltip

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
  },
  tooltip: {
    node: {
      title: '',
      items: [(d) => ({ name: d.key, value: d.value })],
    },
    link: {
      title: '',
      items: [(d) => ({ name: `${d.source} → ${d.target}`, value: d.value })],
    },
  },
});
```

## Spec 完整结构速查

```javascript
chart.options({
  type: 'chord',
  data: {
    // 数据（nodes + links 结构）
    value: {
      nodes: [...],
      links: [...],
    },
  },
  // 通道映射
  encode: {
    source: 'source',        // 边的起始节点
    target: 'target',        // 边的目标节点
    value: 'value',          // 边的权重
    nodeKey: 'key',          // 节点标识字段
    nodeColor: 'key',        // 节点颜色
    linkColor: 'source',     // 连线颜色
  },

  // 布局配置
  layout: {
    nodeWidthRatio: 0.05,
    nodePaddingRatio: 0.1,
    sortBy: null,            // 'id' | 'weight' | 'frequency' | function
  },

  // 样式
  style: {
    node: { opacity: 1, lineWidth: 1 },
    link: { opacity: 0.5, lineWidth: 1 },
    label: { fontSize: 10 },
  },

  // 标签
  nodeLabels: [{ text: 'name', position: 'outside' }],
  linkLabels: [],

  // Tooltip
  tooltip: { ... },

  // 动画
  animate: {
    node: { enter: { type: 'fadeIn' } },
    link: { enter: { type: 'fadeIn' } },
  },
});
```

## 完整类型参考

```typescript
interface ChordSpec {
  type: 'chord';
  data: {
    value: {
      nodes: Array<{ key: string; [key: string]: any }>;
      links: Array<{ source: string; target: string; value: number; [key: string]: any }>;
    };
  }
  encode?: {
    source?: string;
    target?: string;
    value?: string;
    nodeKey?: string;
    nodeColor?: string;
    linkColor?: string;
  };
  layout?: {
    nodeWidthRatio?: number;   // (0, 1), default: 0.05
    nodePaddingRatio?: number; // [0, 1), default: 0.1
    sortBy?: 'id' | 'weight' | 'frequency' | ((data: any) => any) | null;
  };
  style?: {
    node?: { opacity?: number; lineWidth?: number; fill?: string };
    link?: { opacity?: number; lineWidth?: number; fill?: string };
    label?: { fontSize?: number; fill?: string };
  };
  nodeLabels?: LabelOption[];
  linkLabels?: LabelOption[];
  tooltip?: TooltipOption;
  animate?: AnimateOption;
}
```

## 常见错误与修正

### 错误 1：数据格式不正确

```javascript
// ❌ 错误：使用扁平数组
chart.options({
  type: 'chord',
  data: [
    { source: 'A', target: 'B', value: 100 },
  ],
});

// ✅ 正确：使用 nodes + links 结构
chart.options({
  type: 'chord',
  data: {
    value: {
      nodes: [{ key: 'A' }, { key: 'B' }],
      links: [{ source: 'A', target: 'B', value: 100 }],
    }
  },
  encode: { source: 'source', target: 'target', value: 'value' },
});
```

### 错误 2：节点 key 不匹配

```javascript
// ❌ 错误：links 中的 source/target 与 nodes 的 key 不匹配
const data = {
  nodes: [{ key: 'ProductA' }],
  links: [{ source: 'A', target: 'B', value: 100 }],  // 'A' ≠ 'ProductA'
};

// ✅ 正确：确保 key 一致
const data = {
  nodes: [{ key: 'A' }, { key: 'B' }],
  links: [{ source: 'A', target: 'B', value: 100 }],
};
```

### 错误 3：缺少 value 编码

```javascript
// ❌ 错误：没有指定权重字段
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: { source: 'source', target: 'target' },
});

// ✅ 正确：指定 value 字段
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: { source: 'source', target: 'target', value: 'value' },
});
```