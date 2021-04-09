'use strict';

import { Chart, Types, G2Dependents } from "./types";
import themes from '../themes';
import { merge } from './common';

interface Slider extends Types.SliderCfg {
  /** 显示边界值，默认 false */
  showText?: boolean;
  labelFormatter?(val: any, datum: Types.Datum, idx: number): any;
}

export interface SliderConfig {
  slider?: Slider | boolean;
}

/**
 * 直角坐标系的缩略轴设置
 *
 * @param {Chart} chart 图表实例
 * @param {SliderConfig} config 配置项
 * */
export default function(chart: Chart, config: SliderConfig) {
  if (!config.slider) {
    return;
  }

  const defaultConfig: Slider = {
    // 由于内部对 trendCfg 使用浅层合并，在主题包中配置会被覆盖，只能在这一层设置。
    trendCfg: {
      lineStyle: {
        stroke: themes['widgets-color-category-1'],
      }
    } as G2Dependents.TrendCfg,
    textStyle: {},
  };

  const { showText = false, labelFormatter = undefined, ...other } = typeof config.slider === 'object' ? config.slider : {};

  if (showText) {
    defaultConfig.textStyle.opacity = 0.8;
  }

  if (labelFormatter) {
    defaultConfig.formatter = labelFormatter;
  }

  const sliderConfig = merge(defaultConfig, other);

  chart.option('slider', sliderConfig);
}
