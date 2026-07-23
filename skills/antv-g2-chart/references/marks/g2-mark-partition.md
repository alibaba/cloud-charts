---
id: "g2-mark-partition"
title: "G2 矩形分区图（partition）"
description: |
  partition mark 用矩形（冰柱/icicle）布局展示层次数据，每层从父节点位置开始向下延伸，
  子节点宽度按值比例填满父节点宽度。使用笛卡尔坐标，横轴表示值域，纵轴表示层级深度。
  属于 @antv/g2 核心，无需额外扩展库。
  注意：partition 与 sunburst 是两个独立的 mark，不可混用：
  partition 为矩形布局（直角坐标），sunburst 为圆环布局（极坐标，来自 @antv/g2-extension-plot）。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "partition"
  - "矩形分区"
  - "icicle"
  - "冰柱图"
  - "层次数据"
  - "hierarchy"
  - "下钻"
  - "drillDown"

related:
  - "g2-mark-treemap"
  - "g2-mark-sunburst"
  - "g2-interaction-drilldown"
  - "g2-mark-pack"

use_cases:
  - "层次数据的矩形分区展示（如调用栈火焰图、文件目录结构）"
  - "多层类别数据的占比可视化"
  - "支持下钻交互的层次结构探索"

anti_patterns:
  - "不要用 partition 画圆环旭日图，应使用 sunburst（需要 @antv/g2-extension-plot）"
  - "不要把 data 写成 { value: treeRoot }，partition 的 data 是数组形式"
  - "不要用 d.data?.name 访问字段，partition 回调拿到的是已平铺的 record，直接用 d.name"
  - "所有节点（包括根节点和中间节点）都必须显式设置 value 字段——partition 不会自动累加子节点；根节点缺少 value 时所有矩形宽度为 0，全部叠在 x=0 处"
  - "不要用 d['ancestor-node'] 做分支着色——该字段实际等于节点自身 name；分支着色应使用 d.path[1] || d.path[0]"
  - "encode.color 函数的返回值是颜色通道的域键（domain key），scale.color.domain 必须与函数实际返回值完全一致——若函数返回 hex 色值而 domain 填数据名，Ordinal scale 会把 hex 追加进 domain，图例出现 #E63946 这类乱码条目"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-04-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/graph/hierarchy/#partition"
---

## partition vs sunburst 对比

| 特性 | partition（矩形分区）| sunburst（旭日图）|
|------|----------------------|-------------------|
| 来源 | `@antv/g2` 核心，无需扩展 | `@antv/g2-extension-plot`，需要 `extend` |
| 坐标系 | 笛卡尔坐标（直角）| 极坐标（同心圆）|
| 视觉形态 | 矩形冰柱/icicle | 同心圆环 |
| data 格式 | 数组 `[treeRoot]` | `{ value: treeRoot }` |
| 回调中字段访问 | 直接 `d.name`、`d.depth`、`d.value` | 直接 `d.name`、`d.depth`、`d.path`（字符串）|

## 最小可运行示例

数据结构：单根数组，`name`/`value`/`children` 三个字段。**所有节点（含根节点和中间节点）都必须显式设置 `value`**——partition 不会自动累加子节点，根节点缺少 `value` 将导致所有矩形宽度为 0 并叠在一起。

以下 mock 数据模拟年度预算分配（4 大类别，3 层深度）：

