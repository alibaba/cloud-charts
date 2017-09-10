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
