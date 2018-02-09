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
import { Wcontainer, Wnightingale } from '@alife/aisc-widgets';

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

let options = {};

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
