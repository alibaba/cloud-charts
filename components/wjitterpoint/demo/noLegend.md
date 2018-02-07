---
order: 1
title:
  zh-CN: 无图例的散点图
  en-US: no legend
---

## zh-CN

演示了无图例的扰动点图。

## en-US

basic use.

```jsx
import { Wjitterpoint } from '@alife/aisc-widgets';

const point = [
  {
    name: '团队1',
    data: [
      ['A', 35],
      ['A', 10],
      ['B', 32],
      ['A', 7],
      ['C', 32],
      ['B', 23],
      ['A', 80],
      ['C', 33],
      ['A', 11],
      ['A', 32],
      ['B', 24],
      ['B', 72],
      ['C', 14],
      ['A', 42]
    ]
  }
];

const options = {
  legend: false
};

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Wjitterpoint height="400" data={point} config={options} />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
