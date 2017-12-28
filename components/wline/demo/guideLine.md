---
order: 15
title:
  zh-CN: 辅助线
  en-US: GuideLine
---

## zh-CN

设置yAxis.guideLine添加辅助线

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

let options1 = {
  xAxis: {type: 'time'},
  yAxis:{},
  guide: {
    line: [{
      // 显示标题相关
      text: {
        title: '233',
        //position: 'start',
        //align: 'end',
        //rotate: false,
      },
      status: 'error',
      // 线位置
      axis: 'x',
      value: 1483545600000,
      // 完全自定义线位置
      start: null,
      end: null
    },
    {
      // 显示标题相关
      text: {
        title: 'y轴标注',
        //position: 'start',
        //align: 'end',
        //rotate: false,
      },
      status: 'error',
      // 线位置
      axis: 'y',
      value: 5500,
      // 完全自定义线位置
      start: null,
      end: null
    }]
  }
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item" style={{height: "298px"}}>
            <Wline config={options1} data={data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
