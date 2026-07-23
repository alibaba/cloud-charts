---
id: "g2-mark-tree"
title: "G2 树形图（tree）"
description: |
  tree mark 将层级数据（树状 JSON）渲染为树形结构，
  自动布局节点（point mark）和连线（link mark），
  支持横向/纵向/径向布局，适合组织架构图、决策树、层级分类展示。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "tree"
  - "树形图"
  - "层级"
  - "组织架构"
  - "树状"
  - "hierarchy"

related:
  - "g2-mark-treemap"
  - "g2-mark-partition"
  - "g2-mark-sankey"

use_cases:
  - "组织架构图展示"
  - "决策树可视化"
  - "文件目录树形展示"
  - "分类层级结构可视化"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/hierarchy/tree/"
---

## 最小可运行示例（横向树形图）

```javascript
import { Chart } from '@antv/g2';

// 树形数据（嵌套 JSON 格式）
const treeData = {
  name: '总公司',
  children: [
    {
      name: '研发部',
      children: [
        { name: '前端组', value: 10 },
        { name: '后端组', value: 15 },
        { name: '算法组', value: 8 },
      ],
    },
    {
      name: '市场部',
      children: [
        { name: '品牌组', value: 6 },
        { name: '运营组', value: 9 },
      ],
    },
    {
      name: '产品部',
      children: [
        { name: 'B端产品', value: 7 },
        { name: 'C端产品', value: 5 },
      ],
    },
  ],
};

const chart = new Chart({ container: 'container', width: 800, height: 500 });

chart.options({
  type: 'tree',
  data: treeData,
  layout: {
    // 布局方向：false=纵向（上→下），true=横向（左→右）
    // G2 tree 使用 d3-hierarchy tidy tree 布局
  },
  encode: {
    value: 'value',  // 节点大小编码字段（可选）
  },
  // 节点样式
  nodeLabels: [
    { text: 'name', style: { fontSize: 12, dx: 6 } },
  ],
  // 连线样式
  style: {
    nodeSize: 5,
    nodeFill: '#5B8FF9',
    linkStroke: '#aaa',
    linkLineWidth: 1.5,
  },
});

chart.render();
```

## 纵向树形图（自上而下）

```javascript
chart.options({
  type: 'tree',
  data: treeData,
  coordinate: { transform: [{ type: 'transpose' }] },  // 转置为纵向
  nodeLabels: [
    {
      text: 'name',
      style: { fontSize: 11, textBaseline: 'bottom', dy: -6 },
    },
  ],
  style: {
    nodeFill: '#52c41a',
    nodeSize: 6,
    linkShape: 'smooth',  // 连线使用平滑曲线
  },
});
```

## 径向树形图（放射状）

```javascript
chart.options({
  type: 'tree',
  data: treeData,
  coordinate: { type: 'polar', innerRadius: 0.1 },  // 极坐标 = 径向布局
  style: {
    nodeFill: '#ff7875',
    nodeSize: 4,
  },
  nodeLabels: [
    {
      text: 'name',
      style: {
        fontSize: 10,
        textAlign: (d) => (d.x > Math.PI ? 'right' : 'left'),
      },
    },
  ],
});
```

## 常见错误与修正

### 错误：传入扁平数据而非嵌套 JSON
```javascript
// ❌ tree mark 需要嵌套 JSON（children 字段），不接受扁平数组
chart.options({
  type: 'tree',
  data: [
    { id: 1, parent: null, name: '根' },
    { id: 2, parent: 1, name: '子' },
  ],  // ❌ 扁平数据不能直接使用
});

// ✅ 需要嵌套格式
chart.options({
  type: 'tree',
   { name: '根', children: [{ name: '子' }] },  // ✅ 嵌套 JSON
});
```

### 错误：tree 与 treemap 混淆
```javascript
// tree：展示层级结构关系（节点+连线，强调层次和连接）
chart.options({ type: 'tree',  data: { value: hierarchyData } });

// treemap：按面积展示层级数据占比（矩形嵌套，强调大小和比例）
chart.options({ type: 'treemap',  data: { value: hierarchyData } });
```

---

## 节点数据访问规则（重要！）

层次结构图中，回调函数接收到的参数 `d` **不是原始数据对象**，而是 G2 用 d3-hierarchy 包装后的层次节点，**原始数据在 `d.data` 中**。

### 回调参数 d 的结构

```javascript
// d 是 d3-hierarchy 节点，结构如下：
{
  value: 10,               // 节点数值（d3 计算的子树总和）
  depth: 2,                // 层级深度（0 = 根节点）
  height: 0,               // 子树高度（叶子节点为 0）
  data: {                  // ← 原始数据在这里！
    name: '前端组',
    value: 10,
    // ... 其它自定义字段
  },
  path: ['根', '研发部', '前端组'],
}
```

### nodeLabels 中访问字段

tree mark 的 `nodeLabels` 使用字符串 `'name'` 时，G2 内部会查找 `d.data['name']`（有专项处理），所以字符串形式可以工作。但如需访问计算属性（`depth`、`height`）或条件渲染，必须使用回调：

```javascript
// ✅ 字符串形式（tree 的 nodeLabels 对 data 字段有专项处理）
nodeLabels: [
  { text: 'name', style: { fontSize: 12 } },
]

// ✅ 回调形式（需要条件判断或访问节点属性时）
nodeLabels: [
  {
    text: (d) => {
      if (d.height > 0) return d.data?.name;  // 父节点显示名称
      return `${d.data?.name}\n(${d.value})`;  // 叶节点显示名称+数值
    },
    style: { fontSize: 12 },
  },
]
```

### encode.color 必须用回调

与其他层次 mark 一样，`encode.color` 字符串对 tree 也**不起作用**：

```javascript
// ❌ 错误：color: 'type' 等价于 d['type'] = undefined
encode: {
  value: 'value',
  color: 'type',  // ❌ → undefined → 所有节点相同颜色
}

// ✅ 正确：必须用回调
encode: {
  value: 'value',
  color: (d) => d.data?.type,  // ✅ 通过 d.data 访问原始字段
}
```
