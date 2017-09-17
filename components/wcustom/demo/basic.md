---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US


````jsx
import { Wcustom } from '@alife/aisc-widgets';

let data = [
  { id: '广东', count: 20 },
  { id: '新疆', count: 1 },
  { id: '山西', count: 5 },
  { id: '山东', count: 10 },
  { id: '浙江', count: 32 },
  { id: '青海', count: 3 }
];

let options = {
  defs: {},
  tooltip: false
};

const customChart = {
  init: function(chart, userConfig, data) {
    // 这里可以通过chart，使用G2语法自定义绘制内容
    console.log(chart, userConfig, data);
  }
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wcustom width={800} height={600} customChart={customChart} config={options} data={[]}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
