---
id: "g2-comp-tooltip-config"
title: "G2 Tooltip 配置与自定义"
description: |
  G2 v5 tooltip 通过 tooltip 顶层配置或 interaction: [{ type: 'tooltip' }] 启用，
  支持自定义内容（items 字段过滤、render 函数完全自定义 HTML），
  groupKey 控制合并规则，crosshairs 显示十字准线。

library: "g2"
version: "5.x"
category: "components"
tags:
  - "tooltip"
  - "提示框"
  - "自定义"
  - "交互"
  - "spec"

related:
  - "g2-interaction-tooltip"
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"

use_cases:
  - "自定义 tooltip 显示字段和格式"
  - "多系列共享 tooltip（分组 tooltip）"
  - "完全自定义 tooltip HTML 模板"
  - "显示十字准线辅助定位"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/tooltip"
---

## 最小可运行示例（启用默认 tooltip）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 600,
  height: 400,
});

const data = [
  { month: '1月', value: 120, type: '销售额' },
  { month: '2月', value: 180, type: '销售额' },
  { month: '3月', value: 150, type: '销售额' },
];

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // tooltip 默认开启，此配置可自定义
  tooltip: {
    title: (d) => `${d.month} 数据`,   // 自定义标题
    items: [
      { channel: 'y', name: '销售额', valueFormatter: (v) => `¥${v}` },
    ],
  },
});

chart.render();
```

## 多字段 tooltip（显示多个信息项）

```javascript
const data = [
  { date: '2024-01', revenue: 1200, cost: 800, profit: 400 },
  { date: '2024-02', revenue: 1800, cost: 950, profit: 850 },
  { date: '2024-03', revenue: 1500, cost: 1000, profit: 500 },
];

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'revenue' },
  tooltip: {
    title: 'date',
    // items 中每项对应一行显示内容
    items: [
      { field: 'revenue', name: '收入', valueFormatter: (v) => `¥${v}` },
      { field: 'cost', name: '成本', valueFormatter: (v) => `¥${v}` },
      { field: 'profit', name: '利润', valueFormatter: (v) => `¥${v}` },
    ],
  },
});
```

## 完全自定义 HTML（render 函数）

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  tooltip: {
    render: (event, { title, items }) => {
      // 返回 HTML 字符串，完全自定义 tooltip 内容
      return `
        <div style="padding: 8px 12px; background: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <div style="font-weight: bold; margin-bottom: 6px;">${title}</div>
          ${items.map(({ name, value, color }) => `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="width: 8px; height: 8px; background: ${color}; border-radius: 50%; display: inline-block;"></span>
              <span>${name}：</span>
              <span style="font-weight: 500;">${value}</span>
            </div>
          `).join('')}
        </div>
      `;
    },
  },
});
```

## 多系列共享 tooltip（groupKey）

```javascript
// 多折线图，鼠标悬停时同时显示所有系列的值
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type' },
      tooltip: {
        // groupKey：按哪个字段合并多系列的 tooltip
        // 默认按 x 值合并，所有系列在同一 x 处的点显示在一个 tooltip 中
        title: 'month',
      },
    },
  ],
  interaction: [{ type: 'tooltip', shared: true }],   // shared: true 显示共享 tooltip
});
```

## 完整配置项

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },

  tooltip: {
    // 标题
    title: 'month',               // 字段名 或 函数 (d) => string

    // 显示项
    items: [
      {
        field: 'value',           // 数据字段名
        channel: 'y',             // 或者用通道名（'x' | 'y' | 'color' 等）
        name: '销售额',           // 显示名称（覆盖默认）
        color: '#1890ff',         // 色块颜色
        // valueFormatter 接受：
        //   函数 (value) => string   ← 需要拼接单位时必须用这种形式
        //   d3-format 字符串 '.2f'   ← 只格式化数字本身，不支持追加文字
        valueFormatter: (v) => `${v} 万元`,   // ✅ 函数形式，可拼接单位
        // valueFormatter: '.2f',             // ✅ d3-format，仅格式化数字
        // valueFormatter: '.0f 米',          // ❌ 错误！d3-format 后不能追加文字
      },
    ],

    // 渲染
    render: (event, { title, items }) => `<div>...</div>`,  // 完全自定义 HTML

    // 触发方式
    // 在 interaction 中配置
  },

  // tooltip 交互（可补充配置）
  interaction: [
    {
      type: 'tooltip',
      shared: true,       // 多 Mark 共享 tooltip
      crosshairs: true,   // 显示十字准线
    },
  ],
});
```

## 十字准线（crosshairs）

十字准线通过 `interaction` 中的 `tooltip` 交互项配置：

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },
  interaction: [
    {
      type: 'tooltip',
      crosshairs: true,           // 显示十字准线（默认开启）
      crosshairsStroke: '#aaa',   // 准线颜色
      crosshairsLineWidth: 1,     // 准线宽度
      crosshairsLineDash: [4, 4], // 虚线样式
    },
  ],
});
```

