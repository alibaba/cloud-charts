---
id: "g2-mark-spiral"
title: "G2 螺旋图（spiral）"
description: |
  螺旋图使用 helix 坐标系（coordinate.type: 'helix'）将时间序列数据绘制成螺旋形状，
  从中心向外延伸。适合展示大量时间序列数据的周期性规律和变化趋势（通常 100+ 数据点）。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "螺旋图"
  - "spiral"
  - "helix"
  - "时间序列"
  - "周期性"
  - "大数据量"

related:
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"

use_cases:
  - "大量时间序列数据的趋势展示（100+ 数据点）"
  - "周期性数据规律识别（如年度季节性）"
  - "基因表达时间序列"

anti_patterns:
  - "少量数据（< 30 条）不适合，改用折线图"
  - "需要精确数值对比不适合，螺旋非线性坐标难以精确读值"
  - "animate.enter 不能使用 growInX/growInY，会导致螺旋渲染残缺，必须用 fadeIn"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/spiral"
---

## 核心概念

**螺旋图 = interval/line mark + `coordinate: { type: 'helix', startAngle, endAngle }`**

- `coordinate.type: 'helix'`：阿基米德螺旋坐标系
- `startAngle`：螺旋起始角（弧度），`Math.PI / 2` ≈ 从顶部开始
- `endAngle`：螺旋结束角，值越大螺旋圈数越多
- **数据量要求**：通常需要 100 条以上才能形成完整螺旋

**角度与圈数关系**：`圈数 = (endAngle - startAngle) / (2 * Math.PI)`

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500,
});

chart.options({
  type: 'interval',
  data: {
    value: [
      { time: '2025.07.11', value: 35 },
      { time: '2025.07.12', value: 30 },
      { time: '2025.07.13', value: 55 },
      // ... 更多数据（100+ 条）
    ],
  },
  encode: { x: 'time', y: 'value', color: 'value' },
  scale: {
    color: { type: 'linear', range: ['#ffffff', '#1890FF'] },
  },
  coordinate: {
    type: 'helix',
    startAngle: Math.PI / 2,              // 从顶部开始
    endAngle: Math.PI / 2 + 6 * Math.PI, // 转3圈（每圈 2π）
  },
  animate: { enter: { type: 'fadeIn' } },
  tooltip: { title: 'time' },
});

chart.render();
```

## 常用角度配置

```javascript
// 标准螺旋（约6圈，适合一年每周数据）
coordinate: {
  type: 'helix',
  startAngle: 1.5707963267948966,   // Math.PI / 2
  endAngle: 39.269908169872416,     // Math.PI / 2 + 12 * Math.PI（6圈）
}

// 少圈数（约3圈，适合季度数据）
coordinate: {
  type: 'helix',
  startAngle: Math.PI / 2,
  endAngle: Math.PI / 2 + 6 * Math.PI,
}

// 带内半径（圆环螺旋）
coordinate: {
  type: 'helix',
  startAngle: 0.2 * Math.PI,
  endAngle: 6.5 * Math.PI,
  innerRadius: 0.1,
}
```

## 按类别分组螺旋图

```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'fetch',
    value: 'url-to-data.json',
  },
  encode: {
    x: 'time',
    y: 'group',     // 用 Y 轴区分类别
    color: 'value', // 用颜色映射数值
  },
  scale: {
    color: {
      type: 'linear',
      range: ['#fff', '#ec4839'],
    },
  },
  coordinate: {
    type: 'helix',
    startAngle: 0.2 * Math.PI,
    endAngle: 6.5 * Math.PI,
    innerRadius: 0.1,
  },
  tooltip: {
    title: 'time',
    items: [
      { field: 'group', name: '组别' },
      { field: 'value', name: '数值' },
    ],
  },
});
```

## 常见错误与修正

### 错误 1：数据量太少

```javascript
// ❌ 问题：5 条数据无法形成螺旋，效果极差
chart.options({
  type: 'interval',
  data: {
    value: [
      { time: '2025-01', value: 35 },
      { time: '2025-02', value: 50 },
      { time: '2025-03', value: 45 },
      { time: '2025-04', value: 60 },
      { time: '2025-05', value: 40 },
    ],
  },
  coordinate: { type: 'helix', startAngle: Math.PI / 2, endAngle: 40 },
});

// ✅ 改用折线图处理少量数据
chart.options({
  type: 'line',
  data,
  encode: { x: 'time', y: 'value' },
});
```

### 错误 2：coordinate 类型名错误

```javascript
// ❌ 错误：没有 'spiral' 类型，应该是 'helix'
coordinate: { type: 'spiral' }   // ❌ 不存在

// ✅ 正确：使用 helix
coordinate: { type: 'helix', startAngle: Math.PI / 2, endAngle: 40 }  // ✅
```

### 错误 3：角度单位混淆

```javascript
// ❌ 错误：使用角度（度数）而非弧度
coordinate: {
  type: 'helix',
  startAngle: 90,   // ❌ 90° 不是弧度，应该是 Math.PI / 2
  endAngle: 2250,   // ❌ 应该是弧度值
}

// ✅ 正确：使用弧度
coordinate: {
  type: 'helix',
  startAngle: Math.PI / 2,           // ✅ 90° = π/2 弧度
  endAngle: Math.PI / 2 + 12 * Math.PI,  // ✅ 6圈
}
```

### 错误 4：data 格式错误（行内数据需要 value 包裹）

```javascript
// ❌ 错误：行内数组数据需要放在 data.value 中
chart.options({
  data: [{ time: '2025.01', value: 35 }, ...],  // ❌ 直接数组
  coordinate: { type: 'helix', ... },
});

// ✅ 正确：行内数据用 { value: [...] } 包裹
chart.options({
   {
    value: [{ time: '2025.01', value: 35 }, ...],  // ✅
  },
  coordinate: { type: 'helix', ... },
});
```

### 错误 5：animate.enter 使用 growInY/growInX 导致螺旋渲染残缺

`growInX/Y` 通过沿直角坐标轴方向裁剪（clipPath）实现动画。helix 坐标系已将坐标重映射到螺旋路径，不存在"底部基线"，裁剪矩形会横穿螺旋，导致部分螺旋区域被切掉，动画结束后图表仍显示不完整。

```javascript
// ❌ 错误：growInY 在 helix 坐标系下裁剪矩形横穿螺旋 → 图表渲染残缺
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
    enter: { type: 'growInY', duration: 2000 },  // ❌ 螺旋被截断
  },
});

// ✅ 正确：helix 坐标系必须用 fadeIn（或不设置动画）
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
    enter: { type: 'fadeIn', duration: 1000 },  // ✅
  },
});
```

## 与折线图的选择

| 场景 | 推荐图表 |
|------|---------|
| 数据量 < 50 条 | 折线图 |
| 数据量 100+ 条，观察趋势 | 螺旋图或折线图 |
| 需要发现周期性规律 | **螺旋图**（当每圈周期对齐时效果最佳）|
| 需要精确读取数值 | 折线图 |
| 大屏展示视觉效果 | **螺旋图** |
