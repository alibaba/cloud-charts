'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _dataAdapter = require('../chartCommon/dataAdapter');

var _dataAdapter2 = _interopRequireDefault(_dataAdapter);

var _guide = require('../chartCommon/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectXAxis = require('../chartCommon/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../chartCommon/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectTooltip = require('../chartCommon/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../chartCommon/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

require('./G2LineBar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  lineColors: _normal.color.category_12.slice(1),
  barColors: _normal.color.linear_10,
  padding: [40, 45, 32, 44],
  xAxis: {
    type: 'timeCat', // 默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', // 上述type为time时，此字段生效
    labelFormatter: null, // 可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
    max: null,
    min: null
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
  area: false,
  stack: false, // 仅Area有效
  stackReverse: true,
  spline: false,
  grid: false,
  symbol: false
  // TODO
  // zoom: false,
  // labels: false,
  // mini: false,
  // dataConfig: {
  //   nameKey: 'name',
  //   valueKey: 'value',
  //   // valueKey: ['value1', 'value2'],
  //   typeKey: 'type'
  // }
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);
    // TODO 处理padding
    return _extends({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 45, 32, 44]),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = userConfig;

    var rawLineData = [];
    var rawBarData = [];
    data.forEach(function (d) {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    var lineData = (0, _dataAdapter2.default)(rawLineData, config);
    var barData = (0, _dataAdapter2.default)(rawBarData, config);

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'cat'
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        defs['y' + yIndex] = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
        // 单轴时，必须同步度量，否则会两个度量叠加在一起
        sync: true
      }, config.yAxis);
    }

    chart.scale(defs);

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        var axisColor = (0, _common.getDataIndexColor)(config.lineColors, rawLineData, yIndex) || (0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex) || _normal.color.colorN16;
        var yAxisConfig = {
          line: {
            stroke: axisColor
          }
        };
        if (yIndex !== 0) {
          yAxisConfig.grid = null;
          // 因为是多个view组成的图表，所以这里需要移动位置
          yAxisConfig.position = 'right';
        }

        _rectYAxis2.default.call(_this, chart, _extends({}, config, { yAxis: axis }), 'y' + yIndex, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      _rectYAxis2.default.call(this, chart, config);
    }

    // 设置图例
    _rectLegend2.default.call(this, chart, config, {
      'g2-legend': _extends({
        display: 'inline-block',
        position: 'relative',
        textAlign: 'left',
        top: _normal.size.s3
      }, config.legend.align === 'right' ? { marginLeft: _normal.size.s3 } : { marginRight: _normal.size.s3 })
    });

    if (config.legend) {
      // hack 图例的位置，仅在初始化时处理一遍
      setTimeout(function () {
        var parent = _this.chartDom.querySelector('.g2-legend').parentNode;
        if (parent) {
          parent.style.textAlign = config.legend.align === 'right' ? 'right' : 'left';
        }
      }, 100);
    }

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // 正式开始绘图，创建两个不同的view
    var barView = chart.view();
    barView.source(barData);
    this.barView = barView;

    var lineView = chart.view();
    lineView.source(lineData);
    this.lineView = lineView;

    var lineShape = config.spline ? 'smooth' : 'line';
    var areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (asix, yIndex) {
        if ((0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, 'y' + yIndex);
        }
        if ((0, _common.getDataIndexColor)(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, lineShape, areaShape, 'y' + yIndex);
        }
      });
    } else {
      drawBar(barView, config);
      drawLine(lineView, config, lineShape, areaShape);
    }

    chart.render();
  },
  changeData: function changeData(chart, userConfig, data) {
    var rawLineData = [];
    var rawBarData = [];
    data.forEach(function (d) {
      if (d.type === 'line') {
        rawLineData.push(d);
      } else if (d.type === 'bar') {
        rawBarData.push(d);
      }
    });

    var lineData = (0, _dataAdapter2.default)(rawLineData, userConfig);
    var barData = (0, _dataAdapter2.default)(rawBarData, userConfig);

    this.barView && this.barView.changeData(barData);
    this.lineView && this.lineView.changeData(lineData);
  }
};


function drawBar(chart, config) {
  var yAxisKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';

  if (config.stack) {
    chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'stack',
      reverseOrder: !config.stackReverse // 层叠顺序倒序
    }]);
  } else {
    chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'dodge',
      marginRatio: 0 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }
}

function drawLine(chart, config, lineShape, areaShape) {
  var yAxisKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'y';

  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape).active(false);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape).active(false);
    chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style({
      lineJoin: 'round'
    });
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3).active(false);
  }
}
module.exports = exports['default'];