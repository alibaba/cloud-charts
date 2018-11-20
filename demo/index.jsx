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

const data = [
  {
    "name":"机房1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"机房2",
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];

class Demo extends React.Component {
  state = {
    currentChart: chartList[0],
  };

  handleChartChange = (chartName) => {
    console.log(chartName);
  };

  renderChart() {
    const { currentChart } = this.state;
    const Chart = Widgets[currentChart];

    return <Chart config={{
      padding: [16, 5, 64, 44],
      xAxis: {type: 'time'},
      legend:{
        position: 'bottom',
        align: 'center',
        nameFormatter(value, data, index) {
          return value + '数据';
        }
      }
    }} data={data} height={400} />;
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
