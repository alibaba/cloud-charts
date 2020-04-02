---
order: 0
title:
  zh-CN: 迷你widget基础用法
  en-US: Basic
---

## zh-CN

基础用法，演示了迷你容器配合其他组件使用。

## en-US


````jsx
import {
  Wminicontainer, Wcircle
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

ReactDOM.render(
  <Row>
    <Col span="6">
      <Wminicontainer height={192}>
        <Wcircle
          title="本周未达标指标"
          percent={0.45}>7</Wcircle>
      </Wminicontainer>
    </Col>
    <Col span="6">
      <Wminicontainer height={192}>
        <Wcircle
          title="本周未达标指标"
          status="warning"
          percent={0.45}>7</Wcircle>
      </Wminicontainer>
    </Col>
    <Col span="6">
      <Wminicontainer height={192} status="warning">
        <Wcircle
          title="本周未达标指标"
          status="warning"
          percent={0.45}>7</Wcircle>
      </Wminicontainer>
    </Col>
    <Col span="6">
      <Wminicontainer height={192} status="error">
        <Wcircle type="gauge"
          title="本周未达标指标"
          status="error"
          bottomTitle="较上周"
          bottomNumber={134}
          percent={0.45}
          bottomTrend="raise">45</Wcircle>
      </Wminicontainer>
    </Col>
  </Row>,
mountNode);
````
