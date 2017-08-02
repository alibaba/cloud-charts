---
order: 2
title:
  zh-CN: 轴设置
  en-US: Axis setting
---

## zh-CN

轴设置

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

let options2 = {
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
            <Wbar ref="chart1" config={options2} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
