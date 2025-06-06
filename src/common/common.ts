import tinycolor from 'tinycolor2';
import { Colors, Types } from './types';
import themes from '../themes';
import { warn } from './log';
import { getText } from '../ChartProvider/index';
import LanguageMap from '../locales';
// @ts-ignore
import worldGeo from '../plugins/worldmap/data/world-without-antarctic.json';

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
      return `l(90) 0:${subColor}70 0.7:${subColor}66 1:${subColor}03`;
    }
  });
}

/**
 * 判断是否是无效数字
 *
 * @param v 输入值
 * 增加判断V中有大写字母，目的是为了区分region地址和科学记数法
 *
 * @return {boolean} 是否无效数字
 * */
export function isInvalidNumber(v: any) {
  return isNaN(v) || !isFinite(v) || v === '' || typeof v === 'object' || /[A-Z]/.test(v);
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
  dollar: ['$'],
  percent_1: ['%'],
  percent_100: ['%'],
  count: ['counts', 'k', 'm', 'b'],
  counts: ['counts', 'k', 'm', 'b'],
  time: ['ps', 'ns', 'μs', 'ms', 's'],
  date: ['ms', 's', 'm', 'h', 'days', 'weeks', 'months', 'years'],
};

function convertTimeUnit(
  value: number,
  unit?: 'ms' | 's' | 'm' | 'h' | 'days' | 'weeks' | 'months' | 'years',
  decimal?: number,
): any {
  let resultValue: number = value;
  const currentUnit = !unitMap['date'].includes(unit) || !unit ? 'ms' : unit;

  const conversions = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000, // 这里假设一个月为30天
    years: 365 * 24 * 60 * 60 * 1000, // 这里假设一年为365天
  };
  if (currentUnit !== 'ms') {
    resultValue = resultValue * conversions[currentUnit];
  }

  let resultUnit: string = currentUnit;

  if (resultValue >= conversions.years) {
    resultValue = numberDecimal(resultValue / conversions.years, decimal);
    resultUnit = 'y';
  } else if (resultValue >= conversions.months) {
    resultValue = numberDecimal(resultValue / conversions.months, decimal);
    resultUnit = 'months';
  } else if (resultValue >= conversions.weeks) {
    resultValue = numberDecimal(resultValue / conversions.weeks, decimal);
    resultUnit = 'weeks';
  } else if (resultValue >= conversions.days) {
    resultValue = numberDecimal(resultValue / conversions.days, decimal);
    resultUnit = 'days';
  } else if (resultValue >= conversions.h) {
    resultValue = numberDecimal(resultValue / conversions.h, decimal);
    resultUnit = 'h';
  } else if (resultValue >= conversions.m) {
    resultValue = numberDecimal(resultValue / conversions.m, decimal);
    resultUnit = 'm';
  } else if (resultValue >= conversions.s) {
    resultValue = numberDecimal(resultValue / conversions.s, decimal);
    resultUnit = 's';
  } else {
    resultUnit = 'ms';
  }

  return {
    value: resultValue,
    unit: resultUnit,
    formattedValue: `${resultValue}${resultUnit}`,
  };
}

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
  customCarryUnits?: string | string[];
  customCarryThreshold?: number;
  addonTextAfter?: string;
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
  const {
    unit,
    decimal = 1,
    grouping = true,
    needUnitTransform,
    unitTransformTo,
    valueType,
    hideZeroUnit = false,
    customCarryUnits = [],
    customCarryThreshold,
    addonTextAfter = ''
  } = config;

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

    if (needUnitTransform && (unit || valueType)) {
      if (valueType === 'percent_1') {
        result = result * 100;
      }
      const { value, unit: transformUnit } = unitConversion(
        result,
        unit,
        decimal,
        unitTransformTo,
        valueType,
        customCarryUnits,
        customCarryThreshold,
        addonTextAfter
      );

      result = value;
      newUnit = transformUnit;

      // count计数时不显示单位
      if (valueType === 'count' && newUnit === 'counts') {
        newUnit = '';
      }
    }

    // 小数位
    result = numberDecimal(result, decimal);

    // 千分位
    if (grouping || ['money', 'dollar', 'count'].includes(valueType)) {
      result = beautifyNumber(result, typeof grouping === 'boolean' ? ',' : grouping);
    }

    if (hideZeroUnit && Number(result) === 0) {
      newUnit = '';
    }

    return ['money', 'dollar'].includes(valueType) ? `${newUnit}${result}` : `${result}${newUnit}`;
  };
}

