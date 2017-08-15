---
order: 1
title:
  zh-CN: 带折线的widget
  en-US: Basic
---

## zh-CN

基础用法，演示了容器大小。

## en-US


````jsx
import {
  Wcontainer, Wicon, Wnumber, Wline, WG2Line
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

let options1 = {
  xAxis: {type: 'datetime'}
};

let options2 = {
  xAxis: {type: 'datetime'},
  legend: false
};

let options3 = {
  xAxis: {type: 'datetime'},
  type: 'spline'
};

let options4 = {
  xAxis: {
    type: 'datetime',
    dateFormatter: 'HH:MM:ss'
  },
  dataType: 'Highcharts'
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
    <div>
      <Row>
        <Col span="12">
          <Wcontainer title={"多数据项折线图"} height={298}>
            <Wline ref="chart1" config={options1} data={data} height="250"/>
          </Wcontainer>
        </Col>
        <Col span="12">
          <Wcontainer title={"多数据项无图例"} height={298}>
            <Wline ref="chart1" config={options2} data={data} height="250"/>
          </Wcontainer>
        </Col>
      </Row>
      <p></p>
      <Row>
        <Col span="24">
          <Wcontainer title={"圆滑曲线图"} height={298}>
            <Wline ref="chart1" config={options3} data={data} height="250"/>
          </Wcontainer>
        </Col>
      </Row>
      <p></p>
      {/* 
      <Row>
        <Col span="24">
          <Wcontainer title={"G2曲线图"} height={298}>
            <WG2Line ref="chart1" config={options4} data={data} height="250"/>
          </Wcontainer>
        </Col>
      </Row>
      */}
    </div>,
mountNode);
````
