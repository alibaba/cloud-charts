---
order: 1
title:
  zh-CN: 无图例
  en-US: NoLegend
---

## zh-CN

最简单的用法。

## en-US


````jsx
import { Wpie } from '@alife/aisc-widgets';

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

let options = {
  legend: false
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wpie config={options} data={data} height="300" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
