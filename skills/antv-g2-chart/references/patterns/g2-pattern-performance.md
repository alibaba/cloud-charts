---
id: "g2-pattern-performance"
title: "G2 大数据量性能优化"
description: |
  G2 处理大量数据时的性能优化策略：数据预聚合、LTTB 降采样、
  Canvas 渲染器确认、高频实时数据节流更新等。
  提供各场景的数据量阈值参考和具体优化方案。

library: "g2"
version: "5.x"
category: "patterns"
tags:
  - "性能优化"
  - "performance"
  - "大数据"
  - "Canvas"
  - "降采样"
  - "聚合"

related:
  - "g2-core-chart-init"
  - "g2-data-transform-patterns"

use_cases:
  - "图表数据量超过万条时的优化"
  - "实时数据流的高频更新场景"

difficulty: "advanced"
completeness: "full"
---

## 数据量阈值参考

| 场景 | 数据量 | 建议方案 |
|------|--------|---------|
| 折线图 | < 1,000 点 | 直接渲染 |
| 折线图 | 1,000 ~ 10,000 点 | 降采样到 500 点以内 |
| 折线图 | > 10,000 点 | 后端聚合 + 时间范围过滤 |
| 散点图 | < 5,000 点 | 直接渲染 |
| 散点图 | 5,000 ~ 50,000 点 | 开启 Canvas 渲染 + 降采样 |

## 数据预聚合（最重要的优化）

```javascript
// 10 万条日粒度数据 → 聚合为 365 条月粒度
function aggregateTimeSeries(data, dateKey, valueKey, granularity = 'month') {
  const getGroupKey = (dateStr) => {
    const d = new Date(dateStr);
    if (granularity === 'month') {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    if (granularity === 'quarter') {
      return `${d.getFullYear()}-Q${Math.ceil((d.getMonth() + 1) / 3)}`;
    }
    return d.getFullYear().toString();
  };

  const groups = {};
  data.forEach(d => {
    const key = getGroupKey(d[dateKey]);
    if (!groups[key]) groups[key] = { date: key, sum: 0, count: 0, min: Infinity, max: -Infinity };
    groups[key].sum += d[valueKey];
    groups[key].count += 1;
    groups[key].min = Math.min(groups[key].min, d[valueKey]);
    groups[key].max = Math.max(groups[key].max, d[valueKey]);
  });

  return Object.values(groups)
    .map(g => ({ date: g.date, value: g.sum / g.count, min: g.min, max: g.max }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

chart.options({
  data: aggregateTimeSeries(rawData, 'timestamp', 'value'),
  type: 'line',
  encode: { x: 'date', y: 'value' },
});
```

## 折线图降采样（LTTB 算法）

```javascript
// Largest Triangle Three Buckets (LTTB) 降采样
// 保留视觉上最重要的 N 个点，同时保持折线形状
function lttb(data, threshold) {
  const dataLength = data.length;
  if (threshold >= dataLength || threshold === 0) return data;

  const sampled = [];
  let sampledIndex = 0;
  const bucketSize = (dataLength - 2) / (threshold - 2);
  let a = 0;
  sampled[sampledIndex++] = data[a];

  for (let i = 0; i < threshold - 2; i++) {
    const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const rangeEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, dataLength);

    let avgX = 0, avgY = 0;
    const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, dataLength);
    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }
    avgX /= (avgRangeEnd - avgRangeStart);
    avgY /= (avgRangeEnd - avgRangeStart);

    let maxArea = -1;
    let nextA = rangeStart;
    const pointAX = data[a].x;
    const pointAY = data[a].y;
    for (let j = rangeStart; j < rangeEnd; j++) {
      const area = Math.abs(
        (pointAX - avgX) * (data[j].y - pointAY) -
        (pointAX - data[j].x) * (avgY - pointAY)
      );
      if (area > maxArea) { maxArea = area; nextA = j; }
    }
    sampled[sampledIndex++] = data[nextA];
    a = nextA;
  }
  sampled[sampledIndex++] = data[dataLength - 1];
  return sampled;
}

// 10000 个点降采样到 500 个
const sampledData = lttb(rawData, 500);
chart.options({  sampledData, type: 'line', encode: { x: 'x', y: 'y' } });
```

## 确认使用 Canvas 渲染器

```javascript
// G2 默认使用 Canvas 渲染，比 SVG 快得多
// 大数据量时确认没有被切换为 SVG
const chart = new Chart({
  container: 'container',
  renderer: 'canvas',   // 默认，大数据量下比 SVG 快 5-10x
  width: 800,
  height: 400,
});
```

## 高频实时数据更新优化

```javascript
// 使用 requestAnimationFrame 节流（最多每帧更新一次）
let pendingData = null;
let rafId = null;

function updateChart(newData) {
  pendingData = newData;

  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      if (pendingData) {
        chart.changeData(pendingData);
        pendingData = null;
      }
      rafId = null;
    });
  }
}

// 模拟实时数据流（每 100ms 有新数据）
setInterval(() => {
  const newPoint = { time: Date.now(), value: Math.random() * 100 };
  updateChart([...currentData.slice(-500), newPoint]);  // 只保留最近 500 个点
}, 100);
```

## 常见错误与修正

```javascript
// ❌ 10 万行数据直接传给 G2，页面卡死
chart.options({ data: tenThousandRows });

// ✅ 先聚合/降采样到合理数量（< 1000 点）
chart.options({ data: aggregateTimeSeries(tenThousandRows, 'date', 'value') });
```