export function findUnitArray(input: string, valueType?: string): Array<string> {
  if (valueType) {
    // 定义待查找的数组列表
    const unitArrays = unitMap[valueType];

    // 遍历待查找的数组列表
    if (unitArrays?.includes(input)) {
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
export function unitConversion(
  originValue: any,
  unit?: any,
  decimal?: number,
  unitTransformTo?: any,
  valueType?: string,
  customCarryUnits?: string | string[],
  customCarryThreshold?: number,
  addonTextAfter?: string,
) {
  const isNegative = originValue < 0;
  let value = Math.abs(originValue);
  const suffixUnit = addonTextAfter || '';

  // 增加自定义进位
  if (valueType === 'custom') {
    let threshold = customCarryThreshold || 1000;
    const units = typeof customCarryUnits === 'string' ? customCarryUnits.split(',') : customCarryUnits || ["", "k", "m", "b"];
    let currentUnit = unit || units[0] || '';
    let finalUnit = unit || '';

    let index = units.indexOf(currentUnit);
    while (value >= threshold && index < units.length - 1) {
      value /= threshold;
      index++;
    }

    finalUnit = units[index] || '';
    const finalValue = numberDecimal(value, decimal);
    return {
      value: typeof finalValue === 'number' ? (isNegative ? -finalValue : finalValue) : '-',
      unit: finalUnit + suffixUnit,
    };
  }

  if (valueType === 'date') {
    const { value: finalValue, unit: finalUnit } = convertTimeUnit(value, unit, decimal) ?? {};
    return {
      value: typeof finalValue === 'number' ? (isNegative ? -finalValue : finalValue) : '-',
      unit: (finalUnit ?? '') + suffixUnit,
    };
  } else {
    let currentUnit = unit ? unit.toUpperCase() : unitMap[valueType][0];

    // 只有流量、存储单位大写
    if (currentUnit && !['disk_1000', 'disk_1024', 'bandwidth_1000', 'bandwidth_1024'].includes(valueType)) {
      currentUnit = currentUnit.toLowerCase();
    }

    // 单位的特殊处理，后期统一从unitFamily中取
    if (valueType === 'time') {
      currentUnit = unit ?? 's';
    }
    const units = findUnitArray(currentUnit, valueType);
    let finalUnit = unit;

    const threshold = valueType?.includes('1024') ? 1024 : 1000;

    let index = units.indexOf(currentUnit);
    if (index === -1) {
      return {
        value: originValue,
        unit: unit + suffixUnit,
      };
    }
    if (unitTransformTo) {
      let UpUnitTransformTot = unitTransformTo.toUpperCase();
      let targetUnitIndex = units.indexOf(UpUnitTransformTot);
      if (index === targetUnitIndex) {
        return {
          value: originValue,
          unit: unit + suffixUnit,
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

    if (valueType === 'count' && finalUnit === 'counts') {
      finalUnit = '';
    }

    const finalValue = numberDecimal(value, decimal);

    return {
      value: typeof finalValue === 'number' ? (isNegative ? -finalValue : finalValue) : '-',
      unit: finalUnit + suffixUnit,
    };
  }
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
          colorString = tinycolor.mix(backgroundColor, primaryColor, distributionArray[count - i - 1] * 100).toHexString();
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
export function sampleDataWithNoise(chartData: number[], sampleRate: number = 0.5, options?: any): number[] {
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
    // 保留起始点和结束点
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

const chinaBorderGeoJSON = worldGeo?.features?.find((item: any) => item.properties?.name === 'China');
// 点在多边形内的算法（射线法）
function pointInPolygon(point: number[], polygon: any[]) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * 判断一个地点是否在中国境内
 * @param latitude number 维度
 * @param longitude number 经度
 */
export function isInsideChina(latitude: number, longitude: number) {
  if (!chinaBorderGeoJSON) return false;
  // 遍历GeoJSON中的每个多边形，检查点是否在其中一个多边形内
  for (const polygon of chinaBorderGeoJSON.geometry.coordinates) {
    if (pointInPolygon([longitude, latitude], polygon[0])) {
      return true; // 点在多边形内，即在中国境内
    }
  }
  return false; // 点不在任何多边形内，即不在中国境内
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 59 * 60 * 1000;
const DAY_MS = 22 * HOUR_MS;
const YEAR_MS = 365 * DAY_MS;
// 跨度判定列表：大于半年、大于28天、大于22小时、大于59分钟、大于一分钟、（小于分钟）
// todo后期改为跨度是否跨天/跨年/跨月判定
const timeList = [0.51 * YEAR_MS, 28 * DAY_MS, DAY_MS, HOUR_MS, MINUTE_MS];

function getTimeIndex(t: number): number {
  for (let i = 0; i < timeList.length; i++) {
    if (t >= timeList[i]) {
      return i;
    }
  }
  return timeList.length;
}

// 取数据的跨度和间距两种值，跨度决定上限，间距决定下限。
export function getAutoMask(def: Types.ScaleOption, data: any, language?: keyof typeof LanguageMap): string {
  if (data.length < 2) {
    return getText('defaultMask', language, null);
  }
  // 假设数据是升序的，且传入为 Date 能识别的格式
  data?.sort((a: any, b: any) => a[0] - b[0]);

  // 只取第一、二个元素的间距
  const min = new Date(data[0][0]).getTime();
  const minFirst = new Date(data[1][0]).getTime();
  const max = new Date(data[data.length - 1][0]).getTime();
  if (isNaN(min) || isNaN(max) || isNaN(minFirst)) {
    return getText('defaultMask', language, null);
  }
  const span = max - min; // 间隔
  const interval = def.tickInterval || minFirst - min; // 跨度

  const spanIndex = getTimeIndex(span);
  const intervalIndex = getTimeIndex(interval);

  const maskMap = getText('timeMask', language, null);

  // 如果记录表中没有记录，则使用默认 mask
  return maskMap[intervalIndex][spanIndex] || getText('defaultMask', language, null);
}

// 获取时间戳刻度
export function getHourlyTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0); // 设置分钟、秒和毫秒为0
  return date.getTime();
}
export function generateTimestamps(
  start: number,
  end: number,
  interval: number,
  showLast?: boolean,
  showInteger?: boolean,
) {
  const timestamps: number[] = [];
  const newStart = showInteger ? getHourlyTimestamp(start) : start;
  const newEnd = showInteger ? getHourlyTimestamp(end) : end;
  for (let i = newStart; i <= newEnd; i += interval) {
    timestamps.push(i);
  }

  if (showLast && !timestamps.includes(end) && end) {
    timestamps.push(end);
  }
  return timestamps;
}

// 根据config获取进位相关配置项
export function getFormatConfig(config: any) {
  if (
    typeof config.yAxis === 'object' &&
    !Array.isArray(config.yAxis) &&
    config?.yAxis?.needUnitTransform &&
    typeof config.legend !== 'boolean' &&
    config.legend?.needUnitTransform === undefined
  ) {
    config.legend.needUnitTransform = config.legend.needUnitTransform ?? config?.yAxis?.needUnitTransform;
    config.legend.unit = config.legend.unit ?? config?.yAxis?.unit;
    config.legend.unitTransformTo = config.legend.unitTransformTo ?? config?.yAxis?.unitTransformTo;
    config.legend.valueType = config.legend.valueType ?? config?.yAxis?.valueType;
    config.legend.customCarryUnits = config.legend.customCarryUnits ?? config?.yAxis?.customCarryUnits;
    config.legend.customCarryThreshold = config.legend.customCarryThreshold ?? config?.yAxis?.customCarryThreshold;
    config.legend.addonTextAfter = config.legend.addonTextAfter ?? config?.yAxis?.addonTextAfter;
  }

  if (typeof config.legend === 'object') {
    config.legend.grouping = config.legend.grouping ?? config?.yAxis?.grouping;
    config.legend.decimal = config.legend.decimal ?? config?.yAxis?.decimal;
  }

  // 进位相关配置项
  let formatConfig: any;
  // 当legend中配置了单位相关信息时，直接使用tooltip的配置项，否则使用y轴配置项
  if (
    typeof config?.legend === 'object' &&
    (config?.legend?.valueType ||
      config?.legend?.unit ||
      config?.legend?.needUnitTransform ||
      config?.legend?.unitTransformTo ||
      config?.legend?.decimal)
  ) {
    formatConfig = config.legend;
  } else if (Array.isArray(config.yAxis) && config.yAxis.length >= 2) {
    // 双轴
    formatConfig = config.yAxis;
  } else if (Array.isArray(config.yAxis)) {
    formatConfig = config?.yAxis?.[0] ?? {};
  } else {
    formatConfig = config?.yAxis ?? {};
  }

  return formatConfig;
}

type DataPoint = [number, number | null];
type InputSeries = { name: string; data: [number, number][] };
type OutputSeries = { name: string; data: DataPoint[] };

/**
 * fillMissingTimestamps 数据补齐功能
 */
export function fillMissingTimestamps(
  input: InputSeries[],
  fillValue: null | 0 = null,
  tickInterval?: number,
): OutputSeries[] {
  // 收集所有时间戳并计算最小间隔
  const allTimestamps = input.flatMap((series) => series.data.map((d) => d[0]));
  const sortedTimestamps = [...new Set(allTimestamps)].sort((a, b) => a - b);

  // 计算最小时间间隔
  let minInterval = Infinity;
  if (tickInterval) {
    minInterval = tickInterval;
  } else {
    for (let i = 1; i < sortedTimestamps.length; i++) {
      const interval = sortedTimestamps[i] - sortedTimestamps[i - 1];
      minInterval = Math.min(minInterval, interval);
    }
  }

  // 生成完整时间序列
  const start = Math.min(...sortedTimestamps);
  const end = Math.max(...sortedTimestamps);
  const completeTimestamps: number[] = [];
  for (let t = start; t <= end; t += minInterval || 1) {
    completeTimestamps.push(t);
  }

  // 填充缺失数据
  return input.map((series) => {
    const valueMap = new Map(series.data.map(([t, v]) => [t, v]));
    return {
      name: series.name,
      data: completeTimestamps.map((t) => [t, valueMap.get(t) ?? fillValue]) as DataPoint[],
    };
  });
}
