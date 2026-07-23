---
id: "g2-concept-chart-selection"
title: "G2 图表类型选择指南"
description: |
  根据数据特征和分析目的选择合适的图表类型。
  覆盖比较、趋势、占比、分布、关系六大场景，
  对应 G2 的具体实现方式，帮助避免"用错图表"的常见错误。

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "图表选择"
  - "chart selection"
  - "可视化设计"
  - "柱状图"
  - "折线图"
  - "饼图"
  - "散点图"
  - "决策"

related:
  - "g2-concept-visual-channels"
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"
  - "g2-mark-arc-pie"
  - "g2-mark-point-scatter"

use_cases:
  - "根据用户需求选择正确的图表类型"
  - "避免在不合适场景使用饼图或折线图"
  - "理解何时用 G2 图表 vs G6 图分析"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
---

## 核心决策树

```
你的数据和目的是什么？

├── 比较类别间的大小 → 柱状图 / 条形图
├── 展示随时间的变化趋势 → 折线图 / 面积图
├── 展示部分与整体的占比 → 饼图 / 环形图 / 堆叠柱状图
├── 展示两个变量的相关性 → 散点图 / 气泡图
├── 展示数据的分布规律 → 直方图 / 箱线图 / 小提琴图
└── 展示节点间的关系网络 → G6 图（force/dagre/tree 布局）
```

## 场景一：比较（Comparison）

**目的**：比较不同类别/时间点的数值大小

| 数据特征 | 推荐图表 | G2 实现 |
|---------|---------|---------|
| 类别 ≤ 10，竖向标签可读 | **柱状图** | `type: 'interval'` |
| 类别名称较长 / 类别多 | **条形图**（水平） | `type: 'interval'` + `coordinate: { transform: [{ type: 'transpose' }] }` |
| 多个系列并排比较 | **分组柱状图** | `transform: [{ type: 'dodgeX' }]` |
| 展示子类在总量中的贡献 | **堆叠柱状图** | `transform: [{ type: 'stackY' }]` |

```javascript
// 柱状图（最常见的比较图）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],  // 按值降序
});
```

## 场景二：趋势（Trend）

**目的**：展示数值随时间或序列的变化

| 数据特征 | 推荐图表 | G2 实现 |
|---------|---------|---------|
| 单一指标时间趋势 | **折线图** | `type: 'line'` |
| 多指标对比趋势 | **多系列折线图** | `type: 'line'` + `encode.color: 'series'` |
| 强调面积/累积量 | **面积图** | `type: 'area'` |
| 展示数量随时间增减 | **面积图**（堆叠）| `type: 'area'` + `transform: [{ type: 'stackY' }]` |

```javascript
// 多系列折线图
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'series' },
  labels: [{ text: 'series', selector: 'last', position: 'right' }],
});
```

## 场景三：占比（Part-to-Whole）

**目的**：展示部分占整体的比例

| 数据特征 | 推荐图表 | G2 实现 | 注意 |
|---------|---------|---------|------|
| 类别 ≤ 5，强调比例 | **饼图** | `interval` + `theta` 坐标 | 类别多时难区分 |
| 需要中心留白 | **环形图** | 饼图 + `innerRadius` | 可在中心放总数 |
| 类别多，强调排名 | **百分比堆叠柱状图** | `stackY` + `normalizeY` | |
| 多层级占比 | **旭日图** | 暂用 `sunburst` 插件 | |

```javascript
// 饼图（类别 ≤ 5 时）
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'category' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.85 },
  labels: [{
    text: (d) => `${d.category}\n${d.pct}%`,
    position: 'outside',
    connector: true,
  }],
});
```

## 场景四：相关性（Correlation）

**目的**：探索两个或多个变量之间的关系

| 数据特征 | 推荐图表 | G2 实现 |
|---------|---------|---------|
| 两个数值变量 | **散点图** | `type: 'point'` |
| 两个数值 + 第三数值维度 | **气泡图** | `point` + `encode.size` |
| 多变量热力矩阵 | **热力图** | `type: 'cell'` |
| 展示分布+相关 | **散点图 + 趋势线** | `view` + `point` + `line` |

```javascript
// 气泡图
// 颜色映射表：scale.color.range 和 fill 回调共用
const COLOR_MAP = { 'Asia': '#fb7678', 'Europe': '#81e7ee', 'Americas': '#5B8FF9' };

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'income',
    y: 'happiness',
    size: 'population',  // 第三数值维度
    color: 'region',
    shape: 'point',
  },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },    // sqrt 比例尺 + 合适的气泡范围
    color: { range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,
    lineWidth: 0,
    // 径向渐变：从白色中心到映射色边缘，模拟 3D 球体质感
    // 通过 COLOR_MAP[datum.region] 获取颜色，与 scale.color.range 保持一致
    fill: (datum) => {
      const color = COLOR_MAP[datum.region];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },
  legend: { size: false },
});
```

## 场景五：分布（Distribution）

**目的**：了解数据的分布规律

| 数据特征 | 推荐图表 | G2 实现 |
|---------|---------|---------|
| 单变量分布 | **直方图** | `type: 'interval'` + `transform: [{ type: 'binX' }]` |
| 多组分布比较 | **箱线图** | `type: 'boxplot'` |
| 展示中位数/四分位 | **箱线图** | `type: 'boxplot'` |

```javascript
// 直方图
chart.options({
  type: 'interval',
  data,
  encode: { x: 'value', y: 'count' },
  transform: [{ type: 'binX', y: 'count' }],
});
```

## 场景六：关系网络（Relationship）

**目的**：展示实体间的连接关系、层次结构、流向

| 数据特征 | 推荐库 | G6 布局 |
|---------|--------|---------|
| 无层级的网络关系 | **G6** | `force`（力导向） |
| 有方向的流程/依赖 | **G6** | `dagre`（有向无环图） |
| 单根树形层级 | **G6** | `compactBox`（树形）|
| 对等环状关系 | **G6** | `circular`（环形） |

```javascript
// G6 知识图谱（力导向）
const graph = new Graph({
  layout: { type: 'force', preventOverlap: true },
  data: { nodes, edges },
});
await graph.render();
```

## 快速选择口诀

```
比较用柱状，趋势用折线，
占比用饼图，关系用散点，
分布用直方，层级用树形，
网络用 G6，复杂用组合。
```

## 常见错误

### 错误 1：用折线图表示无时间顺序的分类数据

```javascript
// ❌ 误用：城市名称没有顺序，不应该用折线（会误导"趋势"感知）
chart.options({
  type: 'line',
   [{ city: '北京', gdp: 3.6 }, { city: '上海', gdp: 4.3 }],
  encode: { x: 'city', y: 'gdp' },   // ❌ 城市是无序分类，不是时序
});

// ✅ 正确：分类比较用柱状图
chart.options({
  type: 'interval',
  encode: { x: 'city', y: 'gdp' },
});
```

### 错误 2：用饼图展示 8+ 个类别

```javascript
// ❌ 误用：10个类别的饼图，各扇区难以区分
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  // 如果有 10 个国家/地区...很难读取
});

// ✅ 正确：超过 5 类改用排序条形图
chart.options({
  type: 'interval',
  encode: { x: 'country', y: 'value' },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],
});
```
