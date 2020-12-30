'use strict';

import { Chart, Types } from "./types";
import themes from '../themes';
import { merge, pxToNumber } from './common';

export interface ScrollbarConfig {
  scrollbar?: Types.ScrollbarCfg | boolean;
}

/**
 * 直角坐标系的缩略轴设置
 *
 * @param {Chart} chart 图表实例
 * @param {ScrollbarConfig} config 配置项
 * */
export default function(chart: Chart, config: ScrollbarConfig) {
  if (!config.scrollbar) {
    return;
  }

  const scrollbarConfig: Types.ScrollbarCfg = {
    // 由于 scrollbar controller 内部对主题变量取值路径不对，暂时在这里传入参数设置
    categorySize: pxToNumber(themes['widgets-font-size-1']) * 3,
  };

  if (typeof config.scrollbar === 'object') {
    merge(scrollbarConfig, config.scrollbar);
  }

  // const { showText = false, labelFormatter = undefined, ...other } = typeof config.slider === 'object' ? config.slider : {};
  //
  // if (showText) {
  //   defaultConfig.textStyle.opacity = 0.8;
  // }
  //
  // if (labelFormatter) {
  //   defaultConfig.formatter = labelFormatter;
  // }

  // const sliderConfig = merge(defaultConfig, other);

  chart.option('scrollbar', scrollbarConfig);
}
