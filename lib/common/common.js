'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propertyMap = exports.requestAnimationFrame = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.propertyAssign = propertyAssign;
exports.getParentSize = getParentSize;
exports.getDataIndexColor = getDataIndexColor;
exports.getStatusColor = getStatusColor;
exports.getStatusColorName = getStatusColorName;
exports.isInvalidNumber = isInvalidNumber;
exports.numberDecimal = numberDecimal;
exports.beautifyNumber = beautifyNumber;
exports.noop = noop;
exports.getRawData = getRawData;
exports.filterKey = filterKey;

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
  var w = width || '',
      h = height || '';

  var parent = element && element.parentElement;

  if (parent) {
    var parentStyle = window.getComputedStyle(parent);
    var paddingTop = _pxToNumber(parentStyle.getPropertyValue('padding-top'));
    var paddingRight = _pxToNumber(parentStyle.getPropertyValue('padding-right'));
    var paddingBottom = _pxToNumber(parentStyle.getPropertyValue('padding-bottom'));
    var paddingLeft = _pxToNumber(parentStyle.getPropertyValue('padding-left'));

    if (!width) {
      w = parent.clientWidth - paddingLeft - paddingRight;
    }
    if (!height) {
      h = parent.clientHeight - paddingTop - paddingBottom;
    }
  }
  return [w, h];
}

function _pxToNumber(px) {
  return Number(px.replace('px', ''));
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
    return false;
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
  return statusMap[status] || status || statusMap.normal;
}

var statusColorMap = {
  error: 'red',
  warning: 'orange',
  normal: 'blue',
  success: 'green',
  none: 'gray'
};
function getStatusColorName(status) {
  return statusColorMap[status] || status || statusColorMap.normal;
}

/**
 * 判断是否是有效数字
 *
 * @param v 输入值
 *
 * @return {boolean} 是否有效数字
 * */
function isInvalidNumber(v) {
  return isNaN(v) || !isFinite(v) || v === '' || (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object';
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
function beautifyNumber(num) {
  var char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';

  if (isInvalidNumber(num)) {
    return '-';
  }
  var isNegative = num < 0;
  var numberArr = num.toString().split('.');
  var number = numberArr[0].replace('-', ''),
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
    result = result + '.' + numberArr[1];
  }
  // 处理负数
  if (isNegative) {
    result = '-' + result;
  }
  return result;
}

/**
 * 空函数
 * */
function noop() {}

/**
* tooltip item 获取原始数据
*
* @param {object} config 图表配置项
* @param {array} rawData 挂载于 this.rawData 上的原始数据
* @param {number} item tooltip格式化函数的当前数据项
*
* @return {object} 寻找得到的原始数据，没有找到则返回空对象。
* */
function getRawData(config, rawData, item) {
  if (!rawData) {
    return {};
  }

  var originData = item.point && item.point._origin || {};
  if (config.dataType !== 'g2') {
    rawData.some(function (r) {
      if (r.name === originData.type) {
        originData = r;
        return true;
      }
      return false;
    });
  }

  return originData;
}

/**
* 过滤对象中的key，长用于过滤传递给div的props，防止react invalid attribute warning
*
 * @param {object} obj 过滤的对象
 * @param {array} keys 过滤的键列表
*
* @return {object} 过滤后的结果
* */
function filterKey(obj, keys) {
  var result = {};
  Object.keys(obj).forEach(function (key) {
    if (keys.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });
  return result;
}