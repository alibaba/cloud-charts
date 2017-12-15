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
import { Wscatter } from '@alife/aisc-widgets';

const point = [{ x: 100, y: 100 }, { x: 400, y: 100 }, { x: 200, y: 300 }, { x: 500, y: 300 }];

const testData = [
  {
    name: 'Africa',
    data: [
      ['Algeria', 72.301, 6223.367465, 33333216.0],
      ['Angola', 42.731, 4797.231267, 12420476.0],
      ['Benin', 56.728, 1441.284873, 8078314.0],
      ['Botswana', 50.728, 12569.85177, 1639131.0],
      ['Burkina Faso', 52.295, 1217.032994, 14326203.0]
    ]
  },
  {
    name: 'Americas',
    data: [
      ['Argentina', 75.32, 12779.37964, 40301927.0],
      ['Bolivia', 65.554, 3822.137084, 9119152.0],
      ['Brazil', 72.39, 9065.800825, 190010647.0],
      ['Canada', 80.653, 36319.23501, 33390141.0],
      ['Chile', 78.553, 13171.63885, 16284741.0]
    ]
  }
];

class Demo extends React.Component {
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <Wscatter height="400" data={testData} />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
