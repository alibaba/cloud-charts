---
order: 3
title:
  zh-CN: 带柱状图的widget
  en-US: Basic
---

## zh-CN

基础用法，演示了容器大小。

## en-US


````jsx
import {
  Wcontainer, Wicon, Wnumber, Wbar
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

let data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19],["四",27],["五",77]]
  },{
    "name":"柱2",
    "data":[["一",92],["二",15],["三",4],["四",49],["五",64]]
  }
];

let options1 = {
};

let options2 = {
  column: false,
  single: true,
};

ReactDOM.render(
    <div>
      <Row>
        <Col span="12">
          <Wcontainer title={"柱图"} height={298}>
            <Wbar ref="chart1" config={options1} data={data} />
          </Wcontainer>
        </Col>
        <Col span="12">
          <Wcontainer title={"横向柱图"} height={298}>
            <Wbar ref="chart2" config={options2} data={data} />
          </Wcontainer>
        </Col>
      </Row>
    </div>,
mountNode);
````
