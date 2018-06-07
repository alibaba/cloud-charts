'use strict';

import merge from "./merge";

/*
* 常见直角坐标系的单个Y轴设置。
* */
export default function (chart, config, yField = 'y', componentConfig) {
  if (config.yAxis === false || (config.yAxis && config.yAxis.visible === false)) {
    chart.axis(yField, false);
  } else {
    const { labelFormatter, customConfig } = config.yAxis || {};
    const yConfig = {
      title: null, // 不展示坐标轴的标题
      label: {
        formatter: labelFormatter,
      }
    };

    // 关闭了X轴，需要显示第一条grid
    if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
      yConfig.grid = {
        hideFirstLine: false
      };
    }

    if (componentConfig) {
      Object.assign(yConfig, componentConfig);
    }

    if (customConfig) {
      merge(yConfig, customConfig);
    }

    chart.axis(yField, yConfig);
  }
}
