'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _base = require('../chartCommon/base');

var _base2 = _interopRequireDefault(_base);

var _colors = require('../chartCommon/colors');

var _colors2 = _interopRequireDefault(_colors);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

require('./index.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //暂时使用highcharts


_highcharts2.default.setOptions({
  global: { useUTC: false }, //不使用HC内置时区设置
  lang: { resetZoom: '重置缩放' //修改zoom文案
  } });
var dateFormat = _highcharts2.default.dateFormat;

var Line = function (_Base) {
  _inherits(Line, _Base);

  function Line(selector, options) {
    _classCallCheck(this, Line);

    var _this = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, selector, options));

    var defaultOptions = {
      legend: true,
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      zoom: false,
      clickable: false,
      // type: 'line',
      spline: false,
      area: false,
      grid: false,
      symbol: false,
      stack: false,
      //以上不支持热更新
      colors: _colors2.default,
      padding: [0, 0, 0, 0],
      xAxis: {
        type: 'linear', //默认为线性
        dateFormatter: '%m-%d', //上述type为datetime时，此字段生效
        labelFormatter: null, //可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上X值的格式
        categories: null,
        max: null,
        min: null,
        lineWidth: 1
      },
      yAxis: {
        labelFormatter: null, //可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上Y值的格式
        max: null,
        min: null,
        bgArea: [],
        lineWidth: 0
      }
    };
    _this.options = (0, _merge2.default)({}, defaultOptions, _this.options);
    _this.init();
    return _this;
  }

  _createClass(Line, [{
    key: 'init',
    value: function init() {
      var dom = '';
      if (this.options.legend) {
        dom = '\n        <div class="p2c-legend"></div>\n        <div class="p2c-box"></div>\n      ';
      } else {
        dom = '<div class="p2c-box"></div>';
      }
      this.element.classList.add('p2c');
      this.element.classList.add('p2c-line');
      this.element.innerHTML = dom;

      //触发一次渲染
      this.render();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Line.prototype.__proto__ || Object.getPrototypeOf(Line.prototype), 'destroy', this).call(this);
      this.chart.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // let titleNode = this.element.querySelector('.p2c-title');
      var boxNode = this.element.querySelector('.p2c-box');
      var legendNode = this.element.querySelector('.p2c-legend');

      //位置计算
      // this.element.style.padding = this.options.padding + 'px';
      boxNode.style.top = this.options.padding[0] + (legendNode ? 30 : 0) + 'px'; //此处没有计算margin，默认为30
      boxNode.style.left = this.options.padding[3] + 'px';
      boxNode.style.right = this.options.padding[1] + 'px';
      boxNode.style.bottom = this.options.padding[2] + 'px';
      //boxNode.style.bottom = this.options.padding + (legendNode ? legendNode.offsetHeight : 0 ) + 20 + 'px'; //此处没有计算margin,默认为20
      //legendNode.style.bottom = this.options.padding + 'px';
      if (legendNode) {
        legendNode.style.top = this.options.padding[0] + 'px';
        if (this.options.legend.align === 'right') {
          legendNode.style.right = this.options.padding[1] + 'px';
        } else {
          legendNode.style.left = this.options.padding[3] + 'px';
        }
      }

      //标题
      // if(titleNode){
      //   titleNode.querySelector('h4').innerHTML = this.options.title;
      //   titleNode.querySelector('h5').innerHTML = this.options.subTitle;
      // }

      //图表
      if (this.data.length) {
        var options = getHCOptions(this.options, this.data);
        //加入事件触发
        var self = this;
        options.plotOptions.series.point.events.mouseOver = function () {
          self.fire('mouseover', { target: self, point: { x: this.x, y: this.y } });
        };
        options.plotOptions.series.point.events.mouseOut = function () {
          self.fire('mouseover', { target: self });
        };
        options.plotOptions.series.point.events.click = function () {
          if (!self.options.clickable) return;
          // self._tooltip.refresh([this]);
          self.fire('click', { target: self, point: { x: this.x, y: this.y }, name: this.series.name }); //抛出外部处理
        };
        options.chart.events.selection = function (event) {
          var e = { target: self };
          if (event.xAxis) e.selection = { min: event.xAxis[0].min, max: event.xAxis[0].max };
          self.fire('selection', e);
          if (self._tooltip) self._tooltip.hide();
        };
        options.xAxis.events.setExtremes = function (event) {
          if (event.min === null && event.max === null) {
            if (self.chart.resetZoomButton) self.chart.resetZoomButton.hide();
          } else {
            if (!self.chart.resetZoomButton) self.chart.showResetZoom();else self.chart.resetZoomButton.show();
          }
        };

        var lineType = 'line';
        if (this.options.area) {
          lineType = 'area';
        }
        if (this.options.spline) {
          lineType = 'spline';
        }
        if (this.options.area && this.options.spline) {
          lineType = 'areaspline';
        }

        if (!this.chart) {
          this.data.forEach(function (item, index) {
            options.series.push({
              type: lineType,
              data: item.data,
              color: _this2.options.colors[index],
              lineColor: _this2.options.colors[index],
              name: item.name,
              yAxis: item.yAxis || 0
            });
          });
          this.chart = _highcharts2.default.chart(boxNode, options);

          //加入事件绑定，初始化时全局绑定
          this.on('hover', this.hoverHandler);
          this.on('select', this.selectHandler);
          this.on('clickpoint', this.clickpointHandler);
          this.on('visible', this.visibleHandler);

          //首次初始化一个自定义的Tooltip
          if (!this._tooltip) this._tooltip = new _highcharts2.default.Tooltip(this.chart, options.tooltip);
        } else {
          this.data.forEach(function (item, index) {
            if (_this2.chart.series[index]) {
              _this2.chart.series[index].setData(item.data, false);
              _this2.chart.series[index].color = _this2.options.colors[index];
              _this2.chart.series[index].lineColor = _this2.options.colors[index];
              _this2.chart.series[index].name = item.name;
              _this2.chart.series[index].yAxis = item.yAxis || 0;
            } else {
              _this2.chart.addSeries({
                type: lineType,
                data: item.data,
                color: _this2.options.colors[index],
                lineColor: _this2.options.colors[index],
                name: item.name,
                yAxis: item.yAxis || 0
              });
            }
          });
          //倒序循环remove
          for (var i = this.chart.series.length - 1; i > 0; i--) {
            if (!this.data[i]) {
              this.chart.series[i].remove(false);
            }
          }

          //更新轴信息
          if (this.chart.xAxis[0]) this.chart.xAxis[0].update(options.xAxis, false);
          if (Array.isArray(options.yAxis)) {
            options.yAxis.forEach(function (y, index) {
              if (_this2.chart.yAxis[index]) {
                _this2.chart.yAxis[index].update(y, false);
              } else {
                _this2.chart.addAxis(getYAxis(y, index));
              }
            });
            for (var _i = this.chart.yAxis.length - 1; _i > 0; _i--) {
              if (!options.yAxis[_i]) {
                this.chart.yAxis[_i].remove(false);
              }
            }
          } else {
            if (this.chart.yAxis[0]) this.chart.yAxis[0].update(options.yAxis, false);
          }

          this.chart.redraw(false);
        }
      }

      //图例 TODO性能优化
      if (this.data.length) {
        if (legendNode) {
          legendNode.innerHTML = getLegend(legendNode, this.options, this.data);
          Array.prototype.forEach.call(legendNode.querySelectorAll('li'), function (item) {
            item.addEventListener('click', function (e) {
              var node = getLegendNode(e.target);
              if (isLastVisbleLegendNode(legendNode) && !node.classList.contains('p2c-legend-hidden')) return;
              var id = node.getAttribute('data-id');
              if (node.classList.toggle('p2c-legend-hidden')) {
                if (_this2.chart.series[id]) _this2.chart.series[id].setVisible(false, false);
              } else {
                if (_this2.chart.series[id]) _this2.chart.series[id].setVisible(true, false);
              }
              _this2.chart.redraw(false);
            });
          });
        }
      }

      //检查图表容器是否变化，是否需要调整大小
      if (this._size) {
        if (this._size[0] !== boxNode.offsetWidth || this._size[1] !== boxNode.offsetHeight) this.chart && this.chart.reflow();
      }
      this._size = [boxNode.offsetWidth, boxNode.offsetHeight]; //记录本次尺寸
    }
  }, {
    key: 'hoverHandler',
    value: function hoverHandler(e) {
      var _this3 = this;

      if (e.target === this) return; //防止循环触发
      var x = e.xAxis;
      if (!x && e.point) x = e.point.x;
      if (x) {
        var arr = [];
        this.chart.series.forEach(function (item) {
          item.data.forEach(function (data) {
            if (data.x === x) {
              arr.push(data);
              _this3.chart.xAxis[0] && _this3.chart.xAxis[0].drawCrosshair(false, data);
            }
          });
        });
        if (this.chart.tooltip && arr[0]) this.chart.tooltip.refresh(arr);else this._tooltip && this._tooltip.hide();
      } else {
        this.chart.xAxis[0] && this.chart.xAxis[0].hideCrosshair();
        this.chart.tooltip && this.chart.tooltip.hide();
      }
    }
  }, {
    key: 'clickpointHandler',
    value: function clickpointHandler(e) {
      if (e.point) {
        var arr = [];
        this.chart.series.forEach(function (item) {
          item.data.forEach(function (data) {
            if (data.x === e.point.x && data.y === e.point.y) {
              arr.push(data);
              data.select();
            }
          });
        });
        if (this._tooltip && arr[0]) this._tooltip.refresh(arr);else this._tooltip && this._tooltip.hide();
      } else {
        this._tooltip && this._tooltip.hide();
      }
    }
  }, {
    key: 'selectHandler',
    value: function selectHandler(e) {
      if (e.target === this) return; //防止循环触发
      if (!this.options.zoom) return; //不可选区的图表排除
      if (this.chart.xAxis || this.chart.xAxis[0]) {
        if (e.selection) {
          this.chart.xAxis[0].setExtremes(e.selection.min, e.selection.max);
          //if(!this.chart.resetZoomButton) this.chart.showResetZoom();
          //else this.chart.resetZoomButton.show();
        } else {
          this.chart.xAxis[0].setExtremes(null, null);
          //if(this.chart.resetZoomButton) this.chart.resetZoomButton.hide();
        }
      }
    }
  }, {
    key: 'visibleHandler',
    value: function visibleHandler(e) {
      var _this4 = this;

      if (e.target === this) return; //防止循环触发
      if (this.options.legend) return; //无图例模式下可用
      var series = e.series;
      if (!series) return;
      series.forEach(function (s, i) {
        if (s) {
          if (_this4.chart.series[i]) _this4.chart.series[i].setVisible(true, false);
        } else {
          if (_this4.chart.series[i]) _this4.chart.series[i].setVisible(false, false);
        }
      });
      this.chart.redraw(false);
    }
  }]);

  return Line;
}(_base2.default);

