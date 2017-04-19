import React from 'react';
import ReactDOM from 'react-dom';
import {
  Grid,
  Panel,
  CapacityIndex,
  StateIndex,
  RankList,
  IconLinkButtonMini,
  OnlyLiteralMini,
  PieChartTitleMini,
  BarChartDetailsMini,
  OnlyDetailsLiteralLattice
} from '@alife/p2widgets';
const { Row, Col } = Grid;
const { Item, TitleSub } = Panel;

import Tops from './mods/tops';
import Clusters from './mods/clusters';
import TopList from './mods/topList';

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
const healthyStatusData={
  "title":"Healthy",
  "subTitle":0,
  "a": 0,
  "b": 199,
  "c": 233,
  "d": 199,
}

const ringRroportionData={
  "divisor": 0,
  "dividend": 100,
  "a": 0,
  "b": 1990,
  "c": 23300,
  "d": 1.23,
}

const loadProgressData={
  "title":0,
  "a": 0,
  "b": 0.75,
}

const onlyDetailsLiteralLatticeData={
  "a": 0,
  "b": 1990,
  "c": 23300,
  "d": 1.23,
}

class App extends React.Component {
  render() {
    return (
      <div className="p2-chart-demo">
        <h3>示例</h3>
        <Row>
          <Col span="4">
            <IconLinkButtonMini title="OSD" 
            subTitle="db.zhangbei.na61.1" 
            url="http://aisc.alibaba.net/docs/components/icon/"/>
          </Col>
          <Col span="9">
            <Panel>
              <OnlyLiteralMini dataSource={healthyStatusData}/>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col span="9">
            <Panel>
              <PieChartTitleMini dataSource={ringRroportionData}/>
            </Panel>
          </Col>
          <Col span="9">
            <Panel>
              <BarChartDetailsMini dataSource={loadProgressData}/>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col span="9">
            <Panel title="Device IO">
              <OnlyDetailsLiteralLattice dataSource={onlyDetailsLiteralLatticeData}/>
            </Panel>
          </Col>
          <Col span="9">
            <Panel>
              <BarChartDetailsMini dataSource={loadProgressData}/>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col span="10">
            <Panel title="机器数据指标">
              <Item>
                <CapacityIndex title="数据库" data={data.data1}  />
              </Item>
              <Item>
                <CapacityIndex title="中间件" data={data.data2} />
              </Item>
              <Item>
                <CapacityIndex title="蚂蚁" data={data.data0} />
              </Item>
            </Panel>
          </Col>
          <Col span="14">
            <Panel title="OSD指标">
              <Item>
                <StateIndex title="数据库" data={data.data3}  />
              </Item>
              <Item>
                <StateIndex title="中间件" data={data.data4} />
              </Item>
              <Item>
                <StateIndex title="蚂蚁" data={data.data5} />
              </Item>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Tops />
          </Col>
        </Row>
        <TopList />
        <Row>
          <Col span="24">
            <Clusters />
          </Col>
        </Row>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));