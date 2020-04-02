'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import themes from '../theme/index';
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

var defaultConfigKey = 'label';

export default function (geom, config) {
  var field = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';
  var componentConfig = arguments[3];
  var extraConfigKey = arguments[4];

  var configLabel = config[defaultConfigKey];
  if (extraConfigKey && config[extraConfigKey] !== undefined) {
    configLabel = config[extraConfigKey];
  }
  // const configKey = extraConfigKey || defaultConfigKey;
  if (configLabel === false || configLabel && configLabel.visible === false) {
    return;
  }

  var _ref = configLabel || {},
      _ref$type = _ref.type,
      type = _ref$type === undefined ? 'default' : _ref$type,
      _ref$position = _ref.position,
      position = _ref$position === undefined ? 'top' : _ref$position,
      offset = _ref.offset,
      _ref$autoRotate = _ref.autoRotate,
      autoRotate = _ref$autoRotate === undefined ? true : _ref$autoRotate,
      _ref$labelFormatter = _ref.labelFormatter,
      labelFormatter = _ref$labelFormatter === undefined ? null : _ref$labelFormatter,
      customConfig = _ref.customConfig;

  var labelConfig = {
    type: type,
    position: position,
    // 默认距离 4，加上文字一半的大小以居中，转换为字号 12/3 + 12/2 = 12 * 5/6
    offset: pxToNumber(themes['widgets-font-size-1']) * 5 / 6,
    autoRotate: autoRotate,
    formatter: labelFormatter
  };

  if (position === 'middle') {
    labelConfig.offset = 0;
  }

  if (componentConfig) {
    _extends(labelConfig, componentConfig);
  }

  if (!isInvalidNumber(offset)) {
    labelConfig.offset += Number(offset);
  }

  if (customConfig) {
    merge(labelConfig, customConfig);
  }

  geom.label(field, labelConfig);
}