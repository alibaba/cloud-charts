---
order: 16
title:
  zh-CN: 动态数据
  en-US: Dynamic
---

## zh-CN

最简单的用法。

## en-US


````jsx
import { Wline } from '@alife/aisc-widgets';

const data1 = [];
const data2 = [];
let data = [
  {
    "name":"机房1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"机房2",
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];

let now = Date.now();
for(var i = 0; i < 30; i++) {
  let t = now - (30 - i) * 1000;
  data1.push([t, Math.round(Math.random() * 100) + 500]);
  data2.push([t, Math.round(Math.random() * 100) + 500]);
}

let options1 = {
  xAxis: {
    type: 'datetime',
    dateFormatter: '%H:%M:%S'
  }
};

class Demo extends React.Component{
  state = {
    data: []
  }

  componentWillMount() {
    setInterval(() => {
      let t = Date.now();

      data1.push([t, Math.round(Math.random() * 100) + 500]);
      data2.push([t, Math.round(Math.random() * 100) + 500]);

      data1.shift();
      data2.shift();

      this.setState({
        data: [
          {
            "name":"机房1",
            "data": data1
          },{
            "name":"机房2",
            "data": data2
          }
        ]
      })
    }, 1000);
  }

  render(){
    return (
      <div className="demos">
        <div className="demo-item" style={{height: "298px"}}>
            <Wline config={options1} data={this.state.data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
