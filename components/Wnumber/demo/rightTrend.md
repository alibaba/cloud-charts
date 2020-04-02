---
order: 3
title:
  zh-CN: 右侧数值趋势
  en-US: RightTrend
---

## zh-CN

设置rightRatio可展示右侧额外数值，设置rightRatioTrend可控制其趋势。

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
        <Wnumber rightRatio="30%" rightRatioTrend={this.state.trend} unit="%">2222</Wnumber>
      </div>
    );
  }
}

ReactDOM.render(
    <App />,
mountNode);
````
