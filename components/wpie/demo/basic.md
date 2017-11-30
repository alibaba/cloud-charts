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
import { Wpie } from '@alife/aisc-widgets';

let data = [
  {
    "name": "浏览器占比",
    "data": [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome_Firefox_Safari_Opera', 12.8],
      ['Safari_Chrome_Firefox', 8.5],
      ['Opera_Chrome_Firefox_Safari', 6.2],
      ['Others', 0.7],
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7],
      ['Chrome_Firefox_Safari_Opera', 12.8],
      ['Safari_Chrome_Firefox', 8.5],
      ['Opera_Chrome_Firefox_Safari', 6.2],
      ['Others', 0.7],
      ['Firefox', 45.0],
    ]
  }
];

let options = {
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
