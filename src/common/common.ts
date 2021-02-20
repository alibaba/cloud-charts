import { Colors, Types } from "./types";
import themes from '../themes';
import { warn } from './log';

import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import merge from 'lodash/merge';
export { isEqual, isEqualWith, merge };

export const requestAnimationFrame = window && window.requestAnimationFrame;

export const propertyMap = {
  axis: [
    'type', 'showLast', 'alias', 'sync', 'mask', 'base', 'exponent', 'values',
    'range', 'min', 'max', 'minLimit', 'maxLimit', 'nice',
    'ticks', 'tickMethod', 'tickCount', 'maxTickCount', 'tickInterval', 'minTickInterval', 'formatter',
  ],
};

const keyType: Types.LooseObject = {
  min: 'number',
  max: 'number',
  minLimit: 'number',
  maxLimit: 'number',
  tickCount: 'number',
};
/**
 * 向目标对象拷贝指定的key的值
 *
 * @param {string[]} keys 判断的key
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 *
 * @return {Object} 目标对象
 * */
export function propertyAssign(keys: string[], target: Types.LooseObject, source: Types.LooseObject | false) {
  if (!source) {
    return target;
  }
  keys.forEach((key) => {
    // 仅判断undefined的情况
    if (source[key] === undefined) {
      return;
    }
    // 忽略 tickCount: 'auto'
    if (key === 'tickCount' && source[key] === 'auto') {
      warn('config.axis', `tickCount: 'auto' 被替换为 Axis.autoHide: true`);
      return;
    }
    // 将部分限制了类型的key属性转换为需要的类型
    if (keyType[key] !== 'number') {
      target[key] = source[key];
    } else if (source[key] === null) {
      // 设置null则直接赋值
      target[key] = null;
    } else if (!isInvalidNumber(source[key])) {
      // 是数字时才赋值，否则直接跳过
      target[key] = Number(source[key]);
    }
    // if (keyType[key] === 'number') {
    //   if (!isInvalidNumber(source[key])) {
    //     target[key] = Number(source[key]);
    //   }
    // } else {
    //   target[key] = source[key];
    // }
  });

  return target;
}

/**
 * 找到对应元素的父元素的大小
 *
 * @param {element} element Html元素
 * @param {number | string} width props中传递的width属性
 * @param {number | string} height props中传递的height属性
 *
 * @return {number[]} 宽和高的数组
 * */
export function getParentSize(element: HTMLElement, width: number | string, height: number | string) {
  let w = width || '';
  let h = height || '';

  const parent = element && element.parentElement;

  if (parent) {
    const parentStyle = window.getComputedStyle(parent);
    const paddingTop = pxToNumber(parentStyle.getPropertyValue('padding-top'));
    const paddingRight = pxToNumber(parentStyle.getPropertyValue('padding-right'));
    const paddingBottom = pxToNumber(parentStyle.getPropertyValue('padding-bottom'));
    const paddingLeft = pxToNumber(parentStyle.getPropertyValue('padding-left'));

    if (!width) {
      w = parent.clientWidth - paddingLeft - paddingRight;
    }
    if (!height) {
      h = parent.clientHeight - paddingTop - paddingBottom;
    }
  }
  return [Number(w), Number(h)];
}

/**
 * 将像素字符串转为数值
 *
 * @param {string} px 像素字符串
 *
 * @return {number} 数值
 * */
export function pxToNumber(px: string) {
  return Number(px.replace('px', ''));
}

/**
 * 从Highcharts格式数据中找到对应index的颜色
 *
 * @param {array} colors 颜色数组
 * @param {array} rawData Highcharts 格式的数据
 * @param {number} dataIndex y轴对应的index
 * */
