'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g2Brush = require('@antv/g2-brush');

var _g2Brush2 = _interopRequireDefault(_g2Brush);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../common/common');

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

require('./G2Funnel.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  colors: _normal.color.order_10,
  padding: [40, 0, 0, 0],
  // xAxis: {
  //   type: 'cat',
  //   labelFormatter: null, // 可以强制覆盖，手动设置label
  //   categories: null,
  //   autoRotate: false,
  // },
  // yAxis: {
  //   labelFormatter: null, // 可以强制覆盖，手动设置label
  //   max: null,
  //   min: null,
  // },
  legend: {
    align: 'left',
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
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
      // x: propertyAssign(propertyMap.xAxis, {
      //   type: 'cat',
      // }, config.xAxis),
      // y: propertyAssign(propertyMap.yAxis, {
      //   type: 'linear',
      //   tickCount: 5
      // }, config.yAxis),
      type: {
        type: 'cat'
        // sync: true
      }
    };

    chart.source(data, defs);

    // 漏斗图目前看没有轴
    chart.axis(false);

    // // 设置单个Y轴
    // rectYAxis.call(this, chart, config);
    //
    // // 设置X轴
    // rectXAxis.call(this, chart, config);

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