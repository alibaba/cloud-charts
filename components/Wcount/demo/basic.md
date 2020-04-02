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


````jsx
import {
  Wcount
} from '@alife/aisc-widgets'

class Demo extends React.Component{
  state = {
    value: 100
  };

  componentWillMount() {
    setInterval(() => {
      this.setState({
        value: Math.random() * 100
      });
    }, 3000);
  }

  render(){
    return (
      <div>
        <Wcount start={0} end={this.state.value} />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
