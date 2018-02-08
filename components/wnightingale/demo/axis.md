---
order: 1
title:
  zh-CN: 基本带辅助线
  en-US: axis
---

## zh-CN

基础

## en-US

```jsx
import { Wnightingale } from '@alife/aisc-widgets';

const data = [{
  name: '人口比例',
  data: [
    ['200120012001', 41.8],
    ['200220022002', 38],
    ['200320032003', 33.7],
    ['200420042004', 30.7],
    ['200520052005', 25.8],
    ['200620062006', 31.7],
    ['200720072007', 33],
    ['200820082008', 46],
    ['200920092009', 38.3],
    ['201020102010', 28],
    ['201120112011', 42.5],
    ['201220122012', 30.3]
  ]
}];

let options2 = {
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
      <div className="demos">
        <div className="demo-item" style={{height: '400px'}}>
          <Wnightingale
            config={options2}
            data={data}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
