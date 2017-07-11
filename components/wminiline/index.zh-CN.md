---
category: 组件
subtitle: 迷你线图
type: 图表组件
title: WMiniLine
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

### 迷你曲线配置及数据格式

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
