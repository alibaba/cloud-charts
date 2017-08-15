---
order: 13
title:
  zh-CN: G2
  en-US: G2
---

## zh-CN

G2 版 极坐标柱状图

## en-US


````jsx
import { WG2Bar } from '@alife/aisc-widgets';

let options = {
  dataType: 'Highcharts',
  polar: true,
  max: 100
};
let data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19]]
  }
];


class Demo extends React.Component{

  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <WG2Bar height={300} config={options} data={data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
