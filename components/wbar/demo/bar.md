---
order: 1
title:
  zh-CN: 柱状图
  en-US: Bar
---

## zh-CN

线图示例。

## en-US


````jsx
import { Wbar } from '@alife/aisc-widgets';

let data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19],["四",27],["五",77],["六",100],["七",70],["八",61],["九",15]]
  },{
    "name":"柱2",
    "data":[["一",92],["二",15],["三",4],["四",49],["五",64],["六",76],["七",21],["八",100],["九",71]]
  }
];

let options1 = {
  title: '常规用法',
  subTitle: '副标题或单位'
};

let options2 = {
  title: '轴格式设置',
  subTitle: '',
  xAxis: {
    labelFormatter: function(value){
      return value + '月';
    }
  },
  yAxis: {
    labelFormatter: function(value){
      return value + '%';
    },
    min: 0,
    max: 100
  }
};

let options3 = {
  title: '横向柱状图',
  subTitle: '',
  column: false
};

let options4 = {
  title: '多组堆叠',
  subTitle: '',
  stacking: true
};

let options5 = {
  title: '不带提示',
  subTitle: '也不带网格',
  tooltip: false,
  grid: false
};

let options6 = {
  title: '不带标题',
  subTitle: '标题不会显示',
  single: true
};

class Demo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wbar ref="chart1" config={options1} data={data} height="400" />
        </div>
        <div className="demo-item">
            <Wbar ref="chart2" config={options2} data={data} height="400" />
        </div>
        <div className="demo-item">
            <Wbar ref="chart3" config={options3} data={data} height="400" />
        </div>
        <div className="demo-item">
            <Wbar ref="chart4" config={options4} data={data} height="400" />
        </div>
        <div className="demo-item">
            <Wbar ref="chart4" config={options5} data={data} height="400" />
        </div>
        <div className="demo-item">
            <Wbar ref="chart4" config={options6} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
