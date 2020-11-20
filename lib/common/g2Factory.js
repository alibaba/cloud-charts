'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _g = _interopRequireDefault(require("@antv/g2"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _common = require("./common");

var _dataAdapter = _interopRequireDefault(require("./dataAdapter"));

var _log = _interopRequireDefault(require("./log"));

var _eventBus = _interopRequireDefault(require("./eventBus"));

require("./g2Hacker");

// 图表唯一id
var uniqueId = 0;

function generateUniqueId() {
  return "react-g2-" + uniqueId++;
}

var rootClassName = 'cloud-charts ';
var rootChildClassName = 'cloud-charts-children';
/**
 * g2Factory 函数
 * 将非React版的图表类转化为React版
 *
 * @param {string} name 组件名称
 * @param {object} Chart 组件原生代码组
 * @param {boolean} convertData 控制是否转化数据
 * */

/*#__PURE__*/

function g2Factory(name, Chart, convertData) {
  if (convertData === void 0) {
    convertData = true;
  }

  var CloudCharts = /*#__PURE__*/function (_React$Component) {
    (0, _inheritsLoose2["default"])(CloudCharts, _React$Component);

    function CloudCharts(props, context) {
      var _this;

      _this = _React$Component.call(this, props, context) || this;
      _this.isReRendering = false;
      _this.reRenderTimer = null;

      _this.isEqualCustomizer = function (objValue, othValue, key) {
        var isChangeEqual = _this.chartProcess.isChangeEqual;
        var res = isChangeEqual ? isChangeEqual.call((0, _assertThisInitialized2["default"])(_this), objValue, othValue, key) : undefined;

        if (res !== undefined) {
          return res;
        } // 默认忽略全部function


        if (typeof objValue === 'function' && typeof othValue === 'function') {
          return true;
        }
      };

      _this.unmountCallbacks = [];
      _this.resizeRunning = false;
      _this.resizeTimer = null;
      _this.afterRenderCallbacks = [];
      _this.afterRenderTimer = null;
      _this.chart = null;
      _this.chartDom = null;
      _this.chartId = generateUniqueId();
      _this.defaultConfig = {};
      _this.autoResize = _this.autoResize.bind((0, _assertThisInitialized2["default"])(_this));
      _this.rerender = _this.rerender.bind((0, _assertThisInitialized2["default"])(_this)); // 图表初始化时记录日志

      (0, _log["default"])(name, 'init');
      return _this;
    }

    var _proto = CloudCharts.prototype;

    _proto.componentDidMount = function componentDidMount() {
      this.chartProcess = Object.assign({}, Chart, this.props.customChart || {});
      this.language = this.props.language || 'zh-cn'; // 设置初始高宽

      this.initSize();
      this.initChart(this.props);

      _eventBus["default"].on('setTheme', this.rerender);
    };

    _proto.rerender = function rerender() {
      // 修复 变化过快时 chart.destroy 方法无法清除dom，导致dom重复的问题。
      if (this.isReRendering) {
        window.cancelAnimationFrame(this.reRenderTimer);
      }

      this.isReRendering = true;
      this.destroy(); // this.reRenderTimer = requestAnimationFrame(() => {

      if (!this.chartDom) {
        return;
      }

      this.initSize(this.props);
      this.initChart(this.props);
      this.isReRendering = false; // });
    };

    _proto.checkConfigChange = function checkConfigChange(newConfig, oldConfig) {
      var hasConfigChange = false;

      if (!(0, _common.isEqualWith)(newConfig, oldConfig, this.isEqualCustomizer)) {
        hasConfigChange = true;
      }

      return hasConfigChange;
    };

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          newData = _this$props.data,
          newWidth = _this$props.width,
          newHeight = _this$props.height,
          newPadding = _this$props.padding,
          newConfig = _this$props.config,
          _this$props$changeCon = _this$props.changeConfig,
          changeConfig = _this$props$changeCon === void 0 ? true : _this$props$changeCon;
      var oldData = prevProps.data,
          oldWidth = prevProps.width,
          oldHeight = prevProps.height,
          oldPadding = prevProps.padding,
          oldConfig = prevProps.config;
      this.language = this.props.language || 'zh-cn'; // 配置项有变化，重新生成图表

      if (changeConfig !== false) {
        if (this.checkConfigChange(newConfig, oldConfig)) {
          this.rerender();
          return;
        }
      }

      if (newPadding !== oldPadding) {
        console.warn('padding 不支持修改');
      }

      var needAfterRender = false; // 数据有变化

      if (newData !== oldData || Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length) {
        var data = convertData && this.chartProcess.convertData !== false && newConfig.dataType !== 'g2' ? (0, _dataAdapter["default"])(newData, newConfig, name) : newData;
        this.rawData = newData;

        if (this.chartProcess.changeData) {
          this.chart && this.chartProcess.changeData.call(this, this.chart, newConfig, data);
        } else {
          this.chart && this.chart.changeData(data);
        }

        needAfterRender = true;
      } // 传入的长宽有变化


      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        this.changeSize(newConfig, newWidth, newHeight);
        needAfterRender = true;
      }

      if (needAfterRender) {
        this.afterRender(newConfig);
      }
    } // 渲染控制，仅 class、style、children 变化会触发渲染
    // shouldComponentUpdate(nextProps) {
    //   const { className: newClass, style: newStyle, children: newChild } = nextProps;
    //   const { className: oldClass, style: oldStyle, children: oldChild } = this.props;
    //   return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
    // }
    // 准备销毁
    ;

    _proto.destroy = function destroy() {
      var _this2 = this;

      // 清空缩放相关变量和事件
      this.resizeRunning = false;
      window.cancelAnimationFrame(this.resizeTimer);
      window.removeEventListener('resize', this.autoResize); // 清除配置变化重新生成图表的定时器

      window.cancelAnimationFrame(this.reRenderTimer); // 清除afterRender的定时器

      clearTimeout(this.afterRenderTimer);

      if (this.chartProcess.destroy) {
        this.chart && this.chartProcess.destroy.call(this, this.chart);
      }

      if (this.unmountCallbacks.length > 0) {
        this.unmountCallbacks.forEach(function (cb) {
          cb && cb.call(_this2, _this2.chart);
        });
      }

      this.chart && this.chart.off();
      this.chart && this.chart.destroy && this.chart.destroy();
      this.chart = null; // this.chartDom = null;
      // this.chartId = null;

      if (_g["default"].Util.isFunction(this.props.getChartInstance)) {
        this.props.getChartInstance(null);
      }

      this.afterRenderCallbacks = [];
      this.unmountCallbacks = [];
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.destroy();

      _eventBus["default"].off('setTheme', this.rerender);
    };

    _proto.initChart = function initChart(props) {
      if (this.chartProcess.getDefaultConfig) {
        this.defaultConfig = this.chartProcess.getDefaultConfig();
      }

      var currentProps = props || this.props; // 开始初始化图表

      currentProps = this.chartProcess.beforeInit ? this.chartProcess.beforeInit.call(this, currentProps) : currentProps;
      var _currentProps = currentProps,
          _currentProps$width = _currentProps.width,
          width = _currentProps$width === void 0 ? this._size[0] : _currentProps$width,
          _currentProps$height = _currentProps.height,
          height = _currentProps$height === void 0 ? this._size[1] || 200 : _currentProps$height,
          initData = _currentProps.data,
          padding = _currentProps.padding,
          forceFit = _currentProps.forceFit,
          config = _currentProps.config,
          event = _currentProps.event,
          otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_currentProps, ["width", "height", "data", "padding", "forceFit", "config", "event"]); // 生成图表实例

      var chart = new _g["default"].Chart((0, _extends2["default"])({
        container: this.chartDom,
        width: width,
        height: height,
        padding: padding,
        forceFit: forceFit || false,
        // auto-padding 时自带的内边距
        autoPaddingAppend: 3
      }, otherProps)); // 预处理数据

      var data = convertData && this.chartProcess.convertData !== false && config.dataType !== 'g2' ? (0, _dataAdapter["default"])(initData, config, name) : initData;
      this.rawData = initData; // 生命绘制逻辑

      chart && this.chartProcess.init.call(this, chart, config, data); // 绑定事件，这里透传了G2的所有事件，暂时不做额外封装

      if (chart && event) {
        Object.keys(event).forEach(function (eventKey) {
          chart.on(eventKey, event[eventKey]);
        });
      }

      this.chart = chart;

      if (_g["default"].Util.isFunction(currentProps.getChartInstance)) {
        currentProps.getChartInstance(chart);
      }

      this.afterRender(config);
    } // 初始化时适配高宽
    ;

    _proto.initSize = function initSize(props) {
      var currentProps = props || this.props;
      var element = this.chartDom;
      var parentSize = (0, _common.getParentSize)(element, currentProps.width, currentProps.height);
      this.setSize(parentSize);
      window.addEventListener('resize', this.autoResize);
    };

    _proto.changeSize = function changeSize(config, w, h) {
      if (w === void 0) {
        w = this._size[0];
      }

      if (h === void 0) {
        h = this._size[1];
      }

      this.setSize([w, h]);

      if (this.chartProcess.changeSize) {
        this.chart && this.chartProcess.changeSize.call(this, this.chart, config, w, h);
      } else {
        this.chart && this.chart.changeSize(w, h);
      }
    } // 动态适配高宽，利用 resizeRunning 做节流
    ;

    _proto.autoResize = function autoResize() {
      var _this3 = this;

      if (this.resizeRunning) {
        // this.resizeRunning = false;
        // window.cancelAnimationFrame(this.resizeTimer);
        return;
      }

      var element = this.chartDom,
          props = this.props,
          _size = this._size;
      this.resizeRunning = true;
      this.resizeTimer = (0, _common.requestAnimationFrame)(function () {
        _this3.resizeRunning = false;
        var parentSize = (0, _common.getParentSize)(element, props.width, props.height); // 读取的高宽需要是有效值，0 也不可以

        if (!(parentSize[0] === _size[0] && parentSize[1] === _size[1]) && parentSize[0] && parentSize[1]) {
          _this3.changeSize(props.config, parentSize[0], parentSize[1]);

          _this3.afterRender();
        }
      });
    } // 设置高宽
    ;

    _proto.setSize = function setSize(newSize) {
      var element = this.chartDom;
      this._size = newSize;

      if (newSize[0]) {
        element.style.width = newSize[0] + "px";
      }

      if (newSize[1]) {
        element.style.height = newSize[1] + "px";
      }
    };

    _proto.afterRender = function afterRender(config) {
      var _this4 = this;

      if (this.chartProcess.afterRender || this.afterRenderCallbacks.length > 0) {
        this.afterRenderTimer = setTimeout(function () {
          if (_this4.chart && _this4.chartProcess.afterRender) {
            _this4.chartProcess.afterRender.call(_this4, _this4.chart, config || _this4.props.config);
          }

          if (_this4.afterRenderCallbacks.length > 0) {
            _this4.afterRenderCallbacks.forEach(function (cb) {
              cb && cb.call(_this4, _this4.chart, config || _this4.props.config);
            });
          }
        }, 50);
      }
    };

    _proto.render = function render() {
      var _this5 = this;

      var _this$props2 = this.props,
          _this$props2$classNam = _this$props2.className,
          className = _this$props2$classNam === void 0 ? '' : _this$props2$classNam,
          style = _this$props2.style,
          children = _this$props2.children,
          data = _this$props2.data,
          width = _this$props2.width,
          height = _this$props2.height,
          padding = _this$props2.padding,
          config = _this$props2.config,
          event = _this$props2.event,
          animate = _this$props2.animate,
          language = _this$props2.language,
          customChart = _this$props2.customChart,
          getChartInstance = _this$props2.getChartInstance,
          otherProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props2, ["className", "style", "children", "data", "width", "height", "padding", "config", "event", "animate", "language", "customChart", "getChartInstance"]);
      return /*#__PURE__*/_react["default"].createElement("div", (0, _extends2["default"])({
        ref: function ref(dom) {
          return _this5.chartDom = dom;
        },
        id: this.chartId,
        key: this.chartId,
        className: rootClassName + name + " " + className,
        style: style
      }, otherProps), children ? /*#__PURE__*/_react["default"].createElement("div", {
        className: rootChildClassName
      }, children) : null);
    };

    return CloudCharts;
  }(_react["default"].Component);

  CloudCharts.propTypes = {
    width: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
    height: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
    config: _propTypes["default"].object,
    data: _propTypes["default"].oneOfType([_propTypes["default"].arrayOf(_propTypes["default"].object), _propTypes["default"].object]).isRequired,
    event: _propTypes["default"].object,
    forceFit: _propTypes["default"].bool
  };
  CloudCharts.defaultProps = {
    config: {}
  };
  CloudCharts.isG2Chart = true;
  CloudCharts.displayName = "CloudCharts" + name;
  CloudCharts.baseClassName = rootClassName + name; // 暴露原版类

  CloudCharts.Chart = Chart;
  return CloudCharts;
}

var _default = g2Factory;
exports["default"] = _default;