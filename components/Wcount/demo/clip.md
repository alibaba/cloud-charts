---
order: 3
title:
  zh-CN: 切片
  en-US: Clip
---

## zh-CN

设置 clipNum > 1 ，切片显示数据。让变化较慢的数据比较美观，但是会延迟真实数据的展示。

## en-US

basic use.


````jsx
import {
  Wcount, Wnumber
} from '@alife/aisc-widgets'

class Demo extends React.Component{
  state = {
    value: -1000
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        value: Math.random() * 2000
      });
    }, 15000);
  }

  render(){
    return (
      <div>
        <Wnumber bottomTitle="副标题" unit="个" rightTitle="副标题"><Wcount start={0} end={this.state.value} clipNum={2} /></Wnumber>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
