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
  Wcontainer, Wicon, Wnumber, Wplaceholder
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

ReactDOM.render(
    <div style={{background: '#f2f3f7', padding: '20px 0'}}>
      <Row>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="CPU" >1</Wnumber>
            <Wicon type="monitor" size="big" />
          </Wcontainer>
        </Col>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="本周达标情况" rightRatio="20%" rightRatioTrend="raise">57321</Wnumber>
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

      <p></p>
      <Row>
        <Col span="12">
          <Wcontainer title={false} height={192} arrange="cross" title="233">
            <Wnumber bottomTitle="物理机总量" >21</Wnumber>
            
            <Wcontainer.divider />
            <Wnumber bottomTitle="本月数量" >1</Wnumber>
            <Wnumber bottomTitle="较去年同期" numberTrend="drop">100</Wnumber>
            <Wnumber bottomTitle="较去年同期" numberTrend="raise">1</Wnumber>
            <Wcontainer.divider />
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
      <p></p>
      <Row>
        <Col span="24">
          <Wcontainer title="占位图" height={192}>
            <Wplaceholder />
          </Wcontainer>
        </Col>
      </Row>
    </div>,
mountNode);
````
