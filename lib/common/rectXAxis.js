'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _themes = _interopRequireDefault(require("../themes"));

var _common = require("./common");

/**
 * rectXAxis 直角坐标系的X轴配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} defaultConfig 组件的自定义配置
 * */
function _default(chart, config, defaultConfig) {
  if (config.xAxis === false || config.xAxis && config.xAxis.visible === false) {
    chart.axis('x', false);
  } else {
    var _ref = config.xAxis || {},
        alias = _ref.alias,
        _ref$autoRotate = _ref.autoRotate,
        autoRotate = _ref$autoRotate === void 0 ? false : _ref$autoRotate,
        rotate = _ref.rotate,
        autoHide = _ref.autoHide,
        autoEllipsis = _ref.autoEllipsis,
        _labelFormatter = _ref.labelFormatter,
        tickLine = _ref.tickLine,
        customConfig = _ref.customConfig;

    var myTickLine = null;

    if (typeof tickLine === 'boolean' && tickLine) {
      myTickLine = {};
    }

    var xAxisConfig = (0, _extends2["default"])({}, defaultConfig, {
      title: null,
      // 默认不展示坐标轴的标题
      tickLine: myTickLine,
      label: {
        autoRotate: autoRotate,
        rotate: rotate,
        autoHide: autoHide,
        autoEllipsis: autoEllipsis,
        formatter: _labelFormatter
      }
    }); // if (rotate) {
    //   xAxisConfig.label.style = {
    //     textAlign: 'start',
    //     rotate,
    //   };
    // }
    // 网格线

    if (config.grid) {
      xAxisConfig.grid = {
        line: {
          style: {
            stroke: _themes["default"]['widgets-axis-grid'],
            lineWidth: 1
          }
        } // lineStyle: {
        //   stroke: themes['widgets-axis-grid'],
        //   lineWidth: 1,
        //   // lineDash: null
        // },
        // // hideFirstLine: true

      };
    } // 开启坐标轴标题


    if (alias) {
      xAxisConfig.title = {// position: 'center',
        // offset: 38,
        // textStyle: {
        //   rotate: 0,
        // },
      };
    } // if (componentConfig) {
    //   Object.assign(xAxisConfig, componentConfig);
    // }


    if (customConfig) {
      (0, _common.merge)(xAxisConfig, customConfig);
    }

    chart.axis('x', xAxisConfig);
  }
}