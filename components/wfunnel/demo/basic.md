---
order: 1
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
  legend:{
    align: 'right'
  },
  direction: 'vertical',
  align: 'left',
};
let options2 = {
  legend:{
    align: 'right'
  },
  direction: 'vertical',
  align: 'center',
};
let options3 = {
  legend:{
    align: 'right'
  },
  direction: 'vertical',
  align: 'right',
};

let options4 = {
  legend:{
    align: 'right'
  },
  direction: 'horizontal',
  align: 'top',
};
let options5 = {
  legend:{
    align: 'right'
  },
  direction: 'horizontal',
  align: 'center',
};
let options6 = {
  legend:{
    align: 'right'
  },
  direction: 'horizontal',
  align: 'bottom',
};

class Demo extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render(){
    return (
      <div>
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

        <Row>
          <Col span="8">
            <Wfunnel config={options4} data={data} height="400" />
          </Col>
          <Col span="8">
            <Wfunnel config={options5} data={data} height="400" />
          </Col>
          <Col span="8">
            <Wfunnel config={options6} data={data} height="400" />
          </Col>
        </Row>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
