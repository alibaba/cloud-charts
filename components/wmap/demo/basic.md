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
  { name: '广东', value: 20, type: '大' },
  { name: '新疆', value: 1, type: '小' },
  { name: '山西', value: 5, type: '小' },
  { name: '山东', value: 10, type: '大' },
  { name: '浙江', value: 32, type: '大' },
  { name: '青海', value: 24, type: '大' },
  { name: '四川', value: 46, type: '大' },
  { name: '广西', value: 64, type: '大' },
  { name: '西藏', value: 3, type: '小' },
  { name: '湖南', value: 7, type: '小' },
  { name: '湖北', value: 12, type: '大' },
  { name: '安徽', value: 30, type: '大' },
  { name: '甘肃', value: 28, type: '大' },
  { name: '河南', value: 50, type: '大' },
];

let pointData = [
  { name: '北京', lng: 116.4551, lat: 40.2539, value: 20, type: '优' },
  { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10, type: '良' },
  { name: '上海', lng: 121.4648, lat: 31.2891, value: 40, type: '优' },
  { name: '广州', lng: 113.5107, lat: 23.2196, value: 30, type: '中' },
];

let options = {
  dataType: 'g2',
  legend: {
    nameFormatter(name, data, index) {
      console.log(name, data, index);
      return 'name: ' + name;
    }
  }
};

class Demo extends React.Component{
  state = {
    width: 800,
    height: 600,
    pointData: pointData
  };

  componentWillMount() {
    
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
