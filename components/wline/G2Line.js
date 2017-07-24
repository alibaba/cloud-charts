'use strict';

import COLORS from '../chartCommon/colors';
import G2 from 'g2';
import createG2 from '../chartCommon/createG2';
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const G2Line = createG2((chart, configs, data) => {
  let frame = new G2.Frame(data);
  frame = G2.Frame.combineColumns(frame, configs.keys, 'value', 'type', ['time']);
  chart.source(frame, {
    time: {
      type: "time",
      // mask: "mm-dd"
    },
    value: {
      type: 'linear'
    }
  });

  chart.line().position('time*value').color('type').shape('line');
  chart.render();
});

const theme = G2.Util.mix(true, {}, G2.Theme, {
  // animate: false,
  colors: {
    'default': COLORS
  },
  shape: {
    line: {
      lineWidth: 2
    }
  }
  // 具体的配置项详见 https://antv.alipay.com/g2/api/global.html
});
G2.Global.setTheme(theme); // 将主题设置为用户自定义的主题

// 图表唯一id
let uniqueId = 0;
function generateUniqueId() {
  return `react-g2-${uniqueId++}`;
}

class MyG2Line extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    plotCfg: PropTypes.object,
    forceFit: PropTypes.bool,
    configs: PropTypes.object,
  };

  static defaultProps = {
    forceFit: false,
    plotCfg: {},
    configs: {},
  };

  constructor(props, context) {
    super(props, context);
    this.chart = null;
    this.chartId = generateUniqueId();
  }

  componentDidMount() {
    this.initChart(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { data: newData, width: newWidth, height: newHeight, plotCfg: newPlotCfg } = newProps;
    const { data: oldData, width: oldWidth, height: oldHeight, plotCfg: oldPlotCfg } = this.props;

    if (newPlotCfg !== oldPlotCfg) {
      console.warn('plotCfg 不支持修改');
    }

    if (newData !== oldData || newData.length !== oldData.length) {
      this.chart.changeData(convertData(newData));
    }
    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this.chart.changeSize(newWidth, newHeight);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.chart.destroy();
    this.chart = null;
    this.chartId = null;
  }

  g2operation(chart, configs, data) {
    const newData = convertData(data);
    chart.source(newData, {
      time: {
        type: "time",
        mask: "HH:MM:ss"
      },
      value: {
        type: 'linear'
      },
      type: {
        type: 'cat'
      }
    });

    chart.line().position('time*value').color('type').shape('line');
    chart.render();
  }

  initChart(props) {
    const { width, height = 400, data, plotCfg, forceFit, configs } = props;
    const chart = new G2.Chart({
      id: this.chartId,
      width,
      height,
      plotCfg,
      forceFit: width === undefined || forceFit,
    });
    // // chart.source(data);
    this.g2operation(chart, configs, data);


    //绑定事件
    const events = [
      'plotmove',
      'plotenter',
      'plotleave',
      'plotclick',
      'plotdblclick',
      'rangeselectstart',
      'rangeselectend',
      'itemselected',
      'itemunselected',
      'itemselectedchange',
      'tooltipchange',
      'tooltipshow',
      'tooltiphide'
    ];

    Object.keys(configs).forEach(item => {
      events.includes(item) && chart.on(item, configs[item]);
    });

    this.chart = chart;
  }

  render() {
    return (
      <div id={this.chartId} />
    );
  }
}

function convertData(data) {
  const newData = [];
  data.forEach((oneData) => {
    const dataName = oneData.name;
    oneData.data.forEach((d) => {
      const [time, value] = d;
      newData.push({
        time: Number(time),
        value,
        type: dataName
      });
    });
  });
  return newData;

  // const newData = (() => {
  //   const timeMap = {};
  //   data.forEach((oneData) => {
  //     const dataName = oneData.name;
  //     oneData.data.forEach((d) => {
  //       const [time, value] = d;
  //       if (timeMap[time]) {
  //         timeMap[time][dataName] = value;
  //       } else {
  //         timeMap[time] = {
  //           [dataName]: value
  //         };
  //       }
  //     });
  //   });
  //
  //   return Object.keys(timeMap).map((time) => {
  //     timeMap[time].time = Number(time);
  //     return timeMap[time];
  //   });
  // })();
  //
  // let frame = new G2.Frame(newData);
  // frame = G2.Frame.combineColumns(frame, configs.keys, 'value', 'type', ['time']);
  //
  // return frame;
}

export default MyG2Line;
