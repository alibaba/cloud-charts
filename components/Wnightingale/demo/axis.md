---
order: 2
title:
  zh-CN: 带坐标轴
  en-US: axis
---

## zh-CN

设置axis为true可以显示坐标轴，通过设置label.key控制label显示x轴的值还是y轴的值。

## en-US

```jsx
import { Wcontainer, Wnightingale } from '@alife/aisc-widgets';

const data = [{
  name: '人口比例',
  data: [
    ['20012001', 41.8],
    ['20022002', 38],
    ['20032003', 33.7],
    ['20042004', 30.7],
    ['20052005', 25.8],
    ['20062006', 31.7],
    ['20072007', 33],
    ['20082008', 46],
    ['20092009', 38.3],
    ['20102010', 28],
    ['20112011', 42.5],
    ['20122012', 30.3],
    ['20122013', 34.3]
  ]
}];

let options = {
  axis: true,
  label: {
    key: 'y'
  },
  padding: [50, 50],
  legend: false
};

class Demo extends React.Component {
  render() {
    return (
      <Wcontainer height="400">
        <Wnightingale
          config={options}
          data={data}
        />
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```