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
    "data":[]
  },{
    "name":"机房2",
    "data":[]
  }
];

let now = (new Date()).setSeconds(0, 0);
for(var i = 0; i < 30; i++) {
  let t = now - (30 - i) * 60000;
  data[0].data.push([t, Math.round(Math.random() * 100) + (i > 10 ? 3000 : 6000)]);
  data[1].data.push([t, Math.round(Math.random() * 100) + (i > 10 ? 3000 : 6000)]);
}

let options1 = {
  xAxis: {type: 'time', mask: 'HH:mm:ss'},
  yAxis:{},
  guide: {
    line: [{
      // 显示标题相关
      text: {
        title: '异常',
      },
      status: 'error',
      // 线位置
      axis: 'x',
      value: now - 20 * 60000,
      // 完全自定义线位置
      start: null,
      end: null
    },
    {
      // 显示标题相关
      text: {
        title: '警戒线',
      },
      status: 'error',
      // 线位置
      axis: 'y',
      value: 5200,
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
