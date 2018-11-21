'use strict';

import { size, fonts } from '../theme/index';
import { pxToNumber, isInvalidNumber } from './common';
import merge from './merge';

/**
 * 图形元素label设置。
 *
 * @param {object} geom 图形元素对象
 * @param {object} config 图表配置项
 * @param {string} field 映射数据的字段
 * @param {object} [componentConfig] 图表额外配置项
 *
 * */
export default function (geom, config, field = 'y',  componentConfig) {
  if (config.label === false || (config.label && config.label.visible === false)) {
    return;
  }

  const { type = 'default', position = 'top', offset = 0, autoRotate, labelFormatter, customConfig } = config.label || {};
  const labelConfig = {
    type,
    position,
    offset: pxToNumber(size.s1) + pxToNumber(fonts.fontSizeBaseCaption) / 2,
    autoRotate,
    formatter: labelFormatter,
  };

  if (position === 'middle') {
    labelConfig.offset = 0;
  }

  if (!isInvalidNumber(offset)) {
    labelConfig.offset += Number(offset);
  }

  if (componentConfig) {
    Object.assign(labelConfig, componentConfig);
  }

  if (customConfig) {
    merge(labelConfig, customConfig);
  }

  geom.label(field, labelConfig);
}
