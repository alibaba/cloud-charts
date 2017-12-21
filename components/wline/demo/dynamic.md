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

let now = Date.now();
for(var i = 0; i < 30; i++) {
  let t = now - (30 - i) * 1000;
  data1.push([t, Math.round(Math.random() * 100) + 500]);
  data2.push([t, Math.round(Math.random() * 100) + 500]);
}

let options1 = {
  xAxis: {
    type: 'time',
  }
};

class Demo extends React.Component{
  state = {
    data: [
      {
        "name":"机房1",
        "data": data1
      },{
        "name":"机房2",
        "data": data2
      }
    ]
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
