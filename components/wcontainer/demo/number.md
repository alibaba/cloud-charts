---
order: 1
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
          <Wnumber bottomTitle="CPU" >1024</Wnumber>
          <Wicon type="monitor" size="xl" />
        </Wcontainer>
      </Col>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >1024</Wnumber>
        </Wcontainer>
      </Col>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >1024</Wnumber>
        </Wcontainer>
      </Col>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >1024</Wnumber>
        </Wcontainer>
      </Col>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >1024</Wnumber>
        </Wcontainer>
      </Col>
      <Col span="4">
        <Wcontainer title={false} height={86}>
          <Wnumber bottomTitle="CPU" >1024</Wnumber>
        </Wcontainer>
      </Col>
    </Row>,
mountNode);
````
