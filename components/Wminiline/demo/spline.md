---
order: 1
title:
  zh-CN: 平滑曲线
  en-US: Spline
---

## zh-CN

设置 spline 为 true，平滑曲线。

## en-US


````jsx
import { Wminiline } from '@alife/aisc-widgets';

let data = [
  {
    "name":"机房",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  }
];

let options = {
  spline: true
};

class Demo extends React.Component{
  render(){
    return (
      <Wminiline config={options} data={data} width="180" height="80" />
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
