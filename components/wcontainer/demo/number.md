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
    <div>
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
            <Wnumber rightTitle="物理机总量" >1</Wnumber>
            <Wnumber rightTitle="本月数量" >1</Wnumber>
            <Wcontainer.divider />
            <Wnumber rightTitle="较去年同期" numberTrend="drop">1</Wnumber>
            <Wnumber rightTitle="较去年同期" numberTrend="drop">1</Wnumber>
          </Wcontainer>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Wcontainer title={false} height={192} arrange="cross" title="233">
            <Wnumber bottomTitle="物理机总量" >21</Wnumber>
            <Wnumber bottomTitle="本月数量" >1,024</Wnumber>
            <Wnumber bottomTitle="本月数量" >1</Wnumber>
            
            <Wcontainer.divider />
            <Wnumber bottomTitle="本月数量" >1</Wnumber>
            <Wnumber bottomTitle="较去年同期" numberTrend="drop">100</Wnumber>
            <Wnumber bottomTitle="较去年同期" numberTrend="raise">1</Wnumber>
          </Wcontainer>
        </Col>
        <Col span="12">
          <Wcontainer title={false} height={86}>
            <Wnumber rightTitle="物理机总量" >1</Wnumber>
            <Wnumber rightTitle="本月数量" >1</Wnumber>
            <Wcontainer.divider />
            <Wnumber rightTitle="较去年同期" numberTrend="drop">1</Wnumber>
            <Wnumber rightTitle="较去年同期" numberTrend="drop">1</Wnumber>
          </Wcontainer>
        </Col>
      </Row>
    </div>,
mountNode);
````
