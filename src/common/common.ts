import tinycolor from 'tinycolor2';
import { Colors, Types } from './types';
import themes from '../themes';
import { warn } from './log';

import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import merge from 'lodash/merge';
import colorMap from './colorMap';
export { isEqual, isEqualWith, merge };

export const requestAnimationFrame = window && window.requestAnimationFrame;

export const propertyMap = {
  axis: [
    'type',
    'showLast',
    'alias',
    'sync',
    'mask',
    'base',
    'exponent',
    'values',
    'range',
    'min',
    'max',
    'minLimit',
    'maxLimit',
    'nice',
    'ticks',
    'tickMethod',
    'tickCount',
    'maxTickCount',
    'tickInterval',
    'minTickInterval',
    'formatter',
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
export function propertyAssign(
  keys: string[],
  target: Types.LooseObject,
  source: Types.LooseObject | false,
) {
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
export function getParentSize(
  element: HTMLElement,
  width: number | string,
  height: number | string,
) {
  let w = width || '';
  let h = height || '';

  const parent = element && element.parentElement.parentElement;

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
export function getDataIndexColor(
  colors: Colors,
  rawData: any[],
  dataIndex: number,
): string | void {
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

/** 主题关键字 */
/** 颜色映射, 主要针对状态色 */
export function mapColors(colors: Colors) {
  let newColors = colors;
  if (typeof colors === 'string') {
    newColors = colors in colorMap ? (themes as any)[(colorMap as any)[colors]] : colors;
  } else if (Array.isArray(colors)) {
    newColors = colors.map((color: string) =>
      color in colorMap ? (themes as any)[(colorMap as any)[color]] : color,
    );
  }

  return newColors;
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

    // 运行色和主色有区分
    blue: themes['widgets-color-blue'],
    normal: themes['widgets-color-normal'],
    primary: themes['widgets-color-primary'],

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
  normal: 'normal',
  success: 'green',
  none: 'gray',
  primary: 'primary',
  blue: 'blue',
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

// 统一面积填充的渐变色逻辑
export function getAreaColors(areaColors: string[], isStack?: boolean) {
  return areaColors?.map((subColor: string) => {
     // 若包含自定义渐变则不处理
     if (subColor.includes('l') || subColor.includes('r') || subColor.includes('p')) {
      return subColor;
    } else if(isStack) {
      return subColor;
    } else {
      return `l(90) 0:${subColor}cc 0.7:${subColor}99 1:${subColor}10`;
    }
  });
}

/**
 * 判断是否是无效数字
 *
 * @param v 输入值
 *
 * @return {boolean} 是否无效数字
 * */
export function isInvalidNumber(v: any) {
  return isNaN(v) || !isFinite(v) || v === '' || typeof v === 'object';
}

/**
 * 数字格式化小数位
 *
 * @param {number} num 输入数字
 * @param {number} decimal 小数位数，默认一位
 *
 * @return {string|number} 如果不是数字，返回横杠字符串。如果是数字，返回设定小数位的字符串。
 * */
export function numberDecimal(num: any, decimal = 1) {
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

// 内置模糊匹配

// 统一存储单位显示
const GBUnit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
const GBSpeedUnit = ['B/S', 'KB/S', 'MB/S', 'GB/S', 'TB/S', 'PB/S', 'EB/S', 'ZB/S'];
const GiBUnit = ['BYTE', 'KIB', 'MIB', 'GIB', 'TIB', 'PIB', 'EIB', 'ZIB'];
const GiBSpeedUnit = ['BYTE/S', 'KIB/S', 'MIB/S', 'GIB/S', 'TIB/S', 'PIB/S', 'EIB/S', 'ZIB/S'];

const unitMap: any = {
  number: [],
  disk_1000: GBUnit,
  disk_1024: GiBUnit,
  bandwidth_1000: GBSpeedUnit,
  bandwidth_1024: GiBSpeedUnit,
  money: ['¥'],
  percent_1: ['%'],
  percent_100: ['%'],
  count: ['counts','k', 'm', 'b'],
  time: ['ps', 'ns', 'μs', 'ms', 's'],
  date: ['m', 'h', 'days', 'weeks', 'months', 'years']
};

 export const unitFamily:  any =  {
  disk_1000: {
    defaultUnit: 'B/S',
    units: GBSpeedUnit,
    upgradeFactor: 1000,
    otherUnits: {
      'BYTE': ['bytes']
    }
  },
  disk_1024: {
    defaultUnit: 'BYTE',
    units: GiBUnit,
    upgradeFactor: 1024,
    otherUnits: {
      'BYTE': ['bytes']
    }
  },
  bandwidth_1000: {
    defaultUnit: '',
    units: GBSpeedUnit,
    upgradeFactor: 1000,
    otherUnits: {
      'BYTE': ['bytes']
    }
  },
  bandwidth_1024: {
    defaultUnit: '¥',
    units: GiBSpeedUnit,
    upgradeFactor: 1024,
    otherUnits: {
      'BYTE/S': ['bytes/s']
    }
  },
  money: {
    defaultUnit: '¥',
    units: ['¥'],
    upgradeFactor: 1,
    otherUnits: null
  },
  percent_1: {
    defaultUnit: '%',
    units: ['%'],
    upgradeFactor: 100,
    otherUnits: null
  },
  percent_100: {
    defaultUnit: '%',
    units: ['%'],
    upgradeFactor: 1,
    otherUnits: null
  },
  countFrequency: {
    defaultUnit: 'count/s',
    units: ['count/s','count/m', 'count/h', 'count/d'],
    upgradeFactor: 1000,
    otherUnits: {
      'count/s': ['counts/s'],
      'count/m': ['counts/m'],
      'count/h': ['counts/h']
    }
  },
  countRate: {
    defaultUnit: 'count/s',
    units: ['count/s','k/s', 'm/s', 'b/s'],
    upgradeFactor: 1000,
    otherUnits: {
      counts: ['', 'count']
    }
  },
  count: {
    defaultUnit: 'count',
    units: ['count','k', 'm', 'b'],
    upgradeFactor: 1000,
    otherUnits: {
      counts: ['', 'counts']
    }
  },
  time: {
    defaultUnit: 's',
    upgradeFactor: {
      s: 1000,
      m: 60,
      h: 24,
      // days: 1,
      // weeks: 7,
      // months: 12,
      // years: 12
    },
    units: ['ps', 'ns', 'μs', 'ms', 's', 'm', 'h'],
    otherUnits: null
  }
};

export interface customFormatterConfig {
  unit?: string;
  decimal?: number;
  grouping?: boolean | string;
  needUnitTransform?: boolean;
  unitTransformTo?: string;
  valueType?:
    | 'number'
    | 'disk_1000'
    | 'disk_1024'
    | 'bandwidth_1000'
    | 'bandwidth_1024'
    | 'money'
    | 'percent_1'
    | 'percent_100'
    | 'time'
    | 'count';
  hideZeroUnit?: boolean;
  customUnitList?: string[];
}

/**
 * 自定义格式化函数，支持 单位、小数位、千分位 处理
 * 包含云体系下的单位处理
 * valueType 表示进位方式
 * unit 为当前单位， 默认为当前类型的最小单位
 * needUnitTransform 为是否需要转换
 * unitTransformTo 为目标单位
 * 如：
 * disk - b、kb、mb
 * bandwidth - b/s、kb/s、mb/s
 * money - ¥
 * percent - %
 * count - count、k、m、b
 * time - ms、s
 * */
export function customFormatter(config: customFormatterConfig) {
  const { unit, decimal = 1, grouping, needUnitTransform, unitTransformTo, valueType, hideZeroUnit = false } = config;

  if (!unit && (decimal === undefined || decimal === null) && !grouping && !needUnitTransform) {
    return null;
  }
  return function (v: any) {
    // 柱状图极端情况特殊处理
    if (typeof v === 'string' && v.startsWith('widgets-pad-')) {
      return '';
    }

    let result = v;
    let newUnit = unit || '';

    if (isInvalidNumber(v)) {
      return `${v}${newUnit}`;
    }

    
    if(needUnitTransform && (unit || valueType)) {
      if (valueType === 'percent_1') {
        result = result * 100;
      }
      const { value, unit: transformUnit } = unitConversion(result, unit, decimal, unitTransformTo, valueType);

      result = value;
      newUnit = transformUnit;
    }

    // 小数位
    result = numberDecimal(result, decimal);

    // 千分位
    if (grouping || valueType === 'money' || valueType === 'count') {
      result = beautifyNumber(result, typeof grouping === 'boolean' ? ',' : grouping);
    }

    if(hideZeroUnit && Number(result) === 0) {
      newUnit = '';
    }
  
    return valueType === 'money' ? `${newUnit}${result}` : `${result}${newUnit}`;
  };
}

export function findUnitArray(input: string, valueType?: string): Array<string> {
  if (valueType) {
    // 定义待查找的数组列表
    const unitArrays = unitMap[valueType];

    // 遍历待查找的数组列表
    if (unitArrays.includes(input)) {
      // 如果输入值存在于当前数组中，返回该数组
      return unitArrays;
    }
  } else {
    let targetArray: any = []
    Object.keys(unitMap).forEach((key: string) => {
      if (unitMap[key].includes(input)) {
        targetArray = unitMap[key];
      }
    });

    return targetArray;
  }

  // 若遍历完所有数组仍未找到匹配项，返回 []
  return [];
}

/**
 * 统一进位单位格式化
 * */
export function unitConversion(value: any, unit?: any, decimal?: number, unitTransformTo?: any, valueType?: string) {
  let currentUnit = unit ? unit.toUpperCase() : unitMap[valueType][0];
  // 单位的特殊处理，后期统一从unitFamily中取
  if (valueType === 'time') {
    currentUnit = unit ?? 's';
  }
  const units = findUnitArray(currentUnit, valueType);
  let finalUnit = unit;

  const threshold = currentUnit?.includes('IB') || currentUnit?.includes('BYTE') ? 1024 : 1000;

  let index = units.indexOf(currentUnit);
  if (index === -1) {
    return {
      value,
      unit,
    };
  }
  if (unitTransformTo) {
    let UpUnitTransformTot = unitTransformTo.toUpperCase();
    let targetUnitIndex = units.indexOf(UpUnitTransformTot);
    if (index === targetUnitIndex) {
      return {
        value,
        unit,
      };
    }
    const distance = Math.abs(index - targetUnitIndex);
    if (index > targetUnitIndex) {
      value *= Math.pow(threshold, distance);
    } else {
      value /= Math.pow(threshold, distance);
    }
    finalUnit = unitTransformTo;
  }
  if (!unitTransformTo) {
    while (value >= threshold && index < units.length - 1) {
      value /= threshold;
      index++;
    }

    finalUnit = units[index];
  }

  return {
    value: numberDecimal(value, decimal),
    unit: finalUnit,
  };
}

function generateScaledArray(dataSize: number) {
  const max = 0.75;
  const min = 0.1;
  const scaleArray = [max];
  const distance = 0.1;
  const mean = (0.4 - min) / (dataSize - 5);

  // 前五个分差为0.1
  for (let i = 1; i < 6; i++) {
    scaleArray.push(max - (i) * distance);
  }

  // 后面均分
  for (let i = 6; i < dataSize - 1; i++) {
    scaleArray.push(0.4 - mean * (i - 5))
  }

  scaleArray.push(min);
  return scaleArray
}

/**
 * 获取指定颜色的顺序色
 *  *
 * @param {string} primaryColor 指定颜色
 * @param {string} backgroundColor 当前背景色
 * @param {number} linearCount 顺序色个数
 * @param {string} type 是否为中心取色
 * */
export function calcLinearColor(primaryColor: string, backgroundColor?: string, linearCount?: number, type?: string, needDistribution?: boolean) {
  const linear = [];
  const front = tinycolor(primaryColor);
  const { h, s, v } = front.toHsv();
  const { v: backValue } = tinycolor(backgroundColor).toHsv();
  const isLight = backValue > 0.5;
  const whiteV = tinycolor("#ffffff").toHsv().v;

  const count = linearCount + 1;

  // 中心取色逻辑
  if (type === 'center') {
    let colorString;
    for (let i = 1; i < count + 1; i++) {
      colorString = tinycolor({
        h,
        s: Math.round((i * s * 100) / count) + 1,
        v: Math.round(((i * (v - whiteV)) / count + whiteV) * 100),
      }).toHexString();

      if (i % 2 === 0) {
        linear.push(colorString);
      } else if (colorString === primaryColor) {
        linear.push(colorString);
      }
    }

    for (let i = count; i > Math.floor(count/ 2) + 1; i--) {
      colorString = tinycolor.mix("#000000", primaryColor, (i - 2) * 10).toHexString();
      linear.push(colorString);
    }

    if (linear[Math.floor(linearCount / 2)] !== primaryColor) {
      linear[Math.floor(linearCount / 2)] = primaryColor;
    }
  } else {
    // 如果数量超过10，则有限调整前5的颜色梯度差值，避免过于相近
    // 同时需要防止颜色过于趋向于白/黑
    if (needDistribution) {
      const distributionArray = generateScaledArray(count);

      // console.log(distributionArray)
      for (let i = count - 1; i > 0; i--) {
        let colorString;
        // 亮色模式
        if (isLight) {
          colorString = tinycolor({
            h,
            s: distributionArray[count - i - 1] * s * 100,
            // v: v * 100,
            v: Math.round(((i * (v - backValue)) / count + backValue) * 100),
          }).toHexString();
        } else {
          // 暗色模式
          colorString = tinycolor.mix(backgroundColor, primaryColor, i * 10).toHexString();
        }

        linear.push(colorString);
      }
    } else {
      for (let i = count - 1; i > 0; i--) {
        let colorString;
        // 亮色模式
        if (isLight) {
          colorString = tinycolor({
            h,
            s: Math.round((i / count) * s * 100),
            v: Math.round(((i * (v - backValue)) / count + backValue) * 100),
          }).toHexString();
        } else {
          // 暗色模式
          colorString = tinycolor.mix(backgroundColor, primaryColor, i * 10).toHexString();
        }
        linear.push(colorString);
      }
    }
  }

  return linear;
}

/**
 * 递归遍历树节点
 * */
export function traverseTree(node: any, itemFunction?: any) {
  if (node.children) {
    node.children.map((el: any) => {
      itemFunction && itemFunction(el);
      traverseTree(el, itemFunction);
    });
  }
  return node;
}

// util需要抽取出来
const isObjectLike = (value: any): value is object => {
  /**
   * isObjectLike({}) => true
   * isObjectLike([1, 2, 3]) => true
   * isObjectLike(Function) => false
   */
  return typeof value === 'object' && value !== null;
};

const isPlainObject = (value: any): value is object => {
  /**
   * isObjectLike(new Foo) => false
   * isObjectLike([1, 2, 3]) => false
   * isObjectLike({ x: 0, y: 0 }) => true
   */
  if (!isObjectLike(value) || !isType(value, 'Object')) {
    return false;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
};

const MAX_MIX_LEVEL = 5; // 最大比对层级
const toString = {}.toString;

// 类型检测
const isType = (value: any, type: string): boolean => toString.call(value) === '[object ' + type + ']';

const isArray = (value: any): value is Array<any> => {
  return isType(value, 'Array');
};

/***
 * @param {any} dist
 * @param {any} src
 * @param {number} level 当前层级
 * @param {number} maxLevel 最大层级
 */
const deep = (dist: any, src: any, level?: number, maxLevel?: number) => {
  level = level || 0;
  maxLevel = maxLevel || MAX_MIX_LEVEL;
  for (const key in src) {
    if (Object.prototype.hasOwnProperty.call(src, key)) {
      const value = src[key];
      if (!value) {
        // null 、 undefined 等情况直接赋值
        dist[key] = value;
      } else {
        if (isPlainObject(value)) {
          if (!isPlainObject(dist[key])) {
            dist[key] = {};
          }
          if (level < maxLevel) {
            deep(dist[key], value, level + 1, maxLevel);
          } else {
            // 层级过深直接赋值，性能问题
            dist[key] = src[key];
          }
        } else if (isArray(value)) {
          dist[key] = [];
          dist[key] = dist[key].concat(value);
        } else {
          dist[key] = value;
        }
      }
    }
  }
};

/**
 * deepAssign 功能类似 deepMix
 * 不同点在于 deepAssign 会将 null undefined 等类型直接覆盖给 source
 */
export const deepAssign = (rst: any, ...args: any[]) => {
  for (let i = 0; i < args.length; i += 1) {
    deep(rst, args[i]);
  }
  return rst;
};

// 判断一个字符串中是否包含中文字符
export function containsChinese(str: string) {
  return /[\u4e00-\u9fa5]/.test(str);
}

// 均值采样函数
export function sampleDataWithNoise(chartData: number[], sampleRate: number = 0.5): number[] {
  /**
   *  输入的数字数组
   * sampleRate: 采样率，取值范围为 (0, 1]
   * 返回值: 采样后的数组，同时尽可能保留噪声数据
   */

  if (sampleRate <= 0 || sampleRate > 1) {
    throw new Error("Sample rate must be between 0 and 1.");
  }

  // 确保采样率不为1时执行采样逻辑，否则直接返回原数组
  if (sampleRate < 1) {
    // 定义一个简单的噪声检测逻辑，这里以数据点与前后点差值的绝对值超过平均差值的两倍作为噪声的简单判断
    const avgDiff = calculateAverageDifference(chartData);
    const noiseThreshold = avgDiff * 2;

    // 筛选出噪声数据
    const noiseIndices: number[] = chartData
      .map((value, index, array) => ({
        value,
        index,
        isNoise: index > 0 && index < array.length - 1
          ? Math.abs(value - array[index - 1]) > noiseThreshold || Math.abs(value - array[index + 1]) > noiseThreshold
          : false, // 边界处理
      }))
      .filter(item => item.isNoise)
      .map(item => item.index);

    // 采样逻辑，优先保留噪声数据，再根据采样率采样其他数据
    const sampledData: number[] = [];
    let includedNoise = new Set<number>();

    // 先加入噪声数据
    for (const index of noiseIndices) {
      if (!includedNoise.has(index)) {
        sampledData.push(chartData[index]);
        includedNoise.add(index);
      }
    }

    // 根据采样率采样剩余数据
    for (let i = 0; i < chartData.length; i++) {
      if (!includedNoise.has(i)) {
        if (Math.random() < sampleRate) {
          sampledData.push(chartData[i]);
        }
      }
    }

    // 保证数据的顺序性，如果需要的话，这里可以进行排序，但通常保留原序列的相对顺序较好
    return sampledData;
  } else {
    return [...chartData];
  }
}

function calculateAverageDifference(chartData: number[]): number {
  let sumOfDifferences = 0;
  for (let i = 1; i < chartData.length; i++) {
    sumOfDifferences += Math.abs(chartData[i] - chartData[i - 1]);
  }
  return chartData.length > 1 ? sumOfDifferences / (chartData.length - 1) : 0;
}