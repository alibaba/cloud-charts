'use strict';

// 引入所需要的库和样式

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _common = require('../common/common');

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [40, 5, 32, 44],
  colors: _index.color.category_12,
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
        stroke: _index.color.widgetsAxisGrid,
        lineWidth: 1
        // lineDash: [3, 3]
      }
    };
  }

  // 扰动点图不能打开垂直网格线
  if (config.grid && !config.jitter) {
    xAxis.grid = {
      lineStyle: {
        stroke: _index.color.widgetsAxisGrid,
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
  var geom = chart.point().color('type', config.colors).position('x*y').size(4).shape('circle').active(false);

  if (config.jitter) {
    geom.adjust('jitter');
  }

  (0, _label2.default)(geom, config);

  chart.render();
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
    setSource(chart, config, data);

    setAxis(chart, config);

    _rectTooltip2.default.call(this, chart, config, {
      crosshairs: null
    });

    _rectLegend2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    chartRender(chart, config);
  }
};
module.exports = exports['default'];