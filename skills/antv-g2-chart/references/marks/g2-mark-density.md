---
id: "g2-mark-density"
title: "G2 密度图（density）"
description: |
  density mark 通过核密度估计（KDE）将散点分布转换为连续的密度分布曲线或面积图，
  展示数据的概率密度。必须配合 KDE 数据变换（data.transform）预处理，
  适合大量重叠点的分布可视化。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "density"
  - "密度图"
  - "KDE"
  - "分布"
  - "核密度"
  - "violin"

related:
  - "g2-mark-boxplot"
  - "g2-mark-point-scatter"
  - "g2-data-kde"

use_cases:
  - "展示连续数值数据的分布形状"
  - "小提琴图（density + 极坐标 + 对称变换）"
  - "与箱线图对比展示数据分布"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/density"
---

## 核心概念

**density mark 必须配合 KDE 数据变换使用**：

- KDE 是**数据变换（Data Transform）**，配置在 `data.transform` 中
- density mark 需要的 encode 通道：`x`、`y`、`size`、`series`（均必选）

**关键配置结构**：
```javascript
chart.options({
  type: 'density',
  data: {
    type: 'fetch',  // 或 'inline'
    value: '...',
    transform: [{ type: 'kde', field: 'y', groupBy: ['x', 'species'] }],
  },
  encode: {
    x: 'x',
    y: 'y',       // ← KDE 输出字段（默认 'y'），不是原始 field 名！
    size: 'size', // ← KDE 输出字段（默认 'size'）
    series: 'species', // 必选：系列分组
  },
});
```

**⚠️ `encode.y` 必须对应 KDE 的输出字段（默认 `'y'`），而非原始字段名**：无论 `field` 叫什么（`'value'`、`'score'` 等），KDE 输出都固定写入 `as` 指定的字段（默认 `['y', 'size']`）。

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      {
        type: 'kde',           // KDE 数据变换
        field: 'y',            // 做核密度估计的字段
        groupBy: ['x', 'species'],  // 分组字段
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'species',
    size: 'size',      // 必选：映射密度大小
    series: 'species', // 必选：系列分组
  },
  tooltip: false,
});

chart.render();
```

## 分组密度图（多类别对比）

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      {
        type: 'kde',
        field: 'y',
        groupBy: ['x'],  // 按 x 分组
        size: 20,        // 带宽参数
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'x',
    size: 'size',
    series: 'x',
  },
  tooltip: false,
});
```

## 极坐标密度图

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      { type: 'kde', field: 'y', groupBy: ['x', 'species'] },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'species',
    size: 'size',
    series: 'species',
  },
  coordinate: { type: 'polar' },  // 极坐标系
  tooltip: false,
});
```

## 常见错误与修正

### 错误 1：kde 配置位置错误

```javascript
// ❌ 错误：kde 不是 data.type，而是 data.transform
chart.options({
  type: 'density',
  data: {
    type: 'kde',  // ❌ 错误！kde 不是数据连接器类型
    field: 'value',
  },
});

// ✅ 正确：kde 是数据变换，放在 data.transform 中
chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://example.com/data.json',
    transform: [{ type: 'kde', field: 'y', groupBy: ['x'] }],  // ✅ 正确
  },
});
```

### 错误 2：缺少必选的 encode 通道

```javascript
// ❌ 错误：缺少 size 和 series 通道
chart.options({
  type: 'density',
  data: { /* ... */ },
  encode: { x: 'x', y: 'y' },  // ❌ 缺少 size 和 series
});

// ✅ 正确：包含所有必选通道
chart.options({
  type: 'density',
  data: { /* ... */ },
  encode: {
    x: 'x',
    y: 'y',
    size: 'size',      // 必选
    series: 'species', // 必选
  },
});
```

### 错误 3：encode.y 使用了原始字段名而非 KDE 输出字段名

最常见的命名混淆：原始字段叫 `value`，误以为 encode 也写 `y: 'value'`。

```javascript
// ❌ 错误：field: 'value' 是 KDE 的输入；但 encode.y 要用 KDE 的输出字段
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ type: 'kde', field: 'value', groupBy: ['group'] }],
    //                                ↑ 原始字段叫 'value'
  },
  encode: {
    x: 'group',
    y: 'value',  // ❌ 'value' 是原始标量，不是 KDE 输出的密度数组
    size: 'size',
    series: 'group',
  },
});

// ✅ 正确：encode.y 对应 KDE 输出字段（默认 as[0] = 'y'）
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ type: 'kde', field: 'value', groupBy: ['group'] }],
  },
  encode: {
    x: 'group',
    y: 'y',      // ✅ KDE 默认输出字段名是 'y'，不是 'value'
    size: 'size',
    series: 'group',
  },
});
```

**记忆规则**：`field` 是 KDE 的**输入**，`as`（默认 `['y', 'size']`）是 KDE 的**输出**，encode 必须用**输出字段名**。

### 错误 4：数据零方差或单点组导致 KDE 退化（图表空白）

当某分组数据只有 1 个点，或所有值完全相同（方差 = 0）时，KDE 内部 min=max，出现除以零，产生 NaN，该组密度图不渲染。

```javascript
// ❌ 问题数据：零方差 / 单点，KDE 静默失败
const data = [
  { group: '低负荷', value: 0 },           // 只有 1 个点
  { group: '中负荷', value: 20 },
  { group: '中负荷', value: 20 },          // 9 个完全相同的值
  // ...
];

// ✅ 解决方案1：指定 min/max 扩展 KDE 范围，避免零区间
transform: [{
  type: 'kde',
  field: 'value',
  groupBy: ['group'],
  min: -10,   // 手动指定范围，确保 min ≠ max
  max: 50,
}]

