---
order: 11
title:
  zh-CN: G2
  en-US: G2
---

## zh-CN

G2 版 基础柱状图

## en-US


````jsx
import { WG2Bar } from '@alife/aisc-widgets';
  //dataType: 'Highcharts'
let options = {
  dataType: 'Highcharts',
  grid: true
};
let data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19],["四",27],["五",77],["六",100],["七",70],["八",61],["九",15]]
  },{
    "name":"柱2",
    "data":[["一",92],["二",15],["三",4],["四",49],["五",64],["六",76],["七",21],["八",100],["九",71]]
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
