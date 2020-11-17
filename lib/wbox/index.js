'use strict'; // import errorWrap from '../common/errorWrap';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _guide = _interopRequireDefault(require("../common/guide"));

require("./index.scss");

// import merge from '../common/merge';
// import getGeomSizeConfig from "../common/geomSize";
// import label from '../common/label';
var Wline = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wline, _Base);

  function Wline() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Box';
    return _this;
  }

  var _proto = Wline.prototype;

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
      dodge: true,
      marginRatio: 0,
      grid: false,
      // zoom: false,
      size: null // label: false,

    };
  } // beforeInit(props) {
  //   const { config } = props;
  //   const newConfig = merge({}, this.defaultConfig, config);
  //
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
  //     config: newConfig,
  //   });
  // }
  ;

  _proto.init = function init(chart, config, data) {
    // 设置数据度量
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'cat'
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };
    chart.scale(defs);
    chart.data(data); // 设置单个Y轴

    if (!config.facet) {
      _rectYAxis["default"].call(this, chart, config);
    } // 设置X轴


    _rectXAxis["default"].call(this, chart, config); // 设置图例


    _rectLegend["default"].call(this, chart, config, null, false, 'type');

    _legendFilter["default"].call(this, chart); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      crosshairs: {
        type: 'rect'
      }
    }); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config); // // 横向柱状图
    // if (!config.column) {
    //   chart.coord().transpose();
    // }

    drawBox(chart, config, config.colors);
  };

  return Wline;
}(_Base2["default"]);

exports["default"] = Wline;
;

function drawBox(chart, config, colors, field) {
  if (field === void 0) {
    field = 'type';
  }

  var dodge = config.dodge,
      marginRatio = config.marginRatio;
  var geom = null; // 分组

  geom = chart.schema().position(['x', 'y']).shape('box').color(field, colors).style(field, function (type) {
    return {
      lineWidth: 2
    }; // fill: (type) => {
    //
    // }
  });

  if (dodge !== false) {
    geom.adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0.5 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距

    }]);
  } // if (size) {
  //   const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
  //   geom.size(...sizeConfig);
  // }
  // label(geom, config);

}