'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _common = require("./common");

/**
 * rectYAxis 直角坐标系的单个Y轴配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yField 数据映射字段
 * @param {Object} defaultConfig 组件的自定义配置
 * */
function _default(chart, config, yField, defaultConfig) {
  if (yField === void 0) {
    yField = 'y';
  }

  if (config.yAxis === false || config.yAxis && config.yAxis.visible === false) {
    chart.axis(yField, false);
  } else {
    var _ref = config.yAxis || {},
        alias = _ref.alias,
        _ref$autoRotate = _ref.autoRotate,
        autoRotate = _ref$autoRotate === void 0 ? false : _ref$autoRotate,
        rotate = _ref.rotate,
        autoHide = _ref.autoHide,
        autoEllipsis = _ref.autoEllipsis,
        _labelFormatter = _ref.labelFormatter,
        customConfig = _ref.customConfig;

    var yConfig = (0, _extends2["default"])({}, defaultConfig, {
      title: null,
      // 不展示坐标轴的标题
      label: {
        autoRotate: autoRotate,
        rotate: rotate,
        autoHide: autoHide,
        autoEllipsis: autoEllipsis,
        formatter: _labelFormatter
      }
    }); // // 关闭了X轴，需要显示第一条grid
    // if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    //   yConfig.grid = {
    //     hideFirstLine: false,
    //   };
    // }
    // 开启坐标轴标题

    if (alias) {
      yConfig.title = {// position: 'center',
        // // offset: 30,
        // textStyle: {
        //   rotate: -90,
        // },
      }; // if (yField === 'y1') {
      //   yConfig.title.textStyle.rotate = 90;
      // }
      // yConfig.label.textStyle = {
      //   rotate: 0,
      // };
    } // if (componentConfig) {
    //   Object.assign(yConfig, componentConfig);
    // }


    if (customConfig) {
      (0, _common.merge)(yConfig, customConfig);
    }

    chart.axis(yField, yConfig);
  }
}