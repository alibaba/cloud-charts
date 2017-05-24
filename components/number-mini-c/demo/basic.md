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
  NumberMiniC,
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
          <Panel title="OSD指标">
            <Item>
              <NumberMiniC title="数据库" data={data.data3}  />
            </Item>
            <Item>
              <NumberMiniC title="中间件" data={data.data4} />
            </Item>
            <Item>
              <NumberMiniC title="蚂蚁" data={data.data5} />
            </Item>
          </Panel>
        </Col>
      </Row>
    </div>,
mountNode);
````
