---
id: "g2-mark-treemap"
title: "G2 矩形树图（treemap）"
description: |
  G2 v5 内置 treemap Mark，用矩形面积表示层级数据中各节点的占比，
  数据采用嵌套的 children 树形结构，通过 encode.value 映射叶节点数值，
  支持多种 tile 布局算法和层级钻取交互。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "矩形树图"
  - "treemap"
  - "层级数据"
  - "占比"
  - "hierarchy"
  - "树形"
  - "spec"

related:
  - "g2-mark-arc-pie"
  - "g2-mark-sankey"
  - "g2-core-chart-init"

use_cases:
  - "展示文件目录/磁盘占用大小"
  - "产品类别的销售额占比（多层级）"
  - "证券市场板块涨跌热力图"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/graph/hierarchy/#treemap"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 500,
});

// 树形嵌套数据
const data = {
  name: 'root',
  children: [
    {
      name: '技术',
      children: [
        { name: '前端', value: 120 },
        { name: '后端', value: 180 },
        { name: '算法', value: 80 },
      ],
    },
    {
      name: '产品',
      children: [
        { name: '移动端', value: 95 },
        { name: 'Web', value: 60 },
      ],
    },
    {
      name: '设计',
      children: [
        { name: 'UI', value: 70 },
        { name: 'UX', value: 45 },
      ],
    },
  ],
};

chart.options({
  type: 'treemap',
  data: {
    value: data
  },
  encode: {
    value: 'value',   // 叶节点数值字段
  },
  layout: {
    tile: 'treemapSquarify',    // 布局算法（默认）
    paddingInner: 2,            // 矩形间距
  },
  style: {
    labelText: (d) => d.data?.name || '',
    labelFill: '#fff',
    labelFontSize: 13,
    fillOpacity: 0.85,
  },
  legend: false,
});

chart.render();
```

## 数据配置形式说明

**为什么 treemap 使用 ` { value: data }` 而不是 `data`？**

层次数据是**对象**（包含 name/children），不是数组，必须使用完整形式：

```javascript
// ❌ 错误：层次数据不是数组，不能用简写
chart.options({
  type: 'treemap',
  data: hierarchyData,  // ❌ 不工作
});

// ✅ 正确：层次数据必须用完整形式
chart.options({
  type: 'treemap',
  data: { value: hierarchyData },  // ✅
});
```

**简写形式仅适用于数组数据**（满足三个条件：内联、是数组、无 transform）。

---

## 完整配置项

```javascript
chart.options({
  type: 'treemap',
  data: {
    value: hierarchicalData
  },
  encode: {
    value: 'value',   // 叶节点数值字段（决定矩形面积）
  },
  layout: {
    // tile 算法选择：
    // 'treemapSquarify'（默认，接近正方形）
    // 'treemapBinary'（二叉分割）
    // 'treemapDice'（横向分割）
    // 'treemapSlice'（纵向分割）
    // 'treemapSliceDice'（交替分割）
    tile: 'treemapSquarify',
    paddingInner: 2,      // 同层矩形间距（px）
    paddingOuter: 4,      // 外边距
    paddingTop: 20,       // 顶部留白（用于父节点标签）
    ratio: 1.618,         // 黄金比例（treemapSquarify 专用）
    ignoreParentValue: true,  // 忽略父节点自身 value
  },
  style: {
    // 矩形标签
    labelText: (d) => d.data?.name,
    labelFill: '#fff',
    labelFontSize: 12,
    labelPosition: 'top-left',  // 标签位置
    fillOpacity: 0.8,
    stroke: '#fff',
    lineWidth: 1,
  },
});
```

## 多层级标签（父节点 + 叶节点）

```javascript
chart.options({
  type: 'treemap',
  data: {
    value: data
  },
  encode: { value: 'value' },
  layout: {
    tile: 'treemapSquarify',
    paddingInner: 3,
    paddingTop: 24,       // 为父节点标题留空间
  },
  style: {
    // 叶节点显示名称
    labelText: (d) => {
      // path 是从根到当前节点的路径数组
      return d.depth > 1 ? d.data?.name : '';
    },
    // 父节点（depth=1）用大标签
    labelFontSize: (d) => d.depth === 1 ? 14 : 11,
    labelFontWeight: (d) => d.depth === 1 ? 'bold' : 'normal',
    labelFill: '#fff',
    fillOpacity: (d) => d.depth === 1 ? 0.6 : 0.85,
  },
});
```

## 股票板块热力图（市场涨跌）

```javascript
const marketData = {
  name: 'A股',
  children: [
    {
      name: '科技',
      children: [
        { name: '华为', value: 1200, change: 3.5 },
        { name: '腾讯', value: 980,  change: -1.2 },
        { name: '阿里', value: 850,  change: 0.8 },
      ],
    },
    {
      name: '金融',
      children: [
        { name: '工行', value: 2100, change: 1.1 },
        { name: '建行', value: 1800, change: -0.5 },
      ],
    },
  ],
};

chart.options({
  type: 'treemap',
  data: {
    value: marketData
  },
  encode: {
    value: 'value',
    // 颜色按涨跌幅映射
    color: (d) => d.data?.change ?? 0,
  },
  scale: {
    color: {
      type: 'diverging',
      palette: 'RdYlGn',      // 红（跌）→ 黄（平）→ 绿（涨）
      domain: [-5, 0, 5],
    },
  },
  style: {
    labelText: (d) =>
      d.data?.name && d.data?.change != null
        ? `${d.data.name}\n${d.data.change > 0 ? '+' : ''}${d.data.change}%`
        : d.data?.name || '',
    labelFill: '#fff',
    labelFontSize: 12,
  },
  legend: { color: { position: 'top' } },
});
```

## 常见错误与修正

### 错误 1：数据格式非树形结构

```javascript
// ❌ 错误：treemap 需要树形嵌套数据，不能用平坦数组
chart.options({
  type: 'treemap',
  data: [
    { name: '前端', value: 120, parent: '技术' },   // ❌ 平坦格式
  ],
});

