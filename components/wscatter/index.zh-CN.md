---
category: 组件
subtitle: 散点图
type: 图表组件
title: Wscatter
cols: 1
---

## API

### 通用参数

| 成员   | 说明           | 类型   | 默认值           |
| ------ | -------------- | ------ | ---------------- |
| config | 相关配置       | Object | 见下方具体配置   |
| data   | 传入数据，必填 | Array  | 见下方具体配置   |
| width  | 容器宽度       | Number | 自适应父元素宽度 |
| height | 容器高度       | Number | 自适应父元素高度 |

### 散点图配置及数据格式

* config:

```javascript
  {
    xAxis: {
      type: 'linear', //X轴类型，默认为线性“linear”，还可以设置为时间“time”
      mask: '%m-%d', //时间格式化，当X轴类型为“datetime”时，此字段生效
      labelFormatter: null, //自定义格式化，默认为null。设置值后dateFormatter失效
    },
    // yAxis 设置为数组形式可变为双轴模式
    yAxis: {
      labelFormatter: null, //自定义格式化，默认为null
      max: null, //Y轴可见最大值，默认为自动计算。label最大不一定会显示此值，还与间隔有关
      min: null,  //Y轴可见最小值，默认为自动计算，一般为0
    },
    legend: { //默认显示，设置为false时，表示不显示
      nameFormatter: null, // 图例文字格式化函数。参数：name, data, index
    },
    tooltip: { //默认显示，设置为false时，表示不显示
      titleFormatter: null, // tooltip标题格式化函数。参数：title
      valueFormatter: null, // tooltip value格式化函数。参数：value, data, index, record
    },
    labels: { //默认为false，表示不显示
      labelFormatter: null, // 图例文字格式化函数。参数：value
    },
    colors: ['#389BFF','#F2A72D','#8CD123',...], //线条配色，默认有17种颜色。不建议修改
    padding: [12, 0, 12, 0], //图表内边距
  }
```

* data:

```javascript
[
  {
    name: '机房1',
    data: [
      [1483372800000, 1892],
      [1483459200000, 7292],
      [1483545600000, 5714],
      [1483632000000, 5354],
      [1483718400000, 2014],
      [1483804800000, 22],
      [1483891200000, 11023],
      [1483977600000, 5218],
      [1484064000000, 8759],
      [1484150400000, 9981],
      [1484236800000, 4533],
      [1484323200000, 11398],
      [1484409600000, 1064],
      [1484496000000, 6494]
    ]
  }
];
```
