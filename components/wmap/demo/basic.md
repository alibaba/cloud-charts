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
  { name: '北京', value: 20, type: '优' },
  { name: '杭州', value: 10, type: '良' },
  { name: '上海', value: 40, type: '优' },
  { name: '广州', value: 30, type: '中' },
];

let options = {
  dataType: 'g2',
  labels: true,
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
    setTimeout(() => {
      this.setState({
        pointData: [
          { name: '北京', value: 50, type: '中' },
          { name: '杭州', value: 30, type: '中' },
          { name: '上海', value: 60, type: '良' },
          { name: '广州', value: 10, type: '优' },
        ]
      });
    }, 3000);
  }
  render(){
    const { width, height } = this.state;
    return (
      <Wcontainer height={height} style={{ width: width }}>
        <Wmap config={options}>
          <Wmap.Point data={this.state.pointData} />
        </Wmap>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
