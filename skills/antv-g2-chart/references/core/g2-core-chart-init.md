---
id: "g2-core-chart-init"
title: "G2 Chart 初始化与基础配置"
description: |
  介绍 G2 v5 中 Chart 对象的创建方式、必填与可选参数、
  自适应尺寸、主题配置及生命周期管理。
  必须使用 Spec 声明式写法（chart.options({})），禁止使用链式 API。

library: "g2"
version: "5.x"
category: "core"
tags:
  - "Chart"
  - "初始化"
  - "容器"
  - "autoFit"
  - "主题"
  - "生命周期"
  - "init"
  - "spec"
  - "options"
  - "padding"
  - "paddingLeft"
  - "paddingTop"
  - "paddingRight"
  - "paddingBottom"
  - "margin"
  - "inset"
  - "布局"

related:
  - "g2-core-encode-channel"
  - "g2-core-data-binding"
  - "g2-core-lifecycle"
  - "g2-theme-builtin"

use_cases:
  - "开始创建任何 G2 图表"
  - "配置图表画布尺寸和容器"
  - "设置全局主题和内边距"

anti_patterns:
  - "不要在同一个容器上多次 new Chart（会产生多个画布）"
  - "禁止使用链式 API（chart.interval().encode()...）"
  - "禁止在同一图表中多次调用 chart.options({})（后者会完全覆盖前者）——合并配置时应合并为一次调用；叠加多个 mark 时应使用 type: 'view' + children"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/chart"
---

## 核心概念

`Chart` 是 G2 中最顶层的容器对象，负责管理画布、视图、坐标系和渲染。

**必须使用 Spec 模式**：通过 `chart.options({})` 一次性传入完整描述对象，结构清晰，易于序列化和动态生成。

**禁止使用链式 API**：`chart.interval().encode()` 等链式调用禁止使用。

## 最小可运行示例（Spec 模式）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',        // Mark 类型
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 30 },
    { x: 3, y: 20 },
  ],
  encode: { x: 'x', y: 'y' },
});

chart.render();
```

## 完整 Chart 容器配置项

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  // ── 必填 ──────────────────────────────
  container: 'container',        // string | HTMLElement：DOM 容器

  // ── 尺寸 ──────────────────────────────
  width: 640,                    // 画布宽度（px），默认 640
  height: 480,                   // 画布高度（px），默认 480
  autoFit: true,                 // 自动适应容器尺寸（忽略 width/height）

  // ── 内边距 ────────────────────────────
  // padding 只接受 number 或 'auto'，不支持数组形式
  // 默认 'auto'：G2 根据坐标轴/图例等组件自动计算，无需手动设置
  padding: 'auto',               // 'auto' | number（四边统一值）
  // 需要分方向控制时，使用以下单独配置（优先级高于 padding）
  paddingTop: 40,
  paddingRight: 20,
  paddingBottom: 40,
  paddingLeft: 60,
  inset: 0,                      // 数据区域内缩（防止数据点紧贴边缘）

  // ── 主题 ──────────────────────────────
  theme: 'classic',              // 'classic' | 'classicDark' | 'academy'

  // ── 渲染器 ────────────────────────────
  renderer: undefined,           // 默认 Canvas，可传入 SVG 渲染器

  // ── 像素比 ────────────────────────────
  devicePixelRatio: window.devicePixelRatio,
});
```

## Spec 模式完整结构

```javascript
chart.options({
  // Mark 类型
  type: 'interval',

  // 数据，不同 Mark 直接存在结构上的差异，优先使用对应 mark 中的数据结构
  data: [...],

  // 视觉通道映射
  encode: {
    x: 'genre',
    y: 'sold',
    color: 'genre',
  },

  // 数据变换
  transform: [{ type: 'stackY' }],

  // 比例尺
  scale: {
    y: { domain: [0, 500] },
    color: { range: ['#1890ff', '#52c41a'] },
  },

  // 坐标系
  coordinate: { transform: [{ type: 'transpose' }] },

  // 样式
  style: { radius: 4 },

  // 数据标签
  labels: [{ text: 'sold', position: 'outside' }],

  // Tooltip
  tooltip: { title: 'genre', items: [{ field: 'sold', name: '销量' }] },

  // 坐标轴
  axis: {
    x: { title: '游戏类型' },
    y: { title: '销量' },
  },

  // 图例
  legend: {
    color: { position: 'top' },
  },
});
```

## Spec 模式标准写法

```javascript
// ✅ 正确：Spec 模式（唯一推荐写法）
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  style: { radius: 4 },
});

// ❌ 禁止：链式 API 模式
chart.interval()
  .data([...])
  .encode('x', 'genre')
  .encode('y', 'sold')
  .encode('color', 'genre')
  .style({ radius: 4 });
```


## 响应式自适应

