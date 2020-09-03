'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import merge from './merge';

/**
 * rectYAxis 直角坐标系的单个Y轴配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yField 数据映射字段
 * @param {Object} componentConfig 组件的自定义配置
 * */
export default function (chart, config) {
  var yField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';
  var componentConfig = arguments[3];

  if (config.yAxis === false || config.yAxis && config.yAxis.visible === false) {
    chart.axis(yField, false);
  } else {
    var _ref = config.yAxis || {},
        alias = _ref.alias,
        labelFormatter = _ref.labelFormatter,
        customConfig = _ref.customConfig;

    var yConfig = {
      title: null, // 不展示坐标轴的标题
      label: {
        formatter: labelFormatter
      }
    };

    // 关闭了X轴，需要显示第一条grid
    if (config.xAxis === false || config.xAxis && config.xAxis.visible === false) {
      yConfig.grid = {
        hideFirstLine: false
      };
    }

    // 开启坐标轴标题
    if (alias) {
      // yConfig.alias = title;
      yConfig.title = {
        position: 'center',
        // offset: 30,
        textStyle: {
          rotate: -90
        }
      };
      if (yField === 'y1') {
        yConfig.title.textStyle.rotate = 90;
      }
      yConfig.label.textStyle = {
        rotate: 0
      };
    }

    if (componentConfig) {
      _extends(yConfig, componentConfig);
    }

    if (customConfig) {
      merge(yConfig, customConfig);
    }

    chart.axis(yField, yConfig);
  }
}