// ✅ 正确：需要 children 嵌套结构
chart.options({
  type: 'treemap',
  data: {
    value: {
      name: 'root',
      children: [
        {
          name: '技术',
          children: [
            { name: '前端', value: 120 },   // ✅ 叶节点有 value
          ],
        },
      ],
    },
  },
  encode: { value: 'value' },
});
```

### 错误 2：encode.value 字段名与数据不匹配

```javascript
// ❌ 错误：数据中叶节点字段是 size，但 encode.value 写的是 value
const data = {
  value: { name: 'root', children: [{ name: 'A', size: 100 }] }
 };
chart.options({
  encode: { value: 'value' },   // ❌ 字段名不匹配
});

// ✅ 正确
chart.options({
  encode: { value: 'size' },    // ✅ 与数据字段一致
});
```

---

## 节点数据访问规则（重要！）

层次结构图中，回调函数接收到的参数 `d` **不是原始数据对象**，而是 G2 用 d3-hierarchy 包装后的层次节点，**原始数据在 `d.data` 中**。

### 为什么 `encode.color: 'growth'` 不起作用？

**根本原因**：当 encode 是字符串时，G2 内部做的是 `datum[fieldName]`，直接访问节点对象的属性。对于层次 mark，`datum` 是层次节点（hierarchy node），不是原始数据对象：

```
d['growth']        → undefined  ❌（层次节点没有 growth 属性）
d.data['growth']   → 3.5        ✅（原始数据在 d.data 上）
```

**特例**：`encode.value: 'value'` 看起来用字符串也能工作，是因为 G2 对层次 mark 的 `value` 通道做了**专项处理**，直接读取节点的 `value` 属性（d3-hierarchy 计算后的值）。其他通道（`color`、`shape` 等）没有这个特殊处理，字符串会直接 `datum[field]` 导致 `undefined`。

```javascript
// ❌ encode.color: 'growth' 的内部执行等价于：
const color = datum['growth']  // datum 是层次节点，'growth' 不在节点上 → undefined
// 结果：所有矩形使用相同颜色

// ✅ 使用回调才能正确访问：
const color = datum.data?.['growth']  // datum.data 才是原始数据对象
```

### 回调参数 d 的结构

```javascript
// d 是 d3-hierarchy 节点，结构如下：
{
  value: 100,              // 节点数值（d3 计算的叶子值之和）
  depth: 2,                // 层级深度（0 = 根节点）
  height: 0,               // 子树高度（叶子节点为 0）
   {                  // ← 原始数据在这里！
    name: '前端',
    value: 120,
    growth: 3.5,
    // ... 其它自定义字段
  },
  path: ['root', '技术', '前端'],  // 从根到当前节点的路径
}
```

### encode 中访问字段

```javascript
// ❌ 错误：字符串字段名对 color/shape 等通道不起作用，返回 undefined
encode: {
  value: 'value',   // ✅ value 通道有专项处理，字符串可用
  color: 'growth',  // ❌ 等价于 d['growth'] = undefined，所有矩形颜色相同
}

// ✅ 正确：除 value 外的所有通道必须用回调函数
encode: {
  value: 'value',
  color: (d) => d.data?.growth,  // ✅ 通过 d.data 访问原始字段
}
```

### 常用着色策略

```javascript
// 按父节点着色（推荐，同门类同色，视觉分组清晰）
color: (d) => d.path?.[1] || d.data?.name

// 按层级深度着色
color: (d) => d.depth

// 按自定义字段着色
color: (d) => d.data?.growth
color: (d) => d.data?.category

// 按数值着色（连续色板）
color: (d) => d.value
```

### 配合 scale 自定义颜色

```javascript
encode: {
  value: 'value',
  color: (d) => d.data?.growth,
},
scale: {
  color: {
    type: 'diverging',
    palette: 'RdYlGn',
    domain: [-5, 0, 5],
  },
}
```

### 错误 3：encode.color 使用字符串字段名导致所有矩形颜色相同

```javascript
// ❌ 错误：color: 'growth' 等价于 d['growth']，层次节点上没有 growth 属性 → undefined
chart.options({
  type: 'treemap',
  data: { value: data },
  encode: {
    value: 'value',
    color: 'growth',  // ❌ d['growth'] = undefined → 所有矩形显示相同颜色
  },
});

// ✅ 正确：color 必须用回调函数，通过 d.data 访问原始字段
chart.options({
  type: 'treemap',
  data: { value: data },
  encode: {
    value: 'value',
    color: (d) => d.data?.growth,  // ✅ 按涨跌幅着色
  },
});
```

### 错误 4：labels/style 中使用 d.name 导致 undefined

```javascript
// ❌ 错误：treemap 节点的原始字段在 d.data 中，d.name 是 undefined
style: {
  labelText: (d) => d.name,  // ❌ d.name 是 undefined
}

// ✅ 正确：通过 d.data 访问原始数据字段
style: {
  labelText: (d) => d.data?.name || '',  // ✅
}
```
