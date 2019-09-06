'use strict';

import G2 from '@antv/g2';
import React from 'react';
import PropTypes from 'prop-types';
import { getParentSize, requestAnimationFrame, isEqual, isEqualWith } from './common';
import highchartsDataToG2Data from './dataAdapter';
import chartLog from './log';

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
class G2Base extends React.Component {
  // G2图表标记
  static isG2Chart = true;

  chartName = '';

  constructor(props, context) {
    super(props, context);
    this.chart = null;
    this.chartDom = null;
    this.chartId = generateUniqueId();

    this.autoResize = this.autoResize.bind(this);

    // 图表初始化时记录日志
    chartLog(this.chartName, 'init');
  }

  // 用户自定义绘制方法
  customChart = {};

  // 图表语言
  language = 'zh-cn';

  componentDidMount() {
    if (this.props.customChart) {
      this.customChart = this.props.customChart;
      // ChartProcess = Object.assign({}, ChartProcess, this.props.customChart);
    }
    // this.chartProcess = ChartProcess;

    if (this.props.language) {
      this.language = this.props.language;
    }

    // 设置初始高宽
    this.initSize();

    this.initChart(this.props);
  }

  isReRendering = false;

  reRenderTimer = null;

  componentDidUpdate(prevProps) {
    const { data: newData, width: newWidth, height: newHeight, padding: newPadding, config: newConfig, changeConfig = true } = this.props;
    const { data: oldData, width: oldWidth, height: oldHeight, padding: oldPadding, config: oldConfig } = prevProps;

    this.language = this.props.language || 'zh-cn';

    const changeCustomConfig = ChartProcess.changeCustomConfig;
    // 配置项有变化，重新生成图表
    if (changeConfig !== false) {
      let hasConfigChange = false;
      if (changeCustomConfig && !isEqualWith(newConfig, oldConfig, changeCustomConfig.bind(this))) {
        hasConfigChange = true;
      } else if (!changeCustomConfig && !isEqual(newConfig, oldConfig)) {
        hasConfigChange = true;
      }

      if (hasConfigChange) {
        // 修复 变化过快时 chart.destroy 方法无法清除dom，导致dom重复的问题。
        if (this.isReRendering) {
          window.cancelAnimationFrame(this.reRenderTimer);
        }

        this.isReRendering = true;
        this.componentWillUnmount();

        this.reRenderTimer = requestAnimationFrame(() => {
          if (!this.chartDom) {
            return;
          }
          this.initSize(this.props);

          this.initChart(this.props);

          this.isReRendering = false;
        });

        return;
      }
    }

    if (newPadding !== oldPadding) {
      console.warn('padding 不支持修改');
    }

    let needAfterRender = false;

    // 数据有变化
    if (newData !== oldData || (Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length)) {
      const data = convertData && ChartProcess.convertData !== false && newConfig.dataType !== 'g2' ? highchartsDataToG2Data(newData, newConfig) : newData;
      this.rawData = newData;
      if (ChartProcess.changeData) {
        this.chart && ChartProcess.changeData.call(this, this.chart, newConfig, data);
      } else {
        this.chart && this.chart.changeData(data);
      }

      needAfterRender = true;
    }
    // 传入的长宽有变化
    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this.changeSize(newConfig, newWidth, newHeight);
      // if (ChartProcess.changeSize) {
      //   this.chart && ChartProcess.changeSize.call(this, this.chart, newConfig, newWidth, newHeight);
      // } else {
      //   this.chart && this.chart.changeSize(newWidth, newHeight);
      // }

      needAfterRender = true;
    }

