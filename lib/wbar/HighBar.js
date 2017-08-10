'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _highBase = require('../chartCommon/highBase');

var _highBase2 = _interopRequireDefault(_highBase);

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


_highcharts2.default.setOptions({ global: { useUTC: false } }); //不使用HC内置时区设置
var dateFormat = _highcharts2.default.dateFormat;

var Bar = function (_Base) {
  _inherits(Bar, _Base);

  function Bar(selector, options) {
    _classCallCheck(this, Bar);

    var _this = _possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this, selector, options));

    var defaultOptions = {
      legend: true,
      column: true,
      grid: false,
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      clickable: false,
      //以上不支持热更新
      colors: _colors2.default,
      stack: false,
      // title: '柱状图',
      // subTitle: '',
      padding: [12, 0, 12, 0],
      labels: null,
      xAxis: {
        labelFormatter: null, //可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上X值的格式
        min: null,
        max: null
      },
      yAxis: {
        labelFormatter: null, //可以强制覆盖，手动设置label
        // tooltipFormatter: null, //手动设置tooltip上Y值的格式
        min: null,
        max: null
      }
    };
    _this.options = (0, _merge2.default)({}, defaultOptions, _this.options);
    _this.init();
    return _this;
  }

  _createClass(Bar, [{
    key: 'init',
    value: function init() {
      var dom = '';
      if (this.options.legend) {
        dom = '\n        <div class="p2c-legend"></div>\n        <div class="p2c-box"></div>\n      ';
      } else {
        dom = '<div class="p2c-box"></div>';
      }
      this.element.classList.add('p2c');
      this.element.classList.add('p2c-bar');
      this.element.innerHTML = dom;

      //触发一次渲染
      this.render();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Bar.prototype.__proto__ || Object.getPrototypeOf(Bar.prototype), 'destroy', this).call(this);
      this.chart.destroy();
    }
    // setData (data, sync){
    //   super.setData(data, false);

    //   sync = sync === undefined ? true : sync;
    //   if(sync) this.render();
    // }

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // let titleNode = this.element.querySelector('.p2c-title');
      var boxNode = this.element.querySelector('.p2c-box');
      var legendNode = this.element.querySelector('.p2c-legend');

      //位置计算
      this.element.style.padding = this.options.padding + 'px';
      boxNode.style.top = this.options.padding[0] + (legendNode ? 20 : 8) + 'px'; //此处没有计算margin，默认为20
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
      var data = this.data.concat(); //复制一个数组，浅复制
      //if(this.options.stacking) data.reverse();

      if (this.data.length) {
        var options = getHCOptions(this.options, data);
        //加入事件触发
        var self = this;
        options.plotOptions.series.point.events.click = function () {
          if (!self.options.clickable) return;
          self.fire('click', { target: self, point: { x: this.x, y: this.y, xName: this.name }, name: this.series.name }); //抛出外部处理
        };

        if (!this.chart) {
          data.forEach(function (item, index) {
            //let colorIndex = this.options.stacking ? data.length - 1 - index : index;
            options.series.push({
              type: _this2.options.column ? 'column' : 'bar',
              data: item.data,
              color: _this2.options.colors[index],
              name: item.name
            });
          });
          this.chart = _highcharts2.default.chart(boxNode, options);
        } else {
          data.forEach(function (item, index) {
            //let colorIndex = this.options.stacking ? data.length - 1 - index : index;
            var colorIndex = index;
            if (_this2.chart.series[index]) {
              _this2.chart.series[index].setData(item.data, false);
              _this2.chart.series[index].color = _this2.options.colors[colorIndex];
              _this2.chart.series[index].name = item.name;
            } else {
              _this2.chart.addSeries({
                type: _this2.options.column ? 'column' : 'bar',
                data: item.data,
                color: _this2.options.colors[colorIndex],
                name: item.name
              });
            }
          });
          //倒序循环remove
          for (var i = this.chart.series.length - 1; i > 0; i--) {
            if (!data[i]) {
              this.chart.series[i].remove(false);
            }
          }
          // if(this.chart.xAxis && this.chart.xAxis[0]) this.chart.xAxis[0].setCategories(getLabels(this.options, data), false); //更新可能的x轴
          if (this.chart.xAxis[0]) this.chart.xAxis[0].update(options.xAxis, false);
          if (this.chart.yAxis[0]) this.chart.yAxis[0].update(options.yAxis, false);
          this.chart.redraw(false);
        }
      }

      //图例 TODO性能优化
      if (this.data.length) {
        if (legendNode) {
          legendNode.innerHTML = getLegend(legendNode, this.options, data);
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
  }]);

  return Bar;
}(_highBase2.default);

