---
id: "g2-interaction-tooltip"
title: "G2 Tooltip 交互配置"
description: |
  配置 G2 图表的 Tooltip 提示框，包括内容定制、格式化和自定义渲染。
  在 Spec 模式中，Mark 级别的 tooltip 字段控制内容，
  图表级别的 interaction 字段控制 Tooltip 行为。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "Tooltip"
  - "提示框"
  - "tooltip"
  - "交互"
  - "悬停"
  - "hover"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-interaction-crosshair"

use_cases:
  - "为图表添加数据悬停提示"
  - "自定义 Tooltip 展示的字段和格式"
  - "关闭不需要的 Tooltip"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/tooltip"
---

## 核心概念

G2 Spec 模式中 Tooltip 有两个配置位置：
- **Mark 级别 `tooltip` 字段**：控制该 Mark 的 Tooltip 显示内容
- **图表级别 `interaction` 字段**：控制 Tooltip 的触发行为和自定义渲染

G2 默认已启用 Tooltip，鼠标悬停时显示当前元素的数据。

## 基本用法（Spec 模式）

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  tooltip: {
    title: 'genre',     // Tooltip 标题字段
    items: [
      { field: 'sold', name: '销量', valueFormatter: (v) => `${v} 万` },
    ],
  },
});

chart.render();
```

## tooltip 字段详细配置

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'x', y: 'y' },
  tooltip: {
    // 标题：字段名字符串 | 固定字符串 | 函数
    title: 'name',

    // items：定义 Tooltip 中展示的数据行
    items: [
      // 写法 1：字段名字符串（快捷写法）
      'value',

      // 写法 2：对象配置
      {
        field: 'value',                              // 数据字段
        name: '数值',                                // 显示名称
        valueFormatter: (v) => `${v.toFixed(2)}%`,  // 值格式化
        color: '#1890ff',                            // 颜色标记
      },

      // 写法 3：函数（完全自定义）
      (data) => ({
        name: '计算值',
        value: data.a + data.b,
      }),
    ],
  },
});
```

## 关闭 Tooltip

```javascript
// 关闭整个图表的 Tooltip
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'x', y: 'y' },
  interaction: { tooltip: false },   // 图表级别关闭
});

// 或关闭特定 Mark 的 Tooltip 内容（传 false）
chart.options({
  type: 'interval',
  tooltip: false,   // 该 Mark 不提供 Tooltip 内容
});
```

## 自定义 Tooltip 渲染（HTML）

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  interaction: {
    tooltip: {
      render: (event, { title, items }) => `
        <div style="padding: 8px 12px; background: white; border: 1px solid #ddd; border-radius: 4px;">
          <strong>${title}</strong>
          ${items.map(item => `
            <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 4px;">
              <span style="color: ${item.color}">${item.name}</span>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
      `,
    },
  },
});
```

## 在 view 容器中配置 Tooltip

```javascript
// 多 Mark 叠加时，在外层 view 统一配置 Tooltip
chart.options({
  type: 'view',
  data: [...],
  interaction: { tooltip: { shared: true } },  // 共享 Tooltip（多 Mark 合并展示）
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type' },
      tooltip: { items: [{ field: 'value', name: '数值' }] },
    },
    {
      type: 'point',
      encode: { x: 'month', y: 'value', color: 'type' },
      tooltip: false,    // 点 Mark 不单独触发 Tooltip
    },
  ],
});
```

## 常见错误与修正

### 错误 1：tooltip 写在了 style 里
```javascript
// ❌ 错误
chart.options({ type: 'interval',  [...], style: { tooltip: { title: 'name' } } });

// ✅ 正确：tooltip 是与 encode/style 同级的字段
chart.options({ type: 'interval',  [...], tooltip: { title: 'name' } });
```

### 错误 2：interaction.tooltip 与 mark.tooltip 职责混淆
```javascript
// ❌ 错误：把内容配置写在 interaction 里
chart.options({
  interaction: { tooltip: { items: [{ field: 'value' }] } },  // 无效！
});

// ✅ 正确：内容配置在 mark 的 tooltip 字段；行为配置在 interaction.tooltip
chart.options({
  type: 'interval',
  tooltip: { items: [{ field: 'value', name: '数值' }] },  // 内容
  interaction: { tooltip: { shared: true } },              // 行为
});
```
