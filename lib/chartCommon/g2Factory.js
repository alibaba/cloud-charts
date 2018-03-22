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

var _normal = require('../theme/normal');

var _common = require('./common');

var _dataAdapter = require('./dataAdapter');

var _dataAdapter2 = _interopRequireDefault(_dataAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//全局G2主题设置
var theme = _g2.default.Util.deepMix({}, _g2.default.Global, {
  snapArray: [0, 1, 2, 2.5, 4, 5, 10],
  // 指定固定 tick 数的逼近值
  snapCountArray: [0, 1, 1.2, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10],
  // animate: false,
  // colors: {
  //   'default': COLORS
  // },
  shape: {
    line: {
      lineWidth: 2
    },
    area: {
      fillOpacity: 0.1
    },
    interval: {
      fillOpacity: 1
    }
  },
  axis: {
    bottom: {
      label: {
        offset: 18,
        autoRotate: false,
        textStyle: { fill: _normal.color.colorN22 // 底部标签文本的颜色
        } },
      line: {
        stroke: _normal.color.colorN16
      },
      tickLine: null
    },
    left: {
      label: {
        offset: 8,
        textStyle: { fill: _normal.color.colorN22 // 左部标签文本的颜色
        } },
      grid: {
        // 让grid在轴线的下方
        zIndex: -1,
        lineStyle: {
          stroke: _normal.color.colorN13,
          lineWidth: 1,
          lineDash: null
        }
      }
    },
    right: {
      label: {
        offset: 8,
        textStyle: { fill: _normal.color.colorN22 // 右部标签文本的颜色
        } }
    }
  },
  tooltip: {
    offset: 8,
    crossLine: {
      stroke: _normal.color['widgets-tooltip-cross-line']
      // lineWidth: 1,
    },
    'g2-tooltip': {
      backgroundColor: _normal.color['widgets-tooltip-background'],
      boxShadow: _normal.color['widgets-tooltip-shadow'],
      padding: _normal.size.s3,
      borderRadius: _normal.size.s1,
      fontFamily: _normal.fonts.fontFamilyBase,
      fontSize: _normal.fonts.fontSizeBaseCaption,
      lineHeight: _normal.fonts.fontSizeBaseCaption,
      color: _normal.color.colorN24,
      textAlign: 'left'
    },
    'g2-tooltip-title': {
      marginBottom: 0,
      color: _normal.color.colorN22
    },
    'g2-tooltip-list': {},
    'g2-tooltip-list-item': {
      marginBottom: 0,
      marginTop: _normal.size.s2,
      listStyle: 'none'
    },
    'g2-tooltip-marker': {
      width: '6px',
      height: '6px',
      border: 'none',
      marginRight: _normal.size.s3
    }
  },
  tooltipMarker: {
    symbol: function symbol(x, y, r, ctx, marker) {
      ctx.fillStyle = _normal.color.colorWhite;
      ctx.lineWidth = 2;
      ctx.strokeStyle = marker.get('color');
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
    },
    // 这里必须传数字，所以不能直接引用
    radius: 4
  },
  tooltipCrosshairsRect: {
    style: {
      fill: _normal.color['widgets-tooltip-cross-react'],
      opacity: _normal.color['widgets-tooltip-cross-react-opacity']
    }
  },
  tooltipCrosshairsLine: {
    style: {
      stroke: _normal.color.colorN17,
      lineWidth: 1
    }
  },
  legend: {
    top: {
      textStyle: {
        fill: _normal.color.colorN24
      },
      unCheckColor: _normal.color.colorN21
    },
    right: {
      textStyle: {
        fill: _normal.color.colorN24
      },
      unCheckColor: _normal.color.colorN21
    },
    bottom: {
      textStyle: {
        fill: _normal.color.colorN24
      },
      unCheckColor: _normal.color.colorN21
    },
    left: {
      textStyle: {
        fill: _normal.color.colorN24
      },
      unCheckColor: _normal.color.colorN21
    },
    html: {
      'g2-legend': {
        overflow: 'auto',
        fontFamily: _normal.fonts.fontFamilyBase,
        fontSize: _normal.fonts.fontSizeBaseCaption,
        lineHeight: _normal.fonts.fontSizeBaseCaption,
        color: _normal.color.colorN24
      },
      'g2-legend-list': {},
      'g2-legend-list-item': {
        wordBreak: 'break-all',
        marginBottom: _normal.size.s3,
        marginRight: _normal.size.s3
      },
      'g2-legend-marker': {
        width: '6px',
        height: '6px',
        marginRight: _normal.size.s1,
        verticalAlign: '1px'
      }
    }
  },
  guide: {
    line: {
      lineStyle: {
        stroke: _normal.color.colorB16
      },
      text: {
        autoRotate: false,
        style: {
          fill: _normal.color.colorB16,
          fontSize: _normal.fonts.fontSizeBaseCaption,
          fontFamily: _normal.fonts.fontFamilyBase
        }
      }
    },
    region: {
      style: {
        fill: _normal.color.colorB16, // 辅助框填充的颜色
        fillOpacity: 0.1 // 辅助框的背景透明度
        // 辅助框的图形样式属性
      } }
  }
});
//设置屏幕dpi缩放（如果有效的话）
if (window && window.devicePixelRatio) {
  theme.pixelRatio = window.devicePixelRatio;
}
_g2.default.Global.setTheme(theme); // 将主题设置为用户自定义的主题

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
 * @param Chart 组件原生代码组
 * @param {boolean} convertData 控制是否转化数据
 * */
function g2Factory(name, Chart) {
  var _class, _temp;

  var convertData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var ChartProcess = Chart;
  var AiscChart = (_temp = _class = function (_React$Component) {
    _inherits(AiscChart, _React$Component);

    function AiscChart(props, context) {
      _classCallCheck(this, AiscChart);

      var _this = _possibleConstructorReturn(this, (AiscChart.__proto__ || Object.getPrototypeOf(AiscChart)).call(this, props, context));

      _this.resizeRuning = false;

      _this.chart = null;
      _this.chartDom = null;
      _this.chartId = generateUniqueId();

      _this.autoResize = _this.autoResize.bind(_this);
      return _this;
    }

    // componentWillMount () {}

    _createClass(AiscChart, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.customChart) {
          ChartProcess = _extends({}, ChartProcess, this.props.customChart);
        }

        // 设置初始高宽
        this.setSize();

        // 开始初始化图表
        var props = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, this.props) : this.props;

        var _props$width = props.width,
            width = _props$width === undefined ? this._size[0] : _props$width,
            _props$height = props.height,
            height = _props$height === undefined ? this._size[1] || 200 : _props$height,
            initData = props.data,
            padding = props.padding,
            forceFit = props.forceFit,
            config = props.config,
            event = props.event,
            otherProps = _objectWithoutProperties(props, ['width', 'height', 'data', 'padding', 'forceFit', 'config', 'event']);

        var chart = new _g2.default.Chart(_extends({
          container: this.chartDom,
          width: width,
          height: height,
          padding: padding,
          forceFit: forceFit || false
        }, otherProps));
        var data = convertData ? config.dataType === 'g2' ? initData : (0, _dataAdapter2.default)(initData, config) : initData;
        if (config.xAxis && config.xAxis.type === 'datetime') {
          console.warn('配置属性 "config.xAxis.type": "datetime" 在 widgets 2.x 中已被废弃，请使用 "config.xAxis.type": "time"。详情请看：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/137。');
        }
        this.rawData = initData;
        chart && ChartProcess.init.call(this, chart, config, data, initData);

        if (chart && event) {
          Object.keys(event).forEach(function (name) {
            chart.on(name, event[name]);
          });
        }

        this.chart = chart;
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var newData = nextProps.data,
            newWidth = nextProps.width,
            newHeight = nextProps.height,
            newPadding = nextProps.padding,
            newConfig = nextProps.config;
        var _props = this.props,
            oldData = _props.data,
            oldWidth = _props.width,
            oldHeight = _props.height,
            oldPadding = _props.padding;


        if (newPadding !== oldPadding) {
          console.warn('padding 不支持修改');
        }

        if (newData !== oldData || newData.length !== oldData.length) {
          var data = convertData ? newConfig.dataType === 'g2' ? newData : (0, _dataAdapter2.default)(newData, newConfig) : newData;
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

      // componentWillUpdate (nextProps) {}

    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
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
    }, {
      key: 'setSize',
      value: function setSize() {
        var element = this.chartDom;
        var size = (0, _common.getParentSize)(element, this.props.width, this.props.height);
        this._size = size;

        if (size[0]) {
          element.style.width = size[0] + 'px';
        }
        if (size[1]) {
          element.style.height = size[1] + 'px';
        }

        window.addEventListener('resize', this.autoResize);
      }
    }, {
      key: 'autoResize',
      value: function autoResize() {
        var _this2 = this;

        if (this.resizeRuning) {
          return;
        }

        var element = this.chartDom,
            props = this.props,
            _size = this._size;

        this.resizeRuning = true;

        (0, _common.requestAnimationFrame)(function () {
          _this2.resizeRuning = false;

          var size = (0, _common.getParentSize)(element, props.width, props.height);
          if (!(size[0] === _size[0] && size[1] === _size[1])) {
            if (size[0]) {
              element.style.width = size[0] + 'px';
            }
            if (size[1]) {
              element.style.height = size[1] + 'px';
            }
            _this2._size = size;
            if (ChartProcess.changeSize) {
              _this2.chart && ChartProcess.changeSize.call(_this2, _this2.chart, props.config, size[0], size[1]);
            } else {
              _this2.chart && _this2.chart.changeSize(size[0], size[1]);
            }
          }
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

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
              return _this3.chartDom = dom;
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
  }(_react2.default.Component), _class.propTypes = {
    width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    config: _propTypes2.default.object,
    data: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.object), _propTypes2.default.object]).isRequired,
    event: _propTypes2.default.object,
    forceFit: _propTypes2.default.bool
  }, _class.defaultProps = {
    //forceFit: false,
    config: {}
  }, _class.isG2Chart = true, _temp);

  //暴露原版类

  AiscChart.displayName = 'AiscChart';
  AiscChart.Chart = Chart;

  AiscChart.displayName = 'AiscWidgets' + name;

  return AiscChart;
}

exports.default = g2Factory;
module.exports = exports['default'];