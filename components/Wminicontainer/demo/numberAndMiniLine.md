---
order: 1
title:
  zh-CN: 迷你widget配合迷你曲线
  en-US: NumberAndMiniLine
---

## zh-CN

基础用法，迷你容器配合迷你曲线使用。

## en-US


````jsx
import {
  Wminicontainer, Wicon, Wnumber, Wminiline
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

let data = [
  {
    "name":"机房1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  }
];

let options1 = {
  padding: [20, 20, 20, 20],
  spline: true,
};

let options2 = {
  padding: [20, 20, 20, 20],
  spline: true,
};

let options3 = {
  padding: [20, 20, 20, 20],
  spline: true,
};

const demoStyle = {
  paddingLeft: 20,
  paddingRight: 20
};

ReactDOM.render(
    <div>
      <Row>
        <Col span="8">
          <Wminicontainer height={192}>
            <div style={demoStyle}>
              <Wnumber bottomTitle="底部" unit="个" rightRatio="1%" status="drop" rightRatioTrend="raise">2222</Wnumber>
            </div>
            
            <Wminiline config={options1} data={data} height="128"/>
          </Wminicontainer>
        </Col>
        <Col span="8">
          <Wminicontainer height={192}>
            <div style={demoStyle}>
              <Wnumber bottomTitle="底部标题" unit="个" rightRatio="1%" status="drop" rightRatioTrend="raise">2222</Wnumber>
            </div>
            
            <Wminiline config={options2} data={data} height="128"/>
          </Wminicontainer>
        </Col>
        <Col span="8">
          <Wminicontainer height={192}>
            <div style={demoStyle}>
              <Wnumber bottomTitle="底部标题底部标题底部标题" unit="个" rightRatio="1%" status="raise" rightRatioTrend="drop">2222</Wnumber>
            </div>
            
            <Wminiline config={options3} data={data} height="128"/>
          </Wminicontainer>
        </Col>
      </Row>
      <p></p>
    </div>,
mountNode);
````
