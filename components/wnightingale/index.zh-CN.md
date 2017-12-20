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
* config:

```javascript
{
  position: 'year*population', //极坐标的显示字段
  label: 'year', //极坐标标签字段
  tooltip: { // 参考tooltip
    showTitle: false,
    formatter: (target, source, value) => {
      return {
        name: source.year,
        value
      };
    }
  }
}
```

* data:

```javascript
const data = [
    {year: '2001', population: 41.8 },
    {year: '2002', population: 38 },
    {year: '2003', population: 33.7 },
    {year: '2004', population: 30.7 },
    {year: '2005', population: 25.8 },
    {year: '2006', population: 31.7 },
    {year: '2007', population: 33 },
    {year: '2008', population: 46 },
    {year: '2009', population: 38.3 },
    {year: '2010', population: 28 },
    {year: '2011', population: 42.5 },
    {year: '2012', population: 30.3 }
];
```