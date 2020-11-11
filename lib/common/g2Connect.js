'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var G2Connect = function () {
  function G2Connect() {
    var _this = this;

    var charts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, G2Connect);

    this.handlePlotmove = function () {
      var self = _this;
      return function (e) {
        var _self$config = self.config,
            type = _self$config.type,
            coordinate = _self$config.coordinate,
            custom = _self$config.custom;
        // 显式声明this，指向触发事件的图表实例

        var chartInstance = this;
        var record = type === 'data' ? getRecord(chartInstance, e) : null;
        self.charts.forEach(function (chart) {
          // 过滤自身和已销毁的实例
          if (chart === chartInstance || chart.destroyed) {
            return;
          }

          if (custom) {
            custom(e, chart, chartInstance);
            return;
          }

          if (type === 'data' && record) {
            // 根据数据找到对应点，如果传入的数据不在画布空间内，point 为 null
            var point = chart.getXY(record);
            // 如果数据中包含null, point中的坐标会变为 NaN，所以下面添加额外判断
            if (point && !isNaN(point.x) && !isNaN(point.y)) {
              // 找到对应的点，显示并return
              chart.showTooltip(getPoint(point, e, coordinate));
              return;
            }
          }

          // 兜底方案，根据e直接显示tooltip
          chart.showTooltip(e);
        });
      };
    }();

    this.handlePlotleave = function () {
      var self = _this;
      return function () {
        // 显式声明this，指向触发事件的图表实例
        var chartInstance = this;
        self.charts.forEach(function (chart) {
          // 过滤自身和已销毁的实例
          if (chart !== chartInstance && !chart.destroyed) {
            // 隐藏tooltip
            chart.hideTooltip();
          }
        });
      };
    }();

    this.charts = [];

    // 配置项，后续添加数据联动等配置项
    this.config = _extends({
      type: 'position',
      coordinate: 'xy',
      custom: null
    }, config);

    // 添加绑定
    this.add.apply(this, charts);
  }

  G2Connect.prototype.add = function add() {
    var _this2 = this;

    for (var _len = arguments.length, charts = Array(_len), _key = 0; _key < _len; _key++) {
      charts[_key] = arguments[_key];
    }

    charts.forEach(function (chart) {
      if (!isValidChart(chart)) {
        return;
      }

      if (_this2.charts.indexOf(chart) === -1) {
        // 存储实例的引用
        _this2.charts.push(chart);

        // 绑定事件
        // G2 底层的事件系统 wolfy87-eventemitter 中已经有有去重逻辑，所以直接绑定事件即可。
        chart.on('plotmove', _this2.handlePlotmove);
        chart.on('plotleave', _this2.handlePlotleave);
      }
    });
  };

  G2Connect.prototype.remove = function remove() {
    var _this3 = this;

    for (var _len2 = arguments.length, charts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      charts[_key2] = arguments[_key2];
    }

    if (charts.length === 0) {
      // 清空所有绑定
      this.charts.forEach(function (chart) {
        if (!isValidChart(chart)) {
          return;
        }

        chart.off('plotmove', _this3.handlePlotmove);
        chart.off('plotleave', _this3.handlePlotleave);
      });

      this.charts = [];
    } else {
      charts.forEach(function (chart) {
        if (!isValidChart(chart)) {
          return;
        }

        var index = _this3.charts.indexOf(chart);
        if (index !== -1) {
          // 去除实例的存储
          _this3.charts.splice(index, 1);

          // 绑定事件
          // G2 底层的事件系统 wolfy87-eventemitter 中已经有有去重逻辑，所以直接绑定事件即可。
          chart.off('plotmove', _this3.handlePlotmove);
          chart.off('plotleave', _this3.handlePlotleave);
        }
      });
    }
  };

  G2Connect.prototype.destroy = function destroy() {
    this.remove();
  };

  // 事件相关函数
  // 需要注意的是，这里用闭包创建特殊的行为函数。
  // 事件函数被调用时，this（chartInstance）会指向触发事件的图表实例，而self指向connect类的实例

  return G2Connect;
}();

/**
 * 判断图表是否有效
 *
 * @param {object} chart G2图表实例
 *
 * @return {boolean} 是否有效图例
 * */


exports.default = G2Connect;
function isValidChart(chart) {
  return chart && !chart.destroyed && chart.constructor === _g2.default.Chart;
}

/**
 * 获取原始数据
 *
 * @param {object} chart G2图表实例
 * @param {object} e G2 plotmove 事件传入的参数
 *
 * @return {object|null} 获取的原始数据，没有找到时为 null
 * */
function getRecord(chart, e) {
  var record = e.data && e.data._origin;
  if (!record) {
    record = chart.getSnapRecords(e);
    if (Array.isArray(record) && record[0]) {
      record = record[0]._origin;
    } else {
      record = null;
    }
  }

  return record;
}

/**
 * 按照coordinate设置获取正确的坐标
 *
 * @param {object} point 原始获得的坐标
 * @param {object} e G2 plotmove 事件传入的参数
 * @param {string} coordinate 坐标设置
 *
 * @return {object} 正确的坐标
 * */
function getPoint(point, e, coordinate) {
  if (coordinate === 'x') {
    point.y = e.y;
  }
  if (coordinate === 'y') {
    point.x = e.x;
  }
  return point;
}