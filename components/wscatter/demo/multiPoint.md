---
order: 2
title:
  zh-CN: 多个点的散点图
  en-US: multi point
---

## zh-CN

演示了多个点的散点图。

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
  },
  {
    name: '机房2',
    data: [
      [1483372800000, 3242],
      [1483459200000, 2292],
      [1483545600000, 4714],
      [1483632000000, 2354],
      [1483718400000, 5014],
      [1483804800000, 2322],
      [1483891200000, 12023],
      [1483977600000, 4218],
      [1484064000000, 2759],
      [1484150400000, 6981],
      [1484236800000, 12533],
      [1484323200000, 8398],
      [1484409600000, 2064],
      [1484496000000, 4494]
    ]
  }
];

const options = {
  padding: [40, 5, 24, 44],
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD'
  },
  tooltip: {
    valueFormatter(v, raw) {
      console.log(raw)
      return v;
    }
  },
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
