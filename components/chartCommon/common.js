import G2 from '@antv/g2';
import { color } from '../theme/normal';

export const requestAnimationFrame = (window && window.requestAnimationFrame) || G2.DomUtil.requestAnimationFrame;

// name: 类型 ，相当于type
// stash: 每组类型的一些信息集，注意，要符合G2语法
// Util: G2的Util
// dotDom: 图例的图标dom
// chart: chart实例
// export function g2LegendFilter(name, stash, Util, dotDom, chart, filterString='type'){
//   let obj = stash[name];
//   let filterNames = [];
//   obj.isChecked = obj.isChecked ? false : true;
//   Util.each(stash, function (v) {
//     if (v.isChecked) {
//       dotDom[v.index].style.background = v.color;
//       filterNames.push(v.name);
//     } else {
//       dotDom[v.index].style.background = '#999';
//     }
//   });
//
//   chart.filter(filterString, filterNames);
//   chart.repaint();
// }

export const propertyMap = {
  xAxis: ['type', 'alias', 'range', 'ticks', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'minLimit', 'maxLimit', 'mask', 'base', 'exponent'],
  yAxis: ['type', 'alias', 'range', 'ticks', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'minLimit', 'maxLimit', 'mask', 'base', 'exponent'],
};

export function propertyAssign(keys, target, source) {
  keys.forEach((key) => {
    // 仅判断undefined的情况
    if (source[key] !== undefined) {
      target[key] = source[key];
    }
  });

  return target;
}

/**
 * 找到对应元素的父元素的大小
 *
 * @param {element} element Html元素
 * @param {number} width props中传递的width属性
 * @param {number} height props中传递的height属性
 *
 * @return {array} 宽和高的数组
 * */
export function getParentSize(element, width, height) {
  const parent = element && element.parentElement;
  let w = '', h = '';
  if (width) {
    w = width;
  } else if (parent) {
    w = parent.clientWidth;
  }
  if (height) {
    h = height;
  } else if (parent) {
    h = parent.clientHeight;
  }
  return [w, h];
}

/**
 * 从Highcharts格式数据中找到对应index的颜色
 *
 * @param {array} colors 颜色数组
 * @param {array} rawData Highcharts 格式的数据
 * @param {number} dataIndex y轴对应的index
 * */
export function getDataIndexColor(colors, rawData, dataIndex) {
  let colorIndex = null;
  // 找到第一个顺序值和数据中yAxis值匹配的index
  rawData.some((d, i) => {
    const dataYAxisIndex = d.yAxis || 0;
    if (dataYAxisIndex === dataIndex) {
      colorIndex = i;
      return true;
    }
  });

  if (colorIndex !== null) {
    return colors[colorIndex];
  }
}

const statusMap = {
  error: color.widgetsColorRed,
  red: color.widgetsColorRed,

  warning: color.widgetsColorOrange,
  orange: color.widgetsColorOrange,

  normal: color.widgetsColorBlue,
  blue: color.widgetsColorBlue,

  success: color.widgetsColorGreen,
  green: color.widgetsColorGreen,

  none: color.widgetsColorGray,
  gray: color.widgetsColorGray,
};

export function getStatusColor(status) {
  return statusMap[status] || status || statusMap.normal;
}

const statusColorMap = {
  error: 'red',
  warning: 'orange',
  normal: 'blue',
  success: 'green',
  none: 'gray',
};
export function getStatusColorName(status) {
  return statusColorMap[status] || status || statusColorMap.normal;
}

/**
 * 判断是否是有效数字
 *
 * @param v 输入值
 *
 * @return {boolean} 是否有效数字
 * */
export function isInvalidNumber(v) {
  return isNaN(v) || !isFinite(v) || v === null;
}

/**
 * 数字格式化小数位
 *
 * @param {number} num 输入数字
 * @param {number} decimal 小数位数，默认两位
 *
 * @return {string|number} 如果不是数字，返回横杠字符串。如果是数字，返回设定小数位的字符串。
 * */
export function numberDecimal(num, decimal = 2) {
  if (isInvalidNumber(num) || isInvalidNumber(decimal)) {
    return '-';
  }

  return Math.round(Number(num) * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function beautifyNumber(num, char = ',') {
  if (isInvalidNumber(num)) {
    return '-';
  }
  const isNegative = num < 0;
  let number = num.toString().split('.')[0].replace('-', ''), result = '';
  while (number.length > 3) {
    result = char + number.slice(-3) + result;
    number = number.slice(0, number.length - 3);
  }
  if (number) {
    result = number + result;
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
