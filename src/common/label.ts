'use strict';

import { Geometry, Types } from "./types";
import themes from '../themes';
import { merge, pxToNumber, isInvalidNumber } from './common';

export interface LabelConfig extends Types.GeometryLabelCfg {
  visible?: boolean;
  labelFormatter?: Types.GeometryLabelContentCallback;
  customConfig?: Types.GeometryLabelCfg;
}

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

export default function (
  geom: Geometry,
  config: { label?: LabelConfig | boolean, [key: string]: any },
  field = 'y',
  componentConfig?: Types.GeometryLabelCfg,
  extraConfigKey?: string,
  useCustomOffset?: boolean,
) {
  let configLabel = config[defaultConfigKey];
  if (extraConfigKey && config[extraConfigKey] !== undefined) {
    configLabel = config[extraConfigKey];
  }
  // const configKey = extraConfigKey || defaultConfigKey;
  if (configLabel === false || (typeof configLabel === 'object' && configLabel.visible === false)) {
    return;
  }
  if (configLabel === true) {
    configLabel = {};
  }

  const {
    // type = 'default',
    position = 'top',
    offset,
    // autoRotate = true,
    labelFormatter = null,
    customConfig,
    // style,
    // textStyle,
    ...otherConfigs
  } = configLabel;

  const labelConfig: Types.GeometryLabelCfg = {
    // type,
    position,
    // 默认距离 4，加上文字一半的大小以居中，转换为字号 12/3 + 12/2 = 12 * 5/6
    offset: (pxToNumber(themes['widgets-font-size-1']) * 5) / 6,
    // autoRotate,
    content: labelFormatter,
    // style,
    // textStyle,
    ...otherConfigs
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

  if (useCustomOffset) {
    labelConfig.offset = Number(offset);
  }

  geom.label(field, labelConfig);
}
