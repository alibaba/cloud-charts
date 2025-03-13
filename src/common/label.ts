'use strict';

import { Geometry, Types } from './types';
import themes from '../themes';
import { merge, pxToNumber, getFormatConfig, customFormatter } from './common';
import { IGroup, IShape } from '@antv/g2/esm/dependents';
import { warn } from './log';

export interface LabelConfig extends Types.GeometryLabelCfg {
  visible?: boolean;
  labelFormatter?: (value: string, mappingData: Types.MappingDatum, index: number) => string | IShape | IGroup;
  customConfig?: Types.GeometryLabelCfg;
  field?: string;
  /** @deprecated key 属性已废弃，请使用 field 属性 */
  key?: string;
  offset?: number;
  callback?: Types.LabelCallback;
}

/**
 * 图形元素label设置。
 *
 * @param {object} geom 图形元素对象
 * @param {object} config 图表配置项
 * @param {string} [field] 映射数据的字段，默认为y
 * @param {object} [defaultConfig] 图表额外配置项
 * @param {string} [extraConfigKey] 额外配置项的key，会在 config.label 的基础上额外扩展，且配置优先级高于默认的 label
 * @param {boolean} [useCustomOffset] 是否适用用户自定义偏移量
 * */

const defaultConfigKey = 'label';

export default function ({
  geom,
  config,
  field = 'y',
  defaultConfig = {},
  extraConfigKey = null,
  useCustomOffset = undefined,
  componentConfig = undefined,
  extraCallbackParams,
}: {
  geom: Geometry;
  config: { label?: LabelConfig | boolean; [p: string]: any };
  field?: string;
  defaultConfig?: Types.GeometryLabelCfg;
  extraConfigKey?: string;
  useCustomOffset?: boolean;
  componentConfig?: Types.GeometryLabelCfg;
  extraCallbackParams?: any[];
}) {
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
    field: userField,
    key,
    callback,
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

  if (key) {
    warn('config.label', 'key 属性已废弃，请使用 field 属性');
  }

  const newField = key || userField || field;

  if (componentConfig) {
    Object.assign(labelConfig, componentConfig);
  }

  if (labelFormatter) {
    labelConfig.content = (v, item, index) => {
      return labelFormatter(v[newField], item, index);
    };
  } else {
    const formatConfig = getFormatConfig(config);
    const customValueFormatter = customFormatter(formatConfig);
    if (customValueFormatter) {
      labelConfig.content = (v, item, index) => {
        return customValueFormatter(v[newField]);
      };
    }
  }

  Object.assign(labelConfig, otherConfigs);

  if (position === 'middle') {
    labelConfig.offset = 0;
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

  if (callback) {
    if (extraCallbackParams) {
      geom.label(
        newField,
        function (...args) {
          return callback(...args, ...extraCallbackParams);
        },
        labelConfig,
      );
    } else {
      geom.label(newField, callback, labelConfig);
    }
  } else {
    geom.label(newField, labelConfig);
  }
}
