'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = drawLine;

var _label = require('./label');

var _label2 = _interopRequireDefault(_label);

var _geomSize = require('./geomSize');

var _geomSize2 = _interopRequireDefault(_geomSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stepNames = ['hv', 'vh', 'hvh', 'vhv'];

function drawLine(chart, config) {
  var yAxisKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';
  var lineWidth = config.lineWidth;

  var geomStyle = config.geomStyle || {};
  if (lineWidth && geomStyle.lineWidth === undefined) {
    geomStyle.lineWidth = lineWidth;
  }

  var areaColors = config.areaColors || config.colors;
  if (Array.isArray(config.colors) && Array.isArray(config.areaColors)) {
    areaColors = mergeArray([], config.colors, config.areaColors);
  }

  // 区域、堆叠、平滑曲线
  var lineShape = config.spline ? 'smooth' : 'line';
  var areaShape = config.spline ? 'smooth' : 'area';

  // 阶梯折线，目前区域图不支持阶梯，需特殊说明
  if (config.step && !config.area) {
    lineShape = stepNames.indexOf(config.step) > -1 ? config.step : 'hv';
  }

  var lineGeom = null;

  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', areaColors).tooltip(false).shape(areaShape).active(false);
    lineGeom = chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style('x*y*type*extra', _extends({
      lineJoin: 'round'
    }, geomStyle));
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', areaColors).tooltip(false).shape(areaShape).active(false);
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style('x*y*type*extra', _extends({
      lineJoin: 'round'
    }, geomStyle));
  } else {
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style('x*y*type*extra', _extends({
      lineJoin: 'round'
    }, geomStyle));
  }

  (0, _label2.default)(lineGeom, config, yAxisKey);

  // 曲线默认点
  var pointGeom = null;
  if (config.symbol) {
    var _pointGeom;

    if (config.area && config.stack) {
      pointGeom = chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').active(false);
    } else {
      pointGeom = chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').active(false);
    }

    var sizeConfig = (0, _geomSize2.default)(config.symbol.size, 3, yAxisKey, 'type');
    (_pointGeom = pointGeom).size.apply(_pointGeom, sizeConfig);

    if (config.symbol.geomStyle) {
      pointGeom.style('x*y*type*extra', config.symbol.geomStyle);
    }
  }
}

function mergeArray(target) {
  for (var _len = arguments.length, source = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
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
module.exports = exports['default'];