export function getDataIndexColor(colors: Colors, rawData: any[], dataIndex: number): string | void {
  if (typeof colors === 'string') {
    return colors;
  }
  let colorIndex = null;
  // 找到第一个顺序值和数据中yAxis值匹配的index
  rawData.some((d, i) => {
    const dataYAxisIndex = d.yAxis || 0;
    if (dataYAxisIndex === dataIndex) {
      colorIndex = i;
      return true;
    }
    return false;
  });

  if (typeof colorIndex === 'number') {
    if (Array.isArray(colors)) {
      return colors[colorIndex];
    }

    if (typeof colors === 'function') {
      return colors(rawData[colorIndex].name);
    }
  }
}

/**
 * 根据状态获得颜色值
 *
 * @param {string} status 状态字符串
 *
 * @return {string} 颜色值
 * */
export function getStatusColor(status: string) {
  // map 放入函数内，以响应 theme 的动态变化
  const statusMap: Types.LooseObject = {
    error: themes['widgets-color-red'],
    red: themes['widgets-color-red'],

    warning: themes['widgets-color-orange'],
    orange: themes['widgets-color-orange'],

    normal: themes['widgets-color-blue'],
    blue: themes['widgets-color-blue'],

    success: themes['widgets-color-green'],
    green: themes['widgets-color-green'],

    none: themes['widgets-color-gray'],
    gray: themes['widgets-color-gray'],
  };

  return statusMap[status] || status || statusMap.normal;
}

const statusColorMap: { [key: string]: string } = {
  error: 'red',
  warning: 'orange',
  normal: 'blue',
  success: 'green',
  none: 'gray',
};
/**
 * 根据状态获得颜色名称
 *
 * @param {string} status 状态字符串
 *
 * @return {string} 颜色名称
 * */
export function getStatusColorName(status: string) {
  return statusColorMap[status] || status || statusColorMap.normal;
}

/**
 * 判断是否是有效数字
 *
 * @param v 输入值
 *
 * @return {boolean} 是否有效数字
 * */
export function isInvalidNumber(v: any) {
  return isNaN(v) || !isFinite(v) || v === '' || typeof v === 'object';
}

/**
 * 数字格式化小数位
 *
 * @param {number} num 输入数字
 * @param {number} decimal 小数位数，默认两位
 *
 * @return {string|number} 如果不是数字，返回横杠字符串。如果是数字，返回设定小数位的字符串。
 * */
export function numberDecimal(num: any, decimal = 2) {
  if (isInvalidNumber(num) || isInvalidNumber(decimal)) {
    return num;
  }

  // 小数位被转换为整数且不小于0
  let d = Math.max(0, Math.round(decimal));
  return Math.round(Number(num) * Math.pow(10, d)) / Math.pow(10, d);
}

/**
 * 数字格式化千分位
 *
 * @param {number} num 输入数字
 * @param {number} char 分隔符，默认为逗号
 *
 * @return {string|number} 如果不是数字，返回横杠字符串。如果是数字，返回千分位的字符串。
 * */
export function beautifyNumber(num: any, char = ',') {
  if (isInvalidNumber(num)) {
    return num;
  }
  const isNegative = num < 0;
  const numberArr = num.toString().split('.');
  let number = numberArr[0].replace('-', '');
  let result = '';
  while (number.length > 3) {
    result = char + number.slice(-3) + result;
    number = number.slice(0, number.length - 3);
  }
  if (number) {
    result = number + result;
  }
  // fix 保留了小数位数字
  if (numberArr[1]) {
    result = `${result}.${numberArr[1]}`;
  }
  // 处理负数
  if (isNegative) {
    result = `-${result}`;
  }
  return result;
}

/**
 * 空函数
 * */
export function noop() {}

/**
 * tooltip item 获取原始数据
 *
 * @param {object} config 图表配置项
 * @param {array} rawData 挂载于 this.rawData 上的原始数据
 * @param {number} item tooltip格式化函数的当前数据项
 *
 * @return {object} 寻找得到的原始数据，没有找到则返回空对象。
 * */
