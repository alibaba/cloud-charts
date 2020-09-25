﻿---
order: 1
title:
  zh-CN: 轴设置
  en-US: Axis
---

## zh-CN

通过 xAxis 和 yAxis 设置轴。

## en-US


````jsx
import { Wline } from '@alife/aisc-widgets';

let data = [
  {
    "name":"机房1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"机房2",
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];

let options2 = {
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD'
  },
  yAxis: {
    labelFormatter: function(value){
      if(value >= 1000) return parseInt( value / 1000 ) + 'K';
      else return value;
    }
  }
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wline config={options2} data={data} height="250" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````