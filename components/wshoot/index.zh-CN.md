---
category: 组件
subtitle: 飞线
type: 基础组件
title: Wshoot 
cols: 1
---

## API

| 属性     | 说明    | 类型     | 默认值  |
| ------ | ----- | ------ | ---- |
| width  | 宽度    | Number | 800  |
| height | 高度    | Number | 600  |
| config | 详细配置项 | Object | 见下方  |
| data   | 数据项   | Array  | 见下方  |

### Config 配置项详解

```javascript
{
  interval: 10000,//单次飞线总时间
  dTime: 4000,//单条飞线预计的时间
  shootTime: {//飞行过程中的各个时间 值域[0, 1]
    fromTime: 0,//出发时间（瞬时）
    fromStop: 0.4,//出发点保留时间（持续）
    fromFade: 0.1,//出发点消失所用时间（持续）
    toBegin: 0.3,//到达目标点的时间（瞬时）
    toTime: 0.1,//到达点显示所用时间（持续）
    toStop: 0,//到达点停留持续时间（持续）
    toFade: 0.1//到达点消失所用时间（持续）
  },
  fromRadius: 12,//出发点半径
  toRadius: 12,//到达点半径
  fromBorder:1.5,//出发点边框宽度
  toBorder:2,//到达点边框宽度
  shootPointColor: {
    fromPoint: '243,183,87',//出发点颜色
    fromShadow: '109,30,39',//出发点阴影颜色
    toPoint: '66,173,255',//到达点颜色
    toShadow: '66,173,255'//到达点阴影颜色
  },
  lineWidth:2,//飞线宽度
  lineColor: {
    from:"0,255,255", //线出发颜色
    to:"0,255,255" //线到达颜色
  },
  bullet: {
    r: 2.5, //弹头半径
    length: 20, //弹头长度
    color: 'rgb(232,180,101)'
  },
  keys: {
    from: 'from',
    to: 'to',
    curvature: 'curvature' //曲率半径，值越大越平坦
  }
}
```

### Data 数据项详情

data传入一个数组，每一项如下：

```javascript
{
  // ‘from’ 必须和 config.keys.from 的值一致
  from: { x: 200, y: 200 },
  // ‘to’ 必须和 config.keys.to 的值一致
  to: { x: 400, y: 200 }
}
```
