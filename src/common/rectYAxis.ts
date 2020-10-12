'use strict';

import { Chart, Types } from "./types";
import { merge } from './common';

export interface YAxisConfig {
  visible?: boolean;
  alias?: boolean;
  autoRotate?: boolean;
  rotate?: number;
  autoHide?: boolean;
  autoEllipsis?: boolean;
  labelFormatter?(): string;
  customConfig?: Types.AxisCfg;
}

/**
 * rectYAxis 直角坐标系的单个Y轴配置
 *
 * @param {Chart} chart 图表实例
 * @param {Object} config 配置项
 * @param {string} yField 数据映射字段
 * @param {Object} componentConfig 组件的自定义配置
 * */
export default function (
  chart: Chart,
  config: { yAxis?: YAxisConfig },
  yField: string = 'y',
  componentConfig?: Types.AxisCfg
) {
  if (config.yAxis === false || (config.yAxis && config.yAxis.visible === false)) {
    chart.axis(yField, false);
  } else {
    const { alias, autoRotate = false, rotate, autoHide, autoEllipsis, labelFormatter, customConfig } = config.yAxis || {};
    const yConfig: Types.AxisCfg = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate,
        rotate,
        autoHide,
        autoEllipsis,
        formatter: labelFormatter,
      },
    };

    // // 关闭了X轴，需要显示第一条grid
    // if (config.xAxis === false || (config.xAxis && config.xAxis.visible === false)) {
    //   yConfig.grid = {
    //     hideFirstLine: false,
    //   };
    // }

    // 开启坐标轴标题
    if (alias) {
      yConfig.title = {
        // position: 'center',
        // // offset: 30,
        // textStyle: {
        //   rotate: -90,
        // },
      };
      // if (yField === 'y1') {
      //   yConfig.title.textStyle.rotate = 90;
      // }
      // yConfig.label.textStyle = {
      //   rotate: 0,
      // };
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
