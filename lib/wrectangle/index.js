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

var _guide = _interopRequireDefault(require("../common/guide"));

var _label = _interopRequireDefault(require("../common/label"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _dataSet = require("@antv/data-set/lib/data-set");

require("@antv/data-set/lib/transform/bin/rectangle");

require("./index.scss");

var Wrectangle = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wrectangle, _Base);

  function Wrectangle() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Rectangle';
    _this.convertData = false;
    return _this;
  }

  var _proto = Wrectangle.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      colors: _index["default"].order_10.slice().reverse(),
      xAxis: {
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        autoRotate: false,
        max: null,
        min: null
      },
      yAxis: {
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      },
      bin: {
        fields: ['x', 'y'],
        bins: [20, 10] // 两个方向上的分箱个数
        // binWidth: [ 10, 1000 ],    // 两个方向上的分箱步长（会覆盖bins的配置）
        // offset: [ 0, 0 ],

      },
      grid: false,
      label: false
    };
  };

  _proto.init = function init(chart, config, data) {
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };
    var ds = new _dataSet.DataSet();
    var rectangleDataView = ds.createView('diamond').source(data).transform({
      type: 'bin.rectangle',
      fields: ['x', 'y'],
      // 对应坐标轴上的一个点
      bins: [20, 10] // 两个方向上的分箱个数
      // binWidth: [10, 10], // 两个方向上的分箱步长（会覆盖bins配置）
      // offset: [0, 0], // 两个方向上的分箱偏移量
      // sizeByCount: false, // 是否根据分箱个数调整分箱大小
      // as: ['x', 'y', 'count'], // 这个点落在的六边形的顶点坐标集

    });
    chart.scale(defs);
    chart.data(rectangleDataView.rows); // 设置X轴

    _rectXAxis["default"].call(this, chart, config); // 设置单个Y轴


    _rectYAxis["default"].call(this, chart, config); // 设置图例


    chart.legend(false); // tooltip

    _rectTooltip["default"].call(this, chart, config, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false
    }, function (ev) {}, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false
    }); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config);
    var geom = chart.polygon().position('x*y').color('count', config.colors).tooltip('x*y*count', function (x, y, count) {
      return {
        // title: x,
        name: '数量',
        value: count
      };
    });
    var geomStyle = config.geomStyle || {};
    geom.style((0, _extends2["default"])({}, geomStyle));
    (0, _label["default"])(geom, config, 'count', {
      offset: 0
    }); // chart.render();
  };

  return Wrectangle;
}(_Base2["default"]);

var _default = Wrectangle; // export default /*#__PURE__*/ errorWrap(g2Factory('G2Rectangle', {
//   convertData: false,
//   getDefaultConfig() {
//     return {
//       // 这里需要倒序排列
//       colors: themes.order_10.slice().reverse(),
//       padding: ['auto', 'auto', 'auto', 'auto'],
//       xAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         autoRotate: false,
//         max: null,
//         min: null,
//       },
//       yAxis: {
//         labelFormatter: null, // 可以强制覆盖，手动设置label
//         max: null,
//         min: null,
//       },
//       tooltip: {
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//       bin: {
//         fields: ['x', 'y'],
//         bins: [20, 10], // 两个方向上的分箱个数
//         // binWidth: [ 10, 1000 ],    // 两个方向上的分箱步长（会覆盖bins的配置）
//         // offset: [ 0, 0 ],
//       },
//       grid: false,
//       label: false,
//     };
//   },
//   beforeInit(props) {
//     const { config } = props;
//     const newConfig = merge({}, this.defaultConfig, config);
//     // TODO 处理padding
//     // let defaultPaddingTop = this.defaultConfig.padding[0];
//     // let defaultPaddingRight = this.defaultConfig.padding[1];
//     // const defaultPaddingBottom = this.defaultConfig.padding[2];
//     // const defaultPaddingLeft = this.defaultConfig.padding[3];
//     // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
//     //   defaultPaddingRight = 44;
//     // }
//     // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
//     //   defaultPaddingTop = 16;
//     // }
//     return Object.assign({}, props, {
//       padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
//       config: newConfig,
//     });
//   },
//   init(chart, userConfig, data) {
//     const config = userConfig;
//     const ds = new DataSet();
//     const rectangleDataView = ds.createView('diamond')
//       .source(data)
//       .transform(propertyAssign(['fields', 'bins', 'binWidth', 'offset', 'sizeByCount'], {
//         type: 'bin.rectangle',
//       }, config.bin));
//     this.rectangleDataView = rectangleDataView;
//     const defs = {
//       x: propertyAssign(propertyMap.xAxis, {
//         // 折线图X轴的范围默认覆盖全部区域，保证没有空余
//         range: [0, 1],
//       }, config.xAxis),
//       y: propertyAssign(propertyMap.yAxis, {
//         type: 'linear',
//         tickCount: 5,
//       }, config.yAxis),
//       type: {
//         type: 'cat',
//       },
//     };
//     rectAutoTickCount(chart, config, defs, false);
//     chart.source(rectangleDataView, defs);
//     // 设置X轴
//     rectXAxis.call(this, chart, config);
//     // 设置单个Y轴
//     rectYAxis.call(this, chart, config);
//     // 设置图例
//     chart.legend(false);
//     // tooltip
//     rectTooltip.call(this, chart, config, {
//       showTitle: false,
//       crosshairs: null,
//     });
//     // 绘制辅助线，辅助背景区域
//     guide(chart, config);
//     const geom = chart.polygon().position('x*y').color('count', config.colors).tooltip('x*y*count', (x, y, count) => ({
//       // title: x,
//       name: '数量',
//       value: count,
//     }));
//     const geomStyle = config.geomStyle || {};
//     geom.style('x*y*count*extra', {
//       ...geomStyle,
//     });
//     label(geom, config, 'count', {
//       offset: 0,
//     });
//     chart.render();
//   },
//   changeData(chart, newConfig, data) {
//     if (this.rectangleDataView) {
//       this.rectangleDataView.source(data);
//     }
//   },
// }));

exports["default"] = _default;