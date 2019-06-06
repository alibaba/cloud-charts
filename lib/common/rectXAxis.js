'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
* 常见直角坐标系的X轴设置。
* */


exports.default = function (chart, config, componentConfig) {
  if (config.xAxis === false || config.xAxis && config.xAxis.visible === false) {
    chart.axis('x', false);
  } else {
    var _ref = config.xAxis || {},
        alias = _ref.alias,
        autoRotate = _ref.autoRotate,
        rotate = _ref.rotate,
        labelFormatter = _ref.labelFormatter,
        customConfig = _ref.customConfig;

    var xAxisConfig = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate: autoRotate,
        formatter: labelFormatter
      }
    };

    if (rotate) {
      xAxisConfig.label.textStyle = {
        textAlign: 'start',
        rotate: rotate
      };
    }

    // 网格线
    if (config.grid) {
      xAxisConfig.grid = {
        lineStyle: {
          stroke: _index2.default['widgets-axis-grid'],
          lineWidth: 1
          // lineDash: null
        }
        // hideFirstLine: true
      };
    }

    // 开启坐标轴标题
    if (alias) {
      // xAxisConfig.alias = title;
      xAxisConfig.title = {
        position: 'center',
        offset: 38,
        textStyle: {
          rotate: 0
        }
      };
    }

    if (componentConfig) {
      _extends(xAxisConfig, componentConfig);
    }

    if (customConfig) {
      (0, _merge2.default)(xAxisConfig, customConfig);
    }

    chart.axis('x', xAxisConfig);
  }
};

var _index = require('../theme/index');

var _index2 = _interopRequireDefault(_index);

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];