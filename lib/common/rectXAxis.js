'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import themes from '../theme/index';
import merge from './merge';

/*
* 常见直角坐标系的X轴设置。
* */
export default function (chart, config, componentConfig) {
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
          stroke: themes['widgets-axis-grid'],
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
      merge(xAxisConfig, customConfig);
    }

    chart.axis('x', xAxisConfig);
  }
}