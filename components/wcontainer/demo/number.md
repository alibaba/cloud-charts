---
order: 0
title:
  zh-CN: 数字widget
  en-US: Basic
---

## zh-CN

基础用法，演示了容器大小。

## en-US


````jsx
import {
  Wcontainer, Wicon, Wnumber
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

ReactDOM.render(
    <Row>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >1</Wnumber>
          <Wicon type="monitor" size="big" />
        </Wcontainer>
      </Col>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >12</Wnumber>
          <Wicon type="monitor" size="big" />
        </Wcontainer>
      </Col>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >123</Wnumber>
          <Wicon type="monitor" size="big" />
        </Wcontainer>
      </Col>
      <Col span="12">
        <Wcontainer title={false} height={86}>
          <Wnumber rightTitle="物理机总量" >123</Wnumber>
          <Wcontainer.divider />
          <Wnumber rightTitle="本月数量" >123</Wnumber>
          <Wnumber rightTitle="较去年同期" numberTrend="raise">123</Wnumber>
        </Wcontainer>
      </Col>
    </Row>,
mountNode);
````
