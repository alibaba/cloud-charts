---
order: 2
title:
  zh-CN: 迷你折线图
  en-US: MiniLine
---

## zh-CN

线图示例。

## en-US


````jsx
import { Charts } from '@alife/aisc-widgets';

let data = [
  {
    "name":"机房",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  }
];

let options1 = {
};

let options2 = {
  spline: true
};

let options3 = {
  area: true
};

let options4 = {
  spline: true,
  area: true
};

let options5 = {
  spline: true,
  area: true,
  interactive: true
};

class Demo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      point5: {x:0 , y:0}
    };
  }

  moEvnetHandler(e){
    this.setState({
      point5: {
        x: e.point.x,
        y: e.point.y
      }
    })
  }

  render(){
    return (
      <table>
        <thead>
          <tr>
            <th>描述</th>
            <th>实例</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>默认折线</td>
            <td><Charts ref="chart1" type="miniLine" config={options1} data={data} width="180" height="80" /></td>
            <td></td>
          </tr>
          <tr>
            <td>平滑曲线</td>
            <td><Charts ref="chart2" type="miniLine" config={options2} data={data} width="180" height="80" /></td>
            <td></td>
          </tr>
          <tr>
            <td>面积折线</td>
            <td><Charts ref="chart3" type="miniLine" config={options3} data={data} width="180" height="80" /></td>
            <td></td>
          </tr>
          <tr>
            <td>面积曲线</td>
            <td><Charts ref="chart4" type="miniLine" config={options4} data={data} width="180" height="80" /></td>
            <td></td>
          </tr>
          <tr>
            <td>带交互事件</td>
            <td><Charts ref="chart5" type="miniLine" config={options5} data={data} width="200" height="80" onMouseOver={this.moEvnetHandler.bind(this)} /></td>
            <td>
              x: {this.state.point5.x} y: {this.state.point5.y}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
