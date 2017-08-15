---
order: 2
title:
  zh-CN: 带饼图的widget
  en-US: Basic
---

## zh-CN

基础用法，演示了容器大小。

## en-US


````jsx
import {
  Wcontainer, Wicon, Wnumber, Wpie, WG2Pie
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

let data = [
  {
    "name": "浏览器占比",
    "data": [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7]
    ]
  }
];

let options1 = {
  single: true
};

let options2 = {
  single: true,
  cycle: true
};

let options3 = {
  dataType: 'Highcharts'
};

let options4 = {
  dataType: 'Highcharts',
  cycle: true
};

ReactDOM.render(
    <div>
      <Row>
        <Col span="12">
          <Wcontainer title={"饼图"} height={298}>
            <Wpie ref="chart1" config={options1} data={data} height="250"/>
          </Wcontainer>
        </Col>
        <Col span="12">
          <Wcontainer title={"环图"} height={298}>
            <Wpie ref="chart2" config={options2} data={data} height="250"/>
          </Wcontainer>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Wcontainer title={"G2版本 柱图"} height={298}>
            <WG2Pie ref="chart3" config={options3} data={data} height="250"/>
          </Wcontainer>
        </Col>
        <Col span="12">
          <Wcontainer title={"G2版本 环图"} height={298}>
            <WG2Pie ref="chart4" config={options4} data={data} height="250"/>
          </Wcontainer>
        </Col>
      </Row>
    </div>,
mountNode);
````
