'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _common = require('../common/common');

var _dataAdapter = require('../common/dataAdapter');

var _dataAdapter2 = _interopRequireDefault(_dataAdapter);

var _guide = require('../common/guide');

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

require('./G2LineBar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  lineColors: _index.color.category_12.slice(1),
  barColors: _index.color.linear_10,
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
        // fix 更新数据时x轴无法清除数据
        // sync: true,
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
        var axisColor = (0, _common.getDataIndexColor)(config.lineColors, rawLineData, yIndex) || (0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex) || _index.color.widgetsAxisLine;
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
        top: _index.size.s3
      }, config.legend.align === 'right' ? { marginLeft: _index.size.s3 } : { marginRight: _index.size.s3 })
    });

    // hackLegendPosition.call(this, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

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

    // 绘制辅助线，辅助背景区域
    viewGuide(config, lineView, rawLineData, barView, rawBarData);

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

    this.barView && this.barView.source(barData);
    this.lineView && this.lineView.source(lineData);
    chart.render();

    // hackLegendPosition.call(this, userConfig);
  },
  afterRender: function afterRender(chart, config) {
    if (config.legend) {
      // hack 图例的位置
      var dom = this.chartDom && this.chartDom.querySelector('.g2-legend');
      if (dom && dom.parentNode) {
        dom.parentNode.style.textAlign = config.legend.align === 'right' ? 'right' : 'left';
      }
    }
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

// function hackLegendPosition(config) {
//   if (config.legend) {
//     // hack 图例的位置，仅在初始化时处理一遍
//     setTimeout(() => {
//       const dom = this.chartDom && this.chartDom.querySelector('.g2-legend');
//       if (dom && dom.parentNode) {
//         dom.parentNode.style.textAlign = config.legend.align === 'right' ? 'right' : 'left';
//       }
//     }, 50);
//   }
// }

function viewGuide(config, lineView, rawLineData, barView, rawBarData) {
  var guide = config.guide;
  if (!guide) {
    return;
  }

  if (guide.line) {
    if (Array.isArray(guide.line)) {
      guide.line.forEach(function (line) {
        (0, _guide.drawGuideLine)(getGuideView(config, line, lineView, rawLineData, barView, rawBarData), line);
      });
    } else {
      (0, _guide.drawGuideLine)(getGuideView(config, guide.line, lineView, rawLineData, barView, rawBarData), guide.line);
    }
  }

  if (guide.area) {
    if (Array.isArray(guide.area)) {
      guide.area.forEach(function (area) {
        (0, _guide.drawGuideArea)(getGuideView(config, area, lineView, rawLineData, barView, rawBarData), area);
      });
    } else {
      (0, _guide.drawGuideArea)(getGuideView(config, guide.area, lineView, rawLineData, barView, rawBarData), guide.area);
    }
  }
}

function getGuideView(config, guide, lineView, rawLineData, barView, rawBarData) {
  var target = guide.target,
      axis = guide.axis,
      value = guide.value;

  // 如果用户指定了绘制目标，直接使用

  if (target === 'line') {
    return lineView;
  } else if (target === 'bar') {
    return barView;
  }

  if (axis && (value || value === 0) && /y\d/.test(axis)) {
    var yIndex = Number(axis.replace(/^y/, ''));
    if ((0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex)) {
      return barView;
    }
  }

  return lineView;
}
module.exports = exports['default'];