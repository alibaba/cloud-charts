import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import classnames from 'classnames';
import { Grid } from '@alife/aisc';
import * as Widgets from '@alife/aisc-widgets';
import Wplaceholder from '../components/wplaceholder';

const { Row, Col } = Grid;
const chartList = [
  'Wline',
  'Wminiline',
  'Wbar',
  'Wlinebar',
  'Wpie',
  'Wscatter',
];

let data = [
  {
    "name":"机房1",
    type: 'bar',
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },
  {
    "name":"机房2",
    type: 'bar',
    visible: false,
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

let boxData = [
  {
    "name":"柱1",
    "data":[["一", [1, 9, 16, 22, 24]],["二",[2, 8, 12, 21, 28]]]
  },
  {
    "name":"柱2",
    "data":[["一",[1, 5, 8, 12, 16]],["二",[3, 10, 17, 28, 30]]]
  },
  {
    "name":"柱3",
    "data":[["一",[2, 8, 12, 19, 26]],["二",[1, 7, 10, 17, 22]]]
  }
];

boxData = [
  {
    "name":"柱1",
    "data":[["一", [1, 9, 16, 22, 24]]]
  },
  {
    "name":"柱2",
    "data":[["二",[3, 10, 17, 28, 30]]]
  },
  {
    "name":"柱3",
    "data":[["三",[2, 8, 12, 19, 26]]]
  }
];

let heatmapData = [
  {
    name: '无',
    data: [
      ['aws1', 'aws1'],
      ['aws2', 'aws2'],
      ['aws3', 'aws3'],
      ['aws4', 'aws4'],
      ['aws5', 'aws5'],
    ],
  },
  {
    name: '正常',
    data: [
      ['aws1', 'aws2', 234],
      ['aws1', 'aws3', 234],
      ['aws1', 'aws4', 234],
      ['aws2', 'aws1', 234],
      ['aws2', 'aws3', 234],
      ['aws2', 'aws4', 234],
      ['aws2', 'aws5', 234],
      ['aws3', 'aws1', 234],
      ['aws3', 'aws4', 234],
      ['aws3', 'aws5', 234],
      ['aws4', 'aws1', 234],
      ['aws4', 'aws2', 234],
      ['aws4', 'aws5', 234],
      ['aws5', 'aws1', 234],
      ['aws5', 'aws2', 234],
      ['aws5', 'aws3', 234],
      ['aws5', 'aws4', 234],
    ],
  },
  {
    name: '异常',
    data: [
      ['aws1', 'aws5', 234],
      ['aws3', 'aws2', 234],
      ['aws4', 'aws3', 234],
    ],
  }
];

const depth = 2;
function mockData(target, deep = 0) {
  if (deep < depth) {
    target.children = [];
    const totalValue = Math.round(Math.random() * 100) + 100;
    const loop = Math.round(Math.random() * 3) + 1;
    let unuseValue = totalValue;

    for(let i = 0; i < loop; i++) {
      const name = `${target.name}-${i}`;
      let value = Math.round(Math.random() * totalValue / loop);

      if (i === loop - 1) {
        value = unuseValue;
      } else {
        unuseValue -= value;
      }

      if (deep !== depth - 1) {
        value = undefined;
      }

      target.children.push(mockData({name, value}, deep + 1))
    }
  }

  return target;
}

const multiPieData = mockData({
  name: 'root',
  value: 0,
});

console.log(multiPieData);

function randomData() {
  return Math.round(Math.random()*100);
}

class Demo extends React.Component {

  state = {
    chartData: data,
    currentChart: 'Wlinebar',
    wdashboardData: 56
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        chartData: data.map((d) => {
          if (d.name === '机房4') {
            d.visible = false;
          } else {
            delete d.visible;
          }
          return d;
        })
      });
    }, 2000);
  }

  handleChartChange = (chartName) => {
    console.log(chartName);
  };

  renderChart() {
    const { currentChart } = this.state;
    const Chart = Widgets[currentChart];

    return [
      <Chart config={{
        xAxis: {type: 'timeCat'},
        // yAxis: [{}, {}],
        label: {
          labelFormatter(v) {
            return `value: ${v}`;
          }
          // type: 'scatter',
        },
        // barLabel: false,
        legend:{
          position: 'bottom',
          align: 'center',
        },
        zoom: true,
      }} data={this.state.chartData} height={400} />,

      <Chart config={{
        xAxis: {type: 'timeCat'},
        area: true,
        stack: true,
        label: {
          position: 'middle',
        },
        // lineLabel: {
        //   offset: 24,
        // },
        // barLabel: {
        //   offset: -12,
        // },
        legend:{
          position: 'bottom',
          align: 'left',
        }
      }} data={this.state.chartData} height={400} />,

      <Chart config={{
        xAxis: {type: 'timeCat'},
        legend: false,
      }} data={this.state.chartData} height={400} />,

      <Widgets.Wplaceholder noData height={400} />,

      <Widgets.WmultiPie height={400} config={{
        innerRadius: 0.5
      }} data={multiPieData} />,

      <Widgets.Wicon type="ais" status="normal" />,

      <Widgets.Wradar height={300} config={{
        xAxis: {
        },
      }} data={[{
        "name":"机房1",
        "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
      }]} />,

      <Widgets.Wmap height={300} config={{
      }}>
        <Widgets.Wmap.HeatMap data={[{
          name: '热力',
          data: [
            { name: '北京', lng: 116.4551, lat: 40.2539, value: 20 },
            { name: '杭州', lng: 119.5313, lat: 29.8773, value: 10 },
            // {name: '北京',value: randomData() },
            {name: '天津',value: randomData() },
            {name: '上海',value: randomData() },
            {name: '重庆',value: randomData() },
            {name: '河北省',value: randomData() },
            {name: '河南省',value: randomData() },
            {name: '云南省',value: randomData() },
            {name: '辽宁省',value: randomData() },
            {name: '黑龙江省',value: randomData() },
            {name: '湖南省',value: randomData() },
            {name: '安徽省',value: randomData() },
            {name: '山东省',value: randomData() },
            {name: '新疆维吾尔自治区',value: randomData() },
            {name: '江苏省',value: randomData() },
            {name: '浙江省',value: randomData() },
            {name: '江西省',value: randomData() },
            {name: '湖北省',value: randomData() },
            {name: '广西壮族自治区',value: randomData() },
            {name: '甘肃省',value: randomData() },
            {name: '山西省',value: randomData() },
            {name: '内蒙古自治区',value: randomData() },
            {name: '陕西省',value: randomData() },
            {name: '吉林省',value: randomData() },
            {name: '福建省',value: randomData() },
            {name: '贵州省',value: randomData() },
            {name: '广东省',value: randomData() },
            {name: '青海省',value: randomData() },
            {name: '西藏自治区',value: randomData() },
            {name: '四川省',value: randomData() },
            {name: '宁夏回族自治区',value: randomData() },
            {name: '海南省',value: randomData() },
            {name: '台湾省',value: randomData() },
            {name: '香港',value: randomData() },
            {name: '澳门',value: randomData() }
          ]
        }]} />
      </Widgets.Wmap>,

      <Widgets.Wbox height={400} config={{
        // column: false,
        grid: true,
        zoom: true,
      }} data={boxData} />,

      <Widgets.Wheatmap height={400} config={{
        
      }} data={heatmapData} />
    ]
  }

  render() {
    const { currentChart } = this.state;
    return (
      <Row>
        <Col fixedSpan="16">
          {
            chartList.map((c) => {
              let cls = classnames("chart-list-item", {
                current: currentChart === c,
              });

              return (
                <div className={cls} key={c} onClick={() => {this.handleChartChange(c)}}>{c}</div>
              );
            })
          }
        </Col>
        <Col style={{ background: Widgets.COLORS.widgetsContainerBackground }}>
          {this.renderChart()}
        </Col>
        {/*<div>
          <Widgets.Wdashboard data={this.state.wdashboardData}/>
        </div>*/}
      </Row>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Demo />
    </AppContainer>,
    document.getElementById('container')
  )
};

render();

if (module.hot) {
  module.hot.accept( () => { render() })
}
