---
order: 4
title:
  zh-CN: 动态数据
  en-US: Dynamic
---

## zh-CN

动态加载数据。

## en-US


````jsx
import { Wlinebar } from '@alife/aisc-widgets';

const data1 = [];
const data2 = [];

let now = Date.now();
for(var i = 0; i < 10; i++) {
  let t = now - (30 - i) * 1000;
  data1.push([t, Math.round(Math.random() * 100) + 500]);
  data2.push([t, Math.round(Math.random() * 100) + 500]);
}

let options1 = {
  xAxis: {
    type: 'time',
    mask: 'HH:mm:ss'
  }
};

class Demo extends React.Component{
  state = {
    data: [
      {
        "name":"机房1",
        type: 'bar',
        "data": data1
      },{
        "name":"机房2",
        type: 'line',
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
            type: 'bar',
            "data": data1
          },{
            "name":"机房2",
            type: 'line',
            "data": data2
          }
        ]
      })
    }, 1000);
  }

  render(){
    return null;

    return (
      <div className="demos">
        <div className="demo-item" style={{height: "298px"}}>
            <Wlinebar config={options1} data={this.state.data}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
