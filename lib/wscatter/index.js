'use strict'; // 引入所需要的库和样式

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

var _label = _interopRequireDefault(require("../common/label"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _autoTimeMask = _interopRequireDefault(require("../common/autoTimeMask"));

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

// import errorWrap from '../common/errorWrap';
// import merge from '../common/merge';
var Wscatte = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wscatte, _Base);

  function Wscatte() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2Line';
    return _this;
  }

  var _proto = Wscatte.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      // padding: ['auto', 'auto', 'auto', 'auto'],
      colors: _index["default"].category_12,
      xAxis: {
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
  };

  _proto.init = function init(chart, config, data) {
    // const config = userConfig;
    var colors = config.colors,
        jitter = config.jitter,
        _config$geomStyle = config.geomStyle,
        geomStyle = _config$geomStyle === void 0 ? {} : _config$geomStyle;
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: config.jitter ? 'cat' : 'linear'
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };
    console.log(defs.x, defs);
    defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
      type: 'linear',
      tickCount: 5
    }, config.yAxis);
    (0, _autoTimeMask["default"])(defs, this.rawData); // rectAutoTickCount(chart, config, defs, false);
    // chart.source(data, defs);

    chart.scale(defs);
    chart.data(data); // 设置X轴

    var xAxis = {};

    if (config.jitter) {
      xAxis.grid = {
        align: 'center',
        // 网格顶点从两个刻度中间开始
        line: {
          style: {
            stroke: _index["default"]['widgets-axis-grid'],
            lineWidth: 1 // lineDash: [3, 3]

          }
        }
      };
    } // 扰动点图不能打开垂直网格线


    if (config.grid && !config.jitter) {
      xAxis.grid = {
        line: {
          style: {
            stroke: _index["default"]['widgets-axis-grid'],
            lineWidth: 1
          }
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
    var geom = chart.point().color('type', colors).position('x*y').shape('circle').style(geomStyle); // .active(false);

    if (jitter) {
      geom.adjust('jitter');
    }

    (0, _label["default"])(geom, config); // if (size) {
    //   const sizeConfig = getGeomSizeConfig(size, 4, 'y', 'x*y*type*extra');
    //   geom.size(...sizeConfig);
    //   chart.legend('x', false);
    //   chart.legend('y', false);
    //   chart.legend('extra', false);
    // }
    // fix: 设置 rectLegend 后如果再调用 chart.legend 会生成默认图例

    _rectLegend["default"].call(this, chart, config, null, false, 'type');

    chart.render();
  };

  return Wscatte;
}(_Base2["default"]);

exports["default"] = Wscatte;
;