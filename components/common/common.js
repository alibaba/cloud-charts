import G2 from '@antv/g2';
import { color } from '../theme/index';

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
  xAxis: ['type', 'alias', 'range', 'ticks', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'minLimit', 'maxLimit', 'nice', 'values', 'mask', 'base', 'exponent', 'sync'],
  yAxis: ['type', 'alias', 'range', 'ticks', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'minLimit', 'maxLimit', 'nice', 'values', 'mask', 'base', 'exponent', 'sync'],
};

export function propertyAssign(keys, target, source) {
  if (!source) {
    return target;
  }
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
  let w = width || '',
    h = height || '';

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
  return [w, h];
}

export function pxToNumber(px) {
  return Number(px.replace('px', ''));
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
    return false;
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
export function numberDecimal(num, decimal = 2) {
  if (isInvalidNumber(num) || isInvalidNumber(decimal)) {
    return '-';
  }

  return Math.round(Number(num) * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

/**
 * 数字格式化千分位
 *
 * @param {number} num 输入数字
 * @param {number} char 分隔符，默认为逗号
 *
 * @return {string|number} 如果不是数字，返回横杠字符串。如果是数字，返回千分位的字符串。
 * */
export function beautifyNumber(num, char = ',') {
  if (isInvalidNumber(num)) {
    return '-';
  }
  const isNegative = num < 0;
  const numberArr = num.toString().split('.');
  let number = numberArr[0].replace('-', ''),
    result = '';
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
export function getRawData(config, rawData, item) {
  if (!rawData) {
    return {};
  }

  let originData = (item.point && item.point._origin) || {};
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
export function filterKey(obj, keys) {
  const result = {};
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
export function defaultPadding(padding, config, defaultTop, defaultRight, defaultBottom, defaultLeft) {
  if (padding) {
    return padding;
  }

  // 取默认配置中的padding
  let top = defaultTop, right = defaultRight, bottom = defaultBottom, left = defaultLeft;

  if (right !== 'auto' && Array.isArray(config.yAxis)) {
    right = 45;
  }
  if (top !== 'auto' && config.legend === false) {
    top = 16;
  }
  if (config.legend !== false) {
    const { position = 'top', align } = config.legend || {};
    if (top !== 'auto' && position === 'bottom') {
      top = 16;
    }
    if (bottom !== 'auto' && position === 'bottom') {
      bottom = 64;
    }
  }

  return [ top, right, bottom, left ];
}
