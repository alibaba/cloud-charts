---
order: 1
title:
  zh-CN: 基本单色
  en-US: Basic
---

## zh-CN

将颜色设置为单一种颜色，可以变为单色南丁格尔图。

## en-US

```jsx
import { COLORS, Wcontainer, Wnightingale } from '@alife/aisc-widgets';

const data = [{
  name: '人口比例',
  data: [
    ['2001', 41.8],
    ['2002', 38],
    ['2003', 33.7],
    ['2004', 30.7],
    ['2005', 25.8],
    ['2006', 31.7],
    ['2007', 33],
    ['2008', 46],
    ['2009', 38.3],
    ['2010', 28],
    ['2011', 42.5],
    ['2012', 30.3]
  ]
}];

let options = {
  colors: COLORS.widgetsColorBlue
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
