'use strict'; // 依赖更新部分

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _guide = _interopRequireDefault(require("../common/guide"));

var _common = require("../common/common");

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _drawLine = _interopRequireDefault(require("../common/drawLine"));

require("./index.scss");

// 2.x版本依赖
var Wradar = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wradar, _Base);

  function Wradar() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Wradar.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      // colors: themes.category_12,
      xAxis: {
        labelFormatter: null
      },
      yAxis: {
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        min: 0
      },
      // radius: 0.8,
      legend: {
        position: 'bottom',
        align: 'center',
        nameFormatter: null
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      area: false,
      symbol: false,
      label: false,
      spline: false
    };
  };

  _proto.init = function init(chart, config, data) {
    var defs = {
      type: {
        type: 'cat'
      }
    }; // 轴设置

    defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
      type: 'linear',
      tickCount: 5
    }, config.yAxis);
    chart.scale(defs);
    chart.data(data); // 极坐标配置

    chart.coordinate('polar', {
      radius: config.radius
    }); // 设置X轴

    _rectXAxis["default"].call(this, chart, config); // 设置单个Y轴


    _rectYAxis["default"].call(this, chart, config); // 设置图例


    _rectLegend["default"].call(this, chart, config, null, false, 'type');

    _legendFilter["default"].call(this, chart, config); // tooltip


    _rectTooltip["default"].call(this, chart, config); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config);
    (0, _drawLine["default"])(chart, config);
  };

  return Wradar;
}(_Base2["default"]);

var _default = Wradar; // 2.x版本
// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
// export default /*#__PURE__*/ errorWrap(g2Factory('G2Radar', {
//   getDefaultConfig() {
//     return {
//       padding: [20, 20, 40, 20],
//       colors: themes.category_12,
//       xAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//       },
//       yAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         // max: 100,
//         min: 0,
//       },
//       radius: 0.8,
//       area: false,
//       symbol: false,
//       label: false,
//       spline: false,
//       // stack: false,
//       legend: {
//         position: 'bottom',
//         align: 'center',
//         nameFormatter: null,
//       },
//       tooltip: {
//         titleFormatter: null,
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
//     const defs = {
//       x: propertyAssign(propertyMap.xAxis, {
//         // type: 'cat',
//         // 折线图X轴的范围默认覆盖全部区域，保证没有空余
//         // range: [0, 1],
//       }, config.xAxis),
//       type: {
//         type: 'cat',
//       },
//     };
//     defs.y = propertyAssign(propertyMap.yAxis, {
//       type: 'linear',
//       tickCount: 5,
//     }, config.yAxis);
//     chart.source(data, defs);
//     // 极坐标配置
//     chart.coord('polar', {
//       radius: config.radius,
//     });
//     // 设置X轴
//     rectXAxis.call(this, chart, config, {
//       line: null,
//       tickLine: null,
//       grid: {
//         lineStyle: {
//           lineDash: null,
//         },
//       },
//     });
//     // chart.axis('x', {
//     //   label: {
//     //     formatter: config.xAxis.labelFormatter,
//     //   },
//     //   line: null,
//     //   tickLine: null,
//     //   grid: {
//     //     lineStyle: {
//     //       lineDash: null,
//     //     },
//     //     // hideFirstLine: false
//     //   },
//     // });
//     // 设置Y轴
//     rectYAxis.call(this, chart, config, 'y', {
//       label: {
//         offset: 8,
//         textStyle: {
//           fill: themes['widgets-axis-label'],
//           textAlign: 'right', // 文本右对齐
//         },
//         formatter: config.yAxis.labelFormatter,
//         // 之前使用 htmlTemplate 是为了覆盖在line图形之上，和视觉确认后不需要这么做，直接使用默认 formatter 即可。
//         // htmlTemplate(text, item, index) {
//         //   if (config.yAxis.labelFormatter) {
//         //     return config.yAxis.labelFormatter(text, item, index);
//         //   }
//         //   return `<span style="color: ${themes['widgets-axis-label']}">${text}</span>`;
//         // }
//       },
//       line: null,
//       tickLine: null,
//       grid: {
//         type: 'polygon',
//         lineStyle: {
//           lineDash: null,
//         },
//       },
//     });
//     // 设置图例
//     rectLegend.call(this, chart, config);
//     legendFilter.call(this, chart, config);
//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       crosshairs: null,
//     });
//     drawLine(chart, config);
//     chart.render();
//   },
// }));

exports["default"] = _default;