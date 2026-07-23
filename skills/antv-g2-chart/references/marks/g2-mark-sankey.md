---
id: "g2-mark-sankey"
title: "G2 桑基图（sankey）"
description: |
  G2 v5 内置 sankey Mark，用于展示多阶段流量/能量分配流向，
  数据格式为包含 source、target、value 的链接数组，
  节点宽度自动由传入/传出流量决定。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "桑基图"
  - "sankey"
  - "流向图"
  - "能量流"
  - "转化漏斗"
  - "spec"

related:
  - "g2-mark-funnel"
  - "g2-recipe-funnel"
  - "g2-core-chart-init"

use_cases:
  - "展示能源/物质流动分配"
  - "用户转化路径分析（多步骤）"
  - "预算/资金流向可视化"
  - "供应链流向图"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/graph/network/#sankey"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 500,
});

// 链接数组：每条记录是一条流向
const links = [
  { source: '访问',   target: '注册',   value: 8000 },
  { source: '访问',   target: '直接离开', value: 2000 },
  { source: '注册',   target: '激活',   value: 5000 },
  { source: '注册',   target: '流失',   value: 3000 },
  { source: '激活',   target: '付费',   value: 2000 },
  { source: '激活',   target: '免费使用', value: 3000 },
];

chart.options({
  type: 'sankey',
  data: {
    value: {
      links,    // 链接数组（必须）
      // nodes 可选，不填则自动从 links 中提取节点
    },
  },
  layout: {
    nodeAlign: 'justify',   // 节点对齐：'left'|'right'|'center'|'justify'
    nodePadding: 0.03,      // 节点上下间距（0-1）
  },
  style: {
    labelSpacing: 3,
    nodeLineWidth: 1,
    linkFillOpacity: 0.4,
  },
  legend: false,
});

chart.render();
```

## 带颜色区分的桑基图

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 900,
  height: 600,
});

const links = [
  { source: '煤炭', target: '电力', value: 150 },
  { source: '石油', target: '交通', value: 120 },
  { source: '天然气', target: '供热', value: 80 },
  { source: '电力', target: '工业', value: 90 },
  { source: '电力', target: '居民', value: 60 },
  { source: '交通', target: '公路', value: 80 },
  { source: '交通', target: '航空', value: 40 },
];

chart.options({
  type: 'sankey',
  data: {
    value: { links },
  },
  layout: {
    nodeAlign: 'center',
    nodePadding: 0.03,
    nodeWidth: 0.02,       // 节点宽度（相对画布）
  },
  scale: {
    color: {
      type: 'ordinal',
      // 颜色跟随 source 节点
    },
  },
  style: {
    labelSpacing: 4,
    labelFontWeight: 'bold',
    labelFontSize: 12,
    nodeLineWidth: 1.2,
    linkFillOpacity: 0.35,
  },
  legend: false,
});

chart.render();
```

## 完整配置项

```javascript
chart.options({
  type: 'sankey',
  data: {
    value: {
      links: [
        { source: 'A', target: 'B', value: 10 },  // source/target 是节点名称
      ],
      nodes: [     // 可选，自动推断
        { key: 'A' },
        { key: 'B' },
      ],
    },
  },

  layout: {
    nodeId: (d) => d.key,      // 节点 ID 提取（默认 d.key）
    nodeAlign: 'justify',       // 'left'|'right'|'center'|'justify'
    nodeWidth: 0.02,            // 节点宽度（相对画布宽度，0-1）
    nodePadding: 0.02,          // 节点上下间距
    nodeSort: null,             // 节点排序函数
    linkSort: null,             // 链接排序函数
    iterations: 6,              // 布局迭代次数
  },

  style: {
    labelSpacing: 3,            // 标签与节点的间距
    labelFontSize: 12,
    labelFontWeight: 'normal',
    nodeLineWidth: 1,           // 节点边框宽度
    nodeStroke: '#fff',         // 节点边框颜色
    linkFillOpacity: 0.4,       // 链接透明度
  },
});
```

## 常见错误与修正

### 错误 1：数据格式错误——直接传 links 数组

```javascript
// ❌ 错误：sankey 的 data 需要包装为 { value: { links } }
chart.options({
  type: 'sankey',
  data: links,   // ❌ 直接传数组
});

// ✅ 正确
chart.options({
  type: 'sankey',
  data: {
    value: { links },   // ✅ 需要 { value: { links } } 结构
  },
});
```

### 错误 2：source/target 节点名称不一致导致断链

```javascript
// ❌ 错误：'电力' 和 '电力公司' 被当作两个不同节点
const links = [
  { source: '煤炭',   target: '电力',   value: 100 },
  { source: '电力公司', target: '工业', value: 80 },   // ❌ 名称不一致！
];

// ✅ 正确：source 和 target 中对同一节点使用完全相同的名称
const links = [
  { source: '煤炭', target: '电力', value: 100 },
  { source: '电力', target: '工业', value: 80 },   // ✅ 完全一致
];
```

### 错误 3：图中存在环（循环引用）

```javascript
// ❌ 桑基图不支持环形流向
const links = [
  { source: 'A', target: 'B', value: 10 },
  { source: 'B', target: 'A', value: 5 },   // ❌ 形成环！布局异常
];

// ✅ 桑基图只适合有向无环的流向数据
```
