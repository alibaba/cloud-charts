---
order: 1
title:
  zh-CN: 水平漏斗图
  en-US: Horizontal
---

## zh-CN

设置 direction 为 horizontal 变为水平漏斗图，align 的可选项会发生变化。

## en-US


````jsx
import { Grid } from '@alife/aisc';
import { Wfunnel } from '@alife/aisc-widgets';
const { Row, Col } = Grid;

let data = [
  {
    "name":"柱1",
    "data":[["一", 100], ["二", 94], ["三", 86], ["四", 71], ["五", 67], ["六", 54], ["七", 42], ["八", 30],["九", 23]]
  }
];

let options1 = {
  direction: 'horizontal',
  align: 'top',
};
let options2 = {
  direction: 'horizontal',
  align: 'center',
};
let options3 = {
  direction: 'horizontal',
  align: 'bottom',
};

class Demo extends React.Component{
  render(){
    return (
      <Row>
        <Col span="8">
          <Wfunnel config={options1} data={data} height="400" />
        </Col>
        <Col span="8">
          <Wfunnel config={options2} data={data} height="400" />
        </Col>
        <Col span="8">
          <Wfunnel config={options3} data={data} height="400" />
        </Col>
      </Row>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
