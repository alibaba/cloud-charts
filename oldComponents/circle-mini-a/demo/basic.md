---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了数据和标题的用法。

## en-US


````jsx
import {
  CircleMiniA,
} from '@alife/aisc-widgets';

import {
  Grid
} from '@alife/aisc';

const { Row, Col } = Grid;

const data = {
  data0: {
    ratio: 0,
    quantity: 0,
    capacity: 0
  },
  data1: {
    ratio: 0.46,
    quantity: 20,
    capacity: 32
  },
  data2: {
    ratio: 0.85,
    quantity: 200,
    capacity: 128
  }
};

const details = [
  {
    label: "Text1",
    key: "quantity"
  },
  {
    label: "Text2",
    key: "capacity"
  }
];

ReactDOM.render(
    <div>
      <Row>
        <Col span="24">
            <CircleMiniA title="数据库" ringTitle="使用率1" details={details} dataSource={data.data1}  />
            <CircleMiniA title="中间件" ringTitle="使用率2" details={details} dataSource={data.data2} />
            <CircleMiniA title="蚂蚁" ringTitle="使用率3" details={details} dataSource={data.data0} />
        </Col>
      </Row>
    </div>,
mountNode);
````