function getLegend(node, options, data) {
  var ret = [];
  var legends = node.querySelectorAll('li');
  data.forEach(function (item, i) {
    var style = item.data && item.data.length ? '' : 'display:none;';
    var clsName = legends[i] && legends[i].classList.contains('p2c-legend-hidden') ? 'p2c-legend-hidden' : '';
    var name = item.name && !item.name.match(/data\d+/) ? item.name : '线' + (i + 1);
    ret.push('<li data-id="' + i + '" style="' + style + '" class="' + clsName + '"><i style="background-color:' + options.colors[i] + '"></i><span>' + name + '</span></li>');
  });
  return '<ul>' + ret.join('') + '</ul>';
}

function getLegendNode(target) {
  if (target.tagName === 'LI') return target;else return target.parentNode;
}

function isLastVisbleLegendNode(node) {
  var legends = node.querySelectorAll('li');
  var hideLegends = node.querySelectorAll('li.p2c-legend-hidden');
  return legends.length - hideLegends.length <= 1;
}

//highcharts 配置
function getHCOptions(options, data) {
  function xFormat(value) {
    //自定义处理逻辑优先
    if (options.xAxis.labelFormatter) return options.xAxis.labelFormatter(value, dateFormat);
    //默认处理逻辑
    if (options.xAxis.type === 'datetime') {
      return dateFormat(options.xAxis.dateFormatter, value);
    } else {
      return value;
    }
  }
  function thFormat(value) {
    //自定义处理逻辑优先
    if (options.tooltip.titleFormatter) return options.tooltip.titleFormatter(value, dateFormat);
    return xFormat(value);
  }
  function tNameFormat(value) {
    //自定义处理逻辑优先
    if (options.tooltip.nameFormatter) return options.tooltip.nameFormatter(value, dateFormat);
    return value;
  }
  function tValueFormat(value) {
    //自定义处理逻辑优先
    if (options.tooltip.valueFormatter) return options.tooltip.valueFormatter(value, dateFormat);
    return value;
  }

  var config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      marginTop: 10,
      // marginRight: 15,
      spacing: [0, 0, 0, 0],
      backgroundColor: false,
      zoomType: options.zoom ? 'x' : false,
      events: {}
    },
    credits: false,
    exporting: false,
    title: false,
    tooltip: {
      enabled: !!options.tooltip,
      shared: true,
      crosshairs: {
        color: '#dddddd',
        width: !!options.tooltip ? 1 : 0
      },
      formatter: function formatter() {
        var p = this.points;
        var ret = '<h5>' + thFormat(p[0].key) + '</h5>';
        ret += '<ul>';
        p.forEach(function (item, i) {
          ret += '<li><i style="background:' + item.series.color + '"></i>' + tNameFormat(item.series.name) + ' ' + tValueFormat(item.y, i) + '</li>';
        });
        ret += '</ul>';
        return ret;
      },
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255, 255, 0)',
      shadow: false
    },
    legend: false,
    xAxis: {
      title: {
        enabled: false
      },
      // crosshairs: {
      //   color: '#dddddd',
      //   width: 1//
      // },
      lineWidth: options.xAxis.lineWidth,
      type: options.xAxis.type, //此处依赖options设置
      gridLineWidth: options.grid ? 1 : 0,
      gridLineColor: '#F2F3F7',
      tickPixelInterval: 70,
      lineColor: '#DCDEE3',
      tickLength: 0,
      labels: {
        y: 22,
        formatter: function formatter() {
          return xFormat(this.value);
        },
        style: { 'fontFamily': '"Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Microsoft Yahei"', 'fontSize': '12px', 'color': '#989898' }
      },
      minPadding: 0,
      categories: options.xAxis.categories,
      //endOnTick: true,
      //startOnTick: false,
      allowDecimals: true,
      max: options.xAxis.max,
      min: options.xAxis.min,
      events: {}
    },
    plotOptions: {
      line: {
        //animation: false,
        //stacking: 'normal',
        lineWidth: 2,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: options.symbol ? 2 : 0,
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: null,
              lineColor: null,
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      spline: {
        lineWidth: 2,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 0.1, //不能设置为0，否则select状态会有问题
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 5,
              fillColor: null,
              lineColor: null,
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      area: {
        //animation: false,
        //stacking: 'normal',
        lineWidth: 2,
        fillOpacity: 0.1,
        stacking: options.stack ? 'normal' : null,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: options.symbol ? 2 : 0,
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: null,
              lineColor: null,
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      areaspline: {
        lineWidth: 2,
        fillOpacity: 0.1,
        stacking: options.stack ? 'normal' : null,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: options.symbol ? 2 : 0,
          lineColor: null,
          states: {
            hover: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: 'rgba(255,255,255,1)',
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable || options.tooltip
            },
            select: {
              lineWidthPlus: 0,
              radiusPlus: 0,
              fillColor: null,
              lineColor: null,
              lineWidth: 3,
              radius: 4,
              enabled: options.clickable
            }
          }
        },
        states: {
          hover: {
            lineWidthPlus: 0,
            halo: {
              size: 0
            }
          }
        }
      },
      series: {
        cursor: options.clickable ? 'pointer' : null,
        allowPointSelect: options.clickable,
        point: {
          events: {}
        }
      }
    },
    series: []
  };

  // let ttFormat = null;

  if (Array.isArray(options.yAxis)) {
    config.yAxis = options.yAxis.map(getYAxis);
  } else {
    config.yAxis = getYAxis(options.yAxis);
  }

  return config;
}

function getYAxis(yAxis, index) {
  function yFormat(value) {
    //自定义处理逻辑优先
    if (yAxis.labelFormatter) return yAxis.labelFormatter(value, dateFormat);
    return value;
  }

  return {
    title: {
      enabled: false
    },
    lineWidth: index === undefined ? yAxis.lineWidth : yAxis.lineWidth || 1,
    lineColor: '#DCDEE3',
    gridLineWidth: 1,
    gridLineColor: '#F2F3F7',
    tickPixelInterval: 40,
    opposite: !!index,
    labels: {
      x: index ? 8 : -8,
      formatter: function formatter() {
        return yFormat(this.value);
      },
      style: { 'fontFamily': '"Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Microsoft Yahei"', 'fontSize': '12px', 'color': '#989898' }
    },
    max: yAxis.max,
    min: yAxis.min,
    plotBands: yAxis.bgArea && yAxis.bgArea.length === 2 ? {
      from: yAxis.bgArea[0],
      to: yAxis.bgArea[1],
      color: 'rgba(5,128,242,0.1)'
    } : null
  };
}

function getYAxisColor() {}

exports.default = Line;
module.exports = exports['default'];