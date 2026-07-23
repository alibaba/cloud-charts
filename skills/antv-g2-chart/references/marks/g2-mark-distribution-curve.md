---
id: "g2-mark-distribution-curve"
title: "G2 分布曲线图（distribution curve）"
description: |
  分布曲线图使用 type: 'line' + encode.shape: 'smooth' + data.transform 中的自定义分箱统计，
  展示连续数值数据的频率密度分布。适合探索数据分布形态、多组数据分布比较。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "分布曲线图"
  - "distribution curve"
  - "频率密度"
  - "正态分布"
  - "smooth"
  - "KDE"

related:
  - "g2-mark-histogram"
  - "g2-mark-density"
  - "g2-mark-violin"

use_cases:
  - "展示连续数值的概率密度分布"
  - "多组数据分布形态对比"
  - "数据质量检查（正态性检验）"

anti_patterns:
  - "数据量少于 30 条时效果不稳定，改用散点图或箱线图"
  - "离散分类数据不适合分布曲线"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/distributioncurve"
---

## 核心概念

**分布曲线图 = `type: 'line'` + `encode.shape: 'smooth'` + 手动分箱统计**

G2 本身没有内置分布曲线 mark，需要先把原始数据分箱并计算频率密度，再用 smooth 折线绘制：

```
原始数据 → 分箱（bins） → 计算每箱频率密度 → smooth 折线
```

如果原始数据已有 KDE 处理，也可以直接使用 `type: 'density'` + `data.transform kde`。

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'line',
  data: {
    value: [
      { value: 85 }, { value: 92 }, { value: 78 }, { value: 95 },
      { value: 88 }, { value: 72 }, { value: 91 }, { value: 83 },
      // ... 更多数据（建议 100+ 条）
    ],
    transform: [
      {
        type: 'custom',
        callback: (data) => {
          const values = data.map((d) => d.value);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const binCount = 20;
          const binWidth = (max - min) / binCount;

          // 分箱统计
          const bins = Array.from({ length: binCount }, (_, i) => ({
            x0: min + i * binWidth,
            x1: min + (i + 1) * binWidth,
            count: 0,
          }));
          values.forEach((v) => {
            const idx = Math.min(Math.floor((v - min) / binWidth), binCount - 1);
            bins[idx].count++;
          });

          // 输出频率密度
          const total = values.length;
          return bins.map((bin) => ({
            x: (bin.x0 + bin.x1) / 2,
            y: bin.count / total,
          }));
        },
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    shape: 'smooth',   // 平滑曲线
  },
  style: {
    lineWidth: 3,
    stroke: '#1890ff',
  },
  axis: {
    x: { title: '数值' },
    y: { title: '频率密度' },
  },
});

chart.render();
```

## 多组分布曲线对比

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'line',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      {
        type: 'custom',
        callback: (data) => {
          // 按 species 分组，各自分箱
          const groups = {};
          data.forEach((d) => {
            if (!groups[d.species]) groups[d.species] = [];
            groups[d.species].push(d.y);
          });

          const binCount = 20;
          const results = [];

          Object.entries(groups).forEach(([species, values]) => {
            const filteredValues = values.filter((v) => !isNaN(v));
            const min = Math.min(...filteredValues);
            const max = Math.max(...filteredValues);
            const binWidth = (max - min) / binCount;

            const bins = Array.from({ length: binCount }, (_, i) => ({
              x0: min + i * binWidth,
              x1: min + (i + 1) * binWidth,
              count: 0,
            }));
            filteredValues.forEach((v) => {
              const idx = Math.min(Math.floor((v - min) / binWidth), binCount - 1);
              bins[idx].count++;
            });

            const total = filteredValues.length;
            bins.forEach((bin) => {
              results.push({
                x: (bin.x0 + bin.x1) / 2,
                y: bin.count / total,
                species,
              });
            });
          });

          return results;
        },
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'species',
    shape: 'smooth',
  },
  style: {
    lineWidth: 2,
    strokeOpacity: 0.8,
  },
  axis: {
    x: { title: '花瓣长度' },
    y: { title: '频率密度' },
  },
  legend: {
    color: { title: '物种', position: 'right' },
  },
});

chart.render();
```

## 使用 density mark 替代（推荐）

当数据量足够大时，优先使用内置的 density mark + KDE 变换，比手动分箱更精准：

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [
      {
        type: 'kde',
        field: 'value',        // 做 KDE 的字段
        groupBy: ['category'], // 分组字段
        size: 30,              // 输出点数，越多越精细
      },
    ],
  },
  encode: {
    x: 'category',
    y: 'y',
    size: 'size',
    series: 'category',
    color: 'category',
  },
  tooltip: false,
});
```

## 常见错误与修正

### 错误 1：忘记 encode.shape: 'smooth'

```javascript
// ❌ 效果：折线图，有明显锯齿，不像分布曲线
chart.options({
  type: 'line',
  data: binnedData,
  encode: { x: 'x', y: 'y' },  // ❌ 缺少 shape: 'smooth'
});

// ✅ 正确：smooth 使曲线平滑
chart.options({
  type: 'line',
  data: binnedData,
  encode: { x: 'x', y: 'y', shape: 'smooth' },  // ✅
});
```

### 错误 2：原始数据未分箱直接绘制

```javascript
// ❌ 错误：原始数据点连成折线，不是密度曲线
chart.options({
  type: 'line',
  data: rawData,   // ❌ 未分箱，只是散点连线
  encode: { x: 'index', y: 'value', shape: 'smooth' },
});

// ✅ 正确：先在 data.transform 中分箱，再绘制
chart.options({
  type: 'line',
  data: {
    value: rawData,
    transform: [{ type: 'custom', callback: binningFn }],
  },
  encode: { x: 'x', y: 'y', shape: 'smooth' },
});
```

### 错误 3：data 关键字缺失

```javascript
// ❌ 错误：transform 必须放在 data 对象内
chart.options({
  type: 'line',
  data: { value: rawData, transform: [...] },  // ❌ 孤立的 { } 语法错误
  encode: { x: 'x', y: 'y' },
});

// ✅ 正确：必须有 data: 键
chart.options({
  type: 'line',
  data: { value: rawData, transform: [...] },  // ✅
  encode: { x: 'x', y: 'y' },
});
```

## 分布曲线 vs 相关图表选择

| 图表 | 适用场景 |
|------|---------|
| 分布曲线（line + smooth） | 展示连续分布形态，数据量 50+ |
| 直方图 | 需要精确频次统计，看区间分布 |
| density mark | 数据量大，自动 KDE 估计 |
| 小提琴图 | 多组对比 + 显示统计摘要 |
