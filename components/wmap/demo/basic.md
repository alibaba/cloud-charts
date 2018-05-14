---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最基础用法，仅显示中国地图。

## en-US


````jsx
import { Wcontainer, Wmap } from '@alife/aisc-widgets';


let data = [
  { name: '广东', value: 20 },
  { name: '新疆', value: 1 },
  { name: '山西', value: 5 },
  { name: '山东', value: 10 },
  { name: '浙江', value: 32 },
  { name: '青海', value: 24 },
  { name: '四川', value: 46 },
  { name: '广西', value: 64 },
  { name: '西藏', value: 3 },
  { name: '湖南', value: 7 },
  { name: '湖北', value: 12 },
  { name: '安徽', value: 30 },
  { name: '甘肃', value: 28 },
  { name: '河南', value: 50 },
];

let pointData = [
  { name: '北京', lng: 116.4551, lat: 40.2539, value: 20, level: '0' },
  { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10, level: '1' },
  { name: '上海', lng: 121.4648, lat: 31.2891, value: 40, level: '0' },
  { name: '广州', lng: 113.5107, lat: 23.2196, value: 30, level: '2' },
];

let options = {

};

class Demo extends React.Component{
  state = {
    width: 800,
    height: 600,
  };

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        width: 700,
        height: 700
      });
    }, 3000);

    setTimeout(() => {
      this.setState({
        width: 600,
        height: 800
      });
    }, 6000);
  }
  render(){
    const { width, height } = this.state;

    return (
      <Wcontainer height={height} style={{ width: width }}>
        <Wmap config={options}>
          <Wmap.Area data={data} />
          <Wmap.Point data={pointData} />
        </Wmap>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
