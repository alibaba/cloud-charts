'use strict';

import { size, fonts } from '../theme/index';
import { pxToNumber, isInvalidNumber } from './common';
import merge from './merge';

/**
 * 图形元素label设置。
 *
 * @param {object} geom 图形元素对象
 * @param {object} config 图表配置项
 * @param {string} [field] 映射数据的字段，默认为y
 * @param {object} [componentConfig] 图表额外配置项
 * @param {string} [extraConfigKey] 额外配置项的key，会在 config.label 的基础上额外扩展，且配置优先级高于默认的 label
 *
 * */

const defaultConfigKey = 'label';

export default function (geom, config, field = 'y', componentConfig, extraConfigKey) {
  let configLabel = config[defaultConfigKey];
  if (extraConfigKey && config[extraConfigKey] !== undefined) {
    configLabel = config[extraConfigKey];
  }
  // const configKey = extraConfigKey || defaultConfigKey;
  if (configLabel === false || (configLabel && configLabel.visible === false)) {
    return;
  }

  const { type = 'default', position = 'top', offset, autoRotate = true, labelFormatter = null, customConfig } = configLabel || {};
  const labelConfig = {
    type,
    position,
    // 默认距离，加上文字一半的大小以居中
    offset: pxToNumber(size.s1) + pxToNumber(fonts.fontSizeBaseCaption) / 2,
    autoRotate,
    formatter: labelFormatter,
  };

  if (position === 'middle') {
    labelConfig.offset = 0;
  }

  if (componentConfig) {
    Object.assign(labelConfig, componentConfig);
  }

  if (!isInvalidNumber(offset)) {
    labelConfig.offset += Number(offset);
  }

  if (customConfig) {
    merge(labelConfig, customConfig);
  }

  geom.label(field, labelConfig);
}
