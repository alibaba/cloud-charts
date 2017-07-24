---
order: 3
title:
  zh-CN: 无标题
  en-US: Single
---

## zh-CN

通过设置 single 为 true，不显示标题和图例。

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
  title: '不带标题',
  subTitle: '标题不会显示',
  single: true
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