// ✅ 解决方案2：数据点太少时，改用箱线图或散点图代替密度图
// KDE 建议每组至少 5-10 个不同值才能产生有意义的密度曲线
```

### 错误 5：直接使用原始数据

```javascript
// ❌ 错误：原始数据没有经过 KDE 变换，没有 size 字段
chart.options({
  type: 'density',
  data: rawPoints,  // ❌ 需要先经过 kde 变换
  encode: { x: 'x', y: 'y', size: 'size' },
});

// ✅ 正确：使用 data.transform 进行 KDE 预处理
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawPoints,
    transform: [{ type: 'kde', field: 'y', groupBy: ['x'] }],
  },
  encode: { x: 'x', y: 'y', size: 'size', series: 'x' },
});
```

### 错误 6：在组合视图中未正确传递数据

在组合视图 (`type: 'view'`) 中，如果 `children` 子图没有显式声明 `data`，会继承父级数据。但若子图需要特定的数据变换（如 KDE），必须显式声明自己的 `data` 配置。

```javascript
// ❌ 错误：子图未声明 data，无法应用 KDE 变换
chart.options({
  type: 'view',
  data: rawData,
  children: [{
    type: 'density',
    // 缺少 data 配置，transform 无效
    encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
  }]
});

// ✅ 正确：子图显式声明 data 并应用 KDE 变换
chart.options({
  type: 'view',
  data: rawData,
  children: [{
    type: 'density',
    data: {
      // 显式声明 data，即使与父级相同
      type: 'inline',
      value: rawData,
      transform: [{ type: 'kde', field: 'y', groupBy: ['x', 'species'] }],
    },
    encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
  }]
});
```

### 错误 7：KDE 分组字段配置不当导致数据不足

当 `groupBy` 字段划分过细，导致某些分组内的数据点过少（如小于等于1个），KDE 无法计算有效的密度分布，该分组不会被渲染。

```javascript
// ❌ 错误：groupBy 包含过多字段，导致某些分组只有一个数据点
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ 
      type: 'kde', 
      field: 'y', 
      groupBy: ['x', 'species', 'extraCategory'] // 分组过细，可能造成某些组只有一个点
    }],
  },
  encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
});

// ✅ 正确：合理选择 groupBy 字段，保证每组有足够的数据点
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ 
      type: 'kde', 
      field: 'y', 
      groupBy: ['x', 'species'] // 合理分组，保证每组数据充足
    }],
  },
  encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
});
```

### 错误 8：KDE 输出字段名与 encode 映射不一致导致图表空白

在 KDE 变换中使用 `as` 自定义输出字段名时，必须确保 `encode` 中的 `y` 和 `size` 通道引用的是正确的自定义字段名。

```javascript
// ❌ 错误：KDE 输出字段名为 density_x 和 density_y，但 encode 引用了默认字段名
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{
      type: 'kde',
      field: 'y',
      groupBy: ['x'],
      as: ['density_x', 'density_y']
    }]
  },
  encode: {
    x: 'x',
    y: 'y',       // ❌ 应为 'density_x'
    size: 'size', // ❌ 应为 'density_y'
    series: 'x'
  }
});

// ✅ 正确：encode 中引用 KDE 输出的自定义字段名
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{
      type: 'kde',
      field: 'y',
      groupBy: ['x'],
      as: ['density_x', 'density_y']
    }]
  },
  encode: {
    x: 'x',
    y: 'density_x',  // ✅ 正确引用自定义字段名
    size: 'density_y', // ✅ 正确引用自定义字段名
    series: 'x'
  }
});
```

### 错误 9：KDE 分组后每组样本数过少导致图表空白

KDE 算法要求每组数据具有足够的样本点（建议每组至少 5~10 个不同值）才能有效计算密度分布。若分组后每组样本数过少，可能导致图表渲染为空白。

```javascript
// ❌ 错误：分组后每组样本数过少
const insufficientData = [
  { group: 'A', value: 1 },
  { group: 'A', value: 1 },
  { group: 'B', value: 2 },
  { group: 'B', value: 2 }
];

chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: insufficientData,
    transform: [{ type: 'kde', field: 'value', groupBy: ['group'] }]
  },
  encode: { x: 'group', y: 'y', size: 'size', series: 'group' }
});

// ✅ 解决方案：合并分组或增加样本数，或改用其他图表类型
const sufficientData = [
  { group: 'A', value: 1 }, { group: 'A', value: 1.1 }, { group: 'A', value: 1.2 },
  { group: 'A', value: 1.3 }, { group: 'A', value: 1.4 }, { group: 'B', value: 2 },
  { group: 'B', value: 2.1 }, { group: 'B', value: 2.2 }, { group: 'B', value: 2.3 },
  { group: 'B', value: 2.4 }
];
```

## 配置项

### encode 通道

| 属性   | 描述                                     | 必选 |
|--------|------------------------------------------|------|
| x      | X 轴字段，时间或有序分类字段             | ✓    |
| y      | Y 轴字段，数值字段（KDE 输出字段）       | ✓    |
| size   | 密度大小字段（KDE 变换后生成）           | ✓    |
| series | 系列分组字段                             | ✓    |
| color  | 颜色映射字段                            |      |

### coordinate 坐标系

| 坐标系     | 类型         | 用途             |
|------------|--------------|------------------|
| 直角坐标系 | `'cartesian'` | 默认，和密度图等 |
| 极坐标系   | `'polar'`     | 极坐标小提琴图等 |
| 对称坐标系 | `'transpose'` | 对称小提琴图等   |