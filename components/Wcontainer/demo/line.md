---
order: 1
title:
  zh-CN: 带折线的widget
  en-US: Line
---

## zh-CN

基础用法，演示了容器大小。

## en-US


````jsx
import {
  Wcontainer, Wicon, Wnumber, Wline
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

let options1 = {
  xAxis: {type: 'time'}
};

let options2 = {
  xAxis: {type: 'time'},
  legend: false
};

let options3 = {
  xAxis: {type: 'time'},
  type: 'spline'
};

let options4 = {
  xAxis: {
    type: 'time',
    mask: 'HH:mm:ss'
  }
};

let data = [
  {
    "name":"机房1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"机房2",
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];

ReactDOM.render(
    <div style={{background: '#f2f3f7', padding: '20px 0'}}>
      <Row>
        <Col span="12">
          <Wcontainer title={"多数据项折线图"} height={298}>
            <Wline ref="chart1" config={options1} data={data} />
          </Wcontainer>
        </Col>
        <Col span="12">
          <Wcontainer title={"多数据项无图例"} height={298}>
            <Wline ref="chart1" config={options2} data={data} />
          </Wcontainer>
        </Col>
      </Row>
      <p></p>
      <Row>
        <Col span="24">
          <div style={{height: '400px'}}>
            <Wcontainer>
              <Wline config={options3} data={data} />
            </Wcontainer>
          </div>
        </Col>
      </Row>
      <p></p>
    </div>,
mountNode);
````