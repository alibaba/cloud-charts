---
order: 1
title:
  zh-CN: 配合数字组件
  en-US: Number
---

## zh-CN

可以配合其它组件美化效果。

## en-US

basic use.


````jsx
import {
  Wcount, Wnumber
} from '@alife/aisc-widgets'

class Demo extends React.Component{
  state = {
    value: 1000
  };

  componentWillMount() {
    setInterval(() => {
      this.setState({
        value: Math.random() * 1000
      });
    }, 3000);
  }

  render(){
    return (
      <div>
        <Wnumber bottomTitle="副标题" unit="个" rightTitle="副标题"><Wcount start={0} end={this.state.value} /></Wnumber>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
