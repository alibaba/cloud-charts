---
order: 4
title:
  zh-CN: 容器标题
  en-US: Title
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
        <Col span="24">
          <Wcontainer title="占位图" height={192} operation={<a href="http://www.taobao.com" target="_blank">详情</a>}>
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
