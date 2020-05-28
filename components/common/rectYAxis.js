'use strict';

import merge from './merge';

/**
 * rectYAxis 直角坐标系的单个Y轴配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yField 数据映射字段
 * @param {Object} componentConfig 组件的自定义配置
 * */
export default function (chart, config, yField = 'y', componentConfig) {
  if (config.yAxis === false || (config.yAxis && config.yAxis.visible === false)) {
    chart.axis(yField, false);
  } else {
    const { alias, labelFormatter, customConfig } = config.yAxis || {};
    const yConfig = {
      title: null, // 不展示坐标轴的标题
      label: {
        formatter: labelFormatter,
      },
    };

    // 关闭了X轴，需要显示第一条grid
    if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
      yConfig.grid = {
        hideFirstLine: false,
      };
    }

    // 开启坐标轴标题
    if (alias) {
      // yConfig.alias = title;
      yConfig.title = {
        position: 'center',
        // offset: 30,
        textStyle: {
          rotate: -90,
        },
      };
      if (yField === 'y1') {
        yConfig.title.textStyle.rotate = 90;
      }
      yConfig.label.textStyle = {
        rotate: 0,
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
