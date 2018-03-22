---
order: 2
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

在数据加载完成之前，使用占位图代替图表。

## en-US

basic use.


````jsx
import {
  Wcontainer, Wplaceholder, Wline
} from '@alife/aisc-widgets'

let options = {
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD'
  },
};

class Demo extends React.Component{
  state = {
    data: null
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: [
          {
            "name":"机房1",
            "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
          },{
            "name":"机房2",
            "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
          }
        ]
      });
    }, 3000);
  }

  render(){
    return (
      <Wcontainer className="demos" height="300">
        {
          this.state.data ?
            <Wline config={options} data={this.state.data}/>
            :
            <Wplaceholder>加载中...</Wplaceholder>
        }
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
