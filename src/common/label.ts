'use strict';

import { Geometry, Types } from "./types";
import themes from '../themes';
import { merge, pxToNumber, isInvalidNumber } from './common';

export interface LabelConfig {
  visible?: boolean;
  /**
   * 用于声明渲染的 label 类型。
   * 当用户使用了自定义的 label 类型，需要声明具体的 type 类型，否则会使用默认的 label 类型渲染。
   */
  type?: string;
  /** 相对数据点的偏移距离。 */
  offset?: number;
  /** label 相对于数据点在 X 方向的偏移距离。 */
  offsetX?: number;
  /** label 相对于数据点在 Y 方向的偏移距离。 */
  offsetY?: number;
  /** label 文本图形属性样式。 */
  style?: Types.LooseObject;
  /** label 是否自动旋转，默认为 true。 */
  autoRotate?: boolean;
  /**
   * 当且仅当 `autoRotate` 为 false 时生效，用于设置文本的旋转角度，**弧度制**。
   */
  rotate?: number;

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
  config: { [key: string]: LabelConfig },
  field = 'y',
  componentConfig: Types.GeometryLabelCfg,
  extraConfigKey: string,
  useCustomOffset = false,
) {
  let configLabel = config[defaultConfigKey];
  if (extraConfigKey && config[extraConfigKey] !== undefined) {
    configLabel = config[extraConfigKey];
  }
  // const configKey = extraConfigKey || defaultConfigKey;
  if (configLabel === false || (configLabel && configLabel.visible === false)) {
    return;
  }

  const {
    type = 'default',
    position = 'top',
    offset,
    autoRotate = true,
    labelFormatter = null,
    customConfig,
    style,
    textStyle,
  } = configLabel || {};
  const labelConfig: Types.GeometryLabelCfg = {
    type,
    position,
    // 默认距离 4，加上文字一半的大小以居中，转换为字号 12/3 + 12/2 = 12 * 5/6
    offset: (pxToNumber(themes['widgets-font-size-1']) * 5) / 6,
    autoRotate,
    formatter: labelFormatter,
    style,
    textStyle,
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