```javascript
import { Chart } from '@antv/g2';

const data = [
  {
    name: '年度预算',
    value: 1550,
    children: [
      {
        name: '产品研发',
        value: 600,
        children: [
          {
            name: '前端',
            value: 220,
            children: [
              { name: 'React', value: 90 },
              { name: 'Vue', value: 80 },
              { name: 'CSS', value: 50 },
            ],
          },
          {
            name: '后端',
            value: 230,
            children: [
              { name: 'Java', value: 100 },
              { name: 'Python', value: 80 },
              { name: 'Go', value: 50 },
            ],
          },
          {
            name: '移动端',
            value: 150,
            children: [
              { name: 'iOS', value: 80 },
              { name: 'Android', value: 70 },
            ],
          },
        ],
      },
      {
        name: '市场营销',
        value: 400,
        children: [
          {
            name: '数字营销',
            value: 180,
            children: [
              { name: 'SEO', value: 70 },
              { name: 'SEM', value: 60 },
              { name: '社媒', value: 50 },
            ],
          },
          {
            name: '品牌推广',
            value: 130,
            children: [
              { name: '设计', value: 70 },
              { name: '内容', value: 60 },
            ],
          },
          {
            name: '活动运营',
            value: 90,
            children: [
              { name: '线上', value: 50 },
              { name: '线下', value: 40 },
            ],
          },
        ],
      },
      {
        name: '运营支持',
        value: 300,
        children: [
          {
            name: '客户服务',
            value: 130,
            children: [
              { name: '售前', value: 60 },
              { name: '售后', value: 70 },
            ],
          },
          {
            name: '数据分析',
            value: 100,
            children: [
              { name: 'BI', value: 60 },
              { name: '算法', value: 40 },
            ],
          },
          {
            name: '技术支持',
            value: 70,
            children: [
              { name: '运维', value: 40 },
              { name: '安全', value: 30 },
            ],
          },
        ],
      },
      {
        name: '基础设施',
        value: 250,
        children: [
          {
            name: '云计算',
            value: 120,
            children: [
              { name: 'AWS', value: 60 },
              { name: '自建IDC', value: 60 },
            ],
          },
          {
            name: '工具链',
            value: 130,
            children: [
              { name: 'CI/CD', value: 50 },
              { name: '监控', value: 40 },
              { name: '日志', value: 40 },
            ],
          },
        ],
      },
    ],
  },
];

const chart = new Chart({ container: 'container', autoFit: true, height: 400 });

chart.options({
  type: 'partition',
  data,
  encode: {
    value: 'value',
    color: (d) => d.path[1] || d.path[0],
  },
  scale: {
    color: {
      range: [
        'rgb(91, 143, 249)',
        'rgb(90, 216, 166)',
        'rgb(246, 189, 22)',
        'rgb(232, 104, 74)',
        'rgb(154, 100, 220)',
      ],
    },
  },
  labels: [
    {
      text: 'name',
      position: 'inside',
      transform: [{ type: 'overflowHide' }],
    },
  ],
  style: { inset: 0.5 },
  axis: { x: { title: '预算（万元）' } },
});

chart.render();
```

## 数据格式说明

`partition` 的 `data` 是**数组**，每项是一个树根节点（支持多根）。

**关键：所有节点必须显式设置 `value`**，partition 布局不会自动累加子节点的值。非叶节点的 `value` 应等于其所有叶子节点 `value` 之和。

```javascript
// ✅ 正确：根节点和中间节点都显式设置 value
chart.options({
  type: 'partition',
  data: [
    {
      name: 'root',
      value: 300,          // ← 根节点必须有 value（= 所有叶子之和）
      children: [
        {
          name: 'A',
          value: 200,      // ← 中间节点也必须有 value
          children: [
            { name: 'A1', value: 120 },
            { name: 'A2', value: 80 },
          ],
        },
        { name: 'B', value: 100 },
      ],
    },
  ],
});

// ❌ 错误：根节点缺少 value → 所有矩形宽度为 0，全部叠在 x=0 处
chart.options({
  type: 'partition',
  data: [{ name: 'root', children: [...] }],   // ❌ 缺少 value，图表崩溃
});

// ❌ 错误：不能用 { value: treeRoot } 对象包装（sunburst 的写法）
chart.options({
  type: 'partition',
  data: { value: { name: 'root', children: [...] } },   // ❌ 不工作
});
```

## 回调函数中的数据结构

`partition` 在渲染前会将树形数据展平，回调中拿到的 `d` 是**已展平的 record**，直接访问字段：

