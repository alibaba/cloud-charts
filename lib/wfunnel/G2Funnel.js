'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

require('./G2Funnel.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  colors: _normal.color.order_10,
  padding: [40, 0, 0, 0],
  legend: {
    align: 'left',
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  },
  // 主方向，从上到下(vertical)、从左到右(horizontal)
  direction: 'vertical',
  // 排列位置 start,center,end
  align: 'center',
  // 尖顶漏斗图
  pyramid: false
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    // 设置数据度量
    var defs = {
      type: {
        type: 'cat'
      }
    };

    chart.source(data, defs);

    // 漏斗图目前看没有轴
    chart.axis(false);

    // 设置图例
    _rectLegend2.default.call(this, chart, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    var drawType = config.direction + '-' + config.align;
    var geom = null;

    switch (drawType) {
      case 'vertical-left':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.interval();
        break;
      case 'vertical-center':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.intervalSymmetric();
        break;
      case 'vertical-right':
        chart.coord('rect').transpose().scale(-1, -1);
        geom = chart.interval();
        break;
      case 'horizontal-top':
        chart.coord('rect').reflect('y');
        geom = chart.interval();
        break;
      case 'horizontal-center':
        geom = chart.intervalSymmetric();
        break;
      case 'horizontal-bottom':
      // 和 default 时相同
      default:
        geom = chart.interval();
    }

    var funnelShape = config.align === 'center' && config.pyramid ? 'pyramid' : 'funnel';

    geom.position('x*y').shape(funnelShape).color('x', config.colors);

    chart.render();
  }
};
module.exports = exports['default'];