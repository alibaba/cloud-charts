'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g2Brush = require('@antv/g2-brush');

var _g2Brush2 = _interopRequireDefault(_g2Brush);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _guide = require('../chartCommon/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectTooltip = require('../chartCommon/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../chartCommon/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _ResetButton = require('../chartCommon/ResetButton');

var _ResetButton2 = _interopRequireDefault(_ResetButton);

require('./G2Bar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  colors: _normal.color.category_12,
  padding: [40, 5, 32, 44],
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
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null
  },
  column: true,
  stack: false,
  stackReverse: true,
  grid: false,
  zoom: false,
  // labels: false,
  polar: false
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

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

    chart.source(data, defs);

    var yAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        formatter: config.yAxis.labelFormatter
      }
    };

    var xAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate: config.xAxis.autoRotate,
        formatter: config.xAxis.labelFormatter
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: _normal.color.colorN13
          // lineWidth: 1,
          // lineDash: null
        }
        // TODO 双轴情况下，需要处理
        // hideFirstLine: true
      };
    }
    chart.axis('x', xAxis);
    chart.axis('y', yAxis);

    // 设置图例
    _rectLegend2.default.call(this, chart, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // if (config.polar) {
    // chart.coord('theta', {
    //   inner: 0.6
    // });
    //
    // chart.point().position('name*0').color('name').shape('circle');
    // chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
    // chart.point().position('name*value').color('name').shape('circle');
    // } else {
    // 横向柱状图
    if (!config.column) {
      chart.coord().transpose();
    }
    // 堆叠
    if (config.stack) {
      chart.interval().position('x*y').color('type', config.colors).adjust([{
        type: 'stack',
        reverseOrder: !config.stackReverse // 层叠顺序倒序
      }]);
    } else {
      chart.interval().position('x*y').color('type', config.colors).adjust([{
        type: 'dodge',
        marginRatio: 0 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      }]);
    }
    // }

    chart.render();

    if (config.zoom) {
      var button = this.resetButton = new _ResetButton2.default(chart);

      this.brush = new _g2Brush2.default({
        canvas: chart.get('canvas'),
        chart: chart,
        type: 'X',
        onBrushstart: function onBrushstart() {
          chart.hideTooltip();
        },
        onBrushmove: function onBrushmove() {
          chart.hideTooltip();
          button.show();
        }
      });
    }
  }
};
module.exports = exports['default'];