---
order: 8
title:
  zh-CN: 辅助线
  en-US: GuideLine
---

## zh-CN

设置yAxis.guideLine添加辅助线

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
  legend:{
    align: 'right'
  },
  guide: {
    line: {
      // 显示标题相关
      text: {
        title: '标注',
        //position: 'start',
        //align: 'end',
        //rotate: false,
      },
      status: 'error',
      // 线位置
      axis: 'y',
      value: 55,
    }
  }
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wbar ref="chart1" config={options1} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
