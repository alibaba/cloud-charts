'use strict';

// import G2 from '@antv/g2';

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

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _legendFilter = require('../common/legendFilter');

var _legendFilter2 = _interopRequireDefault(_legendFilter);

require('./G2Heatmap.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Heatmap', {
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
      // grid: false,
      // label: false,
      coordinate: null
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
        type: 'cat'
      }, config.yAxis),
      type: {
        type: 'cat'
        // sync: true,
      }
    };

    chart.source(data, defs);

    if (config.coordinate) {
      var _config$coordinate = config.coordinate,
          _config$coordinate$ty = _config$coordinate.type,
          type = _config$coordinate$ty === undefined ? 'rect' : _config$coordinate$ty,
          reflect = _config$coordinate.reflect;

      var coord = chart.coord(type);
      if (reflect) {
        coord.reflect(reflect);
      }
    }

    // 设置单个Y轴
    _rectYAxis2.default.call(this, chart, config, undefined, {
      grid: null
    });

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    // 设置图例
    _rectLegend2.default.call(this, chart, config);
    chart.legend('x', false);
    chart.legend('y', false);

    _legendFilter2.default.call(this, chart, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    var geomStyle = config.geomStyle || {};

    chart.polygon().position('x*y').color('type', config.colors).tooltip('x*y*extra', function (x, y, extra) {
      return {
        name: x + ' - ' + y,
        value: (Array.isArray(extra) ? extra[0] : extra.value) || '-'
      };
    }).style('x*y*type*extra', _extends({
      lineWidth: 1,
      stroke: _index2.default['widgets-map-area-border']
    }, geomStyle));

    // label(geom, config, 'extra');

    chart.render();
  }
}
// changeData(chart, config, data) {
//   chart.changeData(data);
// },
// destroy() {
// },
));