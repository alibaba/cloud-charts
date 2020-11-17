'use strict'; // 新增

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _guide = _interopRequireDefault(require("../common/guide"));

var _label = _interopRequireDefault(require("../common/label"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

require("./index.scss");

var Wfunnel = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wfunnel, _Base);

  function Wfunnel() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Funnel';
    return _this;
  }

  var _proto = Wfunnel.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      colors: _index["default"].order_10,
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
      // symbol: false,
      label: false,
      pyramid: false,
      // 主方向，从上到下(vertical)、从左到右(horizontal)
      direction: 'vertical',
      // 排列位置 start,center,end
      align: 'center',
      // 尖顶漏斗图
      percent: true
    };
  };

  _proto.init = function init(chart, config, data) {
    var defs = {
      type: {
        type: 'cat'
      }
    };
    chart.scale(defs);
    chart.axis(false);
    chart.data(data); // 设置图例

    _rectLegend["default"].call(this, chart, config, null, false, 'type'); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    }); // 根据传入的 direction 和 align 设置坐标系，并绘制图形


    var drawType = config.direction + "-" + config.align;
    var geom = null; // const fontSize1 = pxToNumber(themes['widgets-font-size-1']);
    // let percentOffsetX = 0;
    // let percentOffsetY = 0;

    var funnelShape = config.align === 'center' && config.pyramid ? 'pyramid' : 'funnel';

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        chart.coordinate('rect').transpose().scale(1, -1);
        geom = chart.interval().position('x*y').shape(funnelShape).color('x', config.colors); // percentOffsetX = 3 * fontSize1;

        break;

      case 'vertical-center':
        chart.coordinate('rect').transpose().scale(1, -1);
        geom = chart.interval().position('x*y').shape(funnelShape).color('x', config.colors).adjust([{
          type: 'symmetric'
        }]);
        break;

      case 'vertical-right':
      case 'vertical-end':
        chart.coordinate('rect').transpose().scale(-1, -1);
        geom = chart.interval().position('x*y').shape(funnelShape).color('x', config.colors); // percentOffsetX = -3 * fontSize1;

        break;

      case 'horizontal-top':
      case 'horizontal-start':
        chart.coordinate('rect').reflect('y');
        geom = chart.interval().position('x*y').shape(funnelShape).color('x', config.colors); // percentOffsetY = 3 * fontSize1;

        break;

      case 'horizontal-center':
        geom = chart.interval().position('x*y').shape(funnelShape).color('x', config.colors).adjust([{
          type: 'symmetric'
        }]);
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同

      default:
        geom = chart.interval().position('x*y').shape(funnelShape).color('x', config.colors);
      // percentOffsetY = -3 * fontSize1;
    }

    (0, _label["default"])(geom, config, 'y', {
      offset: (0, _common.pxToNumber)(_index["default"]['widgets-font-size-1']),
      labelLine: {
        style: {
          lineWidth: 1,
          stroke: _index["default"]['widgets-axis-line']
        }
      }
    });
    var geomStyle = config.geomStyle || {};
    geom.style((0, _extends2["default"])({}, geomStyle)); // 绘制辅助线，辅助背景区域

    (0, _guide["default"])(chart, config); // renderGuide(chart, config, data, percentOffsetX, percentOffsetY);
  };

  _proto.changeData = function changeData(chart, config, data) {
    chart.changeData(data);
    var drawType = config.direction + "-" + config.align; // const fontSize1 = pxToNumber(themes['widgets-font-size-1']);
    // let percentOffsetX = 0;
    // let percentOffsetY = 0;

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        // percentOffsetX = 3 * fontSize1;
        break;

      case 'vertical-center':
        break;

      case 'vertical-right':
      case 'vertical-end':
        // percentOffsetX = -3 * fontSize1;
        break;

      case 'horizontal-top':
      case 'horizontal-start':
        // percentOffsetY = 3 * fontSize1;
        break;

      case 'horizontal-center':
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同

      default: // percentOffsetY = -3 * fontSize1;

    } // renderGuide(chart, config, data, percentOffsetX, percentOffsetY);

  };

  return Wfunnel;
}(_Base2["default"]); // function renderGuide(chart: Chart, config: WfunnelConfig, data: ChartData, percentOffsetX: number, percentOffsetY: number) {
//   chart.guide().clear(true);
//   // 绘制辅助线，辅助背景区域
//   guide(chart, config);
//   // 中间标签文本
//   if (!config.percent) {
//     return;
//   }
//   const { labelFormatter, offsetX = 0, offsetY = 0, top = true, style = {} } = config.percent;
//   const positionY = config.align === 'center' ? 'median' : 'start';
//   data.forEach((d, i) => {
//     let content = `${numberDecimal(100 * d.y / data[0].y)}%`;
//     if (labelFormatter) {
//       content = labelFormatter(d.y / data[0].y, d, i);
//     }
//     const textConfig = {
//       top,
//       offsetX: percentOffsetX + offsetX,
//       offsetY: percentOffsetY + offsetY,
//       position: {
//         x: d.x,
//         y: positionY,
//       },
//       content,
//       style: {
//         fill: themes['widgets-label-text'],
//         fontSize: pxToNumber(themes['widgets-font-size-1']),
//         textAlign: 'center',
//         shadowBlur: 2,
//         shadowColor: 'rgba(255, 255, 255, .3)',
//         ...style,
//       },
//     };
//     chart.guide().text(textConfig);
//   });
// }


