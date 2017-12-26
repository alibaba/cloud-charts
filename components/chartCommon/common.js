export const compareComputed = function (compare, value1, value2) {
  switch(compare){
    case '<':
      return value1 < value2;
    case '<=':
      return value1 <= value2;
    case '>':
      return value1 > value2;
    case '>=':
      return value1 >= value2;
    case '==':
      return value1 == value2;
    case '===':
      return value1 === value2;
    case '!=':
      return value1 != value2;
    case '!==':
      return value1 !== value2;
    default:
      return false;
  }
}

// name: 类型 ，相当于type
// stash: 每组类型的一些信息集，注意，要符合G2语法
// Util: G2的Util
// dotDom: 图例的图标dom
// chart: chart实例
export function g2LegendFilter(name, stash, Util, dotDom, chart, filterString='type'){
  let obj = stash[name];
  let filterNames = [];
  obj.isChecked = obj.isChecked ? false : true;
  Util.each(stash, function (v) {
    if (v.isChecked) {
      dotDom[v.index].style.background = v.color;
      filterNames.push(v.name);
    } else {
      dotDom[v.index].style.background = '#999';
    }
  });

  chart.filter(filterString, filterNames);
  chart.repaint();
}

export function propertyAssign (keys, target, source) {
  keys.forEach((key) => {
    if (source[key]) {
      target[key] = source[key];
    }
  });

  return target;
}

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
  if (this.isInvalidNumber(num)) {
    return '-';
  }

  return Math.round(Number(num) * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function beautifyNumber(num) {
  if (this.isInvalidNumber(num)) {
    return '-';
  }
  let number = num.toString(), result = '';
  while (number.length > 3) {
    result = ' ' + number.slice(-3) + result;
    number = number.slice(0, number.length - 3);
  }
  if (number) {
    result = number + result;
  }
  return result;
}
