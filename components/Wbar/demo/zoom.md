---
order: 9
title:
  zh-CN: 缩放
  en-US: Zoom
---

## zh-CN

基础

## en-US


````jsx
import { Wbar } from '@alife/aisc-widgets';

let data = [
  {
    "name":"柱1",
    "data":[]
  },{
    "name":"柱2",
    "data":[]
  }
];

for (let i = 0; i < 50; i++) {
  const name = i + '-' + i;
  data[0].data.push([name, Math.random() * 100 + 100]);
  data[1].data.push([name, Math.random() * 100 + 100]);
}

let options1 = {
  legend:{
    align: 'right'
  },
  zoom: true
};

class Demo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wbar ref="chart1" config={options1} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
