import G2 from 'g2';
import React from 'react';
import PropTypes from 'prop-types';
import COLORS from './colors';

// 全局配置项
G2.Global.pixelRatio = 2;

const theme = G2.Util.mix(true, {}, G2.Theme, {
  // animate: false,
  colors: {
    'default': COLORS
  },
  // shapes: {...}
  // 具体的配置项详见 https://antv.alipay.com/g2/api/global.html
});
G2.Global.setTheme(theme); // 将主题设置为用户自定义的主题

// 图表唯一id
let uniqueId = 0;
function generateUniqueId() {
  return `react-g2-${uniqueId++}`;
}

export default function createG2(__operation) {
  class Component extends React.Component {
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

      if (newData !== oldData) {
        this.chart.changeData(newData);
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

    initChart(props) {
      const { width, height = 400, data, plotCfg, forceFit, configs } = props;
      const chart = new G2.Chart({
        id: this.chartId,
        width,
        height,
        plotCfg,
        forceFit: width === undefined || forceFit,
      });
      // chart.source(data);
      __operation(chart, configs, data);
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

  return Component;
}