export function getRawData(config: { dataType?: string }, rawData: any[], item: any) {
  if (!rawData) {
    return {};
  }
  let originData = item.data || {};
  if (config.dataType !== 'g2' && Array.isArray(rawData)) {
    rawData.some((r) => {
      if (r.name === originData.type) {
        // 如果原数据中定义了 facet，需要额外判定 facet 字段
        if (r.facet && originData.facet !== r.facet) {
          return false;
        }
        originData = r;
        return true;
      }
      return false;
    });
  }

  return originData;
}

/**
 * 过滤对象中的key，常用于过滤传递给div的props，防止react invalid attribute warning
 *
 * @param {object} obj 过滤的对象
 * @param {array} keys 过滤的键列表
 *
 * @return {object} 过滤后的结果
 * */
export function filterKey(obj: Types.LooseObject, keys: string[]) {
  const result: Types.LooseObject = {};
  Object.keys(obj).forEach((key) => {
    if (keys.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * 处理图表库中的默认padding值的通用函数
 *
 * @param {padding} padding 用户配置的padding值
 * @param {object} config 合并了默认配置后的最终配置项
 * 以下参数非必选
 * @param {number} [defaultTop] 默认top padding
 * @param {number} [defaultRight] 默认right padding
 * @param {number} [defaultBottom] 默认bottom padding
 * @param {number} [defaultLeft] 默认left padding
 *
 * @return
 * */
// export function defaultPadding(padding, config, defaultTop, defaultRight, defaultBottom, defaultLeft) {
//   if (padding) {
//     return padding;
//   }
//
//   // 取默认配置中的padding
//   let top = defaultTop;
//   let right = defaultRight;
//   let bottom = defaultBottom;
//   let left = defaultLeft;
//
//   if (right !== 'auto' && Array.isArray(config.yAxis)) {
//     right = 45;
//   }
//
//   if (top !== 'auto' && (config.legend === false || (config.legend && config.legend.visible === false))) {
//     top = 16;
//   }
//   if (config.legend !== false && !(config.legend && config.legend.visible === false)) {
//     const { position = 'top' } = config.legend || {};
//     if (top !== 'auto' && position === 'bottom') {
//       top = 10;
//     }
//     if (position === 'bottom') {
//       bottom = 48;
//     }
//   }
//
//   // X轴标题
//   if (config.xAxis && config.xAxis.visible !== false && config.xAxis.alias && bottom !== 'auto') {
//     bottom += 14;
//   }
//
//   // Y轴标题
//   if (Array.isArray(config.yAxis)) {
//     config.yAxis.forEach((axis, yIndex) => {
//       if (yIndex === 0 && axis && axis.visible !== false && axis.alias && left !== 'auto') {
//         left += 20;
//       }
//       if (yIndex !== 0 && axis && axis.visible !== false && axis.alias && right !== 'auto') {
//         right += 20;
//       }
//     });
//   } else if (config.yAxis && config.yAxis.visible !== false && config.yAxis.alias && left !== 'auto') {
//     left += 20;
//   }
//
//   return [top, right, bottom, left];
// }

export interface customFormatterConfig {
  unit?: string;
  decimal?: number;
  grouping?: boolean | string;
}

/**
 * 自定义格式化函数，支持 单位、小数位、千分位 处理
 * */
export function customFormatter(config: customFormatterConfig) {
  const { unit, decimal = 6, grouping } = config;

  if (!unit && (decimal === undefined || decimal === null) && !grouping) {
    return null;
  }
  return function (v: any) {
    let result = v;
    let newUnit = unit || '';
    if (isInvalidNumber(v)) {
      return `${v}${newUnit}`;
    }

    // 小数位
    result = numberDecimal(result, decimal);

    // 千分位
    if (grouping) {
      result = beautifyNumber(result, typeof grouping === 'boolean' ? ',' : grouping);
    }

    return `${result}${newUnit}`;
  }
}
