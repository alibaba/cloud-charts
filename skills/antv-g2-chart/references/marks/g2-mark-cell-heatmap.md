---
id: "g2-mark-cell-heatmap"
title: "G2 热力图（Cell Mark）"
description: |
  使用 Cell Mark 创建矩阵热力图，通过颜色深浅表示两个分类维度交叉点的数值大小，
  常用于相关性分析、时间-类别分布等场景。本文采用 Spec 模式。

library: "g2"
version: "5.x"
category: "marks"
subcategory: "cell"
tags:
  - "热力图"
  - "Cell"
  - "heatmap"
  - "矩阵"
  - "相关性"
  - "颜色映射"
  - "spec"

related:
  - "g2-core-encode-channel"
  - "g2-scale-sequential"
  - "g2-comp-legend-config"

use_cases:
  - "展示两个分类维度的交叉数值（如相关矩阵）"
  - "时间热力图（如每周各天的活跃度）"
  - "用户行为矩阵分析"

anti_patterns:
  - "数据为连续型 x/y 时改用密度图或等值线图"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/heatmap/basic"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'cell',
  data: [
    { week: 'Mon', hour: '6AM',  value: 10 },
    { week: 'Mon', hour: '12PM', value: 80 },
    { week: 'Mon', hour: '6PM',  value: 60 },
    { week: 'Tue', hour: '6AM',  value: 5  },
    { week: 'Tue', hour: '12PM', value: 95 },
    { week: 'Tue', hour: '6PM',  value: 70 },
    { week: 'Wed', hour: '6AM',  value: 20 },
    { week: 'Wed', hour: '12PM', value: 75 },
    { week: 'Wed', hour: '6PM',  value: 55 },
  ],
  encode: {
    x: 'week',
    y: 'hour',
    color: 'value',    // 颜色深浅表示数值大小
  },
  scale: {
    color: { 
      type: 'sequential',   // 明确指定为顺序色阶
      palette: 'YlOrRd'     // 连续色阶：YlOrRd | Blues | Viridis 等
    },
  },
  style: {
    inset: 1,    // 格子间距（px）
  },
});

chart.render();
```

## 带数值标签的热力图

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'week', y: 'hour', color: 'value' },
  scale: {
    color: { type: 'sequential', palette: 'Blues' },
  },
  labels: [
    {
      text: 'value',
      style: {
        fontSize: 11,
        fill: (d) => d.value > 60 ? 'white' : '#333',  // 深色背景用白字
      },
    },
  ],
  style: { inset: 2 },
});
```

## 相关系数矩阵

```javascript
// 相关性分析热力图（-1 到 1 的发散色阶）
chart.options({
  type: 'cell',
  data: correlationData,  // [{ x: '变量A', y: '变量B', corr: 0.75 }, ...]
  encode: {
    x: 'x',
    y: 'y',
    color: 'corr',
  },
  scale: {
    color: {
      type: 'sequential',  // 明确指定为顺序色阶
      palette: 'RdBu',     // 发散色阶：红-白-蓝
      domain: [-1, 1],     // 固定数值范围
    },
  },
  labels: [
    {
      text: (d) => d.corr.toFixed(2),
      style: { fontSize: 10 },
    },
  ],
});
```

## 日历热力图（GitHub 风格）

```javascript
// 每天活跃度的日历视图
chart.options({
  type: 'cell',
  data: dailyData,   // [{ date: '2024-01-01', weekday: 'Mon', week: 1, value: 5 }, ...]
  encode: {
    x: 'week',      // 第几周（1-53）
    y: 'weekday',   // 周几
    color: 'value',
  },
  scale: {
    color: { type: 'sequential', palette: 'Greens', domain: [0, 20] },
    y: {
      domain: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  },
  style: { inset: 2, radius: 2 },
  axis: {
    y: { title: null },
    x: { title: null, tickCount: 4 },
  },
});
```

## 地形高程热力图

```javascript
// 模拟地形高程数据
const terrainData = [];
for (let x = 0; x <= 50; x += 2) {
  for (let y = 0; y <= 50; y += 2) {
    // 模拟山峰地形：两个山峰的高程分布
    const elevation1 = 100 * Math.exp(-((x - 15) ** 2 + (y - 15) ** 2) / 200);
    const elevation2 = 80 * Math.exp(-((x - 35) ** 2 + (y - 35) ** 2) / 150);
    const elevation = elevation1 + elevation2 + 10; // 基础海拔
    terrainData.push({ x, y, elevation });
  }
}

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'cell',
  data: terrainData,
  encode: {
    x: 'x',
    y: 'y',
    color: 'elevation',
  },
  style: {
    stroke: '#333',
    lineWidth: 0.5,
    inset: 0.5,
  },
  scale: {
    color: {
      type: 'sequential',
      palette: 'viridis',
    },
  },
  legend: {
    color: {
      length: 300,
      layout: { justifyContent: 'center' },
      labelFormatter: (value) => `${Math.round(value)}m`,
    },
  },
  tooltip: {
    title: '海拔信息',
    items: [
      { field: 'x', name: '经度' },
      { field: 'y', name: '纬度' },
      {
        field: 'elevation',
        name: '海拔',
        valueFormatter: (value) => `${Math.round(value)}m`,
      },
    ],
  },
});

chart.render();
```