```javascript
// autoFit：宽度跟随容器，高度可固定
const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 400,
});

chart.options({ type: 'line', data: [...], encode: { x: 'x', y: 'y' } });
chart.render();
```

## 生命周期

```javascript
// 初次渲染
chart.render();

// 更新 Spec 后重新渲染（changeData 只更新数据）
chart.options({ type: 'bar',  newData, encode: { x: 'x', y: 'y' } });
chart.render();

// 仅更新数据（性能更好）
chart.changeData(newData);

// 销毁
chart.destroy();

// 事件监听
chart.on('afterrender', () => console.log('渲染完成'));
```

## 布局模型：margin / padding / inset

G2 v5 的视图空间分为四层，从外到内：

```
View Area（width × height）
  └─ margin（外边距，默认 16，View Area 与 Plot Area 之间的固定留白）
      └─ Plot Area（绘制区域）
          └─ padding（内边距，默认 auto，自动为 axis/legend/title 等组件计算空间）
              └─ Main Area（主区域）
                  └─ inset（呼吸范围，默认 0，防止数据点紧贴边缘）
                      └─ Content Area（数据标记绘制区域）
```

- **`margin`**：外边距，`number`，默认 `16`，View Area 与 Plot Area 之间的固定留白，不直接关联组件渲染
- **`padding`**：内边距，`number | 'auto'`，默认 `'auto'`，由 G2 自动计算为 axis/legend/title 等组件预留空间；手动设置会关闭自适应
- **`inset`**：呼吸范围，`number`，默认 `0`，散点图等防止点紧贴边缘时使用

```javascript
const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
  margin: 16,        // 默认，通常不需要修改
  // padding: 'auto',  // 默认，通常不需要修改
  paddingLeft: 80,   // 仅需要调整某侧时，单独设置
  inset: 8,          // 散点图建议设置，防止数据点被裁剪
});
```

## 常见错误与修正

### 错误 0：多次调用 chart.options({})

`chart.options()` 是**全量替换**，不是合并。每个图表只能调用一次。多 mark 叠加必须用 `type: 'view'` + `children`。详见 SKILL.md 核心约束 #3。

```javascript
// ❌ 错误：多次调用，只有最后一次生效
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
chart.options({ type: 'text', data: labelData, encode: { x: 'x', y: 'y', text: 'text' } });

// ✅ 正确：一次 chart.options()，用 view + children 组合
chart.options({
  type: 'view',
  children: [
    { type: 'interval', data, encode: { x: 'x', y: 'y' } },
    { type: 'text', data: labelData, encode: { x: 'x', y: 'y', text: 'text' } },
  ],
});
```


### 错误 1：container 指向不存在的 ID
```javascript
// ❌ 错误：DOM 还未加载
const chart = new Chart({ container: 'chart' });

// ✅ 正确：确保 DOM 已存在
document.addEventListener('DOMContentLoaded', () => {
  const chart = new Chart({ container: 'chart', width: 640, height: 400 });
  chart.options({ type: 'line',  [...], encode: { x: 'x', y: 'y' } });
  chart.render();
});
```

### 错误 2：重复初始化同一容器
```javascript
// ❌ 错误：会创建两个画布叠加
const chart1 = new Chart({ container: 'container' });
const chart2 = new Chart({ container: 'container' });

// ✅ 正确：先销毁旧实例
chart1.destroy();
const chart2 = new Chart({ container: 'container' });
```

### 错误 3：autoFit 与固定宽度混用
```javascript
// ❌ 错误：autoFit 会覆盖 width
const chart = new Chart({ container: 'c', autoFit: true, width: 640 });

// ✅ 正确：autoFit 时只设 height
const chart = new Chart({ container: 'c', autoFit: true, height: 400 });
```

### 错误 4：padding 使用数组形式（CSS 简写）
```javascript
// ❌ 错误：padding 不支持数组，G2 v5 的类型是 number | 'auto'
const chart = new Chart({
  container: 'container',
  autoFit: true,
  padding: [40, 30, 40, 50],   // ❌ 无效，会被忽略或引发异常
});

// ✅ 正确：四边统一
const chart = new Chart({ container: 'container', padding: 40 });

// ✅ 正确：分方向控制，使用 paddingTop/Right/Bottom/Left
const chart = new Chart({
  container: 'container',
  autoFit: true,
  paddingTop: 40,
  paddingRight: 30,
  paddingBottom: 40,
  paddingLeft: 50,
});
```

### 错误 5：padding 设为 0 导致坐标轴被截断
```javascript
// ❌ 错误：padding=0 会关闭自动计算，坐标轴/图例可能显示不全
const chart = new Chart({ container: 'container', padding: 0 });

// ✅ 正确：默认 'auto' 即可；只需要调整某一方向时，单独设置对应方向
const chart = new Chart({ container: 'container', paddingLeft: 80 });
// 或保持默认自动计算
const chart = new Chart({ container: 'container' });
```