var _default = Wfunnel; // export default /*#__PURE__*/ errorWrap(g2Factory('G2Funnel', {
//   getDefaultConfig() {
//     return {
//       colors: themes.order_10,
//       padding: ['auto', 0, 'auto', 0],
//       legend: {
//         align: 'left',
//         nameFormatter: null, // 可以强制覆盖，手动设置label
//       },
//       tooltip: {
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//       // 主方向，从上到下(vertical)、从左到右(horizontal)
//       direction: 'vertical',
//       // 排列位置 start,center,end
//       align: 'center',
//       // 尖顶漏斗图
//       pyramid: false,
//       label: false,
//       percent: false,
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
//       type: {
//         type: 'cat',
//       },
//     };
//     chart.source(data, defs);
//     // 漏斗图目前看没有轴
//     chart.axis(false);
//     // 设置图例
//     rectLegend.call(this, chart, config, null, true);
//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       showTitle: false,
//       crosshairs: null,
//     });
//     // 根据传入的 direction 和 align 设置坐标系，并绘制图形
//     const drawType = `${config.direction}-${config.align}`;
//     let geom = null;
//     const fontSize1 = pxToNumber(themes['widgets-font-size-1']);
//     let percentOffsetX = 0;
//     let percentOffsetY = 0;
//     switch (drawType) {
//       case 'vertical-left':
//       case 'vertical-start':
//         chart.coord('rect').transpose().scale(1, -1);
//         geom = chart.interval();
//         percentOffsetX = 3 * fontSize1;
//         break;
//       case 'vertical-center':
//         chart.coord('rect').transpose().scale(1, -1);
//         geom = chart.intervalSymmetric();
//         break;
//       case 'vertical-right':
//       case 'vertical-end':
//         chart.coord('rect').transpose().scale(-1, -1);
//         geom = chart.interval();
//         percentOffsetX = -3 * fontSize1;
//         break;
//       case 'horizontal-top':
//       case 'horizontal-start':
//         chart.coord('rect').reflect('y');
//         geom = chart.interval();
//         percentOffsetY = 3 * fontSize1;
//         break;
//       case 'horizontal-center':
//         geom = chart.intervalSymmetric();
//         break;
//       // case 'horizontal-bottom':
//       // case 'horizontal-end':
//         // 和 default 时相同
//       default:
//         geom = chart.interval();
//         percentOffsetY = -3 * fontSize1;
//     }
//     const funnelShape = (config.align === 'center' && config.pyramid) ? 'pyramid' : 'funnel';
//     geom.position('x*y').shape(funnelShape).color('x', config.colors);
//     label(geom, config, 'y', {
//       offset: pxToNumber(themes['widgets-font-size-1']),
//       labelLine: {
//         lineWidth: 1,
//         stroke: themes['widgets-axis-line'],
//       },
//     });
//     const geomStyle = config.geomStyle || {};
//     geom.style('x*y*type*extra', {
//       ...geomStyle,
//     });
//     renderGuide(chart, config, data, percentOffsetX, percentOffsetY);
//     chart.render();
//   },
//   changeData(chart, config, data) {
//     chart.changeData(data);
//     const drawType = `${config.direction}-${config.align}`;
//     const fontSize1 = pxToNumber(themes['widgets-font-size-1']);
//     let percentOffsetX = 0;
//     let percentOffsetY = 0;
//     switch (drawType) {
//       case 'vertical-left':
//       case 'vertical-start':
//         percentOffsetX = 3 * fontSize1;
//         break;
//       case 'vertical-center':
//         break;
//       case 'vertical-right':
//       case 'vertical-end':
//         percentOffsetX = -3 * fontSize1;
//         break;
//       case 'horizontal-top':
//       case 'horizontal-start':
//         percentOffsetY = 3 * fontSize1;
//         break;
//       case 'horizontal-center':
//         break;
//       // case 'horizontal-bottom':
//       // case 'horizontal-end':
//       // 和 default 时相同
//       default:
//         percentOffsetY = -3 * fontSize1;
//     }
//     renderGuide(chart, config, data, percentOffsetX, percentOffsetY);
//   },
// }));

exports["default"] = _default;