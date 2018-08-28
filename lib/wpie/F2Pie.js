'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _f2Factory = require('../common/f2Factory');

var _f2Factory2 = _interopRequireDefault(_f2Factory);

var _theme = require('../theme/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultLegendFormatter = function defaultLegendFormatter(d) {
  return '<span style="color: ' + _theme.color.widgetsColorText1 + '">' + d[0] + ' ' + d[1] * 100 + '%</span>';
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
  legend: { show: true, dir: 'right' },
  colors: _theme.color.category_12,

  autoSort: true,
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8 // 饼图半径大小，初始化时可用，暂不支持
};

var pie = {
  beforeInit: function beforeInit(props) {
    var newProps = _extends({}, props);
    var newConfig = _extends({}, defaultConfig, newProps.config);

    if (newConfig.legend) {
      if (typeof newConfig.legend === 'boolean') newConfig.legend = {};
      var _newConfig$legend = newConfig.legend,
          _newConfig$legend$dir = _newConfig$legend.dir,
          dir = _newConfig$legend$dir === undefined ? 'right' : _newConfig$legend$dir,
          _newConfig$legend$sho = _newConfig$legend.show,
          show = _newConfig$legend$sho === undefined ? true : _newConfig$legend$sho,
          _newConfig$legend$for = _newConfig$legend.formatter,
          formatter = _newConfig$legend$for === undefined ? defaultLegendFormatter : _newConfig$legend$for;

      newConfig.legend.dir = dir;
      newConfig.legend.show = show;
      newConfig.legend.formatter = formatter;
    }

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