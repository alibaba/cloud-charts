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
} from '@alife/aisc-widgets';

const { Row, Col } = Grid;
const { Item, TitleSub } = Panel;

const data = {
  data0: {
    main: 512,
    down: 23,
    out: 0
  },
  data1: {
    main: 128,
    down: 0,
    out: 10
  },
  data2: {
    main: 1024,
    down: 0,
    out: 0
  }
};

const details = [
  {
    label: "Text1",
    key: "down"
  },
  {
    label: "Text2",
    key: "out"
  }
];

ReactDOM.render(
    <div>
      <Row>
        <Col span="24">
          <Panel title="指标">
            <Item>
              <NumberMiniC title="数据库" mainTitle="指标1" details={details} dataSource={data.data0}  />
            </Item>
            <Item>
              <NumberMiniC title="中间件" mainTitle="指标1" details={details} dataSource={data.data1} />
            </Item>
            <Item>
              <NumberMiniC title="蚂蚁" mainTitle="指标1" details={details} dataSource={data.data2} />
            </Item>
          </Panel>
        </Col>
      </Row>
    </div>,
mountNode);
````
