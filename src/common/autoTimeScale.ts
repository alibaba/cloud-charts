'use strict';
import { Types, ChartData } from './types';
import { timePretty, timeCat } from './autoTimeTicksMethod';
import LanguageMap from '../locales';
import { getText } from '../ChartProvider';
import {getAutoMask} from '../common/common';

// 移入国际化文件中
/*
| 间隔 \ 跨度 | 大于半年             | 大于一个月      | 大于一天        | 大于一小时  | 大于一分钟   | 小于分钟  |
| 大于半年    | YYYY                | -              | -              | -          | -          | -        |
| 大于一个月  | YYYY-MM             | YYYY-MM        | -              | -          | -          | -        |
| 大于一天    | YYYY-MM-DD          | MM-DD          | MM-DD          | -          | -          | -        |
| 大于一小时  | YYYY-MM-DD HH:mm    | MM-DD HH:mm    | MM-DD HH:mm    | HH:mm      | -          | -        |
| 大于一分钟  | YYYY-MM-DD HH:mm    | MM-DD HH:mm    | MM-DD HH:mm    | HH:mm      | HH:mm      | -        |
| 小于分钟    | YYYY-MM-DD HH:mm:ss | MM-DD HH:mm:ss | MM-DD HH:mm:ss | HH:mm:ss   | mm:ss      | mm:ss    |
*/

function findIndexOfSubStringIn2DArray(needle: string, haystack: string[][]) {
  for (let i = 0; i < haystack.length; i++) {
      for (let j = 0; j < haystack[i].length; j++) {
          if (haystack[i][j] === needle) {
              return [i, j];
          }
      }
  }

  // 如果未找到，则返回null或其他合适的默认值
  return null;
}

/**
 * 自动计算时间格式。
 * @param defs {object} 数据列定义
 * @param data {array} G2图表实例
 * */
export default function (defs: Record<string, Types.ScaleOption>, data: ChartData, language?: keyof typeof LanguageMap): void {
  const def = defs.x;
  // 所有的时间刻度计算都走图表库自己内置的（迁移G2的算法）
  if (
    (def.type === 'time' || def.type === 'timeCat') &&
    Array.isArray(data) &&
    data[0] &&
    Array.isArray(data[0].data)
  ) {
    // 格式化另算
    if (def.mask === 'auto') {
      def.mask = getAutoMask(def, data[0].data, language);
    } else {
      // 业务自定义国际化处理
      // 初始化的mask
      const sourceMaskMap = getText('timeMask', 'zh-cn', null, true);
      // 当前语言下的mask
      const currentMaskMap = getText('timeMask', language, null);
      // 用户自定义mask
      const customMask = def.mask;
      // 获取自定义mask在初始化mask Map下的索引地址
      const customMaskIndex = findIndexOfSubStringIn2DArray(customMask, sourceMaskMap);
      // 得到当前语言下的mask
      const currentMask = customMaskIndex ? currentMaskMap[customMaskIndex[0]][customMaskIndex[1]] || customMask : customMask;
      def.mask = currentMask;
    }

    // 覆盖G2内置算法
    // 默认的tickCount为7，导致时间永远无法获取全量数据
    // 这里通过修改tickCount的值为当前X轴的数量，使保底能得到全量数据
    if (!def.tickMethod && def.type === 'time') {
      def.tickMethod = (cfg: Types.ScaleOption) => {
        const { values } = cfg;
        return timePretty({
          ...cfg,
          ...def,
          // 补充优化逻辑，针对当前画布尺寸适配标签个数
          tickCount: def.tickCount || values?.length || 7,
        });
      }
    } else if (!def.tickMethod && def.type === 'timeCat') {
      def.tickMethod = (cfg: Types.ScaleOption) => {
        const { values } = cfg;
        return timeCat({
          ...cfg,
          ...def,
          tickCount: def.tickCount || values?.length || 7,
        });
      }
    }
  } else {
    // 分类型默认显示最后一个
    if(def.type === 'cat' || def.type==='timeCat') {
      def.showLast = true;
    }
  }
}
