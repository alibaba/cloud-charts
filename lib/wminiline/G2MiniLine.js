'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _g2Factory = _interopRequireDefault(require("../common/g2Factory"));

var _errorWrap = _interopRequireDefault(require("../common/errorWrap"));

var _merge = _interopRequireDefault(require("../common/merge"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _autoTimeMask = _interopRequireDefault(require("../common/autoTimeMask"));

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _guide = _interopRequireDefault(require("../common/guide"));

var _drawLine = _interopRequireDefault(require("../common/drawLine"));

var _default = /*#__PURE__*/(0, _errorWrap["default"])((0, _g2Factory["default"])('G2MiniLine', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index["default"].category_12,
      padding: [0, 0, 0, 0],
      xAxis: {
        type: 'time',
        // 默认为线性
        mask: 'auto',
        // 上述type为time时，此字段生效
        categories: null,
        max: null,
        min: null
      },
      yAxis: {
        max: null,
        min: null
      },
      tooltip: false,
      area: false,
      spline: false,
      symbol: false,
      label: false // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }

    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;
    var newConfig = (0, _merge["default"])({}, this.defaultConfig, config); // TODO 处理padding

    return Object.assign({}, props, {
      padding: props.padding || config.padding || this.defaultConfig.padding,
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        defs["y" + yIndex] = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis);
    }

    (0, _autoTimeMask["default"])(defs, this.rawData);
    chart.source(data, defs);
    chart.axis(false);
    chart.legend(false);

    _legendFilter["default"].call(this, chart, config); // tooltip


    _rectTooltip["default"].call(this, chart, config); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config);
    (0, _drawLine["default"])(chart, config);
    chart.render();
  }
}));

exports["default"] = _default;