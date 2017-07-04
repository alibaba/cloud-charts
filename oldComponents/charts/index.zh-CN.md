---
category: 组件
subtitle: 基础图表
type: 基础组件
title: Charts
cols: 2
---

## API

### 通用参数

| 成员 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| type | 图表类型，必填 | String | 枚举值：line，bar，pie |
| config | 相关配置 | Object | 根据 type 有不同配置，见下方具体配置 |
| data | 传入数据，必填 | Array | 根据 type 有差异，见下方具体配置 |
| width | 容器宽度 | Number | 自适应父元素宽度 |
| height | 容器高度 | Number | 自适应父元素高度 |

### 线图配置及数据格式

* type: line
* config:

```javascript
  {
    title: '折线图', //标题内容，默认为“折线图”
    subTitle: '', //副标题内容，一般用来放单位说明，默认为空
    xAxis: {
      type: 'linear', //X轴类型，默认为线性“linear”，还可以设置为时间“datetime”
      dateFormatter: '%m-%d', //时间格式化，当X轴类型为“datetime”时，此字段生效
      labelFormatter: null //自定义格式化，默认为null。设置值后dateFormatter失效
    },
    yAxis: {
      labelFormatter: null, //自定义格式化，默认为null
      tooltipFormatter: null, //设置tooltip上Y值的格式，默认为null
      max: null, //Y轴可见最大值，默认为自动计算。label最大不一定会显示此值，还与间隔有关
      min: null,  //Y轴可见最小值，默认为自动计算，一般为0
      bgArea: [] //Y轴背景区域，默认为空数组，表示不显示；设置为[100,200]表示从Y轴坐标100至200的区域带背景
    },
    clickable: false, //图上的点是否可点击，默认为false，表示不可点击。仅初次设置有效
    spline: false, //是否为平滑曲线，默认为false，表示为折线。仅初次设置有效
    grid: false, //参考线是否显示为网格，默认为false，仅有横向参考线。仅初次设置有效
    single: false, //是否为纯图表模式，默认为false，表示带标题和图例。仅初次设置有效。不建议修改
    tooltip: true, //是否需要提示标签，默认为true，表示显示。仅初次设置有效。不建议修改
    colors: ['#389BFF','#F2A72D','#8CD123',...], //线条配色，默认有17种颜色。不建议修改
    padding: 20 //容器内边距，默认为20，单位是像素。不建议修改
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

### 柱图配置及数据格式

* type: bar
* config:

```javascript
  {
    title: '柱状图', //标题内容，默认为“柱状图”
    subTitle: '', //副标题内容，一般用来放单位说明，默认为空
    xAxis: {
      labelFormatter: null //自定义格式化，默认为null。
    },
    yAxis: {
      labelFormatter: null, //自定义格式化，默认为null
      max: null, //Y轴可见的最大值，默认为自动计算。label最大不一定会显示此值，还与间隔有关。
      min: null  //Y轴可见的最小值，默认为自动计算，一般为0
    },
    clickable: false, //柱是否可点击，默认为false，表示不可点击。仅初次设置有效
    stacking: false,//多组数据时是否堆叠，默认为false，表示并列对比，不堆叠
    column: true, //是否为纵向柱图，默认为true，表示纵向，仅初次设置有效
    grid: true, //是否显示网格，默认为true，表示显示。仅初次设置有效。不建议修改
    single: false, //是否为纯图表模式，默认为false，表示带标题和图例。仅初次设置有效。不建议修改
    tooltip: true, //是否需要提示标签，默认为true，表示显示。仅初次设置有效。不建议修改
    colors: ['#389BFF','#F2A72D','#8CD123',...], //线条配色，默认有17种颜色。不建议修改
    padding: 20 //容器内边距，默认为20，单位是像素。不建议修改
  }

  /*
   * 说明：
   *
   * labelFormatter 支持的类型为Function。回调会带入原始值和时间格式化函数作为参数。返回值即为显示内容
   * 例如 function(value,format){return format('%m-%d',value)};
   *
   * 当为横向柱状图时，横向轴为Y轴。
   */
```

* data:

```javascript
  [
    {
      "name":"柱1",
      "data":[["一",59],["二",23],["三",19],["四",27],...]
    },
    {
      "name":"柱2",
      "data":[["一",92],["二",15],["三",4],["四",49],...]
    }
  ]
```

* 事件

onClick: (需要设置clickable为true才会触发)

```javascript
  function(e){
    console.log(e.target) //触发事件的图表实例
    console.log(e.point) //点击选中的柱区块
    console.log(e.point.x) //点击选中的区块x位置
    console.log(e.point.y) //点击选中的区块的值
    console.log(e.point.xName) //点击选中区块的描述
    console.log(e.name) //选中点所在的柱名
  }
```

### 饼图配置及数据格式

* type: pie
* config:

```javascript
  {
    title: '饼图', //标题内容，默认为“饼图”
    subTitle: '', //副标题内容，一般用来放单位说明，默认为空
    labelFormatter: null, //自定义格式化，默认为null。
    cycle: false, //是否为环图，默认为false，表示显示为饼图，仅初次设置有效
    clickable: false, //是否可点击，默认为false，表示不可点击。仅初次设置有效
    single: false, //是否为纯图表模式，默认为false，表示带标题和图例。仅初次设置有效。不建议修改
    tooltip: true, //是否需要提示标签，默认为true，表示显示。仅初次设置有效。不建议修改
    colors: ['#389BFF','#F2A72D','#8CD123',...], //线条配色，默认有17种颜色。不建议修改
    padding: 20 //容器内边距，默认为20，单位是像素。不建议修改
  }

  /*
   * 说明：
   * labelFormatter 支持的类型为Function。回调会带入原始值和时间格式化函数作为参数。返回值即为显示内容
   * 例如 function(value,format){return format('%m-%d',value)};
   */
```

* data:

```javascript
  [
    {
      "name": "饼",
      "data": [
        ['Firefox', 45.0],
        ['IE', 26.8],
        ['Chrome', 12.8],
        ['Safari', 8.5],
        ['Opera', 6.2],
        ['Others', 0.7]
      ]
    }
  ]
```

* 事件

onClick: (需要设置clickable为true才会触发)

```javascript
  function(e){
    console.log(e.target) //触发事件的图表实例
    console.log(e.point) //点击选中的饼区块
    console.log(e.point.x) //点击选中区块的索引
    console.log(e.point.y) //点击选中区块的值
    console.log(e.point.xName) //点击选中区块的描述
    console.log(e.name) //选中饼图的名称
  }
```

### 迷你曲线配置及数据格式

* type: miniLine
* config:

```javascript
  {
    spline: false, //是否是曲线，默认为否即为折线
    area: false, //是否为面积图，默认为否即为非面积图
    interactive: false, //是否带交互，默认为否。若置为是，则会响应鼠标事件，显示附近的点，并触发mouseouver事件
    max: null, //y轴最大值。默认为null，取所有点中最大的y值
    min: null, //y轴最小值。默认为null，取所有点中最小的y值
    padding: [8,6,8,6], //边距。除非有特殊需求，否则不建议修改
    color: '#389BFF', //线条颜色。不建议修改。
    areaColor: 'rgba(56,155,255,0.2)' //区域图背景色。不建议修改
  }

```

* data:

```javascript
  [{
    "name":"线",
    "data":[[1483372800000,1892],[1483459200000,7292],...]
  }]
```

特别注意：图表内部不再校验x值的连续性，只根据data顺序渲染。如有需要，请自行将x值处理成连续的

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
