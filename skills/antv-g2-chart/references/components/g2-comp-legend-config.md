---
id: "g2-comp-legend-config"
title: "G2 图例配置（legend）"
description: |
  详解 G2 v5 Spec 模式中 legend 字段的配置，
  涵盖图例位置、布局、标题、颜色图例、过滤交互及隐藏图例等用法。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "legend"
  - "图例"
  - "位置"
  - "过滤"
  - "颜色图例"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-interaction-legend-filter"
  - "g2-comp-axis-config"
  - "g2-comp-legend-category"
  - "g2-comp-legend-continuous"

use_cases:
  - "调整图例位置和布局"
  - "自定义图例标题和样式"
  - "隐藏不需要的图例"
  - "配置连续颜色图例（色带）"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/legend"
---

## 基本用法

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  legend: {
    color: {               // 对应 encode.color 通道的图例
      position: 'bottom',  // 'top'(默认) | 'bottom' | 'left' | 'right'
    },
  },
});

chart.render();
```

---

## 增量修改配置

如果已有图表，只想修改某个配置项（如图例位置），可以使用以下方式：

```javascript
// 方式一：重新调用 options，只传需要修改的配置
chart.options({
  legend: {
    color: {
      position: 'right',  // 只修改位置
    },
  },
});
chart.render();  // 需要重新渲染

// 方式二：完整配置后修改
const options = {
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  legend: { color: { position: 'top' } },
};
chart.options(options);

// 后续修改
options.legend = { color: { position: 'bottom' } };
chart.options(options);
chart.render();
```

---

## 完整配置项参考

### 通用配置（分类图例 & 连续图例）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `position` | 图例位置 | `'top' \| 'right' \| 'left' \| 'bottom'` | `'top'` |
| `orientation` | 图例朝向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `layout` | Flex 布局配置 | `{ justifyContent, alignItems, flexDirection }` | - |
| `size` | 图例容器尺寸 | `number` | - |
| `length` | 图例容器长度 | `number` | - |
| `crossPadding` | 图例到图表区域的距离 | `number` | `12` |
| `order` | 布局排序 | `number` | `1` |
| `title` | 图例标题 | `string \| string[]` | - |

### 分类图例配置

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `cols` | 每行显示的图例项数量 | `number` | - |
| `colPadding` | 图例项横向间隔 | `number` | `12` |
| `rowPadding` | 图例项纵向间隔 | `number` | `8` |
| `maxRows` | 图例最大行数 | `number` | `3` |
| `maxCols` | 图例最大列数 | `number` | `3` |
| `itemWidth` | 图例项宽度 | `number` | - |
| `itemSpan` | 图例项图标、标签、值的空间划分 | `number \| number[]` | `[1, 1, 1]` |
| `itemSpacing` | 图例项内部间距 | `number \| number[]` | `[8, 8, 4]` |
| `focus` | 是否启用图例聚焦 | `boolean` | `false` |
| `focusMarkerSize` | 图例聚焦图标大小 | `number` | `12` |
| `defaultSelect` | 默认选中的图例项 | `string[]` | - |

### 图例项图标样式（itemMarker）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `itemMarker` | 图例项图标 | `string \| (datum, index, data) => string` | - |
| `itemMarkerSize` | 图标大小 | `number` | `8` |
| `itemMarkerFill` | **图标填充色** | `string` | - |
| `itemMarkerFillOpacity` | 图标填充透明度 | `number` | - |
| `itemMarkerStroke` | 图标描边 | `string` | - |
| `itemMarkerStrokeOpacity` | 图标描边透明度 | `number` | - |
| `itemMarkerLineWidth` | 图标描边宽度 | `number` | - |
| `itemMarkerRadius` | 图标圆角 | `number` | - |

### 图例项标签样式（itemLabel）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `itemLabelFill` | **标签文字填充色** | `string` | `#333` |
| `itemLabelFillOpacity` | 标签文字填充透明度 | `number` | - |
| `itemLabelFontSize` | 标签文字大小 | `number` | `12` |
| `itemLabelFontFamily` | 标签文字字体 | `string` | - |
| `itemLabelFontWeight` | 标签字体粗细 | `number \| string` | - |
| `itemLabelTextAlign` | 标签水平对齐方式 | `string` | - |
| `itemLabelTextBaseline` | 标签垂直基线 | `string` | - |
| `itemLabelStroke` | 标签文字描边 | `string` | - |
| `itemLabelLineWidth` | 标签文字描边宽度 | `number` | - |
| `itemLabelDx` | 标签水平偏移量 | `number` | - |
| `itemLabelDy` | 标签垂直偏移量 | `number` | - |

### 图例项值样式（itemValue）

图例项右侧可以额外显示一个"值"列（通过 `formatter` 或数据字段），适合显示数量、百分比等辅助信息。

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `itemValueFill` | 值文字填充色 | `string` | `#1D2129` |
| `itemValueFillOpacity` | 值文字填充透明度 | `number` | `0.65` |
| `itemValueFontSize` | 值文字大小 | `number` | `12` |
| `itemValueFontFamily` | 值文字字体 | `string` | - |
| `itemValueFontWeight` | 值文字字体粗细 | `number \| string` | - |
| `itemValueStroke` | 值文字描边 | `string` | - |
| `itemValueLineWidth` | 值文字描边宽度 | `number` | - |

