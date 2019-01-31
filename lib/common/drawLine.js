'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = drawLine;

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _label = require('./label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawLine(chart, config, lineShape, areaShape) {
  var yAxisKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'y';

  var lineWidth = config.lineWidth;
  var geomStyle = config.geomStyle || {};
  if (lineWidth && geomStyle.lineWidth === undefined) {
    geomStyle.lineWidth = lineWidth;
  }

  var areaColors = config.areaColors || config.colors;
  if (Array.isArray(config.colors) && Array.isArray(config.areaColors)) {
    areaColors = mergeArray([], config.colors, config.areaColors);
  }

  var lineGeom = null;

  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', areaColors).shape(areaShape).active(false);
    lineGeom = chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style('x*y*type*extra', _extends({
      lineJoin: 'round'
    }, geomStyle));
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', areaColors).shape(areaShape).active(false);
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

    var sizeConfig = config.symbol.size || 3;
    if (Array.isArray(sizeConfig)) {
      sizeConfig = [yAxisKey, sizeConfig];
    } else if (_g2.default.Util.isFunction(sizeConfig)) {
      sizeConfig = ['type', sizeConfig];
    } else if ((typeof sizeConfig === 'undefined' ? 'undefined' : _typeof(sizeConfig)) === 'object') {
      sizeConfig = [sizeConfig.field, sizeConfig.param];
    } else {
      sizeConfig = [sizeConfig];
    }
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