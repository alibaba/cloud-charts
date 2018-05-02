---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US


````jsx
import { Wcontainer, Wmap } from '@alife/aisc-widgets';

let data = [
  { name: '广东', value: 20 },
  { name: '新疆', value: 1 },
  { name: '山西', value: 5 },
  { name: '山东', value: 10 },
  { name: '浙江', value: 32 },
  { name: '青海', value: 22 }
];

let options = {
  tooltip: false,
};

class Demo extends React.Component{
  render(){
    return (
      <Wcontainer height={640} style={{ width: 560 }}>
        <Wmap config={options} data={data}/>
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