### 图例项背景样式（itemBackground）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `itemBackgroundFill` | 图例项背景填充色 | `string` | - |
| `itemBackgroundFillOpacity` | 图例项背景填充透明度 | `number` | - |
| `itemBackgroundStroke` | 图例项背景描边 | `string` | - |
| `itemBackgroundStrokeOpacity` | 图例项背景描边透明度 | `number` | - |
| `itemBackgroundLineWidth` | 图例项背景描边宽度 | `number` | - |
| `itemBackgroundRadius` | 图例项背景圆角 | `number` | - |

### 图例标题样式（title）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `titleFill` | **标题填充色** | `string` | `#666` |
| `titleFillOpacity` | 标题填充透明度 | `number` | - |
| `titleFontSize` | 标题字体大小 | `number` | `12` |
| `titleFontFamily` | 标题字体 | `string` | - |
| `titleFontWeight` | 标题字体粗细 | `number \| string` | - |
| `titleStroke` | 标题描边 | `string` | - |
| `titleLineWidth` | 标题描边宽度 | `number` | - |
| `titleSpacing` | 标题与图例项的间距 | `number` | - |

### 连续图例配置

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `color` | 色带颜色 | `string[]` | - |
| `block` | 是否按区间显示 | `boolean` | `false` |
| `type` | 连续图例类型 | `'size' \| 'color'` | `'color'` |

---

## 常用配置示例

### 隐藏图例

```javascript
// 隐藏特定通道的图例
legend: { color: false }

// 全部隐藏（不常用）
legend: false
```

### 修改图例位置和布局

```javascript
chart.options({
  legend: {
    color: {
      position: 'bottom',
      layout: {
        justifyContent: 'center',  // 水平居中
        alignItems: 'center',      // 垂直居中
      },
    },
  },
});
```

### 修改图例项图标颜色

```javascript
chart.options({
  legend: {
    color: {
      itemMarkerFill: 'red',       // 图标填充色
      itemMarkerSize: 10,          // 图标大小
      itemMarkerStroke: 'darkred', // 图标描边
    },
  },
});
```

### 修改图例标签颜色

```javascript
chart.options({
  legend: {
    color: {
      itemLabelFill: '#333',
      itemLabelFontSize: 14,
      itemLabelFontWeight: 'bold',
    },
  },
});
```

### 修改图例标题样式

```javascript
chart.options({
  legend: {
    color: {
      title: '产品类型',
      titleFill: '#1D2129',
      titleFontSize: 14,
      titleFontWeight: 'bold',
      titleSpacing: 12,
    },
  },
});
```

### 饼图图例放底部居中

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  legend: {
    color: {
      position: 'bottom',
      layout: { justifyContent: 'center' },
    },
  },
});
```

### 连续颜色图例（色带）

当 `color` 通道映射连续数值时，图例自动变为色带形式。

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },  // value 是连续数值
  scale: { color: { palette: 'Blues' } },
  legend: {
    color: {
      position: 'right',
      length: 200,
      labelFormatter: (v) => Number(v).toFixed(0),  // 注意：v 可能是 string，需先转换为数字
    },
  },
});
```

> **更多连续图例配置**：[连续图例详细文档](g2-comp-legend-continuous.md) 涵盖阈值图例、size 通道图例、自定义色带等高级用法。

---

## 常见错误与修正

### 错误 1：legend 写成数组

```javascript
// ❌ 错误：legend 是对象，不是数组
chart.options({ legend: [{ color: { position: 'bottom' } }] });

// ✅ 正确
chart.options({ legend: { color: { position: 'bottom' } } });
```

### 错误 2：legend.color 与 encode.color 不对应

```javascript
// ❌ 错误：encode 没有 color 通道，配置 legend.color 无效
chart.options({
  encode: { x: 'month', y: 'value' },  // 没有 color
  legend: { color: { position: 'bottom' } },
});

// ✅ 正确：只有 encode.color 有映射时，legend.color 才有效
chart.options({
  encode: { x: 'month', y: 'value', color: 'type' },
  legend: { color: { position: 'bottom' } },
});
```

### 错误 3：样式属性名错误

```javascript
// ❌ 错误的属性名
legend: { color: { markerFill: 'red' } }  // 不存在

// ✅ 正确的属性名（带前缀）
legend: { color: { itemMarkerFill: 'red' } }  // 正确
```

### 错误 4：混淆图例标题与图表标题

```javascript
// ❌ 图例标题写在 axis 里
axis: { x: { title: '产品类型' } }  // 这是 X 轴标题

// ✅ 图例标题在 legend 里
legend: { color: { title: '产品类型' } }  // 这是图例标题
```

---

## 图例与 Label 的布局冲突

### 饼图外侧 label + 顶部 legend 重叠

饼图使用 `position: 'outside'` 或 `'spider'` 的 label 时，标签分布在饼图周围的上下左右。如果 legend 使用默认的 `position: 'top'`，顶部的 label 和 legend 会发生重叠。

```javascript
// ❌ 错误：spider label + 默认 top legend → 上方空间冲突
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  labels: [{ text: 'type', position: 'spider' }],
  // legend 默认 'top'，与顶部 spider label 重叠
});

// ✅ 方案一：legend 移到 bottom（推荐）
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  labels: [{ text: 'type', position: 'spider' }],
  legend: {
    color: {
      position: 'bottom',
      layout: { justifyContent: 'center' },
    },
  },
});

// ✅ 方案二：增大 paddingTop 留出空间
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  labels: [{ text: 'type', position: 'spider' }],
  paddingTop: 60,
});
```

**适用范围**：所有使用 `position: 'outside'` / `'spider'` / `'surround'` 标签的非笛卡尔坐标图（饼图、环形图、玫瑰图）。