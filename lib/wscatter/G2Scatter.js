'use strict'; // 引入所需要的库和样式

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _g2Factory = _interopRequireDefault(require("../common/g2Factory"));

var _errorWrap = _interopRequireDefault(require("../common/errorWrap"));

var _merge = _interopRequireDefault(require("../common/merge"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _autoTimeMask = _interopRequireDefault(require("../common/autoTimeMask"));

var _rectAutoTickCount = _interopRequireDefault(require("../common/rectAutoTickCount"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _label = _interopRequireDefault(require("../common/label"));

var _guide = _interopRequireDefault(require("../common/guide"));

var _geomSize = _interopRequireDefault(require("../common/geomSize"));

var setSource = function setSource(chart, config, data) {};

var _default = /*#__PURE__*/(0, _errorWrap["default"])((0, _g2Factory["default"])('G2Scatter', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      padding: ['auto', 'auto', 'auto', 'auto'],
      colors: _index["default"].category_12,
      xAxis: {
        type: 'linear',
        mask: 'auto',
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
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;
    var preConfig = {};

    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat'
      };
    }

    var newConfig = (0, _merge["default"])({}, this.defaultConfig, preConfig, config);
    return Object.assign({}, props, {
      padding: _common.defaultPadding.apply(void 0, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;
    var colors = config.colors,
        jitter = config.jitter,
        size = config.size,
        geomStyle = config.geomStyle;
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
    (0, _autoTimeMask["default"])(defs, this.rawData);
    (0, _rectAutoTickCount["default"])(chart, config, defs, false);
    chart.source(data, defs); // 设置X轴

    var xAxis = {};

    if (config.jitter) {
      xAxis.grid = {
        align: 'center',
        // 网格顶点从两个刻度中间开始
        lineStyle: {
          stroke: _index["default"]['widgets-axis-grid'],
          lineWidth: 1 // lineDash: [3, 3]

        }
      };
    } // 扰动点图不能打开垂直网格线


    if (config.grid && !config.jitter) {
      xAxis.grid = {
        lineStyle: {
          stroke: _index["default"]['widgets-axis-grid'],
          lineWidth: 1
        }
      };
    }

    _rectXAxis["default"].call(this, chart, config, xAxis); // 设置单个Y轴


    _rectYAxis["default"].call(this, chart, config);

    _rectTooltip["default"].call(this, chart, config, {
      crosshairs: null
    });

    _legendFilter["default"].call(this, chart, config); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config);
    var geom = chart.point().color('type', colors).position('x*y').shape('circle').style('x*y*type*extra', geomStyle || {}).active(false);

    if (jitter) {
      geom.adjust('jitter');
    }

    (0, _label["default"])(geom, config);

    if (size) {
      var sizeConfig = (0, _geomSize["default"])(size, 4, 'y', 'x*y*type*extra');
      geom.size.apply(geom, sizeConfig);
      chart.legend('x', false);
      chart.legend('y', false);
      chart.legend('extra', false);
    } // fix: 设置 rectLegend 后如果再调用 chart.legend 会生成默认图例


    _rectLegend["default"].call(this, chart, config, null, false, 'type');

    chart.render();
  }
}));

exports["default"] = _default;