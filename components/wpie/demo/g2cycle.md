---
order: 6
title:
  zh-CN: G2
  en-US: G2
---

## zh-CN

G2 版 基础环图

## en-US


````jsx
import { WG2Pie, Wnumber } from '@alife/aisc-widgets';

let options = {
  dataType: 'Highcharts',
  cycle: true
};

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


class Demo extends React.Component{

  render(){
    return (
      <div className="demos">
        <div className="demo-item">
          <WG2Pie height={300} config={options} data={data}>
            <Wnumber bottomTitle="副标题" unit="个" rightTitle="副标题">2222</Wnumber>
          </WG2Pie>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
