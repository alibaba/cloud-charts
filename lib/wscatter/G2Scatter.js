'use strict';

// 引入所需要的库和样式

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _rectXAxis = require('../chartCommon/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../chartCommon/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectLegend = require('../chartCommon/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _guide = require('../chartCommon/guide');

var _guide2 = _interopRequireDefault(_guide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [40, 5, 32, 44],
  colors: _normal.color.category_12,
  xAxis: {
    type: 'linear',
    mask: 'YYYY-MM-DD HH:mm:ss',
    autoRotate: false
  },
  yAxis: {
    min: 0
  },
  jitter: false,
  tooltip: true,
  legend: true
};
var colorMap = _normal.color.category_12;
var setAxis = function setAxis(chart, config) {

  // 设置X轴
  var xAxis = {};

  if (config.jitter) {
    xAxis.grid = {
      align: 'center', // 网格顶点从两个刻度中间开始
      lineStyle: {
        stroke: _normal.color.colorN13,
        lineWidth: 1
        // lineDash: [3, 3]
      }
    };
  }

  // 扰动点图不能打开垂直网格线
  if (config.grid && !config.jitter) {
    xAxis.grid = {
      lineStyle: {
        stroke: _normal.color.colorN13,
        lineWidth: 1
      }
    };
  }

  _rectXAxis2.default.call(undefined, chart, config, xAxis);

  // 设置单个Y轴
  _rectYAxis2.default.call(undefined, chart, config);
};

var setSource = function setSource(chart, config, data) {
  var defs = {
    x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
      type: config.jitter ? 'cat' : 'linear'
    }, config.xAxis),
    type: {
      type: 'cat'
    }
  };

  defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
    type: 'linear',
    tickCount: 5
  }, config.yAxis);

  chart.source(data, defs);
};

var chartRender = function chartRender(chart, config) {
  var typeArr = [];

  var geom = chart.point().color('type', function (val) {
    var curIndex = void 0;
    if (!typeArr.includes(val)) {
      curIndex = typeArr.length;
      typeArr.push(val);
    } else {
      curIndex = typeArr.indexOf(val);
    }

    return colorMap[curIndex];
  }).position('x*y').size(4).shape('circle').active(false);

  if (config.jitter) {
    geom.adjust('jitter');
  }

  chart.render();
};

var setToolTip = function setToolTip(chart, config) {
  var _this = this;

  if (config.tooltip) {
    var tooltipCfg = {
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: null,
      custom: true,
      containerTpl: '<div class="g2-tooltip"><p class="g2-tooltip-title">{name}</p><div class="g2-tooltip-list"></div></div>', // tooltip的外层模板
      itemTpl: '<div class="g2-tooltip-list-item"><span style="color:{color}"></span><span>{value}</span></div>', // 支持的字段 index,color,name,value
      'g2-tooltip': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: _normal.color.colorN24
      }, // 设置 tooltip 的 css 样式
      'g2-tooltip-title': {
        color: _normal.color.colorN24,
        marginRight: _normal.size.s3,
        marginTop: 0,
        fontSize: _normal.size.s3
      },
      'g2-tooltip-list-item': {
        marginTop: 0
      }
    };
    chart.tooltip(tooltipCfg);
    if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltip:change', function (ev) {
        if (config.tooltip.titleFormatter) {
          ev.items[0].title = config.tooltip.titleFormatter(ev.items[0].title, ev.items);
        }

        ev.items.forEach(function (item, index) {
          var raw = (0, _common.getRawData)(config, _this.rawData, item);

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, raw, index, ev.items);
          }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var preConfig = {};
    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat'
      };
    }
    var newConfig = (0, _merge2.default)({}, defaultConfig, preConfig, config);

    return _extends({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;
    setSource(chart, config, data);

    setAxis(chart, config);

    setToolTip.call(this, chart, config);

    _rectLegend2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    chartRender(chart, config);
  }
};
module.exports = exports['default'];