---
order: 2
title:
  zh-CN: 扰动点图
  en-US: jitter
---

## zh-CN

设置jitter为true可以变为扰动点图。

## en-US

```jsx
import { Wcontainer, Wscatter } from '@alife/aisc-widgets';

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
  padding: [40, 5, 24, 29],
  jitter: true,
  yAxis: {
    min: 0,
    max: 100
  }
};

class Demo extends React.Component {
  render() {
    return (
      <Wcontainer>
        <Wscatter height="400" data={point} config={options} />
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