```javascript
// d 的结构（展平后）
{
  name: 'diffProps',                                    // 节点名称
  value: 120,                                           // 节点数值
  depth: 3,                                             // 层级深度（根节点为 0）
  path: ['main', 'render', 'reconcile', 'diffProps'],  // 从根到当前节点的路径数组
  'ancestor-node': 'diffProps',  // 注意：等于节点自身 name，不是一级祖先名
  childNodeCount: 0,             // 子节点数量（叶子节点为 0）
  x: [x0, x1],                  // 水平位置区间
  y: [y0, y1],                   // 垂直位置区间（即层级）
}
```

**按分支（一级类别）着色**：使用 `d.path[1]`（路径第 2 元素 = 一级子节点名），而不是 `d['ancestor-node']`（它等于节点自身名，无分组效果）：

```javascript
// ✅ 按分支着色（同一一级子树同色）
encode: { color: (d) => d.path[1] || d.path[0] }
// path[1] 对根节点为 undefined，回退到 path[0]（根节点自身名）

// ✅ 按节点名着色（每个节点独立颜色）
encode: { color: 'name' }

// ✅ 按层级深度着色
encode: { color: (d) => d.depth }

// ❌ 错误：ancestor-node 等于节点自身 name，不是"一级祖先"
encode: { color: (d) => d['ancestor-node'] }  // 等效于 d.name，无分组效果

// ❌ 错误：partition 不使用 d3-hierarchy 包装，d.data 不存在
encode: { color: (d) => d.data?.name }
```

## labels 位置选择

- **浅树（≤ 6 层）**：用 `position: 'inside'`，文字显示在矩形内部，太窄时由 `overflowHide` 自动隐藏
- **深树（> 6 层）**：用 `position: 'left'` + `dx: 8`，文字从矩形左边缘开始，适合行高较小的场景

```javascript
// 浅树（推荐）
labels: [{ text: 'name', position: 'inside', transform: [{ type: 'overflowHide' }] }]

// 深树（官方 example 用法，适合 10+ 层）
labels: [{ text: 'name', position: 'left', dx: 8, transform: [{ type: 'overflowHide' }] }]
```

## layout 配置

```javascript
chart.options({
  type: 'partition',
  data: [...],
  encode: { value: 'value', color: 'name' },
  layout: {
    sort: (a, b) => b.value - a.value,  // 按值降序排列子节点
    fillParent: true,                   // 子节点填满父节点宽度（默认 true）
    // valueField: 'value',             // 数值字段名（默认 'value'）
    // nameField: 'name',               // 名称字段名（默认 'name'）
  },
});
```

## 带下钻交互

`partition` 内置 `drillDown` 交互，点击节点可下钻：

```javascript
chart.options({
  type: 'partition',
  data: [...],
  encode: { value: 'value', color: 'name' },
  interaction: {
    drillDown: true,  // 默认已开启
  },
});
```

## 常见错误与修正

### 错误 1：根节点缺少 value → 所有矩形叠在 x=0

partition 布局用 `node.value` 计算根节点宽度（`x1 = x0 + value`）。根节点 `value` 为 0 时，宽度为 0，所有子节点也从 `x=0` 开始且宽度由各自 value 决定，导致兄弟节点严重重叠。

```javascript
// ❌ 错误：根节点无 value，子节点起点均为 x=0，发生重叠
chart.options({
  type: 'partition',
  data: [
    {
      name: 'root',
      // value 缺失！
      children: [
        { name: 'A', value: 150 },  // x=[0, 150]
        { name: 'B', value: 200 },  // x=[0, 200] ← 与 A 重叠！
      ],
    },
  ],
});

// ✅ 正确：所有节点显式设置 value
chart.options({
  type: 'partition',
  data: [
    {
      name: 'root',
      value: 350,   // ← 必须有，等于所有叶子 value 之和
      children: [
        { name: 'A', value: 150 },  // x=[0, 150]
        { name: 'B', value: 200 },  // x=[150, 350] ← 正确
      ],
    },
  ],
});
```

