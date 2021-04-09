import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from "@storybook/addon-knobs";

import { Wlinebar, Wcontainer } from '@alicloud/cloud-charts';

const data = [
  {
    "name":"机房1",
    type: 'bar',
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },
  {
    "name":"机房2",
    type: 'bar',
    "data":[[1483372800000,182],[1483459200000,792],[1483545600000,514],[1483632000000,554],[1483718400000,204],[1483804800000,22],[1483891200000,1023],[1483977600000,528],[1484064000000,879],[1484150400000,981],[1484236800000,453],[1484323200000,1198],[1484409600000,1064],[1484496000000,694]]
  },
  {
    "name":"机房3",
    type: 'line',
    yAxis: 1,
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  },
  {
    "name":"机房4",
    type: 'line',
    yAxis: 1,
    "data":[[1483372800000,1151],[1483459200000,4778],[1483545600000,21175],[1483632000000,19048],[1483718400000,14748],[1483804800000,18494],[1483891200000,10597],[1483977600000,8788],[1484064000000,12985],[1484150400000,2492],[1484236800000,5965],[1484323200000,10246],[1484409600000,12160],[1484496000000,6877]]
  }
];

const stories = storiesOf('Wlinebar', module);
stories.addDecorator(withKnobs);
stories.add('线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      barGeomStyle: {
        cursor: 'pointer',
      },
      lineGeomStyle: {
        cursor: 'pointer',
      },
    }} data={data} />
  </Wcontainer>
));
stories.add('平滑线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      spline: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('带点线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      symbol: true
    }} data={data} />
  </Wcontainer>
));
stories.add('面积线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      area: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('面积平滑线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      area: true,
      spline: true,
    }} data={data} />
  </Wcontainer>
));
stories.add('堆叠面积线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      area: true,
      stack: true,
      barSize: 60
    }} data={data} />
  </Wcontainer>
));
stories.add('双轴线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      yAxis: [
        {},
        {},
      ],
    }} data={data} />
  </Wcontainer>
));
stories.add('双轴堆叠线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      stack: true,
      yAxis: [
        {},
        {},
      ],
    }} data={data} />
  </Wcontainer>
));

class NewData extends React.Component {
  state = {
    data: [{
      'name': '推送量',
      'type': 'bar',
      'data': [],
    }, {
      'name': '工单数',
      'type': 'bar',
      'data': [],
    }, {
      'name': '准确率',
      'type': 'line',
      'yAxis': 1,
      'data': [],
    }, {
      'name': '召回率',
      'type': 'line',
      'yAxis': 1,
      'data': [],
    }],
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: [{
          'name': '推送量',
          'type': 'bar',
          'data': [['2019-01-19', 1319], ['2019-01-20', 1312], ['2019-01-21', 1285], ['2019-01-22', 1274], ['2019-01-23', 1244], ['2019-01-24', 1221], ['2019-01-25', 1196], ['2019-01-26', 1150], ['2019-01-27', 1126], ['2019-01-28', 1022], ['2019-01-29', 1005], ['2019-01-30', 1016], ['2019-01-31', 1003], ['2019-02-01', 988]],
        }, {
          'name': '工单数',
          'type': 'bar',
          'data': [['2019-01-19', 1411], ['2019-01-20', 1375], ['2019-01-21', 1362], ['2019-01-22', 1374], ['2019-01-23', 1388], ['2019-01-24', 1389], ['2019-01-25', 1420], ['2019-01-26', 1415], ['2019-01-27', 1417], ['2019-01-28', 1410], ['2019-01-29', 1415], ['2019-01-30', 1424], ['2019-01-31', 1410], ['2019-02-01', 1400]],
        }, {
          'name': '准确率',
          'type': 'line',
          'yAxis': 1,
          'data': [['2019-01-19', 28.3548142532221], ['2019-01-20', 28.125], ['2019-01-21', 28.0155642023346], ['2019-01-22', 28.3359497645212], ['2019-01-23', 28.4565916398714], ['2019-01-24', 28.4193284193284], ['2019-01-25', 28.5117056856187], ['2019-01-26', 28.3478260869565], ['2019-01-27', 29.0408525754885], ['2019-01-28', 30.5283757338552], ['2019-01-29', 30.0497512437811], ['2019-01-30', 29.9212598425197], ['2019-01-31', 29.6111665004985], ['2019-02-01', 29.0485829959514]],
        }, {
          'name': '召回率',
          'type': 'line',
          'yAxis': 1,
          'data': [['2019-01-19', 22.7498228206945], ['2019-01-20', 22.6909090909091], ['2019-01-21', 22.6138032305433], ['2019-01-22', 22.3435225618632], ['2019-01-23', 22.2622478386167], ['2019-01-24', 21.8142548596112], ['2019-01-25', 21.5492957746479], ['2019-01-26', 20.8480565371025], ['2019-01-27', 21.030345800988], ['2019-01-28', 21.063829787234], ['2019-01-29', 20.7773851590106], ['2019-01-30', 20.3651685393258], ['2019-01-31', 20.354609929078], ['2019-02-01', 19.7857142857143]],
        }],
      })
    }, 2000);
  }

  render() {
    return (
      <Wcontainer className="demos">
        <Wlinebar height="300" config={{
          "xAxis":{"type":"timeCat"},
          "yAxis":[{},{}],
          "stack":true,
          legend: {
            position: 'bottom',
            align: 'center',
          }
        }} data={this.state.data} />
      </Wcontainer>
    );
  }
}
stories.add('空数据到有数据', () => (
  <NewData />
));

