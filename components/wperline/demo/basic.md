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
import { Wcontainer, Wperline } from '@alife/aisc-widgets';

class Demo extends React.Component {
  render() {
    return (
      <div>
        <Wcontainer height="50">
          <Wperline  percent={10} status={'error'} />
        </Wcontainer>

        <Wcontainer height="50">
          <Wperline  percent={40} />
        </Wcontainer>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
