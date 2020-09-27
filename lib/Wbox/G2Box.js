'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import label from '../common/label';


var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

var _common = require('../common/common');

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectAutoTickCount = require('../common/rectAutoTickCount');

var _rectAutoTickCount2 = _interopRequireDefault(_rectAutoTickCount);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _legendFilter = require('../common/legendFilter');

var _legendFilter2 = _interopRequireDefault(_legendFilter);

var _geomSize = require('../common/geomSize');

var _geomSize2 = _interopRequireDefault(_geomSize);

require('./G2Box.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Box', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index2.default.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'cat',
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
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
      size: null
      // label: false,
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, this.defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

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

    (0, _rectAutoTickCount2.default)(chart, config, defs, false);

    chart.source(data, defs);

    // 设置单个Y轴
    if (!config.facet) {
      _rectYAxis2.default.call(this, chart, config);
    }

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    // 设置图例
    _rectLegend2.default.call(this, chart, config, null, false, 'type');

    _legendFilter2.default.call(this, chart, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      crosshairs: {
        type: 'rect'
      }
    });

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // // 横向柱状图
    // if (!config.column) {
    //   chart.coord().transpose();
    // }

    drawBox(chart, config, config.colors);

    chart.render();
  }
}));


function drawBox(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'type';
  var dodge = config.dodge,
      marginRatio = config.marginRatio,
      size = config.size;

  var geom = null;

  // 分组
  geom = chart.schema().position(['x', 'y']).shape('box').color(field, colors).style(field, {
    lineWidth: 2
    // fill: (type) => {
    //
    // }
  });

  if (dodge !== false) {
    geom.adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0.5 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }

  if (size) {
    var _geom;

    var sizeConfig = (0, _geomSize2.default)(size, 20, 'y', 'x*y*type*extra');
    (_geom = geom).size.apply(_geom, sizeConfig);
  }

  // label(geom, config);
}