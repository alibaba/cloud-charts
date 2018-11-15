'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _f2Factory = require('../common/f2Factory');

var _f2Factory2 = _interopRequireDefault(_f2Factory);

var _theme = require('../theme/');

var _f2Defaults = require('../common/f2Defaults');

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  legend: _extends({}, _f2Defaults.legendConfig, {
    show: true,
    position: 'right',
    formatter: defaultLegendFormatter
  }),
  colors: _theme.color.category_12,

  autoSort: false,
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8 // 饼图半径大小，初始化时可用，暂不支持
};

var pie = {
  beforeInit: function beforeInit(props) {
    var newProps = _extends({}, props);
    var newConfig = (0, _merge2.default)({}, defaultConfig, newProps.config);

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

exports.default = (0, _f2Factory2.default)('f2Pie', pie);
module.exports = exports['default'];