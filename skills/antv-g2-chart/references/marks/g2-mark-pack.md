---
id: "g2-mark-pack"
title: "G2 圆形打包图（pack）"
description: |
  pack mark 使用圆形打包布局（circle packing）展示层次数据，
  父子关系通过圆的包含关系表达，圆的大小映射数值。
  数据需要是树形结构（包含 children 字段的嵌套数组）或扁平带 parent 的结构。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "pack"
  - "圆形打包"
  - "circle packing"
  - "层次数据"
  - "树形"
  - "嵌套"

related:
  - "g2-mark-treemap"
  - "g2-core-chart-init"

use_cases:
  - "展示层次结构的规模关系（如文件目录大小）"
  - "展示分类的嵌套关系和比例"
  - "组织架构中各部门规模"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#pack"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 层次数据（树形结构）
const data = {
  name: '公司',
  children: [
    {
      name: '研发部',
      children: [
        { name: '前端组', value: 12 },
        { name: '后端组', value: 18 },
        { name: '算法组', value: 8 },
      ],
    },
    {
      name: '市场部',
      children: [
        { name: '品牌组', value: 6 },
        { name: '运营组', value: 10 },
      ],
    },
    {
      name: '设计部',
      children: [
        { name: 'UX组', value: 7 },
        { name: '视觉组', value: 5 },
      ],
    },
  ],
};

const chart = new Chart({ container: 'container', width: 600, height: 600 });

chart.options({
  type: 'pack',
  data: {
    value: data,
  },
  encode: {
    value: 'value',   // 叶子节点的数值（决定圆大小）
  },
  style: {
    labelFontSize: 11,
    fillOpacity: 0.8,
  },
  legend: false,
});

chart.render();
```

## 数据配置形式说明

**为什么 pack 使用 ` { value: data }` 而不是 `data`？**

G2 v5 中数据配置有两种形式：

### 简写形式（仅限数组数据）

当数据满足**三个条件**时可使用简写：
1. 内联数据
2. **是数组**
3. 没有数据转换

```javascript
// ✅ 普通图表：数据是数组，可以用简写
const arrayData = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
];

chart.options({
  type: 'interval',
  data: arrayData,  // 简写形式
});
```

### 完整形式（层次数据必须使用）

层次数据是**对象**（包含 name/children），不是数组，必须使用完整形式：

```javascript
// 层次数据是对象，不是数组
const hierarchyData = {
  name: 'root',
  children: [
    { name: 'A', value: 30 },
    { name: 'B', value: 50 },
  ],
};

// ❌ 错误：层次数据不是数组，不能用简写
chart.options({
  type: 'pack',
  data: hierarchyData,  // ❌ 不工作
});

// ✅ 正确：层次数据必须用完整形式
chart.options({
  type: 'pack',
  data: { value: hierarchyData },  // ✅
});
```

### 数据配置对照表

| 数据类型 | 形式 | 示例 |
|---------|------|------|
| 数组数据（无 transform） | 简写 | `data: arrayData` 或 ` [...]` |
| 数组数据（有 transform） | 完整 | ` { value: [...], transform: [...] }` |
| 层次数据（对象） | 完整 | ` { value: { name, children } }` |
| 远程数据 | 完整 | `data: { type: 'fetch', value: 'url' }` |

---

## 常见错误与修正

### 错误 1：data 直接传树形对象

```javascript
// ❌ 错误：层次数据不是数组，不能用简写形式
chart.options({
  type: 'pack',
  data: hierarchyData,   // ❌ 直接传树形对象不工作
});

// ✅ 正确：层次数据必须用 { value: treeData } 形式
chart.options({
  type: 'pack',
  data: { value: hierarchyData },  // ✅
});
```

### 错误 2：叶子节点没有 value 字段——所有圆大小相同

```javascript
// ❌ 叶子节点没有数值字段，所有节点大小相同（不能展示差异）
const data = {
  value: {
    name: 'root',
    children: [
      { name: 'A' },  // ❌ 没有 value
      { name: 'B' },
    ],
  }
};

// ✅ 叶子节点加 value 字段
const data = {
  value: {
    name: 'root',
    children: [
      { name: 'A', value: 30 },  // ✅
      { name: 'B', value: 50 },
    ],
  }
}
```

### 错误 3：encode.color 使用字符串字段名导致所有圆颜色相同

```javascript
// ❌ 错误：color: 'name' 等价于 d['name']，层次节点上没有 name 属性 → undefined
chart.options({
  type: 'pack',
  data: { value: data },
  encode: {
    value: 'value',
    color: 'name',   // ❌ d['name'] = undefined → 所有圆显示相同颜色
  },
});

// ✅ 正确：color 必须用回调函数，通过 d.data 访问原始字段
chart.options({
  type: 'pack',
  data: { value: data },
  encode: {
    value: 'value',
    color: (d) => d.data?.name,           // ✅ 按节点自身名称着色
    // 或按父节点着色（同门类同色，更直观）：
    // color: (d) => d.path?.[1] || d.data?.name,
  },
});
```

**为什么 `value: 'value'` 字符串可以用，`color: 'name'` 字符串不行？**
G2 对层次 mark 的 `value` 通道有**专项处理**，直接读取 d3-hierarchy 计算好的节点 `.value` 属性；而 `color`、`shape` 等其他通道走通用路径，用字符串直接做 `datum[field]`，拿到的是层次节点而非原始数据，`datum['name']` 自然是 `undefined`。

### 错误 4：labels 中直接使用 d.name 导致 undefined

```javascript
// ❌ 错误：pack 节点的原始字段在 d.data 中，d.name 是 undefined
labels: [
  {
    text: (d) => `${d.name}\n${d.value?.toLocaleString()}`,  // ❌ d.name 是 undefined
  },
]

