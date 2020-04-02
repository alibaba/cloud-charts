var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import f2Factory from '../common/f2Factory';
import { color } from '../themes/';
import { legendConfig } from '../common/f2Defaults';
import merge from '../common/merge';

var defaultLegendFormatter = function defaultLegendFormatter(d, titleStyle) {
  return '<span style="color: ' + titleStyle.fill + '; font-size: ' + titleStyle.fontSize + 'px;">' + d[0] + ' ' + d[1] * 100 + '%</span>';
};

var defaultConfig = {
  width: 130,
  padding: [10, 10, 10, 10],
  xAxis: {
    type: 'timeCat',
    mask: 'YYYY-MM-DD HH:mm:ss'
  },
  yAxis: {
    min: 0
  },
  tooltip: true,
  legend: _extends({}, legendConfig, {
    show: true,
    position: 'right',
    formatter: defaultLegendFormatter
  }),
  colors: color.category_12,

  autoSort: false,
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8 // 饼图半径大小，初始化时可用，暂不支持
};

var pie = {
  beforeInit: function beforeInit(props) {
    var newProps = _extends({}, props);
    var newConfig = merge({}, defaultConfig, newProps.config);

    newProps.config = newConfig;
    return newProps;
  },
  init: function init(chart, userConfig, data) {
    if (userConfig.autoSort) {
      data.sort(function (a, b) {
        return b.y - a.y;
      });
    }
    chart.source(data);
    chart.coord('polar', {
      transposed: true,
      innerRadius: userConfig.innerRadius
    });
    chart.axis(false);

    chart.interval().position('type*y').color('x').adjust('stack');

    chart.render();
  }
};

export default f2Factory('f2Pie', pie);