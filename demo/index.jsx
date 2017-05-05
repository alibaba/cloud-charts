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
  OnlyDetailsLiteralLattice,
  IconTitleMini,
  OnlyDetailsLiteralRowsMini
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
const iconTitleMiniData={
  "title": 40782
}
const onlyDetailsLiteralRowsMiniData={
  "a":12,
  "b": 9679
}
const onlyDetailsLiteralLatticeDetails = [{
  "label": "Text",
  "key": "a",
}, {
  "label": "Text",
  "key": "b",
}, {
  "label": "Text",
  "key": "c",
}, {
  "label": "Text",
  "key": "d",
}, {
  "label": "Text",
  "key": "e",
}];

const cell = function(v){
  return v+'M';
}

class App extends React.Component {
  render() {
    return (
      <div className="p2-chart-demo">
        <h3>示例</h3>
        <h4>IconLinkButtonMini - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/iconLinkButtonMini">文档</a></h4>
        <Row>
          <Col span="4">
            <IconLinkButtonMini title="OSD" 
            subTitle="db.zhangbei.na61.1" 
            url="http://aisc.alibaba.net/docs/components/icon/"/>
          </Col>
        </Row>
        <h4>OnlyLiteralMini - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/onlyLiteralMini">文档</a></h4>
        <Row>
          <Col span="9">
            <Panel>
              <OnlyLiteralMini dataSource={healthyStatusData}/>
            </Panel>
          </Col>
        </Row>
        <h4>PieChartTitleMini - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/pieChartTitleMini">文档</a></h4>
        <Row>
          <Col span="9">
            <Panel>
              <PieChartTitleMini dataSource={ringRroportionData} cell={cell}/>
            </Panel>
          </Col>
        </Row>
        <h4>BarChartDetailsMini - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/barChartDetailsMini">文档</a></h4>
        <Row>
          <Col span="9">
            <Panel>
              <BarChartDetailsMini dataSource={loadProgressData}/>
            </Panel>
          </Col>
        </Row>
        <h4>OnlyDetailsLiteralLattice - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/onlyDetailsLiteralLattice">文档</a></h4>
        <Row>
          <Col span="9">
            <Panel title="Device IO">
              <OnlyDetailsLiteralLattice dataSource={onlyDetailsLiteralLatticeData} row={2} col={3} details={onlyDetailsLiteralLatticeDetails}/>
            </Panel>
          </Col>
        </Row>
        <h4>IconTitleMini - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/iconTitleMini">文档</a></h4>
        <Row>
          <Col span="6">
            <Panel>
              <IconTitleMini dataSource={iconTitleMiniData}/>
            </Panel>
          </Col>
        </Row>
        <h4>OnlyDetailsLiteralRowsMini - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/onlyDetailsLiteralRowsMini">文档</a></h4>
        <Row>
          <Col span="6">
            <Panel>
              <OnlyDetailsLiteralRowsMini dataSource={onlyDetailsLiteralRowsMiniData}/>
            </Panel>
          </Col>
        </Row>
        <h4>CapacityIndex</h4>
        <Row>
          <Col span="10">
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
        <h4>StateIndex</h4>
        <Row>
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
        <h4>RankList</h4>
        <Row>
          <Col span="24">
            <Tops />
          </Col>
        </Row>
        <h4>TopList - <a target="_blank" href="http://gitlab.alibaba-inc.com/ls/p2widgets/tree/master/src/components/topList">文档</a></h4>
        <TopList />
        <h4>TableList</h4>
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