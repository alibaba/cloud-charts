'use strict';

import { Chart, Types } from "./types";
import themes from '../themes';
import { merge } from './common';

export interface XAxisConfig {
  visible?: boolean;
  alias?: boolean;
  title?: boolean;
  autoRotate?: boolean;
  rotate?: number;
  autoHide?: boolean;
  autoEllipsis?: boolean;
  labelFormatter?(): string;
  customConfig?: Types.AxisCfg;
}

/**
 * rectXAxis 直角坐标系的X轴配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {Object} componentConfig 组件的自定义配置
 * */
export default function (
  chart: Chart,
  config: { grid?: boolean; xAxis?: XAxisConfig },
  componentConfig?: Types.AxisCfg
) {
  if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    chart.axis('x', false);
  } else {
    const { alias, title, autoRotate, rotate, autoHide, autoEllipsis, labelFormatter, customConfig } = config.xAxis || {};
    const xAxisConfig: Types.AxisCfg = {
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
    if (alias || title) {
      // xAxisConfig.alias = title;
      if (alias !== undefined) {
        console.warn('config.xAxis.alias 被替换为 config.xAxis.title')
      }
      xAxisConfig.title = {
        // position: 'center',
        offset: 38,
        // textStyle: {
        //   rotate: 0,
        // },
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
