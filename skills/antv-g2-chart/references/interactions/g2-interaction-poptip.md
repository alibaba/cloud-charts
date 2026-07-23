---
id: "g2-interaction-poptip"
title: "G2 文本溢出提示（poptip）"
description: |
  poptip 交互在文本元素文字被截断（溢出容器）时，
  鼠标悬停自动弹出完整文本的气泡提示框。
  适合轴标签过长被截断、标注文字显示不全等场景，无需自定义 tooltip。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "poptip"
  - "文本提示"
  - "溢出"
  - "气泡"
  - "截断"
  - "interaction"

related:
  - "g2-comp-tooltip-config"
  - "g2-comp-axis-config"

use_cases:
  - "X 轴分类标签过长被截断时的完整文本提示"
  - "图表内文本标注过长时的悬停提示"
  - "自动处理文本溢出，无需手动配置 tooltip"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/poptip"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 轴标签很长的数据
const data = [
  { category: '人工智能与机器学习算法研究', value: 85 },
  { category: '云计算基础设施服务', value: 72 },
  { category: '大数据分析与可视化平台', value: 68 },
  { category: '区块链与去中心化应用', value: 45 },
  { category: '物联网设备管理系统', value: 60 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  axis: {
    x: {
      labelFormatter: (v) => v.length > 6 ? v.slice(0, 6) + '...' : v,  // 截断显示
    },
  },
  interaction: {
    poptip: true,   // 开启后，悬停截断标签时自动弹出完整文本
  },
});

chart.render();
```

## 自定义 poptip 样式

```javascript
chart.options({
  interaction: {
    poptip: {
      offsetX: 8,   // 气泡横向偏移（px），默认 8
      offsetY: 8,   // 气泡纵向偏移（px），默认 8
      // 气泡样式（CSS 属性）
      tip: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        fontSize: '12px',
        padding: '4px 8px',
        borderRadius: '4px',
      },
    },
  },
});
```

## 常见错误与修正

### 错误：文本没有溢出时 poptip 不弹出——这是正确行为
```javascript
// ℹ️  poptip 只在文本真正溢出（被截断）时触发，非溢出文本不会弹出
// 如果所有标签都完整显示，hover 时不会弹出任何提示
// 这是设计行为，不是 bug

// 如果需要对所有元素都显示提示，应该用 tooltip
chart.options({
  tooltip: {
    items: [{ channel: 'x' }],   // 显示 x 轴完整值
  },
});
```
