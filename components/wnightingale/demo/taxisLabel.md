---
order: 1
title:
  zh-CN: 基本带辅助线
  en-US: axisLabel
---

## zh-CN

基础

## en-US

```jsx
import { Wnightingale } from '@alife/aisc-widgets';

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

let options2 = {
  axisLabel: true,
  padding: [50, 50],
  legend: false
};

class Demo extends React.Component {
  render() {
    return (
      <div className="demos">
        <div className="demo-item">
          <Wnightingale
            config={options2}
            data={data}
            height="500"
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
