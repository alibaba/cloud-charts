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
  Wcontainer, Wicon, Wnumber, Wplaceholder, Wminiline, Wcircle
} from '@alife/aisc-widgets';

import {
  Grid,
  Table
} from '@alife/aisc';

const { Row, Col } = Grid;

let data = [
  {
    "name":"机房",
    "data":[[1483372800000,2092],[1483459200000,2192],[1483545600000,2214],[1483632000000,2354],[1483718400000,2714],[1483804800000,2922],[1483891200000,2823],[1483977600000,2018],[1484064000000,1259],[1484150400000,1381],[1484236800000,1533],[1484323200000,2398],[1484409600000,2064],[1484496000000,2294]]
  }
];

const getData = () => {
    let result = [];
    for(let i = 0; i< 10; i++){
      result.push({
          title:{
            name: '我能吞下' + i + '个玻璃而不伤身体',
            },
          id:100306660940+i,
          time: 2000 + i
        })
    }
    return result;
}
ReactDOM.render(
    <div style={{background: '#f2f3f7', padding: '20px 0'}}>
      <Row>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="CPU" >1</Wnumber>
            <Wicon type="monitor" size="big" status="gray" />
          </Wcontainer>
        </Col>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="CPU" >123</Wnumber>
            <Wicon type="monitor" size="big" status="gray" />
          </Wcontainer>
        </Col>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="中间件" unit="个">1314</Wnumber>
            <Wcircle radius={16} percent={0.75} />
          </Wcontainer>
        </Col>
      </Row>
      <p></p>
      <Row>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="CPU" >1</Wnumber>
            <Wicon type="monitor" size="big" status="gray" />
          </Wcontainer>
        </Col>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="本周达标情况" rightRatio="20%" rightRatioTrend="raise">57321</Wnumber>
          </Wcontainer>
        </Col>
        <Col span="4">
          <Wcontainer title={false} height={86}>
            <Wnumber bottomTitle="中间件" unit="个">1314</Wnumber>
            <Wminiline data={data} height={50} />
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
      <p></p>
       <Row>
        <Col span="24">
        <Wcontainer title="table" titleBorder={false}>
         <Table
            primaryKey="id"
            dataSource={getData()}>
            <Table.Column title="Id" dataIndex="id" width="24.4%" />
            <Table.Column title="Title" dataIndex="title.name" width="26.7%" searchable/>
            <Table.Column title="Time" dataIndex="time" width="8%" align="right"/>
        </Table>
         </Wcontainer>
        </Col>
      </Row>
    </div>,
mountNode);
````
