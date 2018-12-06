'use strict';

import { size, fonts } from '../theme/index';
import { pxToNumber, isInvalidNumber } from './common';
import merge from './merge';

/**
 * 图形元素label设置。
 *
 * @param {object} chart 图表对象
 * @param {object} config 图表配置项
 * @param {string} [field] 映射分类的字段，默认为type
 * @param {object} [componentConfig] 图表额外配置项
 *
 * */
export default function (chart, config, field = 'type') {
  chart.filter(field, function (type, indexOrData) {
    console.log(type, indexOrData);
    // 类型数字，是图例项对应的index
    if (!isNaN(indexOrData)) {
      if (indexOrData === 0) {
        return false;
      }
    // 剩余情况是对象，是数据项过滤
    } else if (indexOrData.type === '机房1') {
      return false;
    }
    return true;
  });
}
