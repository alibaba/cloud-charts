'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _common = require('./common');

var _dataAdapter = require('./dataAdapter');

var _dataAdapter2 = _interopRequireDefault(_dataAdapter);

var _g2Theme = require('./g2Theme');

var _g2Theme2 = _interopRequireDefault(_g2Theme);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _g2Theme2.default)(_g2.default);

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
function g2Factory(name, Chart) {
  var convertData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var ChartProcess = Chart;

  var AiscChart = function (_React$Component) {
    _inherits(AiscChart, _React$Component);

    function AiscChart(props, context) {
      _classCallCheck(this, AiscChart);

      var _this = _possibleConstructorReturn(this, (AiscChart.__proto__ || Object.getPrototypeOf(AiscChart)).call(this, props, context));

      _this.unmountCallbacks = [];
      _this.resizeRunning = false;
      _this.resizeTimer = null;
      _this.afterRenderCallbacks = [];

      _this.chart = null;
      _this.chartDom = null;
      _this.chartId = generateUniqueId();

      _this.autoResize = _this.autoResize.bind(_this);

      // 图表初始化时记录日志
      (0, _log2.default)(name, 'init');
      return _this;
    }

    _createClass(AiscChart, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        if (this.props.customChart) {
          this.chartProcess = ChartProcess = _extends({}, ChartProcess, this.props.customChart);
        } else {
          this.chartProcess = ChartProcess;
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        // 设置初始高宽
        this.initSize();

        this.initChart(this.props);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        var newData = nextProps.data,
            newWidth = nextProps.width,
            newHeight = nextProps.height,
            newPadding = nextProps.padding,
            newConfig = nextProps.config,
            _nextProps$changeConf = nextProps.changeConfig,
            changeConfig = _nextProps$changeConf === undefined ? true : _nextProps$changeConf;
        var _props = this.props,
            oldData = _props.data,
            oldWidth = _props.width,
            oldHeight = _props.height,
            oldPadding = _props.padding,
            oldConfig = _props.config;

        // 配置项有变化，重新生成图表

        if (changeConfig !== false && !_g2.default.Util.isEqual(newConfig, oldConfig)) {
          this.componentWillUnmount();

          // requestAnimationFrame 会在标签页转到后台时不运行，导致重复dom问题
          setTimeout(function () {
            _this2.initSize(nextProps);

            _this2.initChart(nextProps);
          }, 1000 / 60);

          return;
        }

        if (newPadding !== oldPadding) {
          console.warn('padding 不支持修改');
        }

        var needAfterRender = false;

        // 数据有变化
        if (newData !== oldData || Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length) {
          var data = convertData && ChartProcess.convertData !== false && newConfig.dataType !== 'g2' ? (0, _dataAdapter2.default)(newData, newConfig) : newData;
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

    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var newClass = nextProps.className,
            newStyle = nextProps.style,
            newChild = nextProps.children;
        var _props2 = this.props,
            oldClass = _props2.className,
            oldStyle = _props2.style,
            oldChild = _props2.children;

        return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
      }

      // 准备销毁

    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _this3 = this;

        // 清空缩放相关变量和事件
        this.resizeRunning = false;
        this.resizeTimer = null;
        window.removeEventListener('resize', this.autoResize);

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

        this.afterRenderCallbacks = [];
        this.unmountCallbacks = [];
      }
    }, {
      key: 'initChart',
      value: function initChart(props) {
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


        var chart = new _g2.default.Chart(_extends({
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
          console.warn('配置属性 "config.xAxis.type": "datetime" 在 widgets 2.x 中已被废弃，请使用 "config.xAxis.type": "time"。详情请看：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/137。');
        }

        // 预处理数据
        var data = convertData && ChartProcess.convertData !== false && config.dataType !== 'g2' ? (0, _dataAdapter2.default)(initData, config) : initData;
        this.rawData = initData;
        chart && ChartProcess.init.call(this, chart, config, data);

        // 绑定事件，这里透传了G2的所有事件，暂时不做额外封装
        if (chart && event) {
          Object.keys(event).forEach(function (eventKey) {
            chart.on(eventKey, event[eventKey]);
          });
        }

        this.chart = chart;

        this.afterRender(config);
      }

      // 初始化时适配高宽

    }, {
      key: 'initSize',
      value: function initSize(props) {
        var currentProps = props || this.props;

        var element = this.chartDom;
        var parentSize = (0, _common.getParentSize)(element, currentProps.width, currentProps.height);
        this.setSize(parentSize);

        window.addEventListener('resize', this.autoResize);
      }
    }, {
      key: 'changeSize',
      value: function changeSize(config, w, h) {
        this.setSize([w, h]);

        if (ChartProcess.changeSize) {
          this.chart && ChartProcess.changeSize.call(this, this.chart, config, w, h);
        } else {
          this.chart && this.chart.changeSize(w, h);
        }
      }

      // 动态适配高宽，利用 resizeRunning 做节流

    }, {
      key: 'autoResize',
      value: function autoResize() {
        var _this4 = this;

        if (this.resizeRunning) {
          cancelAnimationFrame(this.resizeTimer);
          return;
        }

        var element = this.chartDom,
            props = this.props,
            _size = this._size;

        this.resizeRunning = true;

        this.resizeTimer = (0, _common.requestAnimationFrame)(function () {
          _this4.resizeRunning = false;

          var parentSize = (0, _common.getParentSize)(element, props.width, props.height);
          if (!(parentSize[0] === _size[0] && parentSize[1] === _size[1])) {
            _this4.changeSize(props.config, parentSize[0], parentSize[1]);

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

    }, {
      key: 'setSize',
      value: function setSize(newSize) {
        var element = this.chartDom;
        this._size = newSize;

        if (newSize[0]) {
          element.style.width = newSize[0] + 'px';
        }
        if (newSize[1]) {
          element.style.height = newSize[1] + 'px';
        }
      }
    }, {
      key: 'afterRender',
      value: function afterRender(config) {
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
      }
    }, {
      key: 'render',
      value: function render() {
        var _this6 = this;

        var _props3 = this.props,
            _props3$className = _props3.className,
            className = _props3$className === undefined ? '' : _props3$className,
            style = _props3.style,
            children = _props3.children,
            data = _props3.data,
            width = _props3.width,
            height = _props3.height,
            padding = _props3.padding,
            config = _props3.config,
            otherProps = _objectWithoutProperties(_props3, ['className', 'style', 'children', 'data', 'width', 'height', 'padding', 'config']);

        return _react2.default.createElement(
          'div',
          _extends({ ref: function ref(dom) {
              return _this6.chartDom = dom;
            }, id: this.chartId, className: rootClassName + name + ' ' + className, style: style }, otherProps),
          children ? _react2.default.createElement(
            'div',
            { className: rootChildClassName },
            children
          ) : null
        );
      }
    }]);

    return AiscChart;
  }(_react2.default.Component);

  AiscChart.displayName = 'AiscChart';


  AiscChart.propTypes = {
    width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    config: _propTypes2.default.object,
    data: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.object), _propTypes2.default.object]).isRequired,
    event: _propTypes2.default.object,
    forceFit: _propTypes2.default.bool
  };

  AiscChart.defaultProps = {
    config: {}
  };

  AiscChart.isG2Chart = true;

  AiscChart.displayName = 'AiscWidgets' + name;

  //暴露原版类
  AiscChart.Chart = Chart;

  return AiscChart;
}

exports.default = g2Factory;
module.exports = exports['default'];