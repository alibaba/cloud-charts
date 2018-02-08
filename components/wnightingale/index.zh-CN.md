---
category: 组件
subtitle: 南丁格尔图
type: 图表组件
title: WNantingale
cols: 1
---


## API

### 通用参数

| 成员 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| config | 相关配置 | Object | 见下方具体配置 |
| data | 传入数据，必填 | Array | 见下方具体配置 |
| width | 容器宽度 | Number | 自适应父元素宽度 |
| height | 容器高度 | Number | 自适应父元素高度 |

### 南丁格尔图配置及数据格式
* config

```javascript
const config = {
  axis: true,
  colors: '#2e85ff'
}
```

* data:

```javascript
const data = [{
  name: '人口比例',
  data: [
    ['2001', 41.8],
    ['2002', 38],
    ['2003', 33.7],
    ['2004', 30.7],
    ['2005', 25.8],
    ['2006', 31.7],
    ['2007', 33],
    ['2008', 46],
    ['2009', 38.3],
    ['2010', 28],
    ['2011', 42.5],
    ['2012', 30.3]
  ]
}];
```