function getLegend(node, options, data) {
  var ret = [];
  var legends = node.querySelectorAll('li');
  data.forEach(function (item, i) {
    var style = item.data && item.data.length ? '' : 'display:none;';
    var clsName = legends[i] && legends[i].classList.contains('p2c-legend-hidden') ? 'p2c-legend-hidden' : '';
    var name = item.name && !item.name.match(/data\d+/) ? item.name : '柱' + (i + 1);
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

function getLabels(options, data) {
  var ret = options.labels;
  if (!ret && data[0] && data[0].data && Array.isArray(data[0].data[0])) {
    ret = [];
    data[0].data.forEach(function (item) {
      ret.push(item[0] || '');
    });
  }
  return ret;
}

//highcharts 配置
function getHCOptions(options, data) {
  function xFormat(value) {
    //自定义处理逻辑优先
    if (options.xAxis.labelFormatter) return options.xAxis.labelFormatter(value, dateFormat);
    //默认处理逻辑
    else return value;
  }
  function yFormat(value) {
    if (options.yAxis.labelFormatter) return options.yAxis.labelFormatter(value, dateFormat);
    //默认处理逻辑
    else return value;
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
  var categories = getLabels(options, data);

  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      marginTop: 10,
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
        width: options.tooltip ? 1 : 0
      },
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255, 255, 0)',
      shadow: false,
      formatter: function formatter() {
        var p = this.points;
        var ret = '<h5>' + thFormat(p[0].key) + '</h5>';
        ret += '<ul>';
        p.forEach(function (item, i) {
          ret += '<li><i style="background:' + item.series.color + '"></i>' + tNameFormat(item.series.name) + ' <span>' + tValueFormat(item.y) + '</span></li>';
        });
        ret += '</ul>';
        return ret;
      }
    },
    legend: false,
    xAxis: {
      title: {
        enabled: false
      },
      lineWidth: 1,
      type: options.xAxis.type, //此处依赖options设置
      gridLineWidth: options.grid ? 1 : 0,
      gridLineColor: '#F2F3F7',
      tickPixelInterval: 70,
      lineColor: '#DCDEE3',
      tickLength: 0,
      labels: {
        formatter: function formatter() {
          return xFormat(this.value);
        },
        style: { 'fontFamily': '"Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Microsoft Yahei"', 'fontSize': '14px', 'color': '#989898' }
      },
      minPadding: 0,
      //endOnTick: false,
      //startOnTick: true,
      allowDecimals: true,
      categories: categories,
      max: options.xAxis.max,
      min: options.xAxis.min
    },
    yAxis: {
      title: {
        enabled: false
      },
      lineWidth: 0,
      lineColor: '#DCDEE3',
      gridLineWidth: 1,
      gridLineColor: '#F2F3F7',
      labels: {
        formatter: function formatter() {
          return yFormat(this.value);
        },
        style: { 'fontFamily': '"Helvetica Neue", Helvetica, Arial, sans-serif, "PingFang SC", "Microsoft Yahei"', 'fontSize': '14px', 'color': '#989898' }
      },
      max: options.yAxis.max,
      min: options.yAxis.min
    },
    plotOptions: {
      series: {
        cursor: options.clickable ? 'pointer' : null,
        events: {},
        point: {
          events: {}
        },
        animation: {
          duration: 500
        },
        pointPadding: 0,
        // groupPadding: 0.2,
        maxPointWidth: 74
      },
      column: {
        //animation: false,
        stacking: options.stack ? 'normal' : '',
        borderWidth: 0,
        //pointPadding: 0.2,
        states: {
          hover: {
            brightness: 0
          }
        },
        events: {}
      },
      bar: {
        //animation: false,
        stacking: options.stack ? 'normal' : '',
        borderWidth: 0,
        //pointPadding: 0.2,
        states: {
          hover: {
            brightness: 0
          }
        },
        events: {}
      }
    },
    series: []
  };
}

exports.default = Bar;
module.exports = exports['default'];