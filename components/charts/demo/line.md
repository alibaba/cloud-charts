---
order: 0
title:
  zh-CN: 折线图
  en-US: Line
---

## zh-CN

线图示例。

## en-US


````jsx
import { Charts } from '@alife/p2widgets';

let data = [
  {
    "name":"机房1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"机房2",
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];

let options1 = {
  title: '常规用法',
  subTitle: '副标题或单位',
  xAxis: {type: 'datetime'}
};

let options2 = {
  title: '轴格式设置',
  subTitle: '',
  xAxis: {
    type: 'datetime',
    dateFormatter: '%m/%d/%y'
  },
  yAxis: {
    labelFormatter: function(value){
      if(value >= 1000) return parseInt( value / 1000 ) + 'K';
      else return value;
    }
  }
};

let options3 = {
  title: '不带提示',
  subTitle: '数据可选',
  xAxis: {type: 'datetime'},
  tooltip: false,
  clickable: true
};

let options4 = {
  title: '不带标题',
  subTitle: '标题不会显示',
  xAxis: {type: 'datetime'},
  single: true
};

let options5 = {
  title: '曲线图',
  subTitle: '线上没点',
  xAxis: {type: 'datetime'},
  spline: true
};

let options6 = {
  title: '带网格',
  subTitle: '',
  xAxis: {type: 'datetime'},
  grid: true
};

let options7 = {
  title: '带背景',
  subTitle: 'y轴方向的区域背景',
  xAxis: {type: 'datetime'},
  yAxis: {
    bgArea: [5000,10000]
  }
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
            <Charts ref="chart1" type="line" config={options1} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart2" type="line" config={options2} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart3" type="line" config={options3} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart4" type="line" config={options4} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart5" type="line" config={options5} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart6" type="line" config={options6} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart7" type="line" config={options7} data={data} width="600" height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
