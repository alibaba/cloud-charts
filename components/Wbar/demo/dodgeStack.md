---
order: 11
title:
  zh-CN: 分组堆叠图
  en-US: dodgeStack
---

## zh-CN

基础

## en-US


````jsx
import { Wbar, COLORS } from '@alife/aisc-widgets';

let data = [
  {
    "name":"柱1",
    "dodge": '分组1',
    "data":[]
  },
  {
    "name":"柱2",
    "dodge": '分组2',
    "data":[]
  },
  {
    "name":"柱3",
    "dodge": '分组2',
    "data":[]
  },
  {
    "name":"柱4",
    "dodge": '分组2',
    "data":[]
  },
];

for (let i = 0; i < 10; i++) {
  const name = i + '-' + i;
  data[0].data.push([name, Math.random() * 100 + 300]);
  data[1].data.push([name, Math.random() * 100 + 100]);
  data[2].data.push([name, Math.random() * 100 + 100]);
  data[3].data.push([name, Math.random() * 100 + 100]);
}

let options1 = {
  dodgeStack: true
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item">
          <Wbar config={options1} data={data} height="400" />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
