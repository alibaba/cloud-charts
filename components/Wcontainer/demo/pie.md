---
order: 2
title:
  zh-CN: 带饼图的widget
  en-US: Pie
---

## zh-CN

基础用法，演示了容器大小。

## en-US


````jsx
import {
  Wcontainer, Wicon, Wnumber, Wpie
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
};

let options4 = {
  cycle: true
};

ReactDOM.render(
    <div style={{background: '#f2f3f7', padding: '20px 0'}}>
      <Row>
        <Col span="12">
          <Wcontainer title={"饼图"} height={298}>
            <Wpie ref="chart1" config={options1} data={data} />
          </Wcontainer>
        </Col>
        <Col span="12">
          <Wcontainer title={"环图"} height={298}>
            <Wpie ref="chart2" config={options2} data={data} />
          </Wcontainer>
        </Col>
      </Row>
    </div>,
mountNode);
````