'use strict';

import G2 from '@antv/g2';

/**
 * getGeomSizeConfig 获取图形元素 size 属性的配置项
 *
 * @param sizeConfig 用户设置的 size 配置项
 * @param defaultValue 默认值
 * @param {string} arrayKey 配置项为数组时映射的数据key
 * @param {string} functionKey 配置项为函数时映射的数据key
 *
 * @return {Array} 配置项数组，直接展开到 G2 的 size 函数中即可
 * */
export default function getGeomSizeConfig(sizeConfig, defaultValue, arrayKey, functionKey) {
  // 默认直接传入 sizeConfig 或 defaultValue
  let result = [sizeConfig || defaultValue];
  if (Array.isArray(sizeConfig)) {
    // 数组，传入key进行大小映射
    result = [arrayKey, sizeConfig];
  } else if (G2.Util.isFunction(sizeConfig)) {
    // 函数，传入key映射到函数参数中
    result = [functionKey, sizeConfig];
  } else if (typeof sizeConfig === 'object') {
    // 对象，完全自定义 field 和 param
    result = [sizeConfig.field, sizeConfig.param];
  }
  return result;
}