const dodgeStackData = [
  {
    "name":"机房1",
    type: 'bar',
    "dodge": '分组1',
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },
  {
    "name":"机房2",
    type: 'bar',
    "dodge": '分组2',
    "data":[[1483372800000,182],[1483459200000,792],[1483545600000,514],[1483632000000,554],[1483718400000,204],[1483804800000,22],[1483891200000,1023],[1483977600000,528],[1484064000000,879],[1484150400000,981],[1484236800000,453],[1484323200000,1198],[1484409600000,1064],[1484496000000,694]]
  },
  {
    "name":"机房3",
    type: 'bar',
    "dodge": '分组2',
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  },
  {
    "name":"机房4",
    type: 'line',
    yAxis: 1,
    "data":[[1483372800000,1151],[1483459200000,4778],[1483545600000,21175],[1483632000000,19048],[1483718400000,14748],[1483804800000,18494],[1483891200000,10597],[1483977600000,8788],[1484064000000,12985],[1484150400000,2492],[1484236800000,5965],[1484323200000,10246],[1484409600000,12160],[1484496000000,6877]]
  },
  {
    "name":"机房5",
    type: 'line',
    yAxis: 1,
    "data":[[1483372800000,2151],[1483459200000,7778],[1483545600000,11175],[1483632000000,11048],[1483718400000,6748],[1483804800000,8494],[1483891200000,6597],[1483977600000,9788],[1484064000000,8985],[1484150400000,7492],[1484236800000,15965],[1484323200000,16246],[1484409600000,5160],[1484496000000,16877]]
  }
];
stories.add('分组堆叠线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      area: true,
      // stack: true,
      dodgeStack: true,
    }} data={dodgeStackData} />
  </Wcontainer>
));
stories.add('双轴分组堆叠线柱图', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      yAxis: [
        {},
        {},
      ],
      area: true,
      dodgeStack: true,
    }} data={dodgeStackData} />
  </Wcontainer>
));

const positionOptions = {
  '顶部': 'top',
  '底部': 'bottom',
};
const alignOptions = {
  '左': 'left',
  '中': 'center',
  '右': 'right',
};
stories.add('图例位置测试', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" config={{
      legend: {
        position: select('上下位置', positionOptions, 'top'),
        align: select('左右分布', alignOptions, 'left'),
      }
    }} data={data} />
  </Wcontainer>
));

