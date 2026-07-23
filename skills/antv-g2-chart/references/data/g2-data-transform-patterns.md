---
id: "g2-data-transform-patterns"
title: "G2 数据转换模式"
description: |
  G2 可视化前最常用的数据预处理模式：宽转长（fold）、分组聚合、
  百分比计算、排名/排序、数据过滤、时间粒度聚合。
  这些模式既可在 JavaScript 前端完成，也可使用 G2 的内置 data transform。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "数据转换"
  - "数据处理"
  - "宽转长"
  - "fold"
  - "分组聚合"
  - "百分比"
  - "排序"
  - "时间聚合"

related:
  - "g2-data-fold"
  - "g2-data-filter"
  - "g2-data-sort"
  - "g2-data-slice"

use_cases:
  - "将 API 返回的宽表转为 G2 需要的长表"
  - "前端对数据进行聚合、排名、百分比计算"
  - "为不同图表类型准备对应格式的数据"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-27"
author: "antv-team"
---

## 核心概念

**数据转换有两种方式**：

1. **JavaScript 前端预处理**：在传入 G2 之前用 JS 函数处理
2. **G2 内置 data transform**：配置在 `data.transform` 中，声明式处理

**推荐**：优先使用 G2 内置 transform，代码更简洁、可序列化。

## 模式 1：宽表转长表（Wide to Long）

**场景**：后端返回每列一个指标的宽表，需转为每行一个观测值的长表

**JavaScript 方式**：
```javascript
// 输入：宽表
const wideData = [
  { month: 'Jan', 北京: 3.6, 上海: 4.3, 广州: 2.8 },
  { month: 'Feb', 北京: 3.8, 上海: 4.5, 广州: 3.0 },
];

function wideToLong(data, idCols, valueCols, keyName = 'key', valueName = 'value') {
  return data.flatMap(row =>
    valueCols.map(col => ({
      ...Object.fromEntries(idCols.map(id => [id, row[id]])),
      [keyName]: col,
      [valueName]: row[col],
    }))
  );
}

const longData = wideToLong(wideData, ['month'], ['北京', '上海', '广州'], 'city', 'gdp');
// 输出：
// [
//   { month: 'Jan', city: '北京', gdp: 3.6 },
//   { month: 'Jan', city: '上海', gdp: 4.3 },
//   ...
// ]
```

**G2 内置方案**（推荐）：
```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{
      type: 'fold',
      fields: ['北京', '上海', '广州'],
      key: 'city',
      value: 'gdp',
    }],
  },
  encode: { x: 'month', y: 'gdp', color: 'city' },
});
```

## 模式 2：分组聚合（Group + Aggregate）

**场景**：按某字段分组，对另一字段求和/均值/计数

**JavaScript 方式**：
```javascript
// 输入：明细数据
const orderData = [
  { month: 'Jan', region: '华东', amount: 1200 },
  { month: 'Jan', region: '华东', amount: 800 },
  { month: 'Jan', region: '华南', amount: 950 },
  { month: 'Feb', region: '华东', amount: 1500 },
];

function groupSum(data, groupKeys, sumKey) {
  const map = new Map();
  data.forEach(row => {
    const key = groupKeys.map(k => row[k]).join('|');
    if (!map.has(key)) {
      const group = Object.fromEntries(groupKeys.map(k => [k, row[k]]));
      group[sumKey] = 0;
      map.set(key, group);
    }
    map.get(key)[sumKey] += row[sumKey];
  });
  return Array.from(map.values());
}

const aggregated = groupSum(orderData, ['month', 'region'], 'amount');
// 输出：
// [
//   { month: 'Jan', region: '华东', amount: 2000 },
//   { month: 'Jan', region: '华南', amount: 950 },
//   { month: 'Feb', region: '华东', amount: 1500 },
// ]
```

**G2 内置方案**（使用 mark transform）：
```javascript
chart.options({
  type: 'interval',
   orderData,
  encode: { x: 'month', y: 'amount', color: 'region' },
  transform: [{ type: 'groupX', y: 'sum' }],  // 按 x 分组求和
});
```

## 模式 3：百分比计算

**场景**：计算每个类别占总量的百分比（饼图标签、百分比柱状图）

**JavaScript 方式**：
```javascript
function addPercentage(data, valueKey, pctKey = 'pct') {
  const total = data.reduce((sum, d) => sum + (d[valueKey] || 0), 0);
  return data.map(d => ({
    ...d,
    [pctKey]: total > 0 ? ((d[valueKey] / total) * 100).toFixed(1) : '0.0',
  }));
}

const dataWithPct = addPercentage(
  [{ city: '北京', gdp: 3.6 }, { city: '上海', gdp: 4.3 }, { city: '广州', gdp: 2.8 }],
  'gdp'
);
// 输出：[{ city: '北京', gdp: 3.6, pct: '33.6' }, ...]
```

**G2 内置方案**（百分比柱状图）：
```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'city', y: 'gdp', color: 'city' },
  transform: [{ type: 'normalizeY' }],  // Y 轴归一化为百分比
});
```