### 错误 2：把 partition 和 sunburst 混用
```javascript
// ❌ 错误：用 partition 配极坐标想得到旭日图
chart.options({
  type: 'partition',
  coordinate: { type: 'polar' },  // ❌ partition 不支持极坐标旭日图
});

// ✅ 正确：旭日图应使用 sunburst（需要 @antv/g2-extension-plot）
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';
const Chart = extend(Runtime, { ...corelib(), ...plotlib() });

chart.options({
  type: 'sunburst',
  data: { value: treeRoot },  // sunburst 使用 { value: root } 对象
  encode: { value: 'sum' },
});
```

### 错误 3：data 使用 sunburst 的对象格式
```javascript
// ❌ 错误：partition 不接受 { value: root } 对象
chart.options({
  type: 'partition',
  data: { value: { name: 'root', children: [...] } },
});

// ✅ 正确：partition 使用数组，且根节点需显式设置 value
chart.options({
  type: 'partition',
  data: [{ name: 'root', value: 1000, children: [...] }],
});
```

### 错误 4：labels 中用 d.data?.name 访问字段
```javascript
// ❌ 错误：d3-hierarchy 写法，partition 已展平，d.data 不存在
labels: [{ text: (d) => d.data?.name }]

// ✅ 正确：直接访问展平后字段
labels: [{ text: 'name' }]
labels: [{ text: (d) => d.name }]
```

### 错误 5：误用 ancestor-node 做分支着色
```javascript
// ❌ 错误：ancestor-node 等于节点自身 name，所有节点颜色各不相同，无分组效果
encode: { color: (d) => d['ancestor-node'] }

// ✅ 正确：用 path[1] 取一级子节点名实现分支着色
encode: { color: (d) => d.path[1] || d.path[0] }
```

### 错误 6：encode.color 函数返回值与 scale.color.domain 不匹配

`encode.color` 的函数返回值是颜色通道的**域键（domain key）**，`scale.color.domain` 必须与函数实际返回的值完全一致。

若函数返回 hex 色值而 `domain` 填数据名，`@antv/scale` 的 Ordinal scale 会把未知的 hex 字符串**动态追加**进 domain，导致图例出现 `#E63946` 这类乱码条目。

```javascript
// ❌ 错误：函数返回 hex 色值，但 domain 是数据字段名
// Ordinal scale 把 '#E63946'/'#BDBDBD' 追加到 domain，图例出现 hex 字符串条目
encode: {
  color: (d) => ['产品研发', '基础设施'].includes(d.path[1]) ? '#E63946' : '#BDBDBD',
},
scale: {
  color: {
    domain: ['产品研发', '市场营销', '运营支持', '基础设施'],  // ❌ 与函数返回值不匹配
    range: ['#E63946', '#BDBDBD', '#BDBDBD', '#E63946'],
  },
},
// 结果：domain 被污染为 ['产品研发', '市场营销', '运营支持', '基础设施', '#E63946', '#BDBDBD']
// 图例显示 6 个条目，其中包含 '#E63946'、'#BDBDBD' 字符串

// ✅ 正确：函数返回语义标签，scale.domain 精确匹配返回值
encode: {
  color: (d) => ['产品研发', '基础设施'].includes(d.path[1]) ? 'highlight' : 'muted',
},
scale: {
  color: {
    domain: ['highlight', 'muted'],  // ✅ 与函数返回值完全一致
    range: ['#E63946', '#BDBDBD'],
  },
},
// 图例只显示 2 个语义条目，颜色映射正确
```

若不需要图例，只想指定颜色映射，可直接用 `range` 不设 `domain`（利用 Ordinal 的自动 domain 收集）：

```javascript
// ✅ 不需要控制图例标签时：直接用 range，让 Ordinal 自动收集 domain
encode: { color: (d) => d.path[1] || d.path[0] },
scale: {
  color: {
    range: ['rgb(91,143,249)', 'rgb(90,216,166)', 'rgb(246,189,22)', 'rgb(232,104,74)'],
  },
},
```
