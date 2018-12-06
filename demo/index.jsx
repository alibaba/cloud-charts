import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import classnames from 'classnames';
import { Grid } from '@alife/aisc';
import * as Widgets from '@alife/aisc-widgets';

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

class Demo extends React.Component {

  state = {
    currentChart: 'Wline',
    wdashboardData: 56
  };

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
        legend:{
          position: 'bottom',
          align: 'center',
        }
      }} data={data} height={400} />,

      <Chart config={{
        xAxis: {type: 'timeCat'},
        area: true,
        stack: true,
        label: {
          position: 'bottom',
        },
        legend:{
          position: 'bottom',
          align: 'left',
        }
      }} data={data} height={400} />,

      <Chart config={{
        xAxis: {type: 'timeCat'},
        legend:{
          position: 'bottom',
          align: 'right',
        }
      }} data={data} height={400} />,
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
        <Col>
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
