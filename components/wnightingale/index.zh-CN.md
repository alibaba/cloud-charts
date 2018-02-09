---
category: 组件
subtitle: 南丁格尔图
type: 图表组件
title: WNantingale
cols: 1
---


## API

### 通用参数

| 属性名    | 描述                                       | 类型               | 默认值      |
| ------ | ---------------------------------------- | ---------------- | -------- |
| width  | 图表宽度                                     | number \| string | 自适应父元素宽度 |
| height | 图表高度                                     | number \| string | 自适应父元素高度 |
| config | 图表配置，详情见下方                               | object           | {}       |
| data   | 图表数据，详情见 [数据 Data](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/140) | array            | []       |
| event  | 图表交互事件，详情见 [图表事件 Event](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/145) | object           | {}       |

### 南丁格尔图配置及数据格式
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
