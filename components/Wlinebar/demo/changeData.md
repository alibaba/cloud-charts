---
order: 7
title:
  zh-CN: 数据变更
  en-US: ChangeData
---

## zh-CN

数据改变时出错？

## en-US


````jsx
import { Wcontainer, Wlinebar } from '@alife/aisc-widgets'

let data =
[
  {"name":"自动提PR","type":"bar","yAxis":0,"data":[["项目编号1.5",4.2]]},
  {"name":"PR、PO","type":"bar","yAxis":0,"data":[["项目编号1.5",3]]},
  {"name":"商品到货","type":"bar","yAxis":0,"data":[["项目编号1.5",2]]},
  {"name":"标准SLA","type":"line","yAxis":1,"data":[["项目编号1.5",29]]}
];

let data1 = [
  {"name":"自动提PR","type":"bar","yAxis":0,"data":[["ali_M122.1",4.2],["ali_M121.1",4.2],["ali_M120.1",4.2],["ali_M119.1",4.2],["ali_M118.1",4.2],["ali_M117.1",4.2],["ali_M116.1",4.2],["ali_M115.1",4.2],["ali_M114.1",4.2],["ali_M113.1",4.2]]},
  {"name":"PR、PO","type":"bar","yAxis":0,"data":[["ali_M122.1",3],["ali_M121.1",3],["ali_M120.1",3],["ali_M119.1",3],["ali_M118.1",3],["ali_M117.1",3],["ali_M116.1",3],["ali_M115.1",3],["ali_M114.1",3],["ali_M113.1",3]]},
  {"name":"商品到货","type":"bar","yAxis":0,"data":[["ali_M122.1",2],["ali_M121.1",2],["ali_M120.1",2],["ali_M119.1",2],["ali_M118.1",2],["ali_M117.1",2],["ali_M116.1",2],["ali_M115.1",2],["ali_M114.1",2],["ali_M113.1",2]]},
  {"name":"标准SLA","type":"line","yAxis":1,"data":[["ali_M122.1",38],["ali_M121.1",38],["ali_M120.1",38],["ali_M119.1",38],["ali_M118.1",38],["ali_M117.1",38],["ali_M116.1",38],["ali_M115.1",38],["ali_M114.1",38],["ali_M113.1",38]]}
]

let options = {
  padding: [40, 5, 24, 44],
  xAxis: {
    type: 'cat',
  },
  yAxis: {}
};

class Demo extends React.Component{
  state = {
    data: []
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: data1
      });
    }, 3000);
  }

  render(){
    return (
      <div className="demos-box">
        <Wcontainer className="demos">
          <Wlinebar height="300" config={options} data={this.state.data}/>
        </Wcontainer>
      </div>
    );
  }
}


ReactDOM.render(<Demo />, mountNode);
````
