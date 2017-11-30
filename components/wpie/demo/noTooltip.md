---
order: 3
title:
  zh-CN: 无Tooltip
  en-US: Tooltip
---

## zh-CN

通过设置 tooltip 为 false，不显示Tooltip。

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
  tooltip: false
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
