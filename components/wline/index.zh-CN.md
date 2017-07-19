---
category: 组件
subtitle: 线图
type: 图表组件
title: Wline
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
      lineWidth:1 //X轴线宽度，默认为1
    },
    yAxis: {
      labelFormatter: null, //自定义格式化，默认为null
      tooltipFormatter: null, //设置tooltip上Y值的格式，默认为null
      max: null, //Y轴可见最大值，默认为自动计算。label最大不一定会显示此值，还与间隔有关
      min: null,  //Y轴可见最小值，默认为自动计算，一般为0
      bgArea: [], //Y轴背景区域，默认为空数组，表示不显示；设置为[100,200]表示从Y轴坐标100至200的区域带背景
      lineWidth:0, //Y轴线宽度，默认为0，表示不显示
    },
    clickable: false, //图上的点是否可点击，默认为false，表示不可点击。仅初次设置有效
    spline: false, //是否为平滑曲线，默认为false，表示为折线。仅初次设置有效
    grid: false, //参考线是否显示为网格，默认为false，仅有横向参考线。仅初次设置有效
    legend: true, //是否显示图例，默认为true，表示展示图例。仅初次设置有效。不建议修改
    tooltip: true, //是否需要提示标签，默认为true，表示显示。仅初次设置有效。不建议修改
    colors: ['#389BFF','#F2A72D','#8CD123',...], //线条配色，默认有17种颜色。不建议修改
    padding: [0, 0, 0, 0], //容器内边距，默认都为0，单位是像素。不建议修改
    symbol: false, //曲线上是否有点，默认为false。仅初次设置有效
    type: 'line', //曲线类型，默认为折线，还可为'spline'展示平滑曲线以及'area'展示面积曲线。
    stacking: false, //曲线是否堆叠，默认为false，表示不堆叠。仅初次设置有效
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

* data:

```javascript
  [
    {
      "name":"线1",
      "data":[[1483372800000,1892],[1483459200000,7292],...]
    },
    {
      "name":"线2",
      "data":[[1483372800000,11751],[1483459200000,4078],...]
    }
  ]
```

* action

```javascript
  {
    'hover': {point: {x: 1483372800000, y: 11751}}, //手动触发鼠标移入事件，传入参数是移到哪个点上
    'select': {selection: {min: 1483372800000, max: 1483459200000}} //手动触发选区事件，传入参数是x轴区间
    'clickpoint': {point: {x: 1483372800000, y: 11751}} //手动触发点击事件，传入参数是选中点的坐标
  }
```

* 事件

onMouseOver:

```javascript
  function(e){
    console.log(e.target) //触发事件的图表实例
    console.log(e.point) //鼠标事件激活的点
    console.log(e.point.x) //鼠标事件激活的点x位置
    console.log(e.point.y) //鼠标事件激活的点y位置
  }
```

onSelection:

```javascript
  function(e){
    console.log(e.target) //触发事件的图表实例
    console.log(e.selection) //实际选区
    console.log(e.selection.min) //实际选区最小值
    console.log(e.selection.max) //实际选区最大值
  }
```

onClick:

```javascript
  function(e){
    console.log(e.target) //触发事件的图表实例
    console.log(e.point) //点击选中的点
    console.log(e.point.x) //点击选中的点x位置
    console.log(e.point.y) //点击选中的点y位置
    console.log(e.name) //选中点所在的线名
  }
```
