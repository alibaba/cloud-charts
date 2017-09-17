'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.g2LegendFilter = g2LegendFilter;
var compareComputed = exports.compareComputed = function compareComputed(compare, value1, value2) {
  switch (compare) {
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
};

// name: 类型 ，相当于type
// stash: 每组类型的一些信息集，注意，要符合G2语法
// Util: G2的Util
// dotDom: 图例的图标dom
// chart: chart实例
function g2LegendFilter(name, stash, Util, dotDom, chart) {
  var filterString = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'type';

  var obj = stash[name];
  var filterNames = [];
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