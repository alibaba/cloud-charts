---
id: "g2-interaction-treemap-drilldown"
title: "G2 矩形树图下钻（treemapDrillDown）"
description: |
  treemapDrillDown 为矩形树图（treemap）提供层级下钻交互，
  点击矩形块进入下一层级，顶部显示面包屑导航可返回上级。
  与 drillDown（用于 partition/sunburst）不同，专为 treemap 布局设计。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "treemapDrillDown"
  - "矩形树图"
  - "下钻"
  - "层级"
  - "面包屑"
  - "interaction"

related:
  - "g2-mark-treemap"
  - "g2-interaction-drilldown"
  - "g2-mark-partition"

use_cases:
  - "多层级目录/文件大小可视化"
  - "产品分类层级销售分析"
  - "组织架构矩形树图下钻"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/hierarchy/treemap/#treemap-drill-down"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

// 多层级树形数据
const hierarchyData = {
  name: '总销售额',
  children: [
    {
      name: '电子产品',
      children: [
        { name: '手机', value: 400 },
        { name: '电脑', value: 350 },
        { name: '平板', value: 200 },
      ],
    },
    {
      name: '服装',
      children: [
        { name: '男装', value: 280 },
        { name: '女装', value: 320 },
      ],
    },
    {
      name: '食品',
      children: [
        { name: '零食', value: 180 },
        { name: '饮料', value: 150 },
      ],
    },
  ],
};

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'treemap',
  data: hierarchyData,
  encode: { value: 'value', color: 'name' },
  style: {
    labelText: (d) => d.data.name,
    labelFill: '#fff',
    stroke: '#fff',
    lineWidth: 1,
  },
  interaction: {
    treemapDrillDown: {
      // 面包屑导航样式
      breadCrumbFill: 'rgba(0,0,0,0.85)',
      breadCrumbFontSize: 12,
      activeFill: 'rgba(0,0,0,0.5)',
    },
  },
});

chart.render();
```

## treemapDrillDown vs drillDown 对比

```javascript
// treemapDrillDown：专为 treemap（矩形树图）设计
chart.options({
  type: 'treemap',
  interaction: { treemapDrillDown: true },
});

// drillDown：用于 partition（旭日图/冰柱图）
chart.options({
  type: 'partition',
  interaction: { drillDown: true },
  coordinate: { type: 'polar' },   // 旭日图用极坐标
});
```

## 常见错误与修正

### 错误：在非 treemap mark 上使用 treemapDrillDown
```javascript
// ❌ treemapDrillDown 只适用于 treemap mark
chart.options({
  type: 'partition',   // ❌ 应用 drillDown，不是 treemapDrillDown
  interaction: { treemapDrillDown: true },
});

// ✅ partition 使用 drillDown
chart.options({
  type: 'partition',
  interaction: { drillDown: true },   // ✅
});

// ✅ treemap 使用 treemapDrillDown
chart.options({
  type: 'treemap',
  interaction: { treemapDrillDown: true },  // ✅
});
```

### 错误：数据不是嵌套层级结构
```javascript
// ❌ 扁平数据无法下钻
chart.options({
  type: 'treemap',
  data: [{ name: 'a', value: 10 }, { name: 'b', value: 20 }],  // ❌ 无层级
  interaction: { treemapDrillDown: true },
});

// ✅ 需要嵌套 children 结构
chart.options({
  type: 'treemap',
   { name: 'root', children: [...] },  // ✅ 嵌套层级
  interaction: { treemapDrillDown: true },
});
```
