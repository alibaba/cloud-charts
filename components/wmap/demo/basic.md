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
import { Wmap } from '@alife/aisc-widgets';
import chinaData from '../china';

let data = [
  { id: '广东', count: 20 },
  { id: '新疆', count: 1 },
  { id: '山西', count: 5 },
  { id: '山东', count: 10 },
  { id: '浙江', count: 32 },
  { id: '青海', count: 3 }
];

let options = {
  defs: {},
  tooltip: false,
  geoData: chinaData
};

class Demo extends React.Component{
  render(){
    return (
      <div className="demos">
        <div className="demo-item">
            <Wmap width={800} height={600} config={options} data={[]}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
