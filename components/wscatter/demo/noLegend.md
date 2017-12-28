---
order: 1
title:
  zh-CN: 无图例的散点图
  en-US: no legend
---

## zh-CN

演示了无图例的散点图。

## en-US

basic use.

```jsx
import { Wscatter } from '@alife/aisc-widgets';

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
      [1483891200000, 5023],
      [1483977600000, 2218],
      [1484064000000, 4759],
      [1484150400000, 7981],
      [1484236800000, 2533],
      [1484323200000, 12398],
      [1484409600000, 2064],
      [1484496000000, 6494]
    ]
  }
];

const options = {
  legend: false,
  xAxis: {
    type: 'time'
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
