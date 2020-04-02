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
          <div>
            指标1 <Wperline style={{display: 'inline-block'}} percent={10} status={'error'} />
            指标2 <Wperline style={{display: 'inline-block'}} percent={40} />
          </div>
        </Wcontainer>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
