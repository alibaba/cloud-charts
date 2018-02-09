---
order: 1
title:
  zh-CN: 面积图
  en-US: Area
---

## zh-CN

设置area为true显示面积图。

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

let options = {
  area: true
};

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