    if (needAfterRender) {
      this.afterRender(newConfig);
    }
  }

  // 渲染控制，仅 class、style、children 变化会触发渲染
  // shouldComponentUpdate(nextProps) {
  //   const { className: newClass, style: newStyle, children: newChild } = nextProps;
  //   const { className: oldClass, style: oldStyle, children: oldChild } = this.props;
  //   return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
  // }

  // 准备销毁
  unmountCallbacks = [];

  componentWillUnmount() {
    // 清空缩放相关变量和事件
    this.resizeRunning = false;
    this.resizeTimer = null;
    window.removeEventListener('resize', this.autoResize);
    // 清除配置变化重新生成图表的定时器
    window.cancelAnimationFrame(this.reRenderTimer);

    if (ChartProcess.destroy) {
      this.chart && ChartProcess.destroy.call(this, this.chart);
    }
    if (this.unmountCallbacks.length > 0) {
      this.unmountCallbacks.forEach((cb) => {
        cb && cb.call(this, this.chart);
      });
    }

    this.chart && this.chart.off();
    this.chart && this.chart.destroy && this.chart.destroy();
    this.chart = null;
    // this.chartDom = null;
    // this.chartId = null;

    if (G2.Util.isFunction(this.props.getChartInstance)) {
      this.props.getChartInstance(null);
    }

    this.afterRenderCallbacks = [];
    this.unmountCallbacks = [];
  }

  initChart(props) {
    let currentProps = props || this.props;
    // 开始初始化图表
    currentProps = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, currentProps) : currentProps;
    const { width = this._size[0], height = (this._size[1] || 200), data: initData, padding, forceFit, config, event, ...otherProps } = currentProps;
    // 生成图表实例
    const chart = new G2.Chart({
      container: this.chartDom,
      width,
      height,
      padding,
      forceFit: forceFit || false,
      // auto-padding 时自带的内边距
      autoPaddingAppend: 3,
      ...otherProps,
    });

    // 1.x 升级 到 2.x 的提示
    if (config.xAxis && config.xAxis.type === 'datetime') {
      console.warn('配置属性 "config.xAxis.type": "datetime" 在 widgets 2.x 中已被废弃，请使用 "config.xAxis.type": "time"。详情请看：aisc.alibaba-inc.com/site/pc#/cate/4/page/137。');
    }

    // 预处理数据
    const data = convertData && ChartProcess.convertData !== false && config.dataType !== 'g2' ? highchartsDataToG2Data(initData, config) : initData;
    this.rawData = initData;
    chart && ChartProcess.init.call(this, chart, config, data);

    // 绑定事件，这里透传了G2的所有事件，暂时不做额外封装
    if (chart && event) {
      Object.keys(event).forEach((eventKey) => {
        chart.on(eventKey, event[eventKey]);
      });
    }

    this.chart = chart;

    if (G2.Util.isFunction(currentProps.getChartInstance)) {
      currentProps.getChartInstance(chart);
    }

    this.afterRender(config);
  }

  // 初始化时适配高宽
  initSize(props) {
    const currentProps = props || this.props;

    const element = this.chartDom;
    const parentSize = getParentSize(element, currentProps.width, currentProps.height);
    this.setSize(parentSize);

    window.addEventListener('resize', this.autoResize);
  }

  changeSize(config, w = this._size[0], h = this._size[1]) {
    this.setSize([w, h]);

    if (ChartProcess.changeSize) {
      this.chart && ChartProcess.changeSize.call(this, this.chart, config, w, h);
    } else {
      this.chart && this.chart.changeSize(w, h);
    }
  }

  // 动态适配高宽，利用 resizeRunning 做节流
  resizeRunning = false;

  resizeTimer = null;

  autoResize() {
    if (this.resizeRunning) {
      window.cancelAnimationFrame(this.resizeTimer);
      return;
    }

    const { chartDom: element, props, _size } = this;
    this.resizeRunning = true;

    this.resizeTimer = requestAnimationFrame(() => {
      this.resizeRunning = false;

      const parentSize = getParentSize(element, props.width, props.height);
      // 读取的高宽需要是有效值，0 也不可以
      if (!(parentSize[0] === _size[0] && parentSize[1] === _size[1]) && parentSize[0] && parentSize[1]) {
        this.changeSize(props.config, parentSize[0], parentSize[1]);

        this.afterRender();

        // this.setSize(parentSize);
        //
        // if (ChartProcess.changeSize) {
        //   this.chart && ChartProcess.changeSize.call(this, this.chart, props.config, parentSize[0], parentSize[1]);
        // } else {
        //   this.chart && this.chart.changeSize(parentSize[0], parentSize[1]);
        // }
      }
    });
  }

  // 设置高宽
  setSize(newSize) {
    const element = this.chartDom;
    this._size = newSize;

    if (newSize[0]) {
      element.style.width = `${newSize[0]}px`;
    }
    if (newSize[1]) {
      element.style.height = `${newSize[1]}px`;
    }
  }

  afterRenderCallbacks = [];

  afterRender(config) {
    if (ChartProcess.afterRender || this.afterRenderCallbacks.length > 0) {
      setTimeout(() => {
        if (this.chart && ChartProcess.afterRender) {
          ChartProcess.afterRender.call(this, this.chart, config || this.props.config);
        }
        if (this.afterRenderCallbacks.length > 0) {
          this.afterRenderCallbacks.forEach((cb) => {
            cb && cb.call(this, this.chart, config || this.props.config);
          });
        }
      }, 50);
    }
  }

  render() {
    const {
      className = '', style, children,
      config, data, width, height,
      padding,
      animate,
      language,
      customChart,
      ...otherProps
    } = this.props;
    return (
      <div ref={dom => (this.chartDom = dom)} id={this.chartId} key={this.chartId} className={`${rootClassName + this.chartName} ${className}`} style={style} {...otherProps}>
        {children ? <div className={rootChildClassName}>{children}</div> : null}
      </div>
    );
  }
}

export default G2Base;