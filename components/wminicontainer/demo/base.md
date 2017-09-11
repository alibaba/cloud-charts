---
order: 0
title:
  zh-CN: 迷你widget基础用法
  en-US: Basic
---

## zh-CN

基础用法，演示了容器大小。

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
    <div>
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
            status="orange"
            percent={0.45}>7</Wcircle>
          </Wminicontainer>
        </Col>
        <Col span="6">
          <Wminicontainer height={192} status="orange">
            <Wcircle 
            title="本周未达标指标"
            status="orange"
            percent={0.45}>7</Wcircle>
          </Wminicontainer>
        </Col>
        <Col span="6">
          <Wminicontainer height={192} status="red">
            <Wcircle type="gauge" 
            title="本周未达标指标"
            status="red"
            bottomTitle="较上周" 
            bottomNumber={2} 
            percent={0.45}
            bottomTrend="raise">7</Wcircle>
          </Wminicontainer>
        </Col>
      </Row>
      <p></p>
    </div>,
mountNode);
````