class NewLegendData extends React.Component {
  state = {
    data: [{
      'name': '推送量',
      'type': 'bar',
      'data': [],
    }, {
      'name': '工单数',
      'type': 'bar',
      'data': [],
    }, {
      'name': '准确率',
      'type': 'line',
      'yAxis': 1,
      'data': [],
    }, {
      'name': '召回率',
      'type': 'line',
      'yAxis': 1,
      'data': [],
    }],
    //  [{
    //           'name': '推送量',
    //           'type': 'bar',
    //           'data': [['2019-01-19', 1319], ['2019-01-20', 1312], ['2019-01-21', 1285], ['2019-01-22', 1274], ['2019-01-23', 1244], ['2019-01-24', 1221], ['2019-01-25', 1196], ['2019-01-26', 1150], ['2019-01-27', 1126], ['2019-01-28', 1022], ['2019-01-29', 1005], ['2019-01-30', 1016], ['2019-01-31', 1003], ['2019-02-01', 988]],
    //         }, {
    //           'name': '工单数',
    //           'type': 'bar',
    //           'data': [['2019-01-19', 1411], ['2019-01-20', 1375], ['2019-01-21', 1362], ['2019-01-22', 1374], ['2019-01-23', 1388], ['2019-01-24', 1389], ['2019-01-25', 1420], ['2019-01-26', 1415], ['2019-01-27', 1417], ['2019-01-28', 1410], ['2019-01-29', 1415], ['2019-01-30', 1424], ['2019-01-31', 1410], ['2019-02-01', 1400]],
    //         }, {
    //           'name': '准确率',
    //           'type': 'line',
    //           'yAxis': 1,
    //           'data': [['2019-01-19', 28.3548142532221], ['2019-01-20', 28.125], ['2019-01-21', 28.0155642023346], ['2019-01-22', 28.3359497645212], ['2019-01-23', 28.4565916398714], ['2019-01-24', 28.4193284193284], ['2019-01-25', 28.5117056856187], ['2019-01-26', 28.3478260869565], ['2019-01-27', 29.0408525754885], ['2019-01-28', 30.5283757338552], ['2019-01-29', 30.0497512437811], ['2019-01-30', 29.9212598425197], ['2019-01-31', 29.6111665004985], ['2019-02-01', 29.0485829959514]],
    //         }, {
    //           'name': '召回率',
    //           'type': 'line',
    //           'yAxis': 1,
    //           'data': [['2019-01-19', 22.7498228206945], ['2019-01-20', 22.6909090909091], ['2019-01-21', 22.6138032305433], ['2019-01-22', 22.3435225618632], ['2019-01-23', 22.2622478386167], ['2019-01-24', 21.8142548596112], ['2019-01-25', 21.5492957746479], ['2019-01-26', 20.8480565371025], ['2019-01-27', 21.030345800988], ['2019-01-28', 21.063829787234], ['2019-01-29', 20.7773851590106], ['2019-01-30', 20.3651685393258], ['2019-01-31', 20.354609929078], ['2019-02-01', 19.7857142857143]],
    //         }]
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: [
          {
            "name":"机房1",
            type: 'bar',
            "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
          },
          {
            "name":"机房2",
            type: 'bar',
            "data":[[1483372800000,182],[1483459200000,792],[1483545600000,514],[1483632000000,554],[1483718400000,204],[1483804800000,22],[1483891200000,1023],[1483977600000,528],[1484064000000,879],[1484150400000,981],[1484236800000,453],[1484323200000,1198],[1484409600000,1064],[1484496000000,694]]
          },
          {
            "name":"机房3",
            type: 'line',
            yAxis: 1,
            "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
          },
          {
            "name":"机房4",
            type: 'line',
            yAxis: 1,
            "data":[[1483372800000,1151],[1483459200000,4778],[1483545600000,21175],[1483632000000,19048],[1483718400000,14748],[1483804800000,18494],[1483891200000,10597],[1483977600000,8788],[1484064000000,12985],[1484150400000,2492],[1484236800000,5965],[1484323200000,10246],[1484409600000,12160],[1484496000000,6877]]
          }
        ],
      })
    }, 2000);
  }

  render() {
    return (
      <Wcontainer className="demos">
        <Wlinebar height="300" config={{
          "xAxis":{"type":"timeCat"},
          "yAxis":[{},{}],
          "stack":true,
          legend: {
            position: 'top',
            align: 'left',
          }
        }} data={this.state.data} />
      </Wcontainer>
    );
  }
}
stories.add('数据项更新', () => (
  <NewLegendData />
));

const sameNameData = [
  {
    "name":"机房1",
    type: 'bar',
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },
  {
    "name":"机房2",
    type: 'bar',
    "data":[[1483372800000,182],[1483459200000,792],[1483545600000,514],[1483632000000,554],[1483718400000,204],[1483804800000,22],[1483891200000,1023],[1483977600000,528],[1484064000000,879],[1484150400000,981],[1484236800000,453],[1484323200000,1198],[1484409600000,1064],[1484496000000,694]]
  },
  {
    "name":"机房1",
    type: 'line',
    yAxis: 1,
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  },
  {
    "name":"机房2",
    type: 'line',
    yAxis: 1,
    "data":[[1483372800000,1151],[1483459200000,4778],[1483545600000,21175],[1483632000000,19048],[1483718400000,14748],[1483804800000,18494],[1483891200000,10597],[1483977600000,8788],[1484064000000,12985],[1484150400000,2492],[1484236800000,5965],[1484323200000,10246],[1484409600000,12160],[1484496000000,6877]]
  }
];
stories.add('同名数据项', () => (
  <Wcontainer className="demos">
    <Wlinebar height="300" data={sameNameData} />
  </Wcontainer>
));

