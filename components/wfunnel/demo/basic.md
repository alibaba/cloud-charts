---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础

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
  align: 'left',
};
let options2 = {
  direction: 'vertical',
  align: 'center',
  legend: {
    showData: true,
    valueFormatter(value, data, index) {
      console.log(value, data, index);
      return value + '个';
    }
  }
};
let options3 = {
  direction: 'vertical',
  align: 'right',
  legend: {
    showData: true,
  }
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
