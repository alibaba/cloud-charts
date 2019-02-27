'use strict';

import { color } from '../theme/index';
import merge from './merge';

/*
* 常见直角坐标系的X轴设置。
* */
export default function (chart, config, componentConfig) {
  if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    chart.axis('x', false);
  } else {
    const { autoRotate, rotate, labelFormatter, customConfig } = config.xAxis || {};
    const xAxisConfig = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate,
        formatter: labelFormatter,
      }
    };

    if (rotate) {
      xAxisConfig.label.textStyle = {
        textAlign: 'start',
        rotate,
      }
    }

    // 网格线
    if (config.grid) {
      xAxisConfig.grid = {
        lineStyle: {
          stroke: color.widgetsAxisGrid,
          lineWidth: 1,
          // lineDash: null
        },
        // hideFirstLine: true
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