class ChangeData extends React.Component {
  state = {
    data: [{
      'name': '推送量',
      'type': 'bar',
      'data': [['2019-01-19', 1319], ['2019-01-20', 1312], ['2019-01-21', 1285], ['2019-01-22', 1274], ['2019-01-23', 1244]],
    }, {
      'name': '工单数',
      'type': 'bar',
      'data': [['2019-01-19', 1411], ['2019-01-20', 1375], ['2019-01-21', 1362], ['2019-01-22', 1374], ['2019-01-23', 1388]],
    }, {
      'name': '准确率',
      'type': 'line',
      'yAxis': 1,
      'data': [['2019-01-19', 28.3548142532221], ['2019-01-20', 28.125], ['2019-01-21', 28.0155642023346], ['2019-01-22', 28.3359497645212], ['2019-01-23', 28.4565916398714]],
    }, {
      'name': '召回率',
      'type': 'line',
      'yAxis': 1,
      'data': [['2019-01-19', 22.7498228206945], ['2019-01-20', 22.6909090909091], ['2019-01-21', 22.6138032305433], ['2019-01-22', 22.3435225618632], ['2019-01-23', 22.2622478386167]],
    }],
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: [{
          'name': '推送量',
          'type': 'bar',
          'data': [['2019-01-19', 1319], ['2019-01-20', 1312], ['2019-01-21', 1285], ['2019-01-22', 1274], ['2019-01-23', 1244], ['2019-01-24', 1221], ['2019-01-25', 1196], ['2019-01-26', 1150], ['2019-01-27', 1126], ['2019-01-28', 1022], ['2019-01-29', 1005], ['2019-01-30', 1016], ['2019-01-31', 1003], ['2019-02-01', 988]],
        }, {
          'name': '工单数',
          'type': 'bar',
          'data': [['2019-01-19', 1411], ['2019-01-20', 1375], ['2019-01-21', 1362], ['2019-01-22', 1374], ['2019-01-23', 1388], ['2019-01-24', 1389], ['2019-01-25', 1420], ['2019-01-26', 1415], ['2019-01-27', 1417], ['2019-01-28', 1410], ['2019-01-29', 1415], ['2019-01-30', 1424], ['2019-01-31', 1410], ['2019-02-01', 1400]],
        }, {
          'name': '准确率',
          'type': 'line',
          'yAxis': 1,
          'data': [['2019-01-19', 28.3548142532221], ['2019-01-20', 28.125], ['2019-01-21', 28.0155642023346], ['2019-01-22', 28.3359497645212], ['2019-01-23', 28.4565916398714], ['2019-01-24', 28.4193284193284], ['2019-01-25', 28.5117056856187], ['2019-01-26', 28.3478260869565], ['2019-01-27', 29.0408525754885], ['2019-01-28', 30.5283757338552], ['2019-01-29', 30.0497512437811], ['2019-01-30', 29.9212598425197], ['2019-01-31', 29.6111665004985], ['2019-02-01', 29.0485829959514]],
        }, {
          'name': '召回率',
          'type': 'line',
          'yAxis': 1,
          'data': [['2019-01-19', 22.7498228206945], ['2019-01-20', 22.6909090909091], ['2019-01-21', 22.6138032305433], ['2019-01-22', 22.3435225618632], ['2019-01-23', 22.2622478386167], ['2019-01-24', 21.8142548596112], ['2019-01-25', 21.5492957746479], ['2019-01-26', 20.8480565371025], ['2019-01-27', 21.030345800988], ['2019-01-28', 21.063829787234], ['2019-01-29', 20.7773851590106], ['2019-01-30', 20.3651685393258], ['2019-01-31', 20.354609929078], ['2019-02-01', 19.7857142857143]],
        }],
      })
    }, 2000);
  }

  render() {
    return (
      <Wcontainer className="demos">
        <Wlinebar height="300" config={{
          "xAxis":{"type":"timeCat"},
          "yAxis":[{},{}],
          "stack":true,
          legend: {
            position: 'top',
            align: 'center',
          },
        }} data={this.state.data} />
      </Wcontainer>
    );
  }
}
stories.add('更新数据', () => (
  <ChangeData />
));
