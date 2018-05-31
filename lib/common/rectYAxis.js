'use strict';

/*
* 常见直角坐标系的单个Y轴设置。
* */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (chart, config) {
  var yField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';
  var customConfig = arguments[3];

  if (config.yAxis && config.yAxis.enable !== false) {
    var yConfig = {
      title: null, // 不展示坐标轴的标题
      label: {
        formatter: config.yAxis.labelFormatter
      }
    };

    // 关闭了X轴，需要显示第一条grid
    if (!config.xAxis || config.xAxis.enable === false) {
      yConfig.grid = {
        hideFirstLine: false
      };
    }

    if (customConfig) {
      _extends(yConfig, customConfig);
    }

    chart.axis(yField, yConfig);
  } else {
    chart.axis(yField, false);
  }
};

module.exports = exports['default'];