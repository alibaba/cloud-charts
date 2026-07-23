---
id: "g2-comp-scrollbar"
title: "G2 滚动条（scrollbar）"
description: |
  scrollbar 组件让用户滚动查看超出画布范围的数据，适合数据条目过多时的浏览。
  滚动条可配置在 x 轴（scrollbarX）或 y 轴（scrollbarY）方向。
  与 slider 不同，scrollbar 是固定比例窗口的滚动，slider 支持调整窗口大小。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "scrollbar"
  - "滚动条"
  - "数据浏览"
  - "scrollbarX"
  - "scrollbarY"
  - "component"

related:
  - "g2-comp-slider"
  - "g2-interaction-scrollbar-filter"

use_cases:
  - "分类项目太多时水平滚动查看（> 20 个类别）"
  - "时间序列数据太长时滚动浏览"
  - "固定可视窗口大小、滚动查看全部数据"

anti_patterns:
  - "数据量不多时不需要滚动条"
  - "需要调整窗口大小时应使用 slider"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/scrollbar"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 50 个分类项目
const data = Array.from({ length: 50 }, (_, i) => ({
  category: `类别${i + 1}`,
  value: Math.random() * 100,
}));

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scrollbar: {
    x: true,   // 启用 X 轴滚动条
  },
  legend: false,
});

chart.render();
```

---

## 增量修改配置

如果已有图表，只想修改某个配置项（如滑块颜色），可以使用以下方式：

```javascript
// 方式一：重新调用 options，只传需要修改的配置
chart.options({
  scrollbar: {
    x: {
      thumbFill: 'red',  // 只修改滑块填充色
    },
  },
});
chart.render();  // 需要重新渲染

// 方式二：完整配置后修改
const options = {
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  scrollbar: { x: true },
};
chart.options(options);

// 后续修改
options.scrollbar = { x: { thumbFill: 'red' } };
chart.options(options);
chart.render();
```

---

## 完整配置项参考

### 基础配置

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `ratio` | 滚动条的比例，单页显示数据在总数据量上的比例 | `number` | `0.5` |
| `value` | 滚动条的起始位置（0~1），水平默认 0，垂直默认 1 | `number` | - |
| `slidable` | 是否可以拖动 | `boolean` | `true` |
| `position` | 滚动条相对图表方位 | `string` | `'bottom'` |
| `isRound` | 滚动条样式是否为圆角 | `boolean` | `true` |

### 滑块样式（thumb）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `thumbFill` | **滑块填充色** | `string` | `#000` |
| `thumbFillOpacity` | 滑块填充透明度 | `number` | `0.15` |
| `thumbStroke` | 滑块描边颜色 | `string` | - |
| `thumbLineWidth` | 滑块描边宽度 | `number` | - |
| `thumbStrokeOpacity` | 滑块描边透明度 | `number` | - |
| `thumbLineDash` | 滑块虚线配置 | `[number, number]` | - |
| `thumbOpacity` | 滑块整体透明度 | `number` | - |
| `thumbShadowColor` | 滑块阴影颜色 | `string` | - |
| `thumbShadowBlur` | 滑块阴影模糊系数 | `number` | - |
| `thumbShadowOffsetX` | 阴影水平偏移 | `number` | - |
| `thumbShadowOffsetY` | 阴影垂直偏移 | `number` | - |
| `thumbCursor` | 滑块鼠标样式 | `string` | `default` |

### 滑轨样式（track）

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `trackSize` | 滑轨宽度 | `number` | `10` |
| `trackLength` | 滑轨长度 | `number` | - |
| `trackFill` | 滑轨填充色 | `string` | - |
| `trackFillOpacity` | 滑轨填充透明度 | `number` | `0` |
| `trackStroke` | 滑轨描边颜色 | `string` | - |
| `trackLineWidth` | 滑轨描边宽度 | `number` | - |
| `trackStrokeOpacity` | 滑轨描边透明度 | `number` | - |
| `trackLineDash` | 滑轨虚线配置 | `[number, number]` | - |
| `trackOpacity` | 滑轨整体透明度 | `number` | - |
| `trackShadowColor` | 滑轨阴影颜色 | `string` | - |
| `trackShadowBlur` | 滑轨阴影模糊系数 | `number` | - |
| `trackShadowOffsetX` | 阴影水平偏移 | `number` | - |
| `trackShadowOffsetY` | 阴影垂直偏移 | `number` | - |
| `trackCursor` | 滑轨鼠标样式 | `string` | `default` |

---

## 常用配置示例

### 配置滚动条样式和初始位置

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'date', y: 'value' },
  scrollbar: {
    x: {
      ratio: 0.2,      // 可视窗口占全部数据的比例
      value: 0,        // 初始滚动位置（0=最左，1=最右）
      // 滑轨样式
      trackSize: 14,
      trackFill: '#f0f0f0',
      trackFillOpacity: 1,
      // 滑块样式
      thumbFill: '#5B8FF9',
      thumbFillOpacity: 0.5,
    },
  },
});
```

### 修改滑块颜色为红色

```javascript
chart.options({
  scrollbar: {
    x: {
      thumbFill: 'red',
      thumbFillOpacity: 0.3,
      thumbStroke: 'darkred',
      thumbLineWidth: 1,
    },
  },
});
```

### Y 轴滚动条

```javascript
chart.options({
  type: 'interval',
  data: manyRowsData,
  encode: { x: 'value', y: 'category' },
  coordinate: { transform: [{ type: 'transpose' }] },
  scrollbar: {
    y: {
      ratio: 0.3,   // 每次只显示 30% 的数据
      value: 0.5,   // 从中间开始
    },
  },
});
```

### 同时配置 X 和 Y 滚动条

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'letter', y: 'frequency' },
  scrollbar: {
    x: {
      ratio: 0.2,
      trackSize: 14,
      trackFill: '#000',
      trackFillOpacity: 1,
    },
    y: {
      ratio: 0.5,
      trackSize: 12,
      value: 0.1,
      trackFill: '#000',
      trackFillOpacity: 1,
    },
  },
});
```

---

## 常见错误与修正

### 错误 1：样式属性名错误

```javascript
// ❌ 错误的属性名
scrollbar: { x: { fill: 'red' } }  // 不存在

// ✅ 正确的属性名（带前缀）
scrollbar: { x: { thumbFill: 'red' } }  // 修改滑块颜色
scrollbar: { x: { trackFill: '#f0f0f0' } }  // 修改滑轨颜色
```

### 错误 2：与 slider 混淆

```javascript
// scrollbar：固定窗口大小，只能移动，不能缩放
scrollbar: { x: { ratio: 0.2 } }  // 总是显示 20% 的数据

// slider：可以拖拽两端调整显示范围
slider: { x: { values: [0, 0.2] } }  // 可以拖拽调整到任意范围
```

### 错误 3：数据量不多却使用滚动条

```javascript
// ❌ 只有 10 个分类，不需要滚动条
chart.options({ scrollbar: { x: true } });  // 多余

// ✅ 通常在 > 20 个类别或时序数据较长时才考虑
// 少量数据时建议直接调整 chart.width 或坐标轴旋转标签
```

### 错误 4：scrollbar 写在 style 里

```javascript
// ❌ 错误：样式属性直接写在配置项，不是 style 对象里
scrollbar: { x: { style: { thumbFill: 'red' } } }

// ✅ 正确：样式属性直接写在配置项
scrollbar: { x: { thumbFill: 'red' } }
```