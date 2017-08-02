---
category: 组件
subtitle: 柱图
type: 图表组件
title: Wbar
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

### 柱图配置及数据格式

* config:

```javascript
  {
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
    grid: false, //是否显示网格，默认为false，表示显示。仅初次设置有效。不建议修改
    legend: true, //是否显示图例，默认为true，表示展示图例。仅初次设置有效。不建议修改
    tooltip: true, //是否需要提示标签，默认为true，表示显示。仅初次设置有效。不建议修改
    colors: ['#389BFF','#F2A72D','#8CD123',...], //线条配色，默认有17种颜色。不建议修改
    padding: [12, 0, 12, 0] //容器内边距，单位是像素。不建议修改
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
