import G2 from "g2";
import React from "react";
import PropTypes from "prop-types";

let uniqueId = 0;
function generateUniqueId() {
  return `rc-g2-${uniqueId++}`;
}

export default function createG2(__operation) {
  class Component extends React.Component {
    static propTypes = {
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.instanceOf(G2.Frame),
      ]).isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      plotCfg: PropTypes.object,
      forceFit: PropTypes.bool,
      configs: PropTypes.object,
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
      const {
        data: newData,
        width: newWidth,
        height: newHeight,
        plotCfg: newPlotCfg,
      } = newProps;
      const {
        data: oldData,
        width: oldWidth,
        height: oldHeight,
        plotCfg: oldPlotCfg,
      } = this.props;

      if (newPlotCfg !== oldPlotCfg) {
        console.warn("plotCfg 不支持修改");
      }

      if (newData !== oldData) {
        this.chart.changeData(newData);
      }
      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        this.chart.changeSize(newWidth, newHeight);
      }
    }

    componentWillUnmount() {
      this.chart.destroy();
      this.chart = null;
      this.chartId = null;
    }

    initChart(props) {
      const { width, height, data, plotCfg, forceFit, configs } = props;
      const chart = new G2.Chart({
        id: this.chartId,
        width,
        height,
        plotCfg,
        forceFit,
      });
      chart.source(data);
      __operation(chart, configs);
      this.chart = chart;
    }

    render() {
      return <div id={this.chartId} />;
    }
  }

  return Component;
}
