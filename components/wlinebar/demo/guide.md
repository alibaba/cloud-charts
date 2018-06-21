---
order: 6
title:
  zh-CN: 辅助线
  en-US: Guide
---

## zh-CN

通过将 yAxis 设置为数组设置双轴。

## en-US


````jsx
import { Wlinebar } from '@alife/aisc-widgets';

let data = [
  {
    "name":"机房1",
    type: 'line',
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"机房2",
    type: 'bar',
    "yAxis": 1,
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];

let options2 = {
  xAxis: {
    type: 'timeCat',
    mask: 'YYYY-MM-DD'
  },
  yAxis: [
    {
      labelFormatter: function(value){
        if(value >= 1000) return parseInt( value / 1000 ) + 'K';
        else return value;
      }
    },
    {
      labelFormatter: function(value){
        return value + 'S';
      }
    },
  ],
  guide: {
    line: {
      // 显示标题相关
      text: {
        title: '警戒线',
      },
      status: 'error',
      // 线位置
      axis: 'y1',
      value: 5200
    }
  }
};

class Demo extends React.Component{
  render() {
    return (
      <div className="demos">
        <div className="demo-item">
            <Wlinebar config={options2} data={data} height="250" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
