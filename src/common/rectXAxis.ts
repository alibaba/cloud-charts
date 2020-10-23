'use strict';

import { Chart, Types } from "./types";
import themes from '../themes';
import { merge } from './common';

export interface XAxisConfig {
  visible?: boolean;
  alias?: boolean;
  autoRotate?: boolean;
  rotate?: number;
  autoHide?: boolean;
  autoEllipsis?: boolean;
  labelFormatter?(): string;
  customConfig?: Types.AxisCfg;
  // 数据项中使用
  categories?: number[] | string[];
}

/**
 * rectXAxis 直角坐标系的X轴配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} defaultConfig 组件的自定义配置
 * */
export default function (
  chart: Chart,
  config: { grid?: boolean; xAxis?: XAxisConfig },
  defaultConfig?: Types.AxisCfg
) {
  if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    chart.axis('x', false);
  } else {
    const { alias, autoRotate = false, rotate, autoHide, autoEllipsis, labelFormatter, customConfig } = config.xAxis || {};
    const xAxisConfig: Types.AxisCfg = {
      ...defaultConfig,
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate,
        rotate,
        autoHide,
        autoEllipsis,
        formatter: labelFormatter,
      },
    };

    // if (rotate) {
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
            stroke: themes['widgets-axis-grid'],
            lineWidth: 1,
          },
        },
        // lineStyle: {
        //   stroke: themes['widgets-axis-grid'],
        //   lineWidth: 1,
        //   // lineDash: null
        // },
        // // hideFirstLine: true
      };
    }

    // 开启坐标轴标题
    if (alias) {
      xAxisConfig.title = {
        // position: 'center',
        offset: 38,
        // textStyle: {
        //   rotate: 0,
        // },
      };
    }

    // if (componentConfig) {
    //   Object.assign(xAxisConfig, componentConfig);
    // }

    if (customConfig) {
      merge(xAxisConfig, customConfig);
    }

    chart.axis('x', xAxisConfig);
  }
}
