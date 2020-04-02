---
order: 3
title:
  zh-CN: 自定义点地图
  en-US: Custom
---

## zh-CN

自定义点地图。

## en-US


````jsx
import { Wcontainer, Wmap } from '@alife/aisc-widgets';

let data = [
  {
    name: '分类1',
    data: [
      { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
      { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
    ]
  },
  {
    name: '分类2',
    data: [
      { name: '上海', lng: 121.4648, lat: 31.2891, value: 40 },
      { name: '广州', lng: 113.5107, lat: 23.2196, value: 30 },
    ]
  },
];

data = [
  { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
  { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
  { name: '上海', lng: 121.4648, lat: 31.2891, value: 40 },
  { name: '广州', lng: 113.5107, lat: 23.2196, value: 30 },
  { name: '哈尔滨', lng: 127.9688, lat: 45.368, value: 50 },
  { name: '三亚', lng: 109.3716, lat: 18.3698, value: 60 },
  { name: '喀什', lng: 77.168, lat: 37.8534, value: 36 },
];

let options = {
  tooltip: false,
};

class Demo extends React.Component{
  renderPoint(point, index) {
    return (
      <span>{index} : {point.name}</span>
    );
  }

  render(){
    return (
      <Wcontainer height={600} style={{ width: 800 }}>
        <Wmap config={options}>
          <Wmap.Custom data={data} render={this.renderPoint.bind(this)} />
        </Wmap>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
