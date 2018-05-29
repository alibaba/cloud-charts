'use strict';

import G2 from '@antv/g2';
import React from 'react';
import PropTypes from 'prop-types';
import { getParentSize, requestAnimationFrame } from './common';
import highchartsDataToG2Data from './dataAdapter';
import setG2Theme from './g2Theme'

setG2Theme(G2);

// 图表唯一id
let uniqueId = 0;
function generateUniqueId() {
  return `react-g2-${uniqueId++}`;
}

const rootClassName = 'aisc-widgets ';
const rootChildClassName = 'aisc-widgets-children';

/**
 * g2Factory 函数
 * 将非React版的图表类转化为React版
 *
 * @param {string} name 组件名称
 * @param {object} Chart 组件原生代码组
 * @param {boolean} convertData 控制是否转化数据
 * */
function g2Factory(name, Chart, convertData = true) {
  let ChartProcess = Chart;
  class AiscChart extends React.Component {
    static propTypes = {
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      config: PropTypes.object,
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.object
      ]).isRequired,
      event: PropTypes.object,
      forceFit: PropTypes.bool
    };

    static defaultProps = {
      config: {},
    };

    static isG2Chart = true;

    constructor(props, context) {
      super(props, context);
      this.chart = null;
      this.chartDom = null;
      this.chartId = generateUniqueId();

      this.autoResize = this.autoResize.bind(this);
    }

    componentWillMount () {
      if (this.props.customChart) {
        this.chartProcess = ChartProcess = Object.assign({}, ChartProcess, this.props.customChart);
      } else {
        this.chartProcess = ChartProcess;
      }
    }

    componentDidMount () {
      // 设置初始高宽
      this.initSize();

      // 开始初始化图表
      const props = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, this.props) : this.props;
      const { width = this._size[0], height = (this._size[1] || 200), data: initData, padding, forceFit, config, event, ...otherProps } = props;
      const chart = new G2.Chart({
        container: this.chartDom,
        width,
        height,
        padding,
        forceFit: forceFit || false,
        ...otherProps
      });
      const data = convertData ? (config.dataType === 'g2' ? initData : highchartsDataToG2Data(initData, config)) : initData;
      if (config.xAxis && config.xAxis.type === 'datetime') {
        console.warn('配置属性 "config.xAxis.type": "datetime" 在 widgets 2.x 中已被废弃，请使用 "config.xAxis.type": "time"。详情请看：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/137。');
      }
      this.rawData = initData;
      chart && ChartProcess.init.call(this, chart, config, data);

      if (chart && event) {
        Object.keys(event).forEach((eventKey) => {
          chart.on(eventKey, event[eventKey]);
        });
      }

      this.chart = chart;
    }

    componentWillReceiveProps(nextProps){
      const { data: newData, width: newWidth, height: newHeight, padding: newPadding, config: newConfig } = nextProps;
      const { data: oldData, width: oldWidth, height: oldHeight, padding: oldPadding } = this.props;

      if (newPadding !== oldPadding) {
        console.warn('padding 不支持修改');
      }

      if (newData !== oldData || (Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length)) {
        const data = convertData ? (newConfig.dataType === 'g2' ? newData : highchartsDataToG2Data(newData, newConfig)) : newData;
        this.rawData = newData;
        if (ChartProcess.changeData) {
          this.chart && ChartProcess.changeData.call(this, this.chart, newConfig, data);
        } else {
          this.chart && this.chart.changeData(data);
        }
      }
      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        if (ChartProcess.changeSize) {
          this.chart && ChartProcess.changeSize.call(this, this.chart, newConfig, newWidth, newHeight);
        } else {
          this.chart && this.chart.changeSize(newWidth, newHeight);
        }
      }
    }

    shouldComponentUpdate (nextProps) {
      const { className: newClass, style: newStyle, children: newChild } = nextProps;
      const { className: oldClass, style: oldStyle, children: oldChild } = this.props;
      return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
    }

    // componentWillUpdate (nextProps) {}

    componentWillUnmount () {
      window.removeEventListener('resize', this.autoResize);

      if (ChartProcess.destroy) {
        this.chart && ChartProcess.destroy.call(this, this.chart);
      }

      this.chart && this.chart.off();
      this.chart && this.chart.destroy && this.chart.destroy();
      this.chart = null;
      this.chartDom = null;
      this.chartId = null;
    }

    initSize() {
      const element = this.chartDom;
      const parentSize = getParentSize(element, this.props.width, this.props.height);
      this.setSize(parentSize);

      window.addEventListener('resize', this.autoResize);
    }

    resizeRuning = false;
    autoResize() {
      if (this.resizeRuning) {
        return;
      }

      const { chartDom: element, props, _size } = this;
      this.resizeRuning = true;

      requestAnimationFrame(() => {
        this.resizeRuning = false;

        const parentSize = getParentSize(element, props.width, props.height);
        if(!(parentSize[0] === _size[0] && parentSize[1] === _size[1])){
          this.setSize(parentSize);

          if (ChartProcess.changeSize) {
            this.chart && ChartProcess.changeSize.call(this, this.chart, props.config, parentSize[0], parentSize[1]);
          } else {
            this.chart && this.chart.changeSize(parentSize[0], parentSize[1]);
          }
        }
      })
    }

    setSize(newSize) {
      const element = this.chartDom;
      this._size = newSize;

      if (newSize[0]) {
        element.style.width = newSize[0] + 'px';
      }
      if (newSize[1]) {
        element.style.height = newSize[1] + 'px';
      }
    }

    render() {
      const { className = '', style, children, data, width, height, padding, config, ...otherProps } = this.props;
      return (
        <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + name + ' ' + className} style={style} {...otherProps}>
          {children ? <div className={rootChildClassName}>{children}</div> : null}
        </div>
      );
    }
  }

  //暴露原版类
  AiscChart.Chart = Chart;

  AiscChart.displayName = 'AiscWidgets' + name;

  return AiscChart;
}

export default g2Factory;
