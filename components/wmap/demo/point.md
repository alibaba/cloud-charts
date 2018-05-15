---
order: 2
title:
  zh-CN: 散点地图
  en-US: Point
---

## zh-CN

散点地图。

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

let options = {
  tooltip: false,
};

class Demo extends React.Component{
  render(){
    return (
      <Wcontainer height={600} style={{ width: 800 }}>
        <Wmap config={options}>
          <Wmap.Point data={data} />
        </Wmap>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
