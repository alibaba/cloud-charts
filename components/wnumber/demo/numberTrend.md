---
order: 2
title:
  zh-CN: 数值趋势
  en-US: NumberTrend
---

## zh-CN

设置numberTrend可修改数值的趋势显示

## en-US

basic use.


````jsx
import {
  Wnumber
} from '@alife/aisc-widgets';

import {
  Button
} from '@alife/aisc';

const ButtonGroup = Button.Group;

class App extends React.Component {

  state = {
    trend: 'raise'
  };

  changeTrend(trend) {
    this.setState({
      trend
    })
  }

  render() {
    return (
      <div>
        <ButtonGroup style={{marginBottom: '20px'}}>
          <Button onClick={this.changeTrend.bind(this, 'raise')}>修改趋势为上升</Button>
          <Button onClick={this.changeTrend.bind(this, 'drop')}>修改趋势为下降</Button>
        </ButtonGroup>
        <Wnumber numberTrend={this.state.trend} unit="个">2222</Wnumber>
      </div>
    );
  }
}

ReactDOM.render(
    <App />,
mountNode);
````
