'use strict';

import { color } from '../theme/normal';

/*
* 常见直角坐标系的X轴设置。
* */
export default function (chart, config, customConfig) {
  if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    chart.axis('x', false);
  } else {
    const xAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate: config.xAxis.autoRotate,
        formatter: config.xAxis.labelFormatter,
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: color.colorN13,
          lineWidth: 1,
          // lineDash: null
        },
        // hideFirstLine: true
      };
    }

    if (customConfig) {
      Object.assign(xAxis, customConfig);
    }

    chart.axis('x', xAxis);
  }
}
