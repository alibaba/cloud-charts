---
id: "g2-mark-wordcloud"
title: "G2 词云图（wordCloud）"
description: |
  wordCloud mark 将词语按频率/权重排布成云状图，高频词字体更大。
  数据需包含文本字段（text）和权重字段（value），
  G2 内置词云布局算法，自动处理词语重叠。

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "词云"
  - "wordCloud"
  - "word cloud"
  - "文本可视化"
  - "词频"

related:
  - "g2-mark-text"
  - "g2-core-chart-init"

use_cases:
  - "展示文本数据的词频分布"
  - "用户评论关键词可视化"
  - "话题热度展示"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#word-cloud"
---

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const data = [
  { word: '数据可视化', count: 120 },
  { word: '图表', count: 85 },
  { word: '交互', count: 70 },
  { word: 'JavaScript', count: 95 },
  { word: '前端', count: 110 },
  { word: 'AntV', count: 65 },
  { word: 'G2', count: 100 },
  { word: '分析', count: 78 },
  { word: '用户', count: 55 },
  { word: '体验', count: 60 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'wordCloud',
  data,
  encode: {
    text: 'word',    // 显示的词语字段
    color: 'word',   // 颜色编码（每个词不同颜色）
    fontSize: {      // 字体大小映射（可用字段名或固定范围）
      field: 'count',
      range: [12, 60],  // 最小/最大字号
    },
  },
  layout: {
    spiral: 'archimedean',  // 布局螺旋形状：'archimedean' | 'rectangular'
    padding: 2,             // 词语间距
  },
  style: {
    fontFamily: 'Impact, sans-serif',
    fontWeight: 'bold',
  },
});

chart.render();
```

## 带旋转的词云

```javascript
chart.options({
  type: 'wordCloud',
  data,
  encode: {
    text: 'word',
    color: 'count',
    rotate: {
      // 随机旋转角度：水平或垂直
      callback: () => (Math.random() > 0.7 ? 90 : 0),
    },
    fontSize: { field: 'count', range: [14, 56] },
  },
  scale: {
    color: { type: 'sequential', palette: 'blues' },
  },
  layout: { padding: 4 },
});
```

## 固定词语颜色分组

```javascript
chart.options({
  type: 'wordCloud',
  data: wordsWithCategory,
  encode: {
    text: 'word',
    color: 'category',  // 按类别着色（分类色板）
    fontSize: { field: 'count', range: [16, 50] },
  },
  scale: {
    color: { type: 'ordinal', palette: 'set2' },
  },
});
```

## 常见错误与修正

### 错误 1：数据没有权重字段——所有词大小相同
```javascript
// ❌ 没有 fontSize 编码，所有词大小一样
chart.options({
  type: 'wordCloud',
  data: [{ word: 'A' }, { word: 'B' }],  // ❌ 没有数值字段
  encode: { text: 'word' },
});

// ✅ 必须提供权重字段并配置 fontSize
chart.options({
  encode: {
    text: 'word',
    fontSize: { field: 'count', range: [14, 60] },  // ✅
  },
});
```

### 错误 2：容器太小导致词语显示不全
```javascript
// ❌ 小容器下词云布局算法无法放置所有词
const chart = new Chart({ container: 'container', width: 300, height: 200 });  // ❌ 太小

// ✅ 词云推荐最小 400×300，多词时 600×400 以上
const chart = new Chart({ container: 'container', width: 640, height: 480 });  // ✅
```

### 错误 3：词语太多字号设置太大——大量词语无法布局
```javascript
// ❌ 100+ 个词，最大字号 80px，大量词语被丢弃
encode: { fontSize: { field: 'count', range: [20, 80] } }  // ❌ range 太大

// ✅ 词多时缩小字号范围
encode: { fontSize: { field: 'count', range: [10, 40] } }  // ✅
```