## 通过 CSS 自定义 tooltip 样式

当 `render` 函数的定制化程度不够时，可以通过 CSS 直接覆盖默认样式：

```javascript
// 方式 1：在页面全局 CSS 中覆盖
// .g2-tooltip { background: #1a1a1a; color: #fff; border-radius: 8px; }
// .g2-tooltip-title { font-size: 14px; font-weight: bold; }
// .g2-tooltip-list-item-value { color: #fadb14; }

// 方式 2：通过 interaction 的 css 参数（局部覆盖）
chart.options({
  interaction: [
    {
      type: 'tooltip',
      css: {
        '.g2-tooltip': {
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 12px',
        },
        '.g2-tooltip-title': {
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '6px',
        },
        '.g2-tooltip-list-item-value': {
          color: '#fadb14',
        },
      },
    },
  ],
});
```

**内置 CSS 类名：**
- `.g2-tooltip` — tooltip 容器
- `.g2-tooltip-title` — 标题
- `.g2-tooltip-list-item` — 单条数据项
- `.g2-tooltip-list-item-name-label` — 数据项名称
- `.g2-tooltip-list-item-value` — 数据项值
- `.g2-tooltip-list-item-marker` — 数据项颜色标记点

---

## 常见错误与修正

### 错误 1：tooltip.items 字段名与数据不匹配

```javascript
// ❌ 错误：数据字段是 'revenue' 但 items 写的是 'value'
const data = [{ month: '1月', revenue: 1200 }];
chart.options({
  tooltip: {
    items: [{ field: 'value' }],   // ❌ 数据中没有 'value' 字段
  },
});

// ✅ 正确：field 与数据字段名对应
chart.options({
  tooltip: {
    items: [{ field: 'revenue', name: '收入' }],   // ✅
  },
});
```

### 错误 2：render 函数忘记返回字符串

```javascript
// ❌ 错误：render 函数没有 return 语句
chart.options({
  tooltip: {
    render: (event, { title, items }) => {
      const html = `<div>${title}</div>`;
      // 忘记 return！
    },
  },
});

// ✅ 正确：必须返回 HTML 字符串
chart.options({
  tooltip: {
    render: (event, { title, items }) => {
      return `<div>${title}</div>`;   // ✅
    },
  },
});
```

### 错误 3：valueFormatter 用 d3-format 字符串拼接单位

`valueFormatter` 支持两种形式：函数 `(v) => string` 或 d3-format 字符串（如 `'.2f'`）。**d3-format 字符串只格式化数字本身，不能在后面追加文字单位**——带空格的写法如 `'.0f 米'` 会被当作无效格式符，导致显示异常或直接报错。

```javascript
// ❌ 错误：d3-format 字符串后追加文字单位
chart.options({
  tooltip: {
    items: [
      { field: 'distance', name: '距离', valueFormatter: '.0f 米' },  // ❌ 无效格式，d3-format 不支持拼接文字
      { field: 'price',    name: '价格', valueFormatter: '.2f 元' },  // ❌ 同上
    ],
  },
});

// ✅ 正确：需要拼接单位时必须用函数形式
chart.options({
  tooltip: {
    items: [
      { field: 'distance', name: '距离', valueFormatter: (v) => `${Math.round(v)} 米` },  // ✅ 函数形式
      { field: 'price',    name: '价格', valueFormatter: (v) => `¥${v.toFixed(2)}` },     // ✅ 函数形式
    ],
  },
});

// ✅ 仅格式化数字（不需要单位）时可用 d3-format 字符串
chart.options({
  tooltip: {
    items: [
      { field: 'ratio', name: '占比', valueFormatter: '.1%' },  // ✅ 纯 d3-format，无文字
      { field: 'value', name: '数值', valueFormatter: ',.0f' }, // ✅ 千分位整数
    ],
  },
});
```

### 错误 4：多系列 tooltip 未配置 shared

```javascript
// ❌ 问题：多折线图 tooltip 只显示当前 hover 的那条线
chart.options({
  type: 'view',
  children: [
    { type: 'line', encode: { x: 'month', y: 'value', color: 'type' } },
  ],
  // 没有 shared: true，tooltip 只显示鼠标直接悬停的那条线
});

// ✅ 正确：设置 shared: true 显示所有系列
chart.options({
  type: 'view',
  children: [
    { type: 'line', encode: { x: 'month', y: 'value', color: 'type' } },
  ],
  interaction: [{ type: 'tooltip', shared: true }],   // ✅
});
```

---

> **深色背景适配**：深色背景下 tooltip 样式需要适配时，使用 `theme: 'classicDark'` 自动切换，或通过 `interaction.tooltip.css` 手动控制。详见 [深色主题适配](../concepts/g2-concept-dark-theme-adaptation.md)
