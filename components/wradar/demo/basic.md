---
order: 1
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础

## en-US

```jsx
import { Wradar } from '@alife/aisc-widgets';

const data = [
  {
    name: '平均水准',
    data: [
      ['2001', 41],
      ['2002', 38],
      ['2003', 33],
      ['2004', 30],
      ['2005', 25],
    ]
  },
  {
    name: '个人水准',
    data: [
      ['2001', 25],
      ['2002', 72],
      ['2003', 35],
      ['2004', 27],
      ['2005', 54],
    ]
  }
];

let options1 = {};

class Demo extends React.Component {
  render() {
    return (
      <div className="demos">
        <div className="demo-item">
          <Wradar
            config={options1}
            data={data}
            height="400"
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
