'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _f = require('@antv/f2');

var _f2 = _interopRequireDefault(_f);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _f2Utils = require('./f2Utils');

var _theme = require('../theme/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

_f2.default.Global.pixelRatio = window.devicePixelRatio;

var theme = {
  pixelRatio: window.devicePixelRatio,
  guide: {
    line: {
      lineWidth: 1
    }
  }
};

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
function f2Factory(name, Chart) {
  var _class, _temp;

  var ChartProcess = Chart;
  var chartName = name;
  var isPieChart = chartName === 'f2Pie';

  var AismChart = (_temp = _class = function (_React$Component) {
    _inherits(AismChart, _React$Component);

    function AismChart(props, context) {
      _classCallCheck(this, AismChart);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

      _this.hasSetColor = false;
      _this.showTooltip = true;
      _this.timeoutId = null;
      _this.touchY = 0;

      _this.changeData = function (data, config) {
        if (ChartProcess.changeData) {
          ChartProcess.changeData.call(_this, _this.chart, config, data);
        } else if (_this.chart) {
          _this.chart.changeData(data);
        }

        if (ChartProcess.afterChangeData) {
          ChartProcess.afterChangeData.call(_this, _this.canvas, _this.chart, _this.config, _this.props, _this);
        }
      };

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
            if (_this.showTooltip === true && ChartProcess.chartTouchStart) {
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
        ChartProcess.chartTouchEnd && ChartProcess.chartTouchEnd.call(_this, e, _this.chart, _this.config, _this.canvas, _this.resultData, _this.originData, _this, ChartProcess);
      };

      _this.addCanvasEvents = function () {
        if ('ontouchstart' in document.documentElement) {
          _this.canvas.addEventListener('touchstart', _this.onTouchStart);
          _this.canvas.addEventListener('touchmove', _this.onTouchMove);
          _this.canvas.addEventListener('touchend', _this.onTouchEnd);
        } else {
          var container = document.querySelector('#' + (0, _f2Utils.getContainerId)(_this.chartId));
          _this.canvas.addEventListener('mousedown', _this.onTouchStart);
          _this.canvas.addEventListener('mouseup', _this.onTouchEnd);
        }
      };

      _this.renderLegend = function (legendData, legendItems) {
        var config = _this.props.config;
        var _config$legend = config.legend,
            show = _config$legend.show,
            position = _config$legend.position,
            titleStyle = _config$legend.titleStyle,
            valueStyle = _config$legend.valueStyle,
            unCheckStyle = _config$legend.unCheckStyle;


        if (show === false) {
          return null;
        }

        _this.lastData = legendData;
        var colors = theme.colors;
        var legendContainer = document.querySelector('#' + (0, _f2Utils.getLegendId)(_this.chartId));
        var legendFormatter = _this.config.legend.formatter;
        var isInit = !legendItems;

        if (position === 'top') {
          var newData = legendData;
          var resultData = [];
          if (newData.length < _this.originData.length) {
            _this.originData.forEach(function (item, index) {
              if (!newData[index] || item.name !== newData[index].name) {
                newData.splice(index, 0, { color: _theme.color.widgetsLegendUncheck, name: item.name, value: '--' });
              } else {
                resultData.push(item);
              }
            });
          }

          var legendStr = '<div style="display: flex;WebkitUserSelect: none; flex-wrap: wrap; font-size: 12px; line-height: 1.2; box-sizing: border-box;-webkit-font-smoothing: antialiased; padding-left: 12px; padding-top: 12px;">';
          if (isPieChart) {
            legendData[0].data.forEach(function (d, i) {
              var visible = isInit || legendItems[i].visible;
              var dotColor = visible ? colors[i] : unCheckStyle.fill;
              legendStr += '\n              <div class="legend" data-close=' + (visible ? 'false' : 'true') + ' ' + (0, _f2Utils.setInlineDomStyle)({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }) + ' data-name=' + (0, _f2Utils.escapeHtml)(d[0]) + '>\n                ' + _this.getLegendCircle(dotColor) + ' ' + legendFormatter(d, titleStyle, valueStyle) + '\n              </div>';
            });
          } else {
            legendData.forEach(function (i, index) {
              var dotColor = i.color;
              if (colors.indexOf(dotColor) >= 0) {
                dotColor = colors[colors.indexOf(dotColor)];
              }
              var visible = isInit || legendItems[index].visible;
              legendStr += '\n              <div\n                style="margin-right: 30px; margin-bottom: 12px; white-space: nowrap"\n                data-close=' + (visible ? 'false' : 'true') + '\n                class="legend"\n                data-name=' + (0, _f2Utils.escapeHtml)(i.name) + '\n              >\n                <span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: transparent;border: 1px solid ' + (visible ? dotColor : unCheckStyle.fill) + '">\n                  <span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:' + (visible ? dotColor : unCheckStyle.fill) + '">\n                  </span>\n                </span>\n                ' + legendFormatter(i, titleStyle, valueStyle) + '\n              </div>';
            });
          }

          legendStr += '</div>';
          legendContainer.innerHTML = '';
          legendContainer.insertAdjacentHTML('afterbegin', legendStr);
        } else if (position === 'right') {
          // 将图例放置到右边
          var chartContainer = document.querySelector('#' + (0, _f2Utils.getContainerId)(_this.chartId));
          (0, _f2Utils.setDomStyle)(chartContainer, {
            flexDirection: 'row'
          });

          (0, _f2Utils.setDomStyle)(legendContainer, {
            order: 1,
            position: 'relative',
            marginLeft: '10px'
          });
          // 构造图例字符串
          var _legendStr = '';

          if (isPieChart) {
            legendData[0].data.forEach(function (d, i) {
              var visible = isInit || legendItems[i].visible;
              var dotColor = visible ? colors[i] : unCheckStyle.fill;
              _legendStr += '\n              <div class="legend" data-close=' + (visible ? 'false' : 'true') + ' ' + (0, _f2Utils.setInlineDomStyle)({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '6px'
              }) + ' data-name=' + (0, _f2Utils.escapeHtml)(d[0]) + '>\n                ' + _this.getLegendCircle(dotColor) + ' ' + legendFormatter(d, titleStyle, valueStyle) + '\n              </div>';
            });
          } else {
            legendData.forEach(function (d, i) {
              var visible = isInit || legendItems[i].visible;
              var dotColor = visible ? colors[i] : unCheckStyle.fill;
              _legendStr += '\n              <div class="legend" data-close=' + (visible ? 'false' : 'true') + ' ' + (0, _f2Utils.setInlineDomStyle)({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }) + ' data-name=' + (0, _f2Utils.escapeHtml)(d.name) + '>\n              ' + _this.getLegendCircle(dotColor) + ' ' + legendFormatter(d, titleStyle, valueStyle) + '\n            </div>';
            });
          }

          legendContainer.innerHTML = '';
          legendContainer.insertAdjacentHTML('afterbegin', '<div ' + (0, _f2Utils.setInlineDomStyle)({
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '15px 0 20px',
            flexGrow: 1
          }) + '>' + _legendStr + '</div>');
        }

        var legends = legendContainer.querySelectorAll('.legend');

        if (!legends || legends.length <= 1) {
          return;
        }

        var _loop = function _loop(i) {
          var legendItem = legends[i];
          var index = i;
          legendItem.addEventListener('click', function (e) {
            var legendItems = [].concat(legends).map(function (l) {
              return {
                visible: l.getAttribute('data-close') === 'false',
                name: l.getAttribute('data-name')
              };
            });
            var curVisible = e.currentTarget.getAttribute('data-close') === 'false';

            if (curVisible) {
              legendItems[i].visible = false;
            } else {
              legendItems[i].visible = true;
            }
            _this.filterData(legendItems);
          });
        };

        for (var i = 0; i < legends.length; i++) {
          _loop(i);
        }
      };

      _this.getLegendCircle = function (color) {
        return '<span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color: ' + color + ';margin-right: 6px"></span>';
      };

      _this.filterData = function (legendItems) {
        var data = _this.resultData;
        var colorIndexes = [];
        var visibleNames = legendItems.filter(function (i) {
          return i.visible;
        }).map(function (i) {
          return i.name;
        });
        _this.chart.filter(isPieChart ? 'x' : 'type', function (val) {
          return visibleNames.indexOf(val) > -1;
        });
        _this.chart.repaint();
        _this.renderLegend(_this.lastData, legendItems);
        ChartProcess.onRepaint && ChartProcess.onRepaint.call(_this, _this, ChartProcess);
      };

      _this.clearLegend = function () {
        var legendContainer = document.querySelector('#' + (0, _f2Utils.getLegendId)(_this.chartId));
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

    AismChart.prototype.componentWillMount = function componentWillMount() {
      var config = this.props.config;

      // 如果外部有传入颜色主题，则使用这个主题

      if (config.colors) {
        theme.colors = config.colors;
      }
      if (config.theme) {
        _extends(theme, config.theme);
      }

      _f2.default.Global.setTheme(theme);
    };

    AismChart.prototype.componentDidMount = function componentDidMount() {
      // 开始初始化图表
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          chartData = _props.data,
          forceFit = _props.forceFit,
          config = _props.config,
          otherProps = _objectWithoutProperties(_props, ['width', 'height', 'data', 'forceFit', 'config']);

      var padding = config.padding,
          legend = config.legend,
          xAxis = config.xAxis,
          yAxis = config.yAxis,
          configWidth = config.width;

      var initData = [];
      var colors = _f2.default.Global.colors;

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

      // tooltip、legend 都是自己实现的，将默认的关掉
      chart.tooltip(false);
      chart.legend(false);

      initData.forEach(function (i, index) {
        i.color = colors[index];
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
      var data = (0, _f2Utils.dealData)(initData, config);
      ChartProcess.init.call(this, chart, config, data, initData, this);

      this.resultData = data;
      this.originData = initData;
      this.chart = chart;
      this.config = config;
      this.addCanvasEvents();

      this.renderLegend(initData);
      ChartProcess.afterRender && ChartProcess.afterRender.call(this, this.canvas, this.chart, this.config, this.props, this, ChartProcess);
    };

    AismChart.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var newData = nextProps.data,
          newWidth = nextProps.width,
          newHeight = nextProps.height,
          newPadding = nextProps.padding,
          newConfig = nextProps.config;
      var _props2 = this.props,
          oldData = _props2.data,
          oldWidth = _props2.width,
          oldHeight = _props2.height,
          oldPadding = _props2.padding;


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

        var data = (0, _f2Utils.dealData)(newData, newConfig, isPieChart);

        this.changeData(data, newConfig);
      }

      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        if (ChartProcess.changeSize) {
          ChartProcess.changeSize.call(this, this.chart, newConfig, newWidth, newHeight);
        } else {
          this.chart && this.chart.changeSize(newWidth, newHeight);
        }
      }
    };

    AismChart.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
      return false;
    };

    AismChart.prototype.componentWillUnmount = function componentWillUnmount() {
      if (ChartProcess.destroy) {
        ChartProcess.destroy.call(this, this.chart);
      }

      this.chart && this.chart.destroy && this.chart.destroy();
      this.chart = null;
      this.chartDom = null;
      this.chartId = null;
    };

    // 构造图例的小圆点


    /**
     * @param {Array} legendItems
     */


    AismChart.prototype.render = function render() {
      var _this2 = this;

      var _props3 = this.props,
          _props3$style = _props3.style,
          style = _props3$style === undefined ? {} : _props3$style,
          width = _props3.width,
          height = _props3.height,
          config = _props3.config;

      var backgroundColor = style.backgroundColor || _theme.color.widgetsColorWhite;
      var chartStyle = {
        position: 'relative',
        'WebkitUserSelect': 'none',
        backgroundColor: backgroundColor,
        overflow: 'hidden'
      };
      var canvasStyle = {
        backgroundColor: backgroundColor
      };

      if (config.legend.position === 'right') {
        chartStyle.display = 'flex';
        chartStyle.alignItems = 'center';
      }

      if (Array.isArray(config.appendPadding)) {
        var padding = config.appendPadding.map(function (i) {
          return i + 'px';
        }).join(' ');
        chartStyle.padding = padding;
      }
      if (typeof config.appendPadding === 'number') {
        var _padding = config.appendPadding + 'px';
        chartStyle.padding = _padding;
      }

      return _react2.default.createElement(
        'div',
        { id: '' + (0, _f2Utils.getContainerId)(this.chartId), style: chartStyle },
        _react2.default.createElement('div', { id: '' + (0, _f2Utils.getLegendId)(this.chartId), style: { width: width } }),
        _react2.default.createElement('canvas', { ref: function ref(dom) {
            return _this2.canvas = dom;
          }, id: this.chartId, className: rootClassName + name, style: canvasStyle })
      );
    };

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

  function ChartHOC(props) {
    // 开始初始化图表
    var newProps = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, props) : props;

    if (props.customChart) {
      _extends(newProps, props.customChart);
    }

    return _react2.default.createElement(AismChart, newProps);
  }

  return ChartHOC;
}

f2Factory.generateUniqueId = generateUniqueId;

exports.default = f2Factory;
module.exports = exports['default'];