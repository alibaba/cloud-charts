'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _guide = _interopRequireDefault(require("../common/guide"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

require("./index.scss");

var Wheatmap = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wheatmap, _Base);

  function Wheatmap() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Heatmap';
    return _this;
  }

  var _proto = Wheatmap.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      colors: _index["default"].category_12,
      // padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'cat',
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false
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
      // grid: false,
      // label: false,
      coordinate: null
    };
  };

  _proto.init = function init(chart, config, data) {
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'cat'
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'cat'
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };
    chart.scale(defs);
    chart.data(data);

    if (config.coordinate) {
      var _config$coordinate = config.coordinate,
          _config$coordinate$ty = _config$coordinate.type,
          type = _config$coordinate$ty === void 0 ? 'rect' : _config$coordinate$ty,
          reflect = _config$coordinate.reflect;
      var coord = chart.coord(type);

      if (reflect) {
        coord.reflect(reflect);
      }
    } // 设置单个Y轴


    _rectYAxis["default"].call(this, chart, config, undefined, {
      grid: null
    }); // 设置X轴


    _rectXAxis["default"].call(this, chart, config);

    chart.legend('x', false);
    chart.legend('y', false); // 设置图例

    _rectLegend["default"].call(this, chart, config);

    _legendFilter["default"].call(this, chart, config); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      showTitle: false,
      showCrosshairs: false
    }); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config);
    var geomStyle = config.geomStyle || {};
    chart.polygon().position('x*y').color('type', config.colors).tooltip('x*y*extra', function (x, y, extra) {
      return {
        name: x + " - " + y,
        value: (Array.isArray(extra) ? extra[0] : extra.value) || '-'
      };
    }).style((0, _extends2["default"])({
      lineWidth: 1,
      stroke: _index["default"]['widgets-map-area-border']
    }, geomStyle));
  };

  return Wheatmap;
}(_Base2["default"]);

var _default = Wheatmap; // export default /*#__PURE__*/ errorWrap(g2Factory('G2Heatmap', {
//   getDefaultConfig() {
//     return {
//       colors: themes.category_12,
//       padding: ['auto', 'auto', 'auto', 'auto'],
//       xAxis: {
//         type: 'cat',
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         categories: null,
//         autoRotate: false,
//       },
//       yAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         max: null,
//         min: null,
//       },
//       legend: {
//         align: 'left',
//         nameFormatter: null, // 可以强制覆盖，手动设置label
//       },
//       tooltip: {
//         titleFormatter: null,
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//       // grid: false,
//       // label: false,
//       coordinate: null,
//     };
//   },
//   beforeInit(props) {
//     const { config } = props;
//     const newConfig = merge({}, this.defaultConfig, config);
//     // TODO 处理padding
//     return Object.assign({}, props, {
//       padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
//       config: newConfig,
//     });
//   },
//   init(chart, userConfig, data) {
//     const config = userConfig;
//     // 设置数据度量
//     const defs = {
//       x: propertyAssign(propertyMap.xAxis, {
//         type: 'cat',
//       }, config.xAxis),
//       y: propertyAssign(propertyMap.yAxis, {
//         type: 'cat',
//       }, config.yAxis),
//       type: {
//         type: 'cat',
//         // sync: true,
//       },
//     };
//     chart.source(data, defs);
//     if (config.coordinate) {
//       const { type = 'rect', reflect } = config.coordinate;
//       const coord = chart.coord(type);
//       if (reflect) {
//         coord.reflect(reflect);
//       }
//     }
//     // 设置单个Y轴
//     rectYAxis.call(this, chart, config, undefined, {
//       grid: null,
//     });
//     // 设置X轴
//     rectXAxis.call(this, chart, config);
//     chart.legend('x', false);
//     chart.legend('y', false);
//     // 设置图例
//     rectLegend.call(this, chart, config);
//     legendFilter.call(this, chart, config);
//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       showTitle: false,
//       crosshairs: null,
//     });
//     // 绘制辅助线，辅助背景区域
//     guide(chart, config);
//     const geomStyle = config.geomStyle || {};
//     chart.polygon()
//       .position('x*y')
//       .color('type', config.colors)
//       .tooltip('x*y*extra', (x, y, extra) => {
//         return {
//           name: `${x} - ${y}`,
//           value: (Array.isArray(extra) ? extra[0] : extra.value) || '-',
//         };
//       })
//       .style('x*y*type*extra', {
//         lineWidth: 1,
//         stroke: themes['widgets-map-area-border'],
//         ...geomStyle,
//       });
//     // label(geom, config, 'extra');
//     chart.render();
//   },
//   // changeData(chart, config, data) {
//   //   chart.changeData(data);
//   // },
//   // destroy() {
//   // },
// }));

exports["default"] = _default;