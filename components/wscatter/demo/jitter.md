---
order: 2
title:
  zh-CN: 多个点的散点图
  en-US: multi point
---

## zh-CN

演示了多个点的扰动点图。

## en-US

basic use.

```jsx
import { Wscatter } from '@alife/aisc-widgets';

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
  },
  {
    name: '团队2',
    data: [
      ['A', 54],
      ['A', 10],
      ['B', 24],
      ['B', 72],
      ['C', 14],
      ['A', 42],
      ['B', 32],
      ['A', 7],
      ['C', 32],
      ['B', 23],
      ['A', 24],
      ['C', 33],
      ['A', 11],
      ['A', 32]
    ]
  },
  {
    name: '团队3',
    data: [
      ['A', 31],
      ['A', 10],
      ['A', 11],
      ['A', 32],
      ['B', 24],
      ['B', 32],
      ['A', 7],
      ['C', 32],
      ['B', 23],
      ['A', 43],
      ['C', 33],
      ['B', 72],
      ['C', 14],
      ['A', 42]
    ]
  }
];

const options = {
  jitter: true,
  yAxis: {
    min: 0,
    max: 100
  }
};

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Wscatter height="400" data={point} config={options} />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
