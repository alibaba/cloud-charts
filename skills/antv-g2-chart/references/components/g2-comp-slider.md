---
id: "g2-comp-slider"
title: "G2 缩略轴 / 滑条（slider）"
description: |
  slider（缩略轴）让用户通过拖拽两端控制手柄来调整图表的数据显示范围。
  常见于时间序列图表的时间范围筛选，可配置在 x 轴（sliderX）或 y 轴（sliderY）方向。
  支持设置初始值（values）、联动交互（sliderFilter interaction）。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "slider"
  - "缩略轴"
  - "sliderX"
  - "sliderY"
  - "时间筛选"
  - "范围选择"
  - "component"

related:
  - "g2-comp-scrollbar"
  - "g2-interaction-slider-filter"
  - "g2-scale-time"

use_cases:
  - "时间序列图表的时间范围交互筛选"
  - "数值范围的动态调整查看"
  - "大数据集的局部数据探索"

anti_patterns:
  - "分类轴几乎不使用缩略轴"
  - "数据量少时不需要缩略轴"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/slider"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 200 }, (_, i) => ({
  date: new Date(2020, 0, i + 1).toISOString().split('T')[0],
  value: Math.sin(i / 30) * 50 + 100 + Math.random() * 20,
}));

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: true,   // 启用 X 轴缩略轴（默认显示全部范围）
  },
});

chart.render();
```

---

## 增量修改配置

如果已有图表，只想修改某个配置项（如手柄颜色），可以使用以下方式：

```javascript
// 方式一：重新调用 options，只传需要修改的配置
chart.options({
  slider: {
    x: {
      handleIconFill: 'red',  // 只修改手柄图标填充色
    },
  },
});
chart.render();  // 需要重新渲染

// 方式二：完整配置后，在 render 前修改
const options = {
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: { x: true },
};
chart.options(options);

// 后续修改
options.slider = { x: { handleIconFill: 'red' } };
chart.options(options);
chart.render();
```

---

## 完整配置项参考

### 基础配置

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `values` | 初始选区范围，位于 0~1 区间 | `[number, number]` | `[0, 1]` |
| `slidable` | 是否允许拖动选取和手柄 | `boolean` | `true` |
| `brushable` | 是否启用刷选 | `boolean` | `true` |
| `labelFormatter` | 拖动手柄标签格式化 | `(value) => string` | - |
| `showHandle` | 是否显示拖动手柄 | `boolean` | `true` |
| `showLabel` | 是否显示拖动手柄文本 | `boolean` | `true` |
| `showLabelOnInteraction` | 在调整手柄或刷选时才显示手柄文本 | `boolean` | `false` |
| `autoFitLabel` | 是否自动调整拖动手柄文本位置 | `boolean` | `true` |
| `padding` | 缩略轴内边距 | `number \| number[]` | - |

### 选区样式（selection）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `selectionFill` | 选区填充色 | `string` | `#1783FF` |
| `selectionFillOpacity` | 选区填充透明度 | `number` | `0.15` |
| `selectionStroke` | 选区描边 | `string` | - |
| `selectionStrokeOpacity` | 选区描边透明度 | `number` | - |
| `selectionLineWidth` | 选区描边宽度 | `number` | - |
| `selectionLineDash` | 选区描边虚线配置 | `[number, number]` | - |
| `selectionOpacity` | 选区整体透明度 | `number` | - |
| `selectionShadowColor` | 选区阴影颜色 | `string` | - |
| `selectionShadowBlur` | 选区阴影模糊系数 | `number` | - |
| `selectionShadowOffsetX` | 阴影水平偏移 | `number` | - |
| `selectionShadowOffsetY` | 阴影垂直偏移 | `number` | - |
| `selectionCursor` | 选区鼠标样式 | `string` | `default` |

### 滑轨样式（track）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `trackLength` | 滑轨长度 | `number` | - |
| `trackSize` | 滑轨尺寸 | `number` | `16` |
| `trackFill` | 滑轨填充色 | `string` | `#416180` |
| `trackFillOpacity` | 滑轨填充透明度 | `number` | `1` |
| `trackStroke` | 滑轨描边 | `string` | - |
| `trackStrokeOpacity` | 滑轨描边透明度 | `number` | - |
| `trackLineWidth` | 滑轨描边宽度 | `number` | - |
| `trackLineDash` | 滑轨描边虚线配置 | `[number, number]` | - |
| `trackOpacity` | 滑轨整体透明度 | `number` | - |
| `trackShadowColor` | 滑轨阴影颜色 | `string` | - |
| `trackShadowBlur` | 滑轨阴影模糊系数 | `number` | - |
| `trackShadowOffsetX` | 阴影水平偏移 | `number` | - |
| `trackShadowOffsetY` | 阴影垂直偏移 | `number` | - |
| `trackCursor` | 滑轨鼠标样式 | `string` | `default` |

### 手柄图标样式（handleIcon）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `handleIconSize` | 手柄图标尺寸 | `number` | `10` |
| `handleIconRadius` | 手柄图标圆角 | `number` | `2` |
| `handleIconShape` | 手柄图标形状 | `string \| (type) => DisplayObject` | - |
| `handleIconFill` | **手柄图标填充色** | `string` | `#f7f7f7` |
| `handleIconFillOpacity` | 手柄图标填充透明度 | `number` | `1` |
| `handleIconStroke` | 手柄图标描边 | `string` | `#1D2129` |
| `handleIconStrokeOpacity` | 手柄图标描边透明度 | `number` | `0.25` |
| `handleIconLineWidth` | 手柄图标描边宽度 | `number` | `1` |
| `handleIconLineDash` | 手柄图标描边虚线配置 | `[number, number]` | - |
| `handleIconOpacity` | 手柄图标整体透明度 | `number` | - |
| `handleIconShadowColor` | 手柄图标阴影颜色 | `string` | - |
| `handleIconShadowBlur` | 手柄图标阴影模糊系数 | `number` | - |
| `handleIconShadowOffsetX` | 阴影水平偏移 | `number` | - |
| `handleIconShadowOffsetY` | 阴影垂直偏移 | `number` | - |
| `handleIconCursor` | 手柄图标鼠标样式 | `string` | `default` |

