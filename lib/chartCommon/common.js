'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propertyMap = exports.requestAnimationFrame = undefined;
exports.propertyAssign = propertyAssign;
exports.getParentSize = getParentSize;
exports.getDataIndexColor = getDataIndexColor;
exports.getStatusColor = getStatusColor;
exports.getStatusColorName = getStatusColorName;
exports.isInvalidNumber = isInvalidNumber;
exports.numberDecimal = numberDecimal;
exports.beautifyNumber = beautifyNumber;
exports.noop = noop;

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _normal = require('../theme/normal');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestAnimationFrame = exports.requestAnimationFrame = window && window.requestAnimationFrame || _g2.default.DomUtil.requestAnimationFrame;

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

var propertyMap = exports.propertyMap = {
  xAxis: ['type', 'alias', 'range', 'ticks', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'minLimit', 'maxLimit', 'mask', 'base', 'exponent'],
  yAxis: ['type', 'alias', 'range', 'ticks', 'tickCount', 'tickInterval', 'formatter', 'min', 'max', 'minLimit', 'maxLimit', 'mask', 'base', 'exponent']
};

function propertyAssign(keys, target, source) {
  keys.forEach(function (key) {
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
function getParentSize(element, width, height) {
  var parent = element && element.parentElement;
  var w = '',
      h = '';
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
function getDataIndexColor(colors, rawData, dataIndex) {
  var colorIndex = null;
  // 找到第一个顺序值和数据中yAxis值匹配的index
  rawData.some(function (d, i) {
    var dataYAxisIndex = d.yAxis || 0;
    if (dataYAxisIndex === dataIndex) {
      colorIndex = i;
      return true;
    }
  });

  if (colorIndex !== null) {
    return colors[colorIndex];
  }
}

var statusMap = {
  error: _normal.color.widgetsColorRed,
  red: _normal.color.widgetsColorRed,

  warning: _normal.color.widgetsColorOrange,
  orange: _normal.color.widgetsColorOrange,

  normal: _normal.color.widgetsColorBlue,
  blue: _normal.color.widgetsColorBlue,

  success: _normal.color.widgetsColorGreen,
  green: _normal.color.widgetsColorGreen,

  none: _normal.color.widgetsColorGray,
  gray: _normal.color.widgetsColorGray
};

function getStatusColor(status) {
  return statusMap[status] || status || statusMap['normal'];
}

var statusColorMap = {
  error: 'red',
  warning: 'orange',
  normal: 'blue',
  success: 'green',
  none: 'gray'
};
function getStatusColorName(status) {
  return statusColorMap[status] || status || statusColorMap['normal'];
}

/**
 * 判断是否是有效数字
 *
 * @param v 输入值
 *
 * @return {boolean} 是否有效数字
 * */
function isInvalidNumber(v) {
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
function numberDecimal(num) {
  var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (isInvalidNumber(num)) {
    return '-';
  }

  return Math.round(Number(num) * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

function beautifyNumber(num) {
  var char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';

  if (isInvalidNumber(num)) {
    return '-';
  }
  var number = num.toString().split('.')[0],
      result = '';
  while (number.length > 3) {
    result = char + number.slice(-3) + result;
    number = number.slice(0, number.length - 3);
  }
  if (number) {
    result = number + result;
  }
  return result;
}

/**
 * 空函数
 * */
function noop() {}