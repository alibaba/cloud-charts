'use strict';

/**
 * 图例变灰设置。
 *
 * @param {object} chart 图表对象，或者是view对象
 * @param {object} config 图表配置项
 * @param {string} [dataKey] 原始数据挂载的key，用于动态获取原始数据
 *
 * */
export default function (chart, config, dataKey = 'rawData') {
  /*
   * indexOrData 有两种可能类型，一种是数字，一种是对象。
   * 2019-04-15 在新版本G2中变为： undefined 或者 对象
   * 当传入 undefined 时，与旧版的数字对应，是对图例项显示控制的过滤。
   * 当类型是数字时，是对图例项显示控制的过滤。
   * 当类型是对象时，是对渲染数据的过滤。
   * 只有当两者匹配时，图例过滤功能才完整。
   * 即使关闭图例也有过滤功能，因为可能有外部控制图例开关
   * */
  chart.filter('type', (type, indexOrData) => {
    const rawData = this[dataKey] || [];
    // 类型数字，是图例项对应的index，且有对应的原始数据项
    if (!isNaN(indexOrData) && rawData[indexOrData] && rawData[indexOrData].visible === false) {
      return false;
    // 剩余情况是对象，是数据项过滤
    } else if (typeof indexOrData === 'object' && indexOrData.visible === false) {
      return false;
    // 新版中indexOrData是undefined，只传入了type
    } else if (!indexOrData) {
      const dataItem = rawData.filter(group => group.name === type);
      if (dataItem[0] && dataItem[0].visible === false) {
        return false;
      }
    }
    return true;
  });
}
