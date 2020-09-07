'use strict';

import G2 from '@antv/g2';
import React from 'react';
import PropTypes from 'prop-types';
import {
  getParentSize,
  requestAnimationFrame,
  isEqual,
  isEqualWith,
} from './common';
import highchartsDataToG2Data from './dataAdapter';
import chartLog from './log';
import eventBus from './eventBus';
import './g2Hacker';

// 图表唯一id
let uniqueId = 0;
function generateUniqueId() {
  return `react-g2-${uniqueId++}`;
}

const rootClassName = 'cloud-charts ';
const rootChildClassName = 'cloud-charts-children';

/**
 * g2Factory 函数
 * 将非React版的图表类转化为React版
 *
 * @param {string} name 组件名称
 * @param {object} Chart 组件原生代码组
 * @param {boolean} convertData 控制是否转化数据
 * */
/*#__PURE__*/
function g2Factory(name, Chart, convertData = true) {
  class CloudCharts extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.chart = null;
      this.chartDom = null;
      this.chartId = generateUniqueId();
      this.defaultConfig = {};

      this.autoResize = this.autoResize.bind(this);
      this.rerender = this.rerender.bind(this);

      // 图表初始化时记录日志
      chartLog(name, 'init');
    }

    componentDidMount() {
      this.chartProcess = Object.assign(
        {},
        Chart,
        this.props.customChart || {}
      );

      this.language = this.props.language || 'zh-cn';

      // 设置初始高宽
      this.initSize();

      this.initChart(this.props);

      eventBus.on('setTheme', this.rerender);
    }

    isReRendering = false;

    reRenderTimer = null;

    rerender() {
      // 修复 变化过快时 chart.destroy 方法无法清除dom，导致dom重复的问题。
      if (this.isReRendering) {
        window.cancelAnimationFrame(this.reRenderTimer);
      }

      this.isReRendering = true;
      this.destroy();

      // this.reRenderTimer = requestAnimationFrame(() => {
        if (!this.chartDom) {
          return;
        }
        this.initSize(this.props);

        this.initChart(this.props);

        this.isReRendering = false;
      // });
    }

    isEqualCustomizer = (objValue, othValue, key) => {
      const { isChangeEqual } = this.chartProcess;

      const res = isChangeEqual ? isChangeEqual.call(this, objValue, othValue, key) : undefined;
      if (res !== undefined) {
        return res;
      }
      // 默认忽略全部function
      if (typeof objValue === 'function' && typeof othValue === 'function') {
        return true;
      }
    };

    checkConfigChange(newConfig, oldConfig) {
      let hasConfigChange = false;

      if (!isEqualWith(newConfig, oldConfig, this.isEqualCustomizer)) {
        hasConfigChange = true;
      }

      return hasConfigChange;
    }

    componentDidUpdate(prevProps) {
      const {
        data: newData,
        width: newWidth,
        height: newHeight,
        padding: newPadding,
        config: newConfig,
        changeConfig = true,
      } = this.props;
      const {
        data: oldData,
        width: oldWidth,
        height: oldHeight,
        padding: oldPadding,
        config: oldConfig,
      } = prevProps;

      this.language = this.props.language || 'zh-cn';

      // 配置项有变化，重新生成图表
      if (changeConfig !== false) {
        if (this.checkConfigChange(newConfig, oldConfig)) {
          this.rerender();

          return;
        }
      }

      if (newPadding !== oldPadding) {
        console.warn('padding 不支持修改');
      }

      let needAfterRender = false;

      // 数据有变化
      if (
        newData !== oldData ||
        (Array.isArray(newData) &&
          Array.isArray(oldData) &&
          newData.length !== oldData.length)
      ) {
        const data =
          convertData &&
          this.chartProcess.convertData !== false &&
          newConfig.dataType !== 'g2'
            ? highchartsDataToG2Data(newData, newConfig, name)
            : newData;
        this.rawData = newData;
        if (this.chartProcess.changeData) {
          this.chart &&
            this.chartProcess.changeData.call(
              this,
              this.chart,
              newConfig,
              data
            );
        } else {
          this.chart && this.chart.changeData(data);
        }

        needAfterRender = true;
      }
      // 传入的长宽有变化
      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        this.changeSize(newConfig, newWidth, newHeight);

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

    destroy() {
      // 清空缩放相关变量和事件
      this.resizeRunning = false;
      window.cancelAnimationFrame(this.resizeTimer);
      window.removeEventListener('resize', this.autoResize);
      // 清除配置变化重新生成图表的定时器
      window.cancelAnimationFrame(this.reRenderTimer);
      // 清除afterRender的定时器
      clearTimeout(this.afterRenderTimer);

      if (this.chartProcess.destroy) {
        this.chart && this.chartProcess.destroy.call(this, this.chart);
      }
      if (this.unmountCallbacks.length > 0) {
        this.unmountCallbacks.forEach(cb => {
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

    componentWillUnmount() {
      this.destroy();

      eventBus.off('setTheme', this.rerender);
    }

    initChart(props) {
      if (this.chartProcess.getDefaultConfig) {
        this.defaultConfig = this.chartProcess.getDefaultConfig();
      }
      let currentProps = props || this.props;
      // 开始初始化图表
      currentProps = this.chartProcess.beforeInit
        ? this.chartProcess.beforeInit.call(this, currentProps)
        : currentProps;
      const {
        width = this._size[0],
        height = this._size[1] || 200,
        data: initData,
        padding,
        forceFit,
        config,
        event,
        ...otherProps
      } = currentProps;
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

      // 预处理数据
      const data =
        convertData &&
        this.chartProcess.convertData !== false &&
        config.dataType !== 'g2'
          ? highchartsDataToG2Data(initData, config, name)
          : initData;
      this.rawData = initData;

      // 生命绘制逻辑
      chart && this.chartProcess.init.call(this, chart, config, data);

      // 绑定事件，这里透传了G2的所有事件，暂时不做额外封装
      if (chart && event) {
        Object.keys(event).forEach(eventKey => {
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
      const parentSize = getParentSize(
        element,
        currentProps.width,
        currentProps.height
      );
      this.setSize(parentSize);

      window.addEventListener('resize', this.autoResize);
    }

    changeSize(config, w = this._size[0], h = this._size[1]) {
      this.setSize([w, h]);

      if (this.chartProcess.changeSize) {
        this.chart &&
          this.chartProcess.changeSize.call(this, this.chart, config, w, h);
      } else {
        this.chart && this.chart.changeSize(w, h);
      }
    }

    // 动态适配高宽，利用 resizeRunning 做节流
    resizeRunning = false;

    resizeTimer = null;

    autoResize() {
      if (this.resizeRunning) {
        // this.resizeRunning = false;
        // window.cancelAnimationFrame(this.resizeTimer);
        return;
      }

      const { chartDom: element, props, _size } = this;
      this.resizeRunning = true;

      this.resizeTimer = requestAnimationFrame(() => {
        this.resizeRunning = false;

        const parentSize = getParentSize(element, props.width, props.height);
        // 读取的高宽需要是有效值，0 也不可以
        if (
          !(parentSize[0] === _size[0] && parentSize[1] === _size[1]) &&
          parentSize[0] &&
          parentSize[1]
        ) {
          this.changeSize(props.config, parentSize[0], parentSize[1]);

          this.afterRender();
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

    afterRenderTimer = null;

    afterRender(config) {
      if (
        this.chartProcess.afterRender ||
        this.afterRenderCallbacks.length > 0
      ) {
        this.afterRenderTimer = setTimeout(() => {
          if (this.chart && this.chartProcess.afterRender) {
            this.chartProcess.afterRender.call(
              this,
              this.chart,
              config || this.props.config
            );
          }
          if (this.afterRenderCallbacks.length > 0) {
            this.afterRenderCallbacks.forEach(cb => {
              cb && cb.call(this, this.chart, config || this.props.config);
            });
          }
        }, 50);
      }
    }

    render() {
      const {
        className = '',
        style,
        children,
        data,
        width,
        height,
        padding,
        config,
        event,
        animate,
        language,
        customChart,
        getChartInstance,
        ...otherProps
      } = this.props;
      return (
        <div
          ref={dom => (this.chartDom = dom)}
          id={this.chartId}
          key={this.chartId}
          className={`${rootClassName + name} ${className}`}
          style={style}
          {...otherProps}>
          {children ? (
            <div className={rootChildClassName}>{children}</div>
          ) : null}
        </div>
      );
    }
  }

  CloudCharts.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    config: PropTypes.object,
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object,
    ]).isRequired,
    event: PropTypes.object,
    forceFit: PropTypes.bool,
  };

  CloudCharts.defaultProps = {
    config: {},
  };

  CloudCharts.isG2Chart = true;

  CloudCharts.displayName = `CloudCharts${name}`;

  CloudCharts.baseClassName = rootClassName + name;

  // 暴露原版类
  CloudCharts.Chart = Chart;

  return CloudCharts;
}

export default g2Factory;
