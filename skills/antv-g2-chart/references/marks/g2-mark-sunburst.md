---
id: "g2-mark-sunburst"
title: "G2 旭日图（sunburst）"
description: |
  sunburst mark 用同心圆环（极坐标）展示多层级层次数据，来自 @antv/g2-extension-plot 扩展库。
  圆环的径向深度表示层级，弧长角度表示数值大小。
  注意：sunburst 与 partition 是两个独立的 mark：
  sunburst 为圆环布局（极坐标，需要扩展），partition 为矩形冰柱布局（直角坐标，@antv/g2 核心）。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "旭日图"
  - "sunburst"
  - "层次结构"
  - "多层级"
  - "hierarchy"
  - "polar"
  - "g2-extension-plot"

related:
  - "g2-mark-partition"
  - "g2-mark-treemap"
  - "g2-mark-arc-pie"

use_cases:
  - "组织架构展示"
  - "文件系统分析"
  - "预算分配的层次占比"

anti_patterns:
  - "层级过深（>4层）应使用矩形树图或 partition"
  - "不要用 type: 'partition' 加极坐标替代 sunburst，应直接使用 sunburst"
  - "不要把 data 写成数组，sunburst 的 data 是 { value: treeRoot } 对象"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-04-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/sunburst"
---

## partition vs sunburst 对比

| 特性 | sunburst（旭日图）| partition（矩形分区）|
|------|-------------------|----------------------|
| 来源 | `@antv/g2-extension-plot`，需要 `extend` | `@antv/g2` 核心，无需扩展 |
| 坐标系 | 极坐标（同心圆）| 笛卡尔坐标（直角）|
| 视觉形态 | 同心圆环 | 矩形冰柱/icicle |
| data 格式 | `{ value: treeRoot }` 或 fetch | 数组 `[treeRoot]` 或 fetch |
| 回调中 path | `d.path` 是**字符串** `'A / B / C'` | `d.path` 是**数组** `['A', 'B', 'C']` |

## 引入扩展（必须）

```javascript
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';

const Chart = extend(Runtime, { ...corelib(), ...plotlib() });
```

## 最小可运行示例

```javascript
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';

const Chart = extend(Runtime, { ...corelib(), ...plotlib() });

const chart = new Chart({ container: 'container', autoFit: true });

chart.options({
  type: 'sunburst',
  data: {
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/sunburst.json',
  },
  encode: { value: 'sum' },
  labels: [
    {
      text: 'name',
      transform: [{ type: 'overflowHide' }],
    },
  ],
});

chart.render();
```

## 数据格式说明

`sunburst` 的 `data` 是 `{ value: treeRoot }` 对象（单棵树），不是数组：

```javascript
// ✅ 正确：内联数据，单棵树根对象
chart.options({
  type: 'sunburst',
  data: {
    value: {
      name: 'root',
      children: [
        { name: '分组1', children: [{ name: '分组1-1', sum: 100 }] },
        { name: '分组2', sum: 200 },
      ],
    },
  },
  encode: { value: 'sum' },
});

// ✅ 正确：远程 fetch
chart.options({
  type: 'sunburst',
  data: { type: 'fetch', value: 'https://example.com/tree.json' },
  encode: { value: 'sum' },
});

// ❌ 错误：不能直接传数组（partition 的写法）
chart.options({
  type: 'sunburst',
  data: [{ name: 'root', children: [...] }],  // ❌ 不工作
});
```

## 回调函数中的数据结构

sunburst 展平后，回调中 `d` 的结构：

```javascript
{
  name: '分组1-1',             // 节点名称
  value: 100,                  // 节点数值（子树汇总）
  depth: 2,                    // 层级深度（根节点为 1）
  path: '分组1 / 分组1-1',     // ← 路径是字符串（/ 分隔）
  'ancestor-node': '分组1',   // 第一层祖先节点名
  x: [x0, x1],
  y: [y0, y1],
}
```

**注意**：`path` 是**字符串**，用 ` / ` 分隔，与 partition 的数组不同。

## encode 着色策略

sunburst 展平后内置字段（`name`、`depth`、`path`、`ancestor-node`）可用字符串指定；
原始数据中的自定义字段不在展平记录中，需用回调通过 `path` 派生：

```javascript
// ✅ 默认着色（按 ancestor-node，同门类同色）
encode: { value: 'sum' }  // color 默认为 'ancestor-node'

// ✅ 按 name 字段着色（内置字段，字符串可用）
encode: { value: 'sum', color: 'name' }

// ✅ 按路径前两级着色（回调）
encode: {
  value: 'sum',
  color: (d) => {
    const parts = d.path.split(' / ');
    return [parts[0], parts[1]].join('/');
  },
}

// ✅ 按层级深度着色
encode: { value: 'sum', color: (d) => d.depth }
```

## 极坐标自定义

```javascript
// 调整内外半径
chart.options({
  type: 'sunburst',
  data: { value: treeData },
  encode: { value: 'sum' },
  coordinate: {
    type: 'polar',
    innerRadius: 0.3,   // 默认 0.2
    outerRadius: 0.9,
  },
});

// 还原为直角坐标（得到类似 partition 的矩形布局，但用 partition 更合适）
coordinate: { type: 'cartesian' }
```

## 下钻交互

```javascript
chart.options({
  type: 'sunburst',
  data: { value: treeData },
  encode: { value: 'sum' },
  interaction: {
    drillDown: {
      breadCrumb: {
        rootText: '总名称',
        style: { fontSize: '14px', fill: '#333' },
        active: { fill: 'red' },
      },
      isFixedColor: true,   // 下钻后维持原来颜色
    },
  },
});
```

## 常见错误与修正

### 错误 1：未引入扩展库
```javascript
// ❌ 错误：直接用 Chart from '@antv/g2'，sunburst 未注册
import { Chart } from '@antv/g2';
chart.options({ type: 'sunburst', ... });  // ❌ Unknown mark type: sunburst

// ✅ 正确：通过 extend 注册 plotlib
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';
const Chart = extend(Runtime, { ...corelib(), ...plotlib() });
```

### 错误 2：data 使用 partition 的数组格式
```javascript
// ❌ 错误：sunburst 不接受数组
chart.options({
  type: 'sunburst',
  data: [{ name: 'root', children: [...] }],
});

// ✅ 正确：sunburst 使用 { value: root } 对象
chart.options({
  type: 'sunburst',
  data: { value: { name: 'root', children: [...] } },
});
```

### 错误 3：把 path 当数组处理
```javascript
// ❌ 错误：sunburst 的 path 是字符串
color: (d) => d.path[1]          // 拿到的是第 2 个字符，不是第 2 层路径

// ✅ 正确：先 split
color: (d) => d.path.split(' / ')[1]
```
