---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础

## en-US

```jsx
import { Wcontainer, Wradar } from '@alife/aisc-widgets';

const data = [
  {
    name: '平均水准',
    data: [
      ['2001', 41],
      ['2002', 38],
      ['2003', 33],
      ['2004', 30],
      ['2005', 25],
      ['2006', 42],
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
      ['2006', 52],
    ]
  }
];

let options = {};

class Demo extends React.Component {
  render() {
    return (
      <Wcontainer height="400">
        <Wradar
          config={options}
          data={data}
        />
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
