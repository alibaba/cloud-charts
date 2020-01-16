'use strict';

// 引入所需要的库和样式

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _index2 = _interopRequireDefault(_index);

var _common = require('../common/common');

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectAutoTickCount = require('../common/rectAutoTickCount');

var _rectAutoTickCount2 = _interopRequireDefault(_rectAutoTickCount);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _legendFilter = require('../common/legendFilter');

var _legendFilter2 = _interopRequireDefault(_legendFilter);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _geomSize = require('../common/geomSize');

var _geomSize2 = _interopRequireDefault(_geomSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [28, 5, 24, 44],
  colors: _index2.default.category_12,
  xAxis: {
    type: 'linear',
    mask: 'YYYY-MM-DD HH:mm:ss',
    autoRotate: false
  },
  yAxis: {
    min: 0
  },
  size: 4,
  jitter: false,
  tooltip: true,
  legend: true,
  label: false
};

var setAxis = function setAxis(chart, config) {
  // 设置X轴
  var xAxis = {};

  if (config.jitter) {
    xAxis.grid = {
      align: 'center', // 网格顶点从两个刻度中间开始
      lineStyle: {
        stroke: _index2.default['widgets-axis-grid'],
        lineWidth: 1
        // lineDash: [3, 3]
      }
    };
  }

  // 扰动点图不能打开垂直网格线
  if (config.grid && !config.jitter) {
    xAxis.grid = {
      lineStyle: {
        stroke: _index2.default['widgets-axis-grid'],
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

  (0, _rectAutoTickCount2.default)(chart, config, defs, false);

  chart.source(data, defs);
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
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;
    var colors = config.colors,
        jitter = config.jitter,
        size = config.size,
        geomStyle = config.geomStyle;


    setSource(chart, config, data);

    setAxis(chart, config);

    _rectTooltip2.default.call(this, chart, config, {
      crosshairs: null
    });

    _rectLegend2.default.call(this, chart, config, null, false, 'type');

    _legendFilter2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    var geom = chart.point().color('type', colors).position('x*y').shape('circle').style('x*y*type*extra', geomStyle || {}).active(false);

    if (jitter) {
      geom.adjust('jitter');
    }

    (0, _label2.default)(geom, config);

    if (size) {
      var sizeConfig = (0, _geomSize2.default)(size, 4, 'y', 'x*y*type*extra');
      geom.size.apply(geom, sizeConfig);
    }

    chart.render();
  }
};
module.exports = exports['default'];