'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

require('./G2Funnel.css');

var _common = require('../common/common');

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderGuide(chart, config, data, percentOffsetX, percentOffsetY) {
  chart.guide().clear(true);

  // 绘制辅助线，辅助背景区域
  (0, _guide2.default)(chart, config);

  // 中间标签文本
  if (!config.percent || config.percent.visible === false) {
    return;
  }
  var _config$percent = config.percent,
      labelFormatter = _config$percent.labelFormatter,
      _config$percent$offse = _config$percent.offsetX,
      offsetX = _config$percent$offse === undefined ? 0 : _config$percent$offse,
      _config$percent$offse2 = _config$percent.offsetY,
      offsetY = _config$percent$offse2 === undefined ? 0 : _config$percent$offse2,
      _config$percent$top = _config$percent.top,
      top = _config$percent$top === undefined ? true : _config$percent$top,
      _config$percent$style = _config$percent.style,
      style = _config$percent$style === undefined ? {} : _config$percent$style;

  var positionY = config.align === 'center' ? 'median' : 'start';

  data.forEach(function (d, i) {
    var content = (0, _common.numberDecimal)(100 * d.y / data[0].y) + '%';
    if (labelFormatter) {
      content = labelFormatter(d.y / data[0].y, d, i);
    }
    var textConfig = {
      top: top,
      offsetX: percentOffsetX + offsetX,
      offsetY: percentOffsetY + offsetY,
      position: {
        x: d.x,
        y: positionY
      },
      content: content,
      style: _extends({
        fill: _index2.default['widgets-label-text'],
        fontSize: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
        textAlign: 'center',
        shadowBlur: 2,
        shadowColor: 'rgba(255, 255, 255, .3)'
      }, style)
    };

    chart.guide().text(textConfig);
  });
}

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Funnel', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index2.default.order_10,
      padding: ['auto', 0, 'auto', 0],
      legend: {
        align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label
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
      pyramid: false,
      label: false,
      percent: false
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, this.defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
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
    _rectLegend2.default.call(this, chart, config, null, true);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    var drawType = config.direction + '-' + config.align;
    var geom = null;
    var fontSize1 = (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']);
    var percentOffsetX = 0;
    var percentOffsetY = 0;

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.interval();
        percentOffsetX = 3 * fontSize1;
        break;
      case 'vertical-center':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.intervalSymmetric();
        break;
      case 'vertical-right':
      case 'vertical-end':
        chart.coord('rect').transpose().scale(-1, -1);
        geom = chart.interval();
        percentOffsetX = -3 * fontSize1;
        break;
      case 'horizontal-top':
      case 'horizontal-start':
        chart.coord('rect').reflect('y');
        geom = chart.interval();
        percentOffsetY = 3 * fontSize1;
        break;
      case 'horizontal-center':
        geom = chart.intervalSymmetric();
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同
      default:
        geom = chart.interval();
        percentOffsetY = -3 * fontSize1;
    }

    var funnelShape = config.align === 'center' && config.pyramid ? 'pyramid' : 'funnel';

    geom.position('x*y').shape(funnelShape).color('x', config.colors);

    (0, _label2.default)(geom, config, 'y', {
      offset: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
      labelLine: {
        lineWidth: 1,
        stroke: _index2.default['widgets-axis-line']
      }
    });

    var geomStyle = config.geomStyle || {};
    geom.style('x*y*type*extra', _extends({}, geomStyle));

    renderGuide(chart, config, data, percentOffsetX, percentOffsetY);

    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    chart.changeData(data);

    var drawType = config.direction + '-' + config.align;
    var fontSize1 = (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']);
    var percentOffsetX = 0;
    var percentOffsetY = 0;

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        percentOffsetX = 3 * fontSize1;
        break;
      case 'vertical-center':
        break;
      case 'vertical-right':
      case 'vertical-end':
        percentOffsetX = -3 * fontSize1;
        break;
      case 'horizontal-top':
      case 'horizontal-start':
        percentOffsetY = 3 * fontSize1;
        break;
      case 'horizontal-center':
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同
      default:
        percentOffsetY = -3 * fontSize1;
    }
    renderGuide(chart, config, data, percentOffsetX, percentOffsetY);
  }
}));