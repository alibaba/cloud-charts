---
id: "g2-data-fetch"
title: "G2 Fetch 远程数据获取"
description: |
  Fetch 数据连接器从远程接口获取数据，支持 JSON、CSV 等格式解析。
  通过设置 data.type 为 'fetch' 启用，让数据源具备动态性。

library: "g2"
version: "5.x"
category: "data"
tags:
  - "fetch"
  - "远程数据"
  - "JSON"
  - "CSV"
  - "数据连接器"
  - "connector"

related:
  - "g2-data-filter"
  - "g2-data-fold"

use_cases:
  - "从 API 获取动态数据"
  - "加载远程 CSV 文件"
  - "大屏监控数据展示"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/fetch"
---

## 核心概念

**Fetch 是数据连接器（Data Connector），不是数据变换**

- 通过设置 `data.type: 'fetch'` 启用
- 支持 JSON、CSV 格式自动解析
- 远程地址不能设置鉴权

## 最小可运行示例

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'point',
   {
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/scatter.json',
  },
  encode: {
    x: 'weight',
    y: 'height',
    color: 'gender',
  },
});

chart.render();
```

## 配置项

| 属性      | 描述                                              | 类型               | 默认值                         |
| --------- | ------------------------------------------------- | ------------------ | ------------------------------ |
| value     | fetch 请求的网络地址                              | `string`           | -                              |
| format    | 远程文件的数据格式类型，决定用什么方式解析        | `'json' \| 'csv'`  | 默认取 value 末尾 `.` 后的后缀 |
| delimiter | 如果是 csv 文件，解析的时候分割符                 | `string`           | `,`                            |
| autoType  | 如果是 csv 文件，解析的时候是否自动判断列数据类型 | `boolean`          | `true`                         |
| transform | 对加载后的数据进行变换操作                        | `DataTransform[]`  | `[]`                           |

## 加载 CSV 文件

```javascript
chart.options({
  type: 'line',
   {
    type: 'fetch',
    value: 'https://example.com/data.csv',
    format: 'csv',           // 指定格式
    delimiter: ',',          // 分隔符
    autoType: true,          // 自动推断类型
    transform: [
      { type: 'filter', callback: (d) => d.value > 0 },
    ],
  },
  encode: { x: 'date', y: 'value' },
});
```

## 结合 transform 使用

```javascript
chart.options({
  type: 'interval',
   {
    type: 'fetch',
    value: 'https://example.com/sales.json',
    transform: [
      { type: 'filter', callback: (d) => d.year === 2024 },
      { type: 'sortBy', fields: [['amount', false]] },
      { type: 'slice', end: 10 },
    ],
  },
  encode: { x: 'product', y: 'amount' },
});
```

## 常见错误与修正

### 错误 1：远程地址需要鉴权

```javascript
// ❌ 错误：G2 fetch 不支持鉴权
data: {
  type: 'fetch',
  value: 'https://api.example.com/private-data',  // 需要 token
}

// ✅ 正确：使用公开的 API 或在服务端代理
 {
  type: 'fetch',
  value: 'https://public-api.example.com/data',  // 无需鉴权
}
```

### 错误 2：format 与文件格式不匹配

```javascript
// ❌ 错误：format 与实际格式不匹配
data: {
  type: 'fetch',
  value: 'https://example.com/data.json',
  format: 'csv',  // ❌ 实际是 JSON
}

// ✅ 正确：让 G2 自动推断或指定正确格式
 {
  type: 'fetch',
  value: 'https://example.com/data.json',
  // format 默认根据后缀推断为 'json'
}

// 或显式指定
 {
  type: 'fetch',
  value: 'https://example.com/api/data',  // 无后缀
  format: 'json',  // 显式指定
}
```

### 错误 3：CORS 问题

```javascript
// ❌ 错误：跨域请求被阻止
// 浏览器控制台会显示 CORS 错误

// ✅ 解决方案：
// 1. 服务端配置 CORS 头
// 2. 使用同源请求
// 3. 使用代理服务器
```