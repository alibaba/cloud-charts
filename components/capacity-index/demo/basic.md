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
  Grid,
  Panel,
  CapacityIndex,
} from '@alife/p2widgets';

const { Row, Col } = Grid;
const { Item, TitleSub } = Panel;

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
  },
  data3: {
    total: 512,
    down: 23,
    out: 0
  },
  data4: {
    total: 128,
    down: 0,
    out: 10
  },
  data5: {
    total: 1024,
    down: 0,
    out: 0
  }
};

ReactDOM.render(
    <div>
      <Row>
        <Col span="24">
          <Panel title="机器数据指标" tabMode>
            <Item title="数据库">
              <CapacityIndex title="数据库" data={data.data1}  />
            </Item>
            <Item title="中间件">
              <CapacityIndex title="中间件" data={data.data2} />
            </Item>
            <Item title="蚂蚁">
              <CapacityIndex title="蚂蚁" data={data.data0} />
            </Item>
          </Panel>
        </Col>
      </Row>
    </div>,
mountNode);
````