### 手柄标签样式（handleLabel）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `handleLabelFontSize` | 标签文字大小 | `number` | `12` |
| `handleLabelFontFamily` | 标签文字字体 | `string` | - |
| `handleLabelFontWeight` | 标签字体粗细 | `number` | `normal` |
| `handleLabelLineHeight` | 标签文字行高 | `number` | - |
| `handleLabelTextAlign` | 标签水平对齐方式 | `string` | `start` |
| `handleLabelTextBaseline` | 标签垂直基线 | `string` | `bottom` |
| `handleLabelFill` | 标签文字填充色 | `string` | `#1D2129` |
| `handleLabelFillOpacity` | 标签文字填充透明度 | `number` | `0.45` |
| `handleLabelStroke` | 标签文字描边 | `string` | - |
| `handleLabelStrokeOpacity` | 标签文字描边透明度 | `number` | - |
| `handleLabelLineWidth` | 标签文字描边宽度 | `number` | - |
| `handleLabelLineDash` | 标签文字描边虚线配置 | `[number, number]` | - |
| `handleLabelOpacity` | 标签整体透明度 | `number` | - |
| `handleLabelShadowColor` | 标签阴影颜色 | `string` | - |
| `handleLabelShadowBlur` | 标签阴影模糊系数 | `number` | - |
| `handleLabelShadowOffsetX` | 阴影水平偏移 | `number` | - |
| `handleLabelShadowOffsetY` | 阴影垂直偏移 | `number` | - |
| `handleLabelCursor` | 标签鼠标样式 | `string` | `default` |
| `handleLabelDx` | 标签水平偏移量 | `number` | `0` |
| `handleLabelDy` | 标签垂直偏移量 | `number` | `0` |

### 迷你图样式（sparkline）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `sparklineType` | 迷你图类型 | `'line' \| 'column'` | `'line'` |
| `sparklineIsStack` | 是否堆叠 | `boolean` | `false` |
| `sparklineRange` | 值范围 | `[number, number]` | - |
| `sparklineColor` | 颜色 | `string \| string[]` | - |
| `sparklineSmooth` | 平滑曲线 | `boolean` | `false` |
| `sparklineLineStroke` | 折线颜色 | `string` | - |
| `sparklineLineStrokeOpacity` | 折线透明度 | `number` | - |
| `sparklineLineLineDash` | 折线虚线配置 | `[number, number]` | - |
| `sparklineAreaFill` | 填充区域颜色 | `string` | - |
| `sparklineAreaFillOpacity` | 填充区域透明度 | `number` | - |
| `sparklineColumnFill` | 直方图条形颜色 | `string` | - |
| `sparklineColumnFillOpacity` | 直方图条形透明度 | `number` | - |
| `sparklineIsGroup` | 是否分组显示 | `boolean` | `false` |
| `sparklineSpacing` | 分组直方间距 | `number` | `0` |

---

## 常用配置示例

### 设置初始显示范围

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: {
      values: [0.5, 1.0],  // 初始显示后 50% 的数据
    },
  },
});
```

### 修改手柄图标为红色

```javascript
chart.options({
  slider: {
    x: {
      handleIconFill: 'red',
      handleIconStroke: 'darkred',
      handleIconSize: 12,
    },
  },
});
```

### 自定义手柄图标形状

```javascript
import { Circle } from '@antv/g';

chart.options({
  slider: {
    x: {
      handleIconShape: (type) => {
        // type 为 'start' 或 'end'，分别表示左右手柄
        return new Circle({
          style: {
            r: 8,
            fill: type === 'start' ? '#FF6B9D' : '#00D9FF',
            stroke: '#fff',
            lineWidth: 2,
          },
        });
      },
      handleIconSize: 16,
    },
  },
});
```

### 完整样式配置

```javascript
chart.options({
  slider: {
    x: {
      values: [0.3, 0.7],
      // 选区样式
      selectionFill: '#1890ff',
      selectionFillOpacity: 0.2,
      // 滑轨样式
      trackFill: '#f0f0f0',
      trackSize: 20,
      // 手柄图标样式
      handleIconFill: '#fff',
      handleIconStroke: '#1890ff',
      handleIconSize: 14,
      handleIconRadius: 4,
      // 手柄标签样式
      handleLabelFill: '#333',
      handleLabelFontSize: 12,
    },
  },
});
```

---

## 常见错误与修正

### 错误 1：values 超出 [0, 1] 范围

```javascript
// ❌ values 必须在 [0, 1] 区间
chart.options({ slider: { x: { values: [50, 100] } } });

// ✅ values 是数据比例（0~1）
chart.options({ slider: { x: { values: [0.5, 1.0] } } });
```

### 错误 2：样式属性名错误

```javascript
// ❌ 错误的属性名
slider: { x: { handleFill: 'red' } }  // 不存在

// ✅ 正确的属性名（带前缀）
slider: { x: { handleIconFill: 'red' } }  // 正确
```

### 错误 3：与 scrollbar 混淆

```javascript
// slider：两端手柄可分别拖动，窗口大小可变
slider: { x: { values: [0.3, 0.7] } }

// scrollbar：固定窗口大小，只能整体滑动
scrollbar: { x: { ratio: 0.4 } }
```