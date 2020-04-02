---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了基本用法。

## en-US

basic use.

```jsx
import { Wcontainer, Wscatter } from '@alife/aisc-widgets';

const point = [
  {
    name: '机房1',
    data: [
      [1483372800000, 1892],
      [1483459200000, 7292],
      [1483545600000, 5714],
      [1483632000000, 5354],
      [1483718400000, 2014],
      [1483804800000, 22],
      [1483891200000, 11023],
      [1483977600000, 5218],
      [1484064000000, 8759],
      [1484150400000, 9981],
      [1484236800000, 4533],
      [1484323200000, 11398],
      [1484409600000, 1064],
      [1484496000000, 6494]
    ]
  }
];

const options = {
  padding: [40, 5, 24, 44],
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD'
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
