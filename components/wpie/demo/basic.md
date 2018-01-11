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
      ['Firefox', 450],
      ['IE', 268],
      ['Chrome_Firefox_Safari_Opera', 128],
      ['Safari_Chrome_Firefox', 85],
      ['Opera_Chrome_Firefox_Safari', 62],
      ['Others', 7],
      ['Chrome', 128],
      ['Safari', 85],
      ['Opera', 62]
    ]
  }
];

let options = {
  padding: [20, 20, 20, 20]
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item" style={{width: 300, height: 300}}>
            <Wpie config={options} data={data} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
