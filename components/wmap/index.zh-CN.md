---
category: 组件
subtitle: 地图
type: 图表组件
title: Wmap
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

### 线图配置及数据格式

* config:

```javascript
  {
    xAxis: {
      type: 'linear', //X轴类型，默认为线性“linear”，还可以设置为时间“datetime”
      dateFormatter: '%m-%d', //时间格式化，当X轴类型为“datetime”时，此字段生效
      labelFormatter: null, //自定义格式化，默认为null。设置值后dateFormatter失效
    },
    // yAxis 设置为数组形式可变为双轴模式
    yAxis: {
      labelFormatter: null, //自定义格式化，默认为null
      max: null, //Y轴可见最大值，默认为自动计算。label最大不一定会显示此值，还与间隔有关
      min: null,  //Y轴可见最小值，默认为自动计算，一般为0
      bgArea: [], //Y轴背景区域，默认为空数组，表示不显示；设置为[100,200]表示从Y轴坐标100至200的区域带背景
    },
    legend: { //默认显示，设置为false时，表示不显示
      nameFormatter: null, // 图例文字格式化函数。参数：name, data, index
    },
    tooltip: { //默认显示，设置为false时，表示不显示
      titleFormatter: null, // tooltip标题格式化函数。参数：title
      nameFormatter: null, // tooltip name格式化函数。参数：name, data, index, record
      valueFormatter: null, // tooltip value格式化函数。参数：value, data, index, record
    },
    zoom: false, //图上是否支持拖拽选择放大，默认为false，表示不缩放。仅初次设置有效
    clickable: false, //图上的点是否可点击，默认为false，表示不可点击。仅初次设置有效
    spline: false, //设置图上的线是否为平滑曲线，默认为false。表示为折线。仅初次设置有效
    area: false, //设置图上的线是否为面积曲线，默认为false。仅初次设置有效
    grid: false, //参考线是否显示为网格，默认为false，仅有横向参考线。仅初次设置有效
    symbol: false, //曲线上是否有点，默认为false。仅初次设置有效
    stack: false, //曲线是否堆叠，默认为false，表示不堆叠。仅初次设置且 area 为 true 时有效
    colors: ['#389BFF','#F2A72D','#8CD123',...], //线条配色，默认有17种颜色。不建议修改
    padding: [12, 0, 12, 0], //图表内边距
  }

  /*
   * 说明：
   *
   * dateFormatter 支持的写法和PHP时间格式化一致，可参见 http://php.net/manual/en/function.strftime.php
   *
   * labelFormatter、tooltipFormatter 支持的类型为Function。回调会带入原始值和时间格式化函数作为参数。返回值即为显示内容
   * 例如 function(value,format){return format('%m-%d',value)};
   *
   */
```