**在饼图标签中使用百分比**：
```javascript
const total = data.reduce((sum, d) => sum + d.value, 0);

chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  labels: [{
    text: (d) => `${d.type}\n${((d.value / total) * 100).toFixed(1)}%`,
    position: 'outside',
  }],
});
```

## 模式 4：排名 / Top N

**场景**：取数值最大/最小的 N 条数据，用于排名图

**JavaScript 方式**：
```javascript
function topN(data, valueKey, n, ascending = false) {
  return [...data]
    .sort((a, b) => ascending ? a[valueKey] - b[valueKey] : b[valueKey] - a[valueKey])
    .slice(0, n);
}

const top5Cities = topN(cityData, 'gdp', 5);
```

**G2 内置方案**：
```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: cityData,
    transform: [
      { type: 'sortBy', fields: [['gdp', false]] },  // 按 gdp 降序
      { type: 'slice', end: 5 },                      // 只取前 5 条
    ],
  },
  encode: { x: 'city', y: 'gdp' },
});
```

## 模式 5：时间粒度聚合

**场景**：日粒度数据聚合为周/月/季度

**JavaScript 方式**：
```javascript
// 日粒度 → 月粒度聚合
function aggregateByMonth(data, dateKey, valueKey) {
  const map = new Map();
  data.forEach(d => {
    const date = new Date(d[dateKey]);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(monthKey)) {
      map.set(monthKey, { month: monthKey, total: 0, count: 0 });
    }
    const entry = map.get(monthKey);
    entry.total += d[valueKey];
    entry.count += 1;
  });
  return Array.from(map.values())
    .map(({ month, total, count }) => ({
      month,
      value: total,
      avg: total / count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// 月粒度 → 季度粒度
function aggregateByQuarter(data, monthKey, valueKey) {
  return data.reduce((acc, d) => {
    const [year, month] = d[monthKey].split('-');
    const quarter = `${year}-Q${Math.ceil(Number(month) / 3)}`;
    const existing = acc.find(a => a.quarter === quarter);
    if (existing) {
      existing[valueKey] += d[valueKey];
    } else {
      acc.push({ quarter, [valueKey]: d[valueKey] });
    }
    return acc;
  }, []);
}
```

## 模式 6：数据过滤与条件筛选

**场景**：根据维度/时间范围筛选数据

**JavaScript 方式**：
```javascript
function filterData(data, conditions) {
  return data.filter(d =>
    conditions.every(({ key, op, value }) => {
      switch (op) {
        case 'eq':  return d[key] === value;
        case 'gt':  return d[key] > value;
        case 'lt':  return d[key] < value;
        case 'gte': return d[key] >= value;
        case 'lte': return d[key] <= value;
        case 'in':  return value.includes(d[key]);
        default:    return true;
      }
    })
  );
}

const filtered = filterData(data, [
  { key: 'region', op: 'in',  value: ['华东', '华南'] },
  { key: 'sales',  op: 'gt',  value: 1000 },
]);
```

**G2 内置方案**：
```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: data,
    transform: [
      { type: 'filter', callback: (d) => ['华东', '华南'].includes(d.region) && d.sales > 1000 },
    ],
  },
  encode: { x: 'region', y: 'sales' },
});
```

**联动过滤示例**：
```javascript
document.getElementById('region-select').addEventListener('change', (e) => {
  const region = e.target.value;
  const filtered = region === 'all'
    ? allData
    : allData.filter(d => d.region === region);
  chart.changeData(filtered);
});
```

## 模式 7：数据归一化（0-1 标准化）

**场景**：多指标对比时，将不同量级的数据归一化到相同范围

**JavaScript 方式**：
```javascript
// Min-Max 归一化
function normalize(data, valueKey, normalizedKey = 'normalized') {
  const values = data.map(d => d[valueKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return data.map(d => ({
    ...d,
    [normalizedKey]: (d[valueKey] - min) / range,
  }));
}

// 多指标分别归一化（雷达图/平行坐标准备）
function normalizeMultiple(data, keys) {
  return keys.reduce((acc, key) => normalize(acc, key, `${key}_norm`), data);
}
```

## 常见错误与修正

### 错误 1：fold 后字段名与 encode 不匹配

```javascript
// ❌ fold 配置了 key='city', value='gdp'，但 encode 还用原字段名
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['北京', '上海'], key: 'city', value: 'gdp' }],
  },
  encode: { color: '北京' },  // ❌ '北京' 字段已被 fold 消除
});

// ✅ encode 要用 fold 生成的新字段名
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['北京', '上海'], key: 'city', value: 'gdp' }],
  },
  encode: { y: 'gdp', color: 'city' },  // ✅ 使用 key/value 配置的字段名
});
```

### 错误 2：data transform 与 mark transform 混淆

```javascript
// ❌ 错误：fold 是数据变换，不应放在 mark transform
chart.options({
  type: 'interval',
   wideData,
  transform: [{ type: 'fold', fields: ['北京', '上海'] }],  // ❌ 错误位置
});

// ✅ 正确：fold 放在 data.transform 中
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['北京', '上海'], key: 'city', value: 'gdp' }],
  },
  transform: [{ type: 'stackY' }],  // mark transform
});
```