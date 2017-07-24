---
category: 组件
subtitle: 饼图
type: 图表组件
title: Wpie
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

### 饼图配置及数据格式

* config:

```javascript
  {
    title: '饼图', //标题内容，默认为“饼图”
    subTitle: '', //副标题内容，一般用来放单位说明，默认为空
    labelFormatter: null, //自定义格式化，默认为null。
    cycle: false, //是否为环图，默认为false，表示显示为饼图，仅初次设置有效
    clickable: false, //是否可点击，默认为false，表示不可点击。仅初次设置有效
    legend: true, //是否显示图例，默认为true，表示展示图例。仅初次设置有效。不建议修改
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
