'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = drawLine;

var _label = _interopRequireDefault(require("./label"));

var _geomSize = _interopRequireDefault(require("./geomSize"));

var stepNames = ['hv', 'vh', 'hvh', 'vhv'];

/**
 * drawLine 绘制线图逻辑
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yAxisKey 数据映射字段
 * */
function drawLine(chart, config, yAxisKey) {
  if (yAxisKey === void 0) {
    yAxisKey = 'y';
  }

  var lineWidth = config.lineWidth;
  var geomStyle = config.geomStyle || {};

  if (lineWidth && geomStyle.lineWidth === undefined) {
    geomStyle.lineWidth = lineWidth;
  }

  var areaColors = config.areaColors || config.colors;

  if (Array.isArray(config.colors) && Array.isArray(config.areaColors)) {
    areaColors = mergeArray([], config.colors, config.areaColors);
  } // 区域、堆叠、平滑曲线


  var lineShape = config.spline ? 'smooth' : 'line';
  var areaShape = config.spline ? 'smooth' : 'area'; // 阶梯折线，目前区域图不支持阶梯，需特殊说明

  if (config.step && !config.area) {
    lineShape = stepNames.indexOf(String(config.step)) > -1 ? config.step : 'hv';
  }

  var lineGeom = null;

  if (config.area && config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', areaColors).tooltip(false).shape(areaShape).adjust('stack');
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).adjust('stack'); // .style('x*y*type*extra', {
    //   lineJoin: 'round',
    //   ...geomStyle,
    // });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', areaColors).tooltip(false).shape(areaShape);
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape); // .style('x*y*type*extra', {
    //   lineJoin: 'round',
    //   ...geomStyle,
    // });
  } else {
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape); // .style('x*y*type*extra', {
    //   lineJoin: 'round',
    //   ...geomStyle,
    // });
  }

  (0, _label["default"])(lineGeom, config, yAxisKey); // 曲线默认点

  var pointGeom = null;

  if (config.symbol) {
    if (config.area && config.stack) {
      pointGeom = chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle');
    } else {
      pointGeom = chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle');
    }

    if (typeof config.symbol === 'object') {
      (0, _geomSize["default"])(pointGeom, config.symbol.size, 3, yAxisKey, 'type'); // if (config.symbol.geomStyle) {
      //   pointGeom.style('x*y*type*extra', config.symbol.geomStyle);
      // }
    }
  }
}

function mergeArray(target) {
  for (var _len = arguments.length, source = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    source[_key - 1] = arguments[_key];
  }

  source.forEach(function (s) {
    if (!s || s.length === 0) {
      return;
    }

    s.forEach(function (item, i) {
      if (i >= target.length) {
        target.push(item);
      } else {
        target[i] = item;
      }
    });
  });
  return target;
}