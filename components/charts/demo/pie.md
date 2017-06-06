---
order: 3
title:
  zh-CN: 饼图
  en-US: Pie
---

## zh-CN

线图示例。

## en-US


````jsx
import { Charts } from '@alife/p2widgets';

let data = [
  {
    "name": "浏览器占比",
    "data": [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7]
    ]
  }
];

let options1 = {
  title: '常规用法',
  subTitle: '副标题或单位'
};

let options2 = {
  title: '环图',
  subTitle: '图例自定义',
  cycle: true,
  labelFormatter: function(value){
    return value + '%';
  }
};

let options3 = {
  title: '不带提示',
  subTitle: '',
  tooltip: false
};

let options4 = {
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
            <Charts ref="chart1" type="pie" config={options1} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart2" type="pie" config={options2} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart3" type="pie" config={options3} data={data} width="600" height="400" />
        </div>
        <div className="demo-item">
            <Charts ref="chart4" type="pie" config={options4} data={data} width="600" height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
