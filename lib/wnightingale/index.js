'use strict'; // 新增

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _label = _interopRequireDefault(require("../common/label"));

var _index = _interopRequireDefault(require("../themes/index"));

require("./index.scss");

// 引入所需要的库和样式, 3.0修改
var Wnightingale = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wnightingale, _Base);

  function Wnightingale() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Nightingale';
    return _this;
  }

  var _proto = Wnightingale.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      // padding: [20, 20, 20, 20],
      colors: _index["default"].category_12,
      cycle: false,
      innerRadius: 0.5,
      // 内环半径大小，仅cycle为true时可用
      label: true,
      legend: {
        position: 'bottom',
        align: 'center',
        nameFormatter: null
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      }
    };
  };

  _proto.init = function init(chart, config, data) {
    var defs = {
      type: {
        type: 'cat'
      }
    };
    chart.scale(defs);
    chart.data(data);
    chart.coordinate('polar', {
      innerRadius: config.cycle ? Math.max(Math.min(config.innerRadius, 1), 0) : 0
    }); // 设置图例

    _rectLegend["default"].call(this, chart, config, null, true); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

    chart.axis(false);
    var geomStyle = config.geomStyle || {};
    var geom = chart.interval().position('x*y').color('x', config.colors).style((0, _extends2["default"])({
      lineWidth: 1,
      stroke: _index["default"]['widgets-color-background']
    }, geomStyle));
    (0, _label["default"])(geom, config, 'x', {
      offset: -15
    });
  };

  return Wnightingale;
}(_Base2["default"]);

var _default = Wnightingale; // 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
// export default /*#__PURE__*/ errorWrap(g2Factory('G2Nightingale', {
//   getDefaultConfig() {
//     return {
//       padding: [20, 20, 20, 20],
//       colors: themes.category_12,
//       cycle: false,
//       innerRadius: 0.5, // 内环半径大小，仅cycle为true时可用
//       label: {
//         key: 'x',
//       },
//       legend: {
//         position: 'bottom',
//         align: 'center',
//         nameFormatter: null,
//       },
//       tooltip: {
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//     };
//   },
//   // 初始化前对props的预处理函数
//   beforeInit(props) {
//     const { config } = props;
//     // TODO 处理padding
//     return Object.assign({}, props, {
//       padding: props.padding || config.padding || this.defaultConfig.padding,
//     });
//   },
//   // 图表绘制主函数，必选
//   init(chart, userConfig, data) {
//     const config = merge({}, this.defaultConfig, userConfig);
//     chart.source(data);
//     chart.coord('polar', {
//       innerRadius: config.cycle ? Math.max(Math.min(config.innerRadius, 1), 0) : 0,
//     });
//     // 设置图例
//     rectLegend.call(this, chart, config, null, true);
//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       showTitle: false,
//       crosshairs: null,
//     });
//     if (config.axis) {
//       chart.axis('x', {
//         grid: {
//           align: 'center',
//           hideFirstLine: false,
//           hideLastLine: false,
//         },
//         label: {
//           offset: 10,
//           autoRotate: true,
//           textStyle: {
//             textAlign: 'center',
//           },
//         },
//       });
//       chart.axis('y', {
//         tickLine: null,
//         label: null,
//         line: null,
//       });
//     } else {
//       chart.axis(false);
//     }
//     const geomStyle = config.geomStyle || {};
//     const geom = chart
//       .interval()
//       .position('x*y')
//       .color('x', config.colors)
//       .style('x*y*extra', {
//         lineWidth: 1,
//         stroke: themes['widgets-color-background'],
//         ...geomStyle
//       });
//     label(geom, config, config.label.key || 'x', {
//       offset: -15,
//     });
//     chart.render();
//   },
// }));

exports["default"] = _default;