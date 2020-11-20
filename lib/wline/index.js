'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _themes = _interopRequireDefault(require("../themes"));

var _common = require("../common/common");

var _guide = _interopRequireDefault(require("../common/guide"));

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _autoTimeMask = _interopRequireDefault(require("../common/autoTimeMask"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _rectZoom = _interopRequireDefault(require("../common/rectZoom"));

var _drawLine = _interopRequireDefault(require("../common/drawLine"));

require("./index.scss");

// import errorWrap from '../common/errorWrap';
var Wline = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wline, _Base);

  function Wline() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Line';
    return _this;
  }

  var _proto = Wline.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      colors: _themes["default"].category_12,
      areaColors: [],
      xAxis: {
        type: 'time',
        // 默认为线性
        mask: 'auto' // 上述type为time时，此字段生效

      },
      yAxis: {
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      legend: {
        align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label

      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      area: false,
      stack: false,
      // 仅Area有效
      spline: false,
      grid: false,
      symbol: false,
      zoom: false,
      label: false,
      step: null // TODO
      // mini: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }

    };
  };

  _proto.init = function init(chart, config, data) {
    var _this2 = this;

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
          tickCount: 5,
          nice: true
        }, axis);
      });
    } else {
      defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
        nice: true
      }, config.yAxis);
    }

    (0, _autoTimeMask["default"])(defs, this.rawData); // rectAutoTickCount(chart, config, defs, false);

    chart.scale(defs);
    chart.data(data); // 设置X轴

    _rectXAxis["default"].call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        var yAxisConfig = {
          line: {
            style: {
              stroke: (0, _common.getDataIndexColor)(config.colors, _this2.rawData, yIndex) || _themes["default"]['widgets-axis-line']
            }
          }
        };

        if (yIndex !== 0) {
          yAxisConfig.grid = null;
        }

        _rectYAxis["default"].call(_this2, chart, (0, _extends2["default"])({}, config, {
          yAxis: axis
        }), "y" + yIndex, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      _rectYAxis["default"].call(this, chart, config);
    } // 设置图例


    _rectLegend["default"].call(this, chart, config, null, false, 'type');

    _legendFilter["default"].call(this, chart); // tooltip


    _rectTooltip["default"].call(this, chart, config); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (asix, yIndex) {
        (0, _drawLine["default"])(chart, config, "y" + yIndex);
      });
    } else {
      (0, _drawLine["default"])(chart, config);
    } // 拖拽缩放


    (0, _rectZoom["default"])(chart, config, this.language);
  };

  return Wline;
}(_Base2["default"]);

var _default = Wline; // /*#__PURE__*/errorWrap(g2Factory('G2Line', {
//   beforeInit(props) {
//     const { config } = props;
//     const newConfig = merge({}, this.defaultConfig, config);
//
//     // // TODO 处理padding
//     // let defaultPaddingTop = defaultConfig.padding[0];
//     // let defaultPaddingRight = defaultConfig.padding[1];
//     // const defaultPaddingBottom = defaultConfig.padding[2];
//     // const defaultPaddingLeft = defaultConfig.padding[3];
//     // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
//     //   defaultPaddingRight = 44;
//     // }
//     // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
//     //   defaultPaddingTop = 16;
//     // }
//     return Object.assign({}, props, {
//       // padding: props.padding || config.padding || [defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft],
//       padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
//       config: newConfig,
//     });
//   },
//   changeData(chart, config, data) {
//     chart.changeData(data);
//
//     // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
//     if (config.zoom && this.brush) {
//       this.brush.xScale = chart.getXScale();
//       this.brush.yScale = chart.getYScales()[0];
//     }
//   },
//   destroy() {
//     // 销毁时需要额外销毁缩放重置按钮
//     if (this.brush) {
//       this.brush.destroy();
//     }
//     if (this.resetButton) {
//       this.resetButton.destroy();
//     }
//   },
// }));

exports["default"] = _default;