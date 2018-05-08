---
order: 0
title:
  zh-CN: 散点地图
  en-US: Area
---

## zh-CN

散点地图。

## en-US


````jsx
import { Wcontainer, Wmap } from '@alife/aisc-widgets';

let data = [
  { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
  { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
];

let options = {
  tooltip: false,
};

class Demo extends React.Component{
  render(){
    return (
      <Wcontainer height={640} style={{ width: 560 }}>
        <Wmap config={options}>
          <Wmap.Point data={data} />
        </Wmap>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
