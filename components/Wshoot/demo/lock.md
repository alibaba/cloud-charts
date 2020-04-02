---
order: 1
title:
  zh-CN: 锁帧
  en-US: Lock
---

## zh-CN

锁定最大显示帧数为30帧，可以有效降低性能消耗。

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

const config = {
  maxFps: 30
};

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
        <Wshoot width="600" height="400" config={config} data={this.state.data} />
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
