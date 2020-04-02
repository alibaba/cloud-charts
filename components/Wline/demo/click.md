---
order: 8
title:
  zh-CN: 点击事件
  en-US: Click
---

## zh-CN

图表的各种事件

## en-US


````jsx
import { Wline } from '@alife/aisc-widgets';

let options = {
  xAxis: {type: 'time'},
  zoom: true,
  tooltip: false,
  clickable: true
};


let data = [
  {
    "name":"线1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"线2",
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];


class Demo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      action: {
      },
      info: {
        x: 0,
        y: 0,
        name: '线'
      }
    };
  }

  clickEventHandler(e){
		this.setState({
      info: {
        x: e.point.x,
        y: e.point.y,
        name: e.name
      }
    });
  }


  render(){
    return (
      <div>
        <Wline config={options} data={data} onClick={this.clickEventHandler.bind(this)} action={this.state.action}  height="250" />
        <div className="info">{this.state.info.name}: [{this.state.info.x},{this.state.info.y}]</div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
