---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了基本用法。

## en-US

basic use.

````jsx
import {
  Wshoot
} from '@alife/aisc-widgets';

const point = [
  { x: 100, y: 100 },
  { x: 400, y: 100 },
  { x: 200, y: 300 },
  { x: 500, y: 300 }
];

class Demo extends React.Component{
  state = {
    data: []
  }

  componentWillMount() {
    this.changeData();
    setInterval(() => {
      this.changeData();
    }, 8000);
  }
  
  changeData() {
    const data = [];
    const len = Math.round(Math.random() * 10) + 10;
    for (let i = 0; i < len; i++) {
      let fIndex = Math.round(Math.random() * 3);
      let tIndex = (fIndex + Math.round(Math.random() * 2) + 1) % 4;
      if (fIndex === tIndex) {
        tIndex = fIndex + 1;
      }
      data.push({
        from: Object.assign({}, point[fIndex]),
        to: Object.assign({}, point[tIndex]),
      });
    }
    
    this.setState({
      data: data
    });
  }

  render(){
    return (
      <div style={{position: 'relative'}}>
        <Wshoot width="600" height="400" data={this.state.data} />
        {
          point.map((p, i) => {
            return <div key={i} style={{position: 'absolute', left: p.x - 5 + 'px', top: p.y - 8 + 'px'}}>{i}</div>;
          })
        }
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
