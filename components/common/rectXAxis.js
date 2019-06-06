'use strict';

import themes from '../theme/index';
import merge from './merge';

/*
* 常见直角坐标系的X轴设置。
* */
export default function (chart, config, componentConfig) {
  if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    chart.axis('x', false);
  } else {
    const { alias, autoRotate, rotate, labelFormatter, customConfig } = config.xAxis || {};
    const xAxisConfig = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate,
        formatter: labelFormatter,
      },
    };

    if (rotate) {
      xAxisConfig.label.textStyle = {
        textAlign: 'start',
        rotate,
      };
    }

    // 网格线
    if (config.grid) {
      xAxisConfig.grid = {
        lineStyle: {
          stroke: themes['widgets-axis-grid'],
          lineWidth: 1,
          // lineDash: null
        },
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
          rotate: 0,
        }
      };
    }

    if (componentConfig) {
      Object.assign(xAxisConfig, componentConfig);
    }

    if (customConfig) {
      merge(xAxisConfig, customConfig);
    }

    chart.axis('x', xAxisConfig);
  }
}
