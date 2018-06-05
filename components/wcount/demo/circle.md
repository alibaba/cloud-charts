---
order: 2
title:
  zh-CN: 配合圆环组件
  en-US: Circle
---

## zh-CN

可以配合其它组件美化效果。

## en-US

basic use.


````jsx
import {
  Wcount, Wcircle
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
        <Wcircle title="标题" percent={this.state.value / 1000}><Wcount start={0} end={this.state.value} /></Wcircle>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