## 常见错误与修正

### 错误 1：color 通道缺少 scale 配置导致离散色
```javascript
// ❌ 问题：color 默认使用离散色阶，不适合连续数值
chart.options({ type: 'cell', encode: { x: 'a', y: 'b', color: 'value' } });
// value 是连续数值，却被映射到离散颜色

// ✅ 正确：指定连续色阶 palette 并明确类型为 sequential
chart.options({
  type: 'cell',
  encode: { x: 'a', y: 'b', color: 'value' },
  scale: { 
    color: { 
      type: 'sequential',   // 明确指定为顺序色阶
      palette: 'Blues'      // 或 'YlOrRd'、'Viridis' 等
    } 
  },
});
```

### 错误 2：格子大小不均匀
```javascript
// ❌ 问题：x/y 轴类别数量差异大时格子变形
// ✅ 解决：设置 Chart 的宽高比接近 x/y 分类数量之比
const chart = new Chart({
  container: 'container',
  width: xCategories.length * 40,    // 每格 40px
  height: yCategories.length * 40,
});
```

### 错误 3：未正确使用 transform.group 导致数据重复或缺失
```javascript
// ❌ 问题：当 x/y 通道存在重复组合时，未使用 group 聚合会导致多个格子重叠或数据丢失
chart.options({
  type: 'cell',
  data: [
    { day: 1, month: 0, temp: 10 },
    { day: 1, month: 0, temp: 15 }, // 同一天同一月有两个温度记录
  ],
  encode: {
    x: 'day',
    y: 'month',
    color: 'temp'
  }
});
// 上述代码可能只显示其中一个值，或出现多个重叠格子

// ✅ 正确：使用 transform.group 对重复数据进行聚合（如取最大值、平均值等）
chart.options({
  type: 'cell',
  data: [
    { day: 1, month: 0, temp: 10 },
    { day: 1, month: 0, temp: 15 },
  ],
  encode: {
    x: 'day',
    y: 'month',
    color: 'temp'
  },
  transform: [{
    type: 'group',
    color: 'max'  // 对相同 x/y 组合的数据，取 temp 的最大值
  }]
});
```

### 错误 4：未正确设置 scale.type 为 sequential 导致颜色映射异常
```javascript
// ❌ 问题：color 通道未显式设置 scale.type 为 'sequential'，可能导致颜色映射不符合预期
chart.options({
  type: 'cell',
  encode: { x: 'a', y: 'b', color: 'value' },
  scale: { color: { palette: 'Blues' } } // 仅设置 palette，未设置 type
});

// ✅ 正确：明确指定 scale.type 为 'sequential'
chart.options({
  type: 'cell',
  encode: { x: 'a', y: 'b', color: 'value' },
  scale: { 
    color: { 
      type: 'sequential',  // 明确指定为顺序色阶
      palette: 'Blues' 
    } 
  }
});
```

### 错误 5：调色板名称大小写敏感导致找不到调色板
```javascript
// ❌ 问题：调色板名称大小写不匹配，如 'gnBu' 实际应为 'GnBu'
chart.options({
  type: 'cell',
  data,
  encode: { x: 'day', y: 'month', color: 'temp' },
  scale: {
    color: { type: 'sequential', palette: 'gnBu' } // 小写 g 不符合实际命名
  }
});

// ✅ 正确：使用正确的调色板名称（注意大小写）
chart.options({
  type: 'cell',
  data,
  encode: { x: 'day', y: 'month', color: 'temp' },
  scale: {
    color: { type: 'sequential', palette: 'GnBu' } // 正确的大写 G
  }
});
```

### 错误 6：数据未定义或引用错误
```javascript
// ❌ 问题：使用了未定义的变量 'data'
const processedData = data.map(...);

// ✅ 正确：确保使用的数据变量已正确定义
const rawData = [...];
const processedData = rawData.map(...);
```

### 错误 7：动画配置语法错误
```javascript
// ❌ 问题：animate.enter 应为对象而非字符串或其他类型
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  animate: 'fadeIn' // 错误的配置方式
});

// ✅ 正确：使用标准的动画配置对象
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  animate: {
    enter: {
      type: 'fadeIn',
      duration: 1000
    }
  }
});
```