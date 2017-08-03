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


_highcharts2.default.setOptions({ global: { useUTC: false } }); //不使用HC内置时区设置
var dateFormat = _highcharts2.default.dateFormat;

var Pie = function (_Base) {
  _inherits(Pie, _Base);

  function Pie(selector, options) {
    _classCallCheck(this, Pie);

    var _this = _possibleConstructorReturn(this, (Pie.__proto__ || Object.getPrototypeOf(Pie)).call(this, selector, options));

    var defaultOptions = {
      legend: true,
      cycle: false,
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      },
      clickable: false,
      //以上不支持热更新
      colors: _colors2.default,
      padding: 20,
      labelFormatter: null
    };
    _this.options = (0, _merge2.default)({}, defaultOptions, _this.options);
    _this.init();
    return _this;
  }

  _createClass(Pie, [{
    key: 'init',
    value: function init() {
      var dom = '';
      if (this.options.legend) {
        dom = '\n        <div class="p2c-legend"><ul></ul></div>\n        <div class="p2c-box"></div>\n      ';
      } else {
        dom = '<div class="p2c-box"></div>';
      }
      this.element.classList.add('p2c');
      this.element.classList.add('p2c-pie');
      this.element.innerHTML = dom;

      //触发一次渲染
      this.render();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Pie.prototype.__proto__ || Object.getPrototypeOf(Pie.prototype), 'destroy', this).call(this);
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
      // let titleHeight = titleNode ? titleNode.offsetHeight : 0;
      var boxHeight = this.element.offsetHeight - this.options.padding * 2 - 20; //此处没有计算margin，默认为20
      var boxWidth = this.element.offsetWidth - this.options.padding * 2;
      var diameter = boxHeight < boxWidth ? boxHeight * 0.84 : boxWidth * 0.84;

      this.element.style.padding = this.options.padding + 'px';

      if (this.options.single) {
        //单图不计算位置
        boxNode.style.top = this.options.padding + 'px';
        boxNode.style.bottom = this.options.padding + 'px';
        boxNode.style.left = this.options.padding + 'px';
        boxNode.style.right = this.options.padding + 'px';
      } else {
        boxNode.style.width = diameter + 'px';
        boxNode.style.height = diameter + 'px';
        boxNode.style.top = this.options.padding + 20 + boxHeight * 0.08 + 'px';
        boxNode.style.left = this.options.padding + boxWidth * 0.04 + 'px';
      }

      if (legendNode) {
        legendNode.style.top = this.options.padding + diameter * 0.08 + 20 + 'px';
        legendNode.style.left = this.options.padding + diameter + boxWidth * 0.04 * 2 + 'px';
        if (legendNode.querySelector('ul')) legendNode.querySelector('ul').style.height = diameter + 'px';
      }

      //标题
      // if(titleNode){
      //   titleNode.querySelector('h4').innerHTML = this.options.title;
      //   titleNode.querySelector('h5').innerHTML = this.options.subTitle;
      // }

      //图表
      var data = this.data;
      if (this.data.length) {

        var options = getHCOptions(this.options, data);
        //事件绑定
        var self = this;
        options.plotOptions.series.point.events.click = function () {
          if (!self.options.clickable) return;
          self.fire('click', { target: self, point: { x: this.x, y: this.y, xName: this.name }, name: this.series.name }); //抛出外部处理
        };

        if (!this.chart) {
          data.forEach(function (item, index) {
            options.series.push({
              type: 'pie',
              data: item.data,
              name: item.name
            });
          });
          this.chart = _highcharts2.default.chart(boxNode, options);
        } else {
          data.forEach(function (item, index) {
            if (_this2.chart.series[index]) {
              _this2.chart.series[index].setData(item.data, false);
              _this2.chart.series[index].name = item.name;
            } else {
              _this2.chart.addSeries({
                type: 'pie',
                data: item.data,
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
          this.chart.redraw();
        }
      }

      //图例 暂时仅支持单列数据
      if (this.data.length && legendNode) {
        legendNode.querySelector('ul').innerHTML = getLegend(legendNode, this.options, data);
      }

      //检查图表容器是否变化，是否需要调整大小
      if (this._size) {
        if (this._size[0] !== boxNode.offsetWidth || this._size[1] !== boxNode.offsetHeight) this.chart && this.chart.reflow();
      }
      this._size = [boxNode.offsetWidth, boxNode.offsetHeight]; //记录本次尺寸
    }
  }]);

  return Pie;
}(_base2.default);

function getLegend(dom, options, data) {

  function labelFormatter(value) {
    //自定义处理逻辑优先
    if (options.labelFormatter) return options.labelFormatter(value, dateFormat);
    //默认处理逻辑
    else return value;
  }

  var ret = [];
  var legends = dom.querySelectorAll('li');
  data[0].data.forEach(function (item, i) {
    var name = Array.isArray(item) ? item[0] : '区域' + (i + 1);
    var value = labelFormatter(Array.isArray(item) ? item[1] : item);
    ret.push('<li data-id="' + i + '"><i style="background-color:' + options.colors[i] + '"></i><b>' + name + '</b><span>' + value + '</span></li>');
  });
  return ret.join('');
}

//highcharts 配置
function getHCOptions(options, data) {

  function labelFormatter(value) {
    //自定义处理逻辑优先
    if (options.labelFormatter) return options.labelFormatter(value, dateFormat);
    //默认处理逻辑
    else return value;
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

  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      //marginTop: 0,
      spacing: [0, 0, 0, 0],
      backgroundColor: false
    },
    credits: false,
    exporting: false,
    title: false,
    tooltip: {
      enabled: !!options.tooltip,
      //followPointer: false,
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255, 255, 0)',
      shadow: false,
      formatter: function formatter() {
        var ret = '<ul>';
        ret += '<li><i style="background:' + this.color + '"></i><b>' + tNameFormat(this.key) + '</b>  ' + tValueFormat(this.y) + '</li>';
        ret += '</ul>';
        return ret;
      }
    },
    legend: false,
    plotOptions: {
      series: {
        cursor: options.clickable ? 'pointer' : null,
        events: {},
        point: {
          events: {}
        }
      },
      pie: {
        dataLabels: false,
        slicedOffset: 0,
        size: '100%',
        innerSize: options.cycle ? '62%' : 0,
        states: {
          hover: { enabled: false }
        },
        borderWidth: 0,
        colors: options.colors
      }
    },
    series: []
  };
}

exports.default = Pie;
module.exports = exports['default'];