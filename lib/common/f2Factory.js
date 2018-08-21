'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _f = require('@antv/f2');

var _f2 = _interopRequireDefault(_f);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
// import { View, Theme, Client, Unit } from '@alife/aism';


// const { bp } = Unit;

var View = function View(props) {
  var defaultStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    borderWidth: 0,
    borderStyle: 'solid',
    margin: 0,
    padding: 0,
    position: 'relative',
    zIndex: 0,
    minHeight: 0,
    minWidth: 0
  };

  var style = props.style,
      extra = _objectWithoutProperties(props, ['style']);

  var s = _extends({}, defaultStyle, style);

  return _react2.default.createElement(
    'div',
    _extends({ style: s }, extra),
    props.children
  );
};

var Client = {
  width: window.innerWidth,
  height: window.innerHeight
};

var Theme = {
  colors: {
    GrayLightest: '#F7F9FB',
    Font9: '#999',
    Font3: '#333',
    GrayLine: '#E5E7E9'
  },
  line: {
    widthDefault: 0.5
  }
};
var bp = 1;

_f2.default.Global.pixelRatio = window.devicePixelRatio;

var colorMap = ['#2196F3', '#26C6DA', '#9CCC65', '#F9A825', '#AB47BC', '#3067C1'];
var areaColorMap = ['#D3EAFD', '#D4F4F8', '#EBF5E0', '#FEEED3', '#EEDAF2', '#D6E1F3'];
var theme = {
  colors: colorMap,
  pixelRatio: window.devicePixelRatio,
  guide: {
    line: {
      lineWidth: 1
    }
  }
};

_f2.default.Global.setTheme(theme);
var uniqueId = 0;
function generateUniqueId() {
  return 'react-f2-' + uniqueId++;
}

var rootClassName = 'aism-widgets ';

var events = ['MouseOver', 'Selection', 'Click'];

var requestAnimationFrame = window && window.requestAnimationFrame || function () {};

/*
* g2Factory 函数
*
* 将非React版的图表类转化为React版
*
* convertData 控制是否转化数据
* */
function g2Factory(name, Chart) {
  var _class, _temp;

  var ChartProcess = Chart;
  var AismChart = (_temp = _class = function (_React$Component) {
    _inherits(AismChart, _React$Component);

    function AismChart(props, context) {
      _classCallCheck(this, AismChart);

      var _this = _possibleConstructorReturn(this, (AismChart.__proto__ || Object.getPrototypeOf(AismChart)).call(this, props, context));

      _this.hasSetColor = false;
      _this.showTooltip = true;
      _this.timeoutId = null;
      _this.touchY = 0;

      _this.onTouchStart = function (e) {
        _this.inTouch = true;
        _this.originCanvas = _this.canvas.toDataURL();
        var tooltip = _this.config.tooltip;

        if (e.touches) {
          _this.touchY = e.touches[0].clientY;
        } else {
          _this.touchY = e.clientY;
        }
        _this.showTooltip = true;
        if (!tooltip || tooltip && tooltip.show === false) {
          return;
        } else {
          _this.timeoutId = setTimeout(function () {
            if (_this.showTooltip === true) {
              ChartProcess.chartTouchStart.call(_this, e, _this.chart, _this.config, _this.canvas, _this.resultData, _this.originData, _this, ChartProcess);
            }
          }, 150);
        }
      };

      _this.onTouchMove = function (e) {
        var touchMoveY = void 0;
        if (e.touches) {
          touchMoveY = e.touches[0].clientY;
        } else {
          touchMoveY = e.clientY;
        }

        if (Math.abs(touchMoveY - _this.touchY) > 20) {
          _this.showTooltip = false;
        }

        ChartProcess.chartTouchMove && ChartProcess.chartTouchMove.call(_this, e, _this.chart, _this.config, _this.canvas, _this.resultData, _this.originData, _this, ChartProcess);
      };

      _this.onTouchEnd = function (e) {
        _this.inTouch = false;
        _this.showTooltip = false;
        clearTimeout(_this.timeoutId);
        ChartProcess.chartTouchEnd.call(_this, e, _this.chart, _this.config, _this.canvas, _this.resultData, _this.originData, _this, ChartProcess);
      };

      _this.addCanvasEvents = function () {
        if ('ontouchstart' in document.documentElement) {
          _this.canvas.addEventListener('touchstart', _this.onTouchStart);
          _this.canvas.addEventListener('touchmove', _this.onTouchMove);
          _this.canvas.addEventListener('touchend', _this.onTouchEnd);
        } else {
          var container = document.querySelector('#aismcontainer-' + _this.chartId);
          _this.canvas.addEventListener('mousedown', _this.onTouchStart);
          // this.canvas.addEventListener('mousemove', this.onTouchMove);
          _this.canvas.addEventListener('mouseup', _this.onTouchEnd);
          // this.canvas.addEventListener('mouseleave', this.onTouchEnd);
        }
      };

      _this.renderLegend = function () {
        var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'top';
        var legendData = arguments[1];
        var filterName = arguments[2];

        _this.lastData = legendData;
        if (dir === 'top') {
          var newData = legendData;
          var resultData = [];
          if (newData.length < _this.originData.length) {
            _this.originData.forEach(function (item, index) {
              if (!newData[index] || item.name !== newData[index].name) {
                newData.splice(index, 0, { color: '#E9EDF0', name: item.name, value: '--' });
              } else {
                resultData.push(item);
              }
            });
          }

          var legendContainer = document.querySelector('#aismlegend' + _this.chartId);
          var lengendStr = '<div style="display: flex;-webkit-user-select: none; flex-wrap: wrap; font-size: 12px; line-height: 1.2; box-sizing: border-box;-webkit-font-smoothing: antialiased; padding-left: 12px;">';

          legendData.forEach(function (i) {
            var color = i.color;
            if (areaColorMap.indexOf(color) >= 0) {
              color = colorMap[areaColorMap.indexOf(color)];
            }
            lengendStr += '<div style="margin-right: 30px; margin-bottom: 12px; white-space: nowrap" data-close=' + (filterName === i.name ? 'true' : 'false') + ' class="legend"><span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: #fff;border: 1px solid ' + (filterName === i.name ? '#E9EDF0' : color) + '"><span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:' + (filterName === i.name ? '#E9EDF0' : filterName === i.name ? '#E9EDF0' : color) + '"></span></span><span class="name" style="color: ' + Theme.colors.Font9 + '; margin-right: 6px;">' + i.name + '</span><span class="value" style="color: ' + Theme.colors.Font3 + '">' + (i.value !== null ? i.value : '') + '</span></div>';
          });
          lengendStr += '</div>';
          legendContainer.innerHTML = '';
          legendContainer.insertAdjacentHTML('afterbegin', lengendStr);
        } else if (dir === 'right') {
          var _setInlineDomStyle;

          //将图例放置到右边
          var chartContainer = document.querySelector('#aismcontainer-' + _this.chartId);
          (0, _utils.setDomStyle)(chartContainer, {
            flexDirection: 'row'
          });
          //调整图表的位置
          var chart = _this.canvas;
          (0, _utils.setDomStyle)(chart, {
            marginLeft: 20 * bp + 'px'
          });
          //图例容器
          var _legendContainer = document.querySelector('#aismlegend' + _this.chartId);
          (0, _utils.setDomStyle)(_legendContainer, {
            order: 1,
            position: 'relative',
            marginLeft: 10 * bp + 'px'
          });
          //构造图例字符串
          var legendStr = '';
          //获取图的颜色
          var colors = _this.props.config.colors;
          var legendFormatter = _this.config.legend.formatter || _this.defaultLegendFormatter;
          legendData[0].data.forEach(function (d, i) {
            legendStr += '<div ' + (0, _utils.setInlineDomStyle)({
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }) + '>' + _this.getLegendCircle(colors[i]) + ' ' + legendFormatter(d) + '</div>';
          });
          _legendContainer.insertAdjacentHTML('afterbegin', '<div ' + (0, _utils.setInlineDomStyle)((_setInlineDomStyle = {
            height: '100%',
            display: 'flex'
          }, _defineProperty(_setInlineDomStyle, 'display', '-webkit-flex'), _defineProperty(_setInlineDomStyle, '-webkit-flex-direction', 'column'), _defineProperty(_setInlineDomStyle, 'flexDirection', 'column'), _defineProperty(_setInlineDomStyle, '-webkit-justify-content', 'space-around'), _defineProperty(_setInlineDomStyle, 'justifyContent', 'space-around'), _defineProperty(_setInlineDomStyle, 'padding', '15px 0 20px'), _defineProperty(_setInlineDomStyle, '-webkit-flex-grow', 1), _defineProperty(_setInlineDomStyle, 'flexGrow', 1), _setInlineDomStyle)) + '>' + legendStr + '</div>');
        }

        var legends = document.querySelector('#aismlegend' + _this.chartId).querySelectorAll('.legend');
        if (!legends || legends.length <= 1) {
          return;
        }

        var _loop = function _loop(i) {
          var legendItem = legends[i];
          var index = i;
          legendItem.addEventListener('click', function (e) {
            var name = e.currentTarget.querySelector('.name').innerHTML;
            if (e.currentTarget.getAttribute('data-close') === 'true') {
              _this.showAllData();
            } else {
              _this.filterData(name, index);
            }
          });
        };

        for (var i = 0; i < legends.length; i++) {
          _loop(i);
        }
      };

      _this.defaultLegendFormatter = function (d) {
        return d[0] + ' ' + d[1] * 100 + ' %';
      };

      _this.getLegendCircle = function (color) {
        var circle = '<span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:' + color + '"></span>';

        return circle;
      };

      _this.showAllData = function () {
        _this.chart && _this.chart.changeData(_this.resultData);
        _this.renderLegend('top', _this.lastData);
      };

      _this.filterData = function (name, index) {
        var data = _this.resultData;
        var resultData1 = [];

        data.forEach(function (item) {
          if (item.type !== name) {
            resultData1.push({
              x: item.x,
              y: -1,
              type: item.type
            });
          } else {
            resultData1.push(name);
          }
        });

        var resultData = data.filter(function (item) {
          return item.type !== name;
        });

        var colorMap = ['#2196F3', '#26C6DA', '#9CCC65', '#F9A825', '#AB47BC', '#3067C1'];
        colorMap.splice(index, 1);
        _f2.default.Global.colors = colorMap;
        _this.chart && _this.chart.changeData(resultData);
        // ChartProcess.filter.call(this);
        _this.renderLegend('top', _this.lastData, name);
      };

      _this.clickLegend = function (i) {};

      _this.clearLegend = function () {
        var legendContainer = document.querySelector('#aismlegend' + _this.chartId);
        var values = legendContainer.querySelectorAll('.value');
        values.forEach(function (i) {
          i.innerHTML = '';
        });
      };

      _this.chart = null;
      _this.chartDom = null;
      _this.chartId = generateUniqueId();
      return _this;
    }

    // componentWillMount () {}

    _createClass(AismChart, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.customChart) {
          ChartProcess = _extends({}, ChartProcess, this.props.customChart);
        }

        // 开始初始化图表
        var props = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, this.props) : this.props;
        // 如果外部有传入颜色主题，则使用这个主题
        if (props.config.colors) {
          _f2.default.Global.colors = props.config.colors;
        }
        _f2.default.Global.pixelRatio = 2;

        var width = props.width,
            height = props.height,
            chartData = props.data,
            forceFit = props.forceFit,
            config = props.config,
            otherProps = _objectWithoutProperties(props, ['width', 'height', 'data', 'forceFit', 'config']);

        var padding = config.padding,
            legend = config.legend,
            xAxis = config.xAxis,
            yAxis = config.yAxis,
            configWidth = config.width;

        var initData = [];
        chartData.forEach(function (item) {
          var curObj = {
            name: item.name,
            data: []
          };
          item.data.forEach(function (dataItem) {
            curObj.data.push(dataItem.concat([]));
          });

          initData.push(curObj);
        });
        var chart = new _f2.default.Chart(_extends({
          id: this.chartId,
          width: width || configWidth,
          height: height,
          padding: padding,
          forceFit: width === undefined || forceFit
        }, otherProps));

        initData.forEach(function (i) {
          i.data.forEach(function (dataItem) {
            if (xAxis.labelFormatter) {
              dataItem[0] = xAxis.labelFormatter(dataItem[0]);
            } else {
              dataItem[0] = '' + dataItem[0];
            }
            if (yAxis.labelFormatter) {
              dataItem[1] = yAxis.labelFormatter(dataItem[1]);
            }
          });
        });
        //把数据处理为g2可以识别的格式
        var data = (0, _utils.dealData)(initData, config);
        ChartProcess.init.call(this, chart, config, data, initData, this);
        initData.forEach(function (i, index) {
          i.color = colorMap[index];
        });

        this.initData = initData;
        this.resultData = data;
        this.originData = initData;
        this.chart = chart;
        this.config = config;
        this.addCanvasEvents();

        if (!legend || legend && legend.show !== false) {
          if (!legend) {
            this.renderLegend('top', initData);
          } else {
            this.renderLegend(legend.dir, initData);
          }
        }
        ChartProcess.afterRender && ChartProcess.afterRender.call(this, this.canvas, this.chart, this.config, this.props, this);
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
          var _newConfig$xAxis = newConfig.xAxis,
              xAxis = _newConfig$xAxis === undefined ? {} : _newConfig$xAxis,
              _newConfig$yAxis = newConfig.yAxis,
              yAxis = _newConfig$yAxis === undefined ? {} : _newConfig$yAxis;

          newData.forEach(function (i) {
            i.data.forEach(function (dataItem) {
              if (xAxis.labelFormatter) {
                dataItem[0] = xAxis.labelFormatter(dataItem[0]);
              } else {
                dataItem[0] = '' + dataItem[0];
              }
              if (yAxis.labelFormatter) {
                dataItem[1] = yAxis.labelFormatter(dataItem[1]);
              }
            });
          });

          var data = (0, _utils.dealData)(newData, newConfig);

          if (ChartProcess.changeData) {
            ChartProcess.changeData.call(this, this.chart, newConfig, data);
          } else {
            this.chart && this.chart.changeData(data);
          }

          if (ChartProcess.afterChangeData) {
            ChartProcess.afterChangeData.call(this, this.canvas, this.chart, this.config, this.props, this);
          }
        }

        if (newWidth !== oldWidth || newHeight !== oldHeight) {
          if (ChartProcess.changeSize) {
            ChartProcess.changeSize.call(this, this.chart, newConfig, newWidth, newHeight);
          } else {
            this.chart && this.chart.changeSize(newWidth, newHeight);
          }
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return false;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (ChartProcess.destroy) {
          ChartProcess.destroy.call(this, this.chart);
        }

        this.chart && this.chart.destroy && this.chart.destroy();
        this.chart = null;
        this.chartDom = null;
        this.chartId = null;
      }

      //默认的图例Formatter


      //构造图例的小圆点

    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props2 = this.props,
            _props2$style = _props2.style,
            style = _props2$style === undefined ? {} : _props2$style,
            width = _props2.width,
            height = _props2.height;

        var chartStyle = {
          position: 'relative',
          '-webkit-user-select': 'none',
          backgroundColor: style.backgroundColor || '#fff',
          overflow: 'hidden'
        };

        return _react2.default.createElement(
          View,
          { id: 'aismcontainer-' + this.chartId, style: chartStyle },
          _react2.default.createElement(View, { id: 'aismlegend' + this.chartId, style: { width: width } }),
          _react2.default.createElement('canvas', { ref: function ref(dom) {
              return _this2.canvas = dom;
            }, id: this.chartId, className: rootClassName + name })
        );
      }
    }]);

    return AismChart;
  }(_react2.default.Component), _class.propTypes = {
    width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    config: _propTypes2.default.object,
    data: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.object), _propTypes2.default.object]).isRequired,
    plotCfg: _propTypes2.default.object,
    forceFit: _propTypes2.default.bool
  }, _class.defaultProps = {
    forceFit: false,
    plotCfg: {},
    config: {}
  }, _class.displayName = 'AismWidgets' + name, _temp);

  //暴露原版类

  AismChart.displayName = 'AismChart';
  AismChart.Chart = Chart;

  return AismChart;
}

g2Factory.generateUniqueId = generateUniqueId;

exports.default = g2Factory;
module.exports = exports['default'];