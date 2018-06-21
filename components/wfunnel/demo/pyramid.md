---
order: 2
title:
  zh-CN: 尖顶漏斗图
  en-US: Pyramid
---

## zh-CN

设置 pyramid 为 true 变为尖顶漏斗图，仅适合 align 为 'center' 的情况。

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
  direction: 'vertical',
  align: 'center',
  pyramid: true,
};
let options2 = {
  direction: 'horizontal',
  align: 'center',
  pyramid: true,
};

class Demo extends React.Component{
  render(){
    return (
      <Row>
        <Col span="12">
          <Wfunnel config={options1} data={data} height="400" />
        </Col>
        <Col span="12">
          <Wfunnel config={options2} data={data} height="400" />
        </Col>
      </Row>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