// ✅ 正确：通过 d.data 访问原始数据字段
labels: [
  {
    text: (d) => {
      if (d.height > 0) return '';  // 父节点不显示文字
      return `${d.data?.name}\n${d.value?.toLocaleString()}`;  // ✅
    },
    position: 'inside',
    fontSize: 10,
    fill: '#000',
  },
]
```

**根本原因**：层次图中 G2 将原始数据封装为层次节点，`d` 本身是节点对象（含 `depth`、`height`、`value` 等内置字段），原始数据对象整体存放在 `d.data` 下。

### 错误 5：混淆 data.value 和节点的 value 字段

```javascript
// ⚠️ 注意区分两个不同的 value：
// 1. data.value - 数据配置的值（可以是任意数据）
// 2. 节点的 value 字段 - 叶子节点的数值（决定圆大小）

// ✅ 正确理解
chart.options({
  type: 'pack',
  data: {
    value: {           // 这是数据配置的 value
      name: 'root',
      children: [
        { name: 'A', value: 30 },  // 这是节点的 value 字段
      ],
    },
  },
  encode: {
    value: 'value',    // 映射节点的 value 字段到圆大小
  },
});
```

---

## 节点数据访问规则（重要！）

层次结构图中，回调函数（encode、labels 的 text 等）接收到的参数 `d` **不是原始数据对象**，而是 G2 用 d3-hierarchy 包装后的层次节点，**原始数据在 `d.data` 中**。

### 为什么 `encode.color: 'name'` 不起作用？

**根本原因**：当 encode 是字符串时，G2 内部做的是 `datum[fieldName]`，即直接访问节点对象的属性。对于层次 mark，`datum` 是层次节点（hierarchy node），不是原始数据对象：

```
d['name']        → undefined  ❌（层次节点没有 name 属性）
d.data['name']   → '前端组'  ✅（原始数据在 d.data 上）
```

**特例**：`encode.value: 'value'` 看起来用字符串也能工作，是因为 G2 对层次 mark 的 `value` 通道做了**专项处理**，直接读取节点的 `value` 属性（d3-hierarchy 计算后的值）。其他通道（`color`、`shape` 等）没有这个特殊处理，字符串会直接 `datum[field]` 导致 `undefined`。

```javascript
// ❌ encode.color: 'name' 的内部执行等价于：
const color = datum['name']  // datum 是层次节点，'name' 属性不在节点上 → undefined
// 结果：所有圆使用相同颜色（undefined 被映射为默认颜色）

// ✅ 使用回调才能正确访问：
const color = datum.data?.['name']  // datum.data 才是原始数据对象
```

### 回调参数 d 的结构

```javascript
// d 是 d3-hierarchy 节点，结构如下：
{
  value: 100,              // 节点数值（d3 计算的叶子值之和）
  depth: 2,                // 层级深度（0 = 根节点）
  height: 0,               // 子树高度（叶子节点为 0）
  data: {                  // ← 原始数据在这里！
    name: '前端组',
    value: 12,
    category: 'tech',
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
  color: 'name',    // ❌ 等价于 d['name'] = undefined，所有圆颜色相同
}

// ✅ 正确：除 value 外的所有通道必须用回调函数
encode: {
  value: 'value',
  color: (d) => d.data?.name,  // ✅ 通过 d.data 访问原始字段
}
```

### labels 中访问字段

```javascript
// ❌ 错误：d.name 是 undefined，因为原始字段在 d.data 中
labels: [
  {
    text: (d) => `${d.name}\n${d.value}`,  // ❌ d.name 是 undefined
  },
]

// ✅ 正确：通过 d.data 访问原始字段
labels: [
  {
    text: (d) => `${d.data?.name}\n${d.value?.toLocaleString()}`,  // ✅
    position: 'inside',
    fontSize: 10,
    fill: '#000',
  },
]
```

### 常用访问模式

```javascript
// 原始字段（name、category 等自定义字段）— 必须通过 d.data 访问
d.data?.name
d.data?.category
d.data?.type

// 层次节点内置字段（不需要 .data）— 可直接访问
d.value    // 节点数值（d3 计算的子树总和）
d.depth    // 层级深度（0 = 根节点）
d.height   // 子树高度（叶子节点为 0）

// 常用着色策略
color: (d) => d.path?.[1] || d.data?.name   // 按第二层父节点着色（推荐，同门类同色）
color: (d) => d.depth                        // 按层级深度着色
color: (d) => d.data?.name                   // 按当前节点名称着色
color: (d) => d.data?.category               // 按自定义字段着色
color: (d) => d.value                        // 按数值大小着色
```

### 完整带 labels 的示例

```javascript
chart.options({
  type: 'pack',
  data: { value: data },
  encode: {
    value: 'value',
    color: (d) => d.path?.[1] || d.data?.name,
  },
  style: {
    stroke: '#fff',
    lineWidth: 1,
    fillOpacity: 0.8,
  },
  labels: [
    {
      text: (d) => {
        // 只在叶子节点（height === 0）显示文本，避免父节点文字遮挡
        if (d.height > 0) return '';
        return `${d.data?.name}\n${d.value?.toLocaleString()}`;
      },
      position: 'inside',
      fontSize: 10,
      fill: '#000',
    },
  ],
  legend: false,
});
```

### 配合 scale 自定义颜色

```javascript
encode: {
  value: 'value',
  color: (d) => d.data?.category,
},
scale: {
  color: {
    type: 'sequential',
    palette: 'blues',
  },
}
```