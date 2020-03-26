'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import G2 from '@antv/g2';
import React from 'react';
import { getParentSize, requestAnimationFrame, isEqual, isEqualWith } from './common';
import highchartsDataToG2Data from './dataAdapter';
import chartLog from './log';

// 图表唯一id
var uniqueId = 0;
function generateUniqueId() {
  return 'react-g2-' + uniqueId++;
}

var rootClassName = 'aisc-widgets ';
var rootChildClassName = 'aisc-widgets-children';

/**
 * g2Factory 函数
 * 将非React版的图表类转化为React版
 *
 * @param {string} name 组件名称
 * @param {object} Chart 组件原生代码组
 * @param {boolean} convertData 控制是否转化数据
 * */
var G2Base = (_temp = _class = function (_React$Component) {
  _inherits(G2Base, _React$Component);

  // G2图表标记
  function G2Base(props, context) {
    _classCallCheck(this, G2Base);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.chartName = '';
    _this.customChart = {};
    _this.language = 'zh-cn';
    _this.isReRendering = false;
    _this.reRenderTimer = null;
    _this.unmountCallbacks = [];
    _this.resizeRunning = false;
    _this.resizeTimer = null;
    _this.afterRenderCallbacks = [];

    _this.chart = null;
    _this.chartDom = null;
    _this.chartId = generateUniqueId();

    _this.autoResize = _this.autoResize.bind(_this);

    // 图表初始化时记录日志
    chartLog(_this.chartName, 'init');
    return _this;
  }

  // 用户自定义绘制方法


  // 图表语言


  G2Base.prototype.componentDidMount = function componentDidMount() {
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
  };

  G2Base.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this2 = this;

    var _props = this.props,
        newData = _props.data,
        newWidth = _props.width,
        newHeight = _props.height,
        newPadding = _props.padding,
        newConfig = _props.config,
        _props$changeConfig = _props.changeConfig,
        changeConfig = _props$changeConfig === undefined ? true : _props$changeConfig;
    var oldData = prevProps.data,
        oldWidth = prevProps.width,
        oldHeight = prevProps.height,
        oldPadding = prevProps.padding,
        oldConfig = prevProps.config;


    this.language = this.props.language || 'zh-cn';

    var changeCustomConfig = ChartProcess.changeCustomConfig;
    // 配置项有变化，重新生成图表
    if (changeConfig !== false) {
      var hasConfigChange = false;
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

        this.reRenderTimer = requestAnimationFrame(function () {
          if (!_this2.chartDom) {
            return;
          }
          _this2.initSize(_this2.props);

          _this2.initChart(_this2.props);

          _this2.isReRendering = false;
        });

        return;
      }
    }

    if (newPadding !== oldPadding) {
      console.warn('padding 不支持修改');
    }

    var needAfterRender = false;

    // 数据有变化
    if (newData !== oldData || Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length) {
      var data = convertData && ChartProcess.convertData !== false && newConfig.dataType !== 'g2' ? highchartsDataToG2Data(newData, newConfig) : newData;
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
  };

  // 渲染控制，仅 class、style、children 变化会触发渲染
  // shouldComponentUpdate(nextProps) {
  //   const { className: newClass, style: newStyle, children: newChild } = nextProps;
  //   const { className: oldClass, style: oldStyle, children: oldChild } = this.props;
  //   return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
  // }

  // 准备销毁


  G2Base.prototype.componentWillUnmount = function componentWillUnmount() {
    var _this3 = this;

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
      this.unmountCallbacks.forEach(function (cb) {
        cb && cb.call(_this3, _this3.chart);
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
  };

  G2Base.prototype.initChart = function initChart(props) {
    var currentProps = props || this.props;
    // 开始初始化图表
    currentProps = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, currentProps) : currentProps;

    var _currentProps = currentProps,
        _currentProps$width = _currentProps.width,
        width = _currentProps$width === undefined ? this._size[0] : _currentProps$width,
        _currentProps$height = _currentProps.height,
        height = _currentProps$height === undefined ? this._size[1] || 200 : _currentProps$height,
        initData = _currentProps.data,
        padding = _currentProps.padding,
        forceFit = _currentProps.forceFit,
        config = _currentProps.config,
        event = _currentProps.event,
        otherProps = _objectWithoutProperties(_currentProps, ['width', 'height', 'data', 'padding', 'forceFit', 'config', 'event']);
    // 生成图表实例


    var chart = new G2.Chart(_extends({
      container: this.chartDom,
      width: width,
      height: height,
      padding: padding,
      forceFit: forceFit || false,
      // auto-padding 时自带的内边距
      autoPaddingAppend: 3
    }, otherProps));

    // 1.x 升级 到 2.x 的提示
    if (config.xAxis && config.xAxis.type === 'datetime') {
      console.warn('配置属性 "config.xAxis.type": "datetime" 在 widgets 2.x 中已被废弃，请使用 "config.xAxis.type": "time"。详情请看：aisc.alibaba-inc.com/site/pc#/cate/4/page/137。');
    }

    // 预处理数据
    var data = convertData && ChartProcess.convertData !== false && config.dataType !== 'g2' ? highchartsDataToG2Data(initData, config) : initData;
    this.rawData = initData;
    chart && ChartProcess.init.call(this, chart, config, data);

    // 绑定事件，这里透传了G2的所有事件，暂时不做额外封装
    if (chart && event) {
      Object.keys(event).forEach(function (eventKey) {
        chart.on(eventKey, event[eventKey]);
      });
    }

    this.chart = chart;

    if (G2.Util.isFunction(currentProps.getChartInstance)) {
      currentProps.getChartInstance(chart);
    }

    this.afterRender(config);
  };

  // 初始化时适配高宽


  G2Base.prototype.initSize = function initSize(props) {
    var currentProps = props || this.props;

    var element = this.chartDom;
    var parentSize = getParentSize(element, currentProps.width, currentProps.height);
    this.setSize(parentSize);

    window.addEventListener('resize', this.autoResize);
  };

  G2Base.prototype.changeSize = function changeSize(config) {
    var w = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._size[0];
    var h = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._size[1];

    this.setSize([w, h]);

    if (ChartProcess.changeSize) {
      this.chart && ChartProcess.changeSize.call(this, this.chart, config, w, h);
    } else {
      this.chart && this.chart.changeSize(w, h);
    }
  };

  // 动态适配高宽，利用 resizeRunning 做节流


  G2Base.prototype.autoResize = function autoResize() {
    var _this4 = this;

    if (this.resizeRunning) {
      window.cancelAnimationFrame(this.resizeTimer);
      return;
    }

    var element = this.chartDom,
        props = this.props,
        _size = this._size;

    this.resizeRunning = true;

    this.resizeTimer = requestAnimationFrame(function () {
      _this4.resizeRunning = false;

      var parentSize = getParentSize(element, props.width, props.height);
      // 读取的高宽需要是有效值，0 也不可以
      if (!(parentSize[0] === _size[0] && parentSize[1] === _size[1]) && parentSize[0] && parentSize[1]) {
        _this4.changeSize(props.config, parentSize[0], parentSize[1]);

        _this4.afterRender();

        // this.setSize(parentSize);
        //
        // if (ChartProcess.changeSize) {
        //   this.chart && ChartProcess.changeSize.call(this, this.chart, props.config, parentSize[0], parentSize[1]);
        // } else {
        //   this.chart && this.chart.changeSize(parentSize[0], parentSize[1]);
        // }
      }
    });
  };

  // 设置高宽


  G2Base.prototype.setSize = function setSize(newSize) {
    var element = this.chartDom;
    this._size = newSize;

    if (newSize[0]) {
      element.style.width = newSize[0] + 'px';
    }
    if (newSize[1]) {
      element.style.height = newSize[1] + 'px';
    }
  };

  G2Base.prototype.afterRender = function afterRender(config) {
    var _this5 = this;

    if (ChartProcess.afterRender || this.afterRenderCallbacks.length > 0) {
      setTimeout(function () {
        if (_this5.chart && ChartProcess.afterRender) {
          ChartProcess.afterRender.call(_this5, _this5.chart, config || _this5.props.config);
        }
        if (_this5.afterRenderCallbacks.length > 0) {
          _this5.afterRenderCallbacks.forEach(function (cb) {
            cb && cb.call(_this5, _this5.chart, config || _this5.props.config);
          });
        }
      }, 50);
    }
  };

  G2Base.prototype.render = function render() {
    var _this6 = this;

    var _props2 = this.props,
        _props2$className = _props2.className,
        className = _props2$className === undefined ? '' : _props2$className,
        style = _props2.style,
        children = _props2.children,
        config = _props2.config,
        data = _props2.data,
        width = _props2.width,
        height = _props2.height,
        padding = _props2.padding,
        animate = _props2.animate,
        language = _props2.language,
        customChart = _props2.customChart,
        otherProps = _objectWithoutProperties(_props2, ['className', 'style', 'children', 'config', 'data', 'width', 'height', 'padding', 'animate', 'language', 'customChart']);

    return React.createElement(
      'div',
      _extends({ ref: function ref(dom) {
          return _this6.chartDom = dom;
        }, id: this.chartId, key: this.chartId, className: rootClassName + this.chartName + ' ' + className, style: style }, otherProps),
      children ? React.createElement(
        'div',
        { className: rootChildClassName },
        children
      ) : null
    );
  };

  return G2Base;
}(React.Component), _class.isG2Chart = true, _temp);
G2Base.displayName = 'G2Base';


export default G2Base;