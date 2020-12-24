'use strict';

import { Geometry, Types } from "./types";
import themes from '../themes';
import { merge, pxToNumber } from './common';
import { IGroup, IShape } from "@antv/g2/esm/dependents";

export interface LabelConfig extends Types.GeometryLabelCfg {
  visible?: boolean;
  labelFormatter?: (value: string, mappingData: Types.MappingDatum, index: number) => string | IShape | IGroup;
  customConfig?: Types.GeometryLabelCfg;
}

/**
 * 图形元素label设置。
 *
 * @param {object} geom 图形元素对象
 * @param {object} config 图表配置项
 * @param {string} [field] 映射数据的字段，默认为y
 * @param {object} [defaultConfig] 图表额外配置项
 * @param {string} [extraConfigKey] 额外配置项的key，会在 config.label 的基础上额外扩展，且配置优先级高于默认的 label
 *
 * */

const defaultConfigKey = 'label';

export default function (
  geom: Geometry,
  config: { label?: LabelConfig | boolean, [key: string]: any },
  field = 'y',
  defaultConfig?: Types.GeometryLabelCfg,
  extraConfigKey?: string,
  useCustomOffset?: boolean,
  componentConfig?: Types.GeometryLabelCfg,
) {
  let configLabel = config[defaultConfigKey];
  if (extraConfigKey && config[extraConfigKey] !== undefined) {
    configLabel = config[extraConfigKey];
  }
  // const configKey = extraConfigKey || defaultConfigKey;
  if (!configLabel || (typeof configLabel === 'object' && configLabel.visible === false)) {
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
    ...defaultConfig,
    // type,
    position,
    // 默认距离 4，加上文字一半的大小以居中，转换为字号 12/3 + 12/2 = 12 * 5/6
    offset: (pxToNumber(themes['widgets-font-size-1']) * 5) / 6,
    // autoRotate,
    // style,
    // textStyle,
  };

  if (labelFormatter) {
    labelConfig.content = (v, item, index) => {
      return labelFormatter(v[field], item, index);
    }
  }

  Object.assign(labelConfig, otherConfigs);

  if (position === 'middle') {
    labelConfig.offset = 0;
  }

  if (componentConfig) {
    Object.assign(labelConfig, componentConfig);
  }

  if (offset !== undefined) {
    labelConfig.offset = offset;
  }

  if (customConfig) {
    merge(labelConfig, customConfig);
  }

  if (useCustomOffset) {
    labelConfig.offset = Number(offset);
  }

  geom.label(field, labelConfig);
}
