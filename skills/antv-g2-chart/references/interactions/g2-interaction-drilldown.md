---
id: "g2-interaction-drilldown"
title: "G2 下钻交互（drillDown）"
description: |
  drillDown 交互用于层次数据（partition / 旭日图）的点击下钻，
  点击某个节点后只展示该节点的子树，同时在顶部显示面包屑导航。
  点击面包屑可以逐层向上回溯。仅适用于 partition mark。

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "drillDown"
  - "下钻"
  - "层次数据"
  - "旭日图"
  - "partition"
  - "面包屑"
  - "interaction"

related:
  - "g2-mark-treemap"
  - "g2-interaction-element-select"

use_cases:
  - "旭日图/矩形分区图的层次数据下钻探索"
  - "组织架构图的逐层查看"
  - "文件目录树的交互式浏览"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/drill-down"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = {
  name: '公司',
  children: [
    {
      name: '研发部',
      children: [
        { name: '前端组', value: 12 },
        { name: '后端组', value: 18 },
        { name: '算法组', value: 8 },
      ],
    },
    {
      name: '市场部',
      children: [
        { name: '品牌组', value: 6 },
        { name: '运营组', value: 10 },
      ],
    },
    {
      name: '设计部',
      children: [
        { name: 'UX组', value: 7 },
        { name: '视觉组', value: 5 },
      ],
    },
  ],
};

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'sunburst',   // 旭日图（partition 的极坐标形式）
  data: { value: data },
  encode: { value: 'value', color: 'name' },
  interaction: {
    drillDown: true,   // 启用下钻交互
  },
});

chart.render();
```

## 自定义面包屑样式

```javascript
chart.options({
  type: 'sunburst',
  data: { value: data },
  encode: { value: 'value', color: 'name' },
  interaction: {
    drillDown: {
      breadCrumb: {
        rootText: '全公司',         // 根节点面包屑文字，默认 'root'
        style: {
          fill: 'rgba(0,0,0,0.65)',
          fontSize: 13,
        },
        active: {
          fill: '#1890ff',          // 悬停时面包屑文字颜色
        },
        y: 8,                       // 面包屑 Y 轴偏移
      },
    },
  },
});
```

## 常见错误与修正

### 错误 1：drillDown 用于 treemap 而非 partition/sunburst
```javascript
// ❌ 错误：drillDown 只适用于 partition 类型（包括旭日图）
// treemap 有专用的 treemapDrillDown 交互
chart.options({
  type: 'treemap',
  interaction: { drillDown: true },  // ❌ 应该用 treemapDrillDown
});

// ✅ treemap 用 treemapDrillDown
chart.options({
  type: 'treemap',
  interaction: { treemapDrillDown: true },  // ✅
});

// ✅ sunburst/partition 用 drillDown
chart.options({
  type: 'sunburst',
  interaction: { drillDown: true },  // ✅
});
```

### 错误 2：数据不是层次结构——下钻无法展示子节点
```javascript
// ❌ 扁平数据没有 children，下钻后没有内容
chart.options({
  data: [{ name: 'A', value: 10 }, { name: 'B', value: 20 }],  // ❌ 扁平
  interaction: { drillDown: true },
});

// ✅ 必须使用带 children 的层次数据
chart.options({
  data: {
    value: { name: 'root', children: [...] },  // ✅ 树形
  },
  interaction: { drillDown: true },
});
```
