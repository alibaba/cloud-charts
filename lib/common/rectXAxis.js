'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
* 常见直角坐标系的X轴设置。
* */


exports.default = function (chart, config, customConfig) {
  if (config.xAxis && config.xAxis.enable !== false) {
    var xAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate: config.xAxis.autoRotate,
        formatter: config.xAxis.labelFormatter
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: _normal.color.colorN13,
          lineWidth: 1
          // lineDash: null
        }
        // hideFirstLine: true
      };
    }

    if (customConfig) {
      _extends(xAxis, customConfig);
    }

    chart.axis('x', xAxis);
  } else {
    chart.axis('x', false);
  }
};

var _normal = require('../theme/normal');

module.exports = exports['default'];