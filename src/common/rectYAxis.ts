'use strict';

import { Chart, Types } from './types';
import { merge, customFormatter, customFormatterConfig } from './common';

export interface YAxisConfig extends customFormatterConfig {
  visible?: boolean;
  alias?: boolean;
  autoRotate?: boolean;
  rotate?: number;
  autoHide?: boolean;
  autoEllipsis?: boolean;
  label?: Types.AxisCfg['label'];
  labelFormatter?: NonNullable<Types.AxisCfg['label']>['formatter'];
  customConfig?: Types.AxisCfg;
}

/**
 * rectYAxis 直角坐标系的单个Y轴配置
 *
 * @param {this} ctx 组件实例 this 指针
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yField 数据映射字段
 * @param {Object} defaultConfig 组件的自定义配置
 * */
export default function <T>(
  ctx: T,
  chart: Chart,
  config: { yAxis?: (Types.ScaleOption & YAxisConfig) | false },
  yField: string = 'y',
  defaultConfig?: Types.AxisCfg,
) {
  if (config.yAxis === false || (config.yAxis && config.yAxis.visible === false)) {
    chart.axis(yField, false);
  } else {
    const {
      alias,
      autoRotate = false,
      rotate,
      autoHide,
      autoEllipsis,
      label,
      labelFormatter,
      customConfig,
    } = config.yAxis || {};
    const yConfig: Types.AxisCfg = {
      ...defaultConfig,
      title: null, // 不展示坐标轴的标题
      label:
        label === undefined
          ? {
              autoRotate,
              rotate,
              autoHide,
              autoEllipsis,
              formatter: labelFormatter || customFormatter({ hideZeroUnit: true, ...(config.yAxis || {}) }),
            }
          : label,
    };

    // // 关闭了X轴，需要显示第一条grid
    // if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    //   yConfig.grid = {
    //     hideFirstLine: false,
    //   };
    // }

    // 开启坐标轴标题
    if (alias) {
      yConfig.title = {};
      if (yField === 'y1') {
        // @ts-ignore G2 文档中没有出现的属性，传入角度值，手动设置转动角度
        yConfig.title.rotate = Math.PI / 2;
      }
      // yConfig.label.textStyle = {
      //   rotate: 0,
      // };
    }

    // if (componentConfig) {
    //   Object.assign(yConfig, componentConfig);
    // }

    if (customConfig) {
      merge(yConfig, customConfig);
    }

    chart.axis(yField, yConfig);
  }
}
