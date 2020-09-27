'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

var _common = require('../common/common');

var _dataAdapter = require('../common/dataAdapter');

var _dataAdapter2 = _interopRequireDefault(_dataAdapter);

var _guide = require('../common/guide');

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _autoTimeMask = require('../common/autoTimeMask');

var _autoTimeMask2 = _interopRequireDefault(_autoTimeMask);

var _rectAutoTickCount = require('../common/rectAutoTickCount');

var _rectAutoTickCount2 = _interopRequireDefault(_rectAutoTickCount);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _legendFilter = require('../common/legendFilter');

var _legendFilter2 = _interopRequireDefault(_legendFilter);

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

require('./G2LineBar.css');

var _g2Theme = require('../common/g2Theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2LineBar', {
  convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      lineColors: _index2.default.category_12.slice(1),
      barColors: _index2.default.linear_10,
      padding: ['auto', 'auto', 'auto', 'auto'],
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
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      area: false,
      dodgeStack: false,
      stack: false, // 仅Area有效
      stackReverse: true,
      marginRatio: 0,
      spline: false,
      grid: false,
      symbol: false,
      lineLabel: undefined,
      barLabel: undefined,
      label: false
      // TODO
      // zoom: false,
      // mini: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }
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
    var _this = this;

    var config = userConfig;

    var rawLineData = [];
    this.rawLineData = rawLineData;
    var rawBarData = [];
    this.rawBarData = rawBarData;
    (data || []).forEach(function (d) {
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

    (0, _autoTimeMask2.default)(defs, this.rawData);

    (0, _rectAutoTickCount2.default)(chart, config, defs, false);

    chart.scale(defs);

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        var axisColor = (0, _common.getDataIndexColor)(config.lineColors, rawLineData, yIndex) || (0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex) || _index2.default['widgets-axis-line'];
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
    var legendStyle = _extends({}, _g2Theme.legendHtmlContainer, {
      display: 'inline-block',
      position: 'relative'
    });
    // const legendItemStyle = {
    //   ...legendHtmlListItem,
    // };
    if (config.legend !== false) {
      var _ref = config.legend || {},
          position = _ref.position,
          align = _ref.align;

      // if (position === 'top') {
      //   legendStyle.top = themes['widgets-font-size-1'];
      // }

      if (align === 'right') {
        legendStyle.marginLeft = _index2.default['widgets-font-size-1'];
      } else if (align === 'left') {
        legendStyle.marginRight = _index2.default['widgets-font-size-1'];
      } else if (align === 'center') {
        legendStyle.marginRight = _index2.default['widgets-font-size-1'];
      } else {
        // 默认放到左边
        legendStyle.marginRight = _index2.default['widgets-font-size-1'];
      }

      if (position === 'bottom') {
        legendStyle.top = '100%';
        legendStyle.transform = 'translate(0, -100%)';
        legendStyle.overflow = 'visible';
        legendStyle.verticalAlign = 'top';

        // legendItemStyle.marginBottom = 0;
        // legendItemStyle.marginTop = themes['widgets-font-size-1'];
      }
    }
    _rectLegend2.default.call(this, chart, config, {
      'g2-legend': legendStyle
      // 'g2-legend-list-item': legendItemStyle,
    }, false, 'type');

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

    // 正式开始绘图，创建两个不同的view
    var barView = chart.view();
    barView.source(barData);
    this.barView = barView;

    var lineView = chart.view();
    lineView.source(lineData);
    this.lineView = lineView;

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (asix, yIndex) {
        if ((0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, 'y' + yIndex);
        }
        if ((0, _common.getDataIndexColor)(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, 'y' + yIndex);
        }
      });
    } else {
      drawBar(barView, config);
      drawLine(lineView, config);
    }

    // 绘制辅助线，辅助背景区域
    viewGuide(config, lineView, rawLineData, barView, rawBarData);

    _legendFilter2.default.call(this, barView, config, 'rawBarData');
    _legendFilter2.default.call(this, lineView, config, 'rawLineData');

    chart.render();
  },
  changeData: function changeData(chart, userConfig, data) {
    var rawLineData = [];
    this.rawLineData = rawLineData;
    var rawBarData = [];
    this.rawBarData = rawBarData;
    (data || []).forEach(function (d) {
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
    if (config.legend !== false) {
      var _ref2 = config.legend || {},
          _ref2$position = _ref2.position,
          position = _ref2$position === undefined ? 'top' : _ref2$position,
          align = _ref2.align;

      // hack 图例的位置


      var dom = this.chartDom && this.chartDom.querySelector('.g2-legend');
      if (dom && dom.parentNode) {
        dom.parentNode.className = '';

        dom.parentNode.classList.add('widgets-legend-align-' + (align || 'left'));
      }
    } else {
      // 清空类名
      var _dom = this.chartDom && this.chartDom.querySelector('.g2-legend');
      if (_dom && _dom.parentNode) {
        _dom.parentNode.className = '';
      }
    }
  }
}));


function drawBar(chart, config) {
  var yAxisKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';
  var stack = config.stack,
      stackReverse = config.stackReverse,
      marginRatio = config.marginRatio,
      dodgeStack = config.dodgeStack;

  var geomStyle = config.barGeomStyle || {};

  var intervalGeom = null;
  if (dodgeStack) {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      dodgeBy: 'dodge'
    }, {
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序
    }]);
  } else if (stack) {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序
    }]);
  } else {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color('type', config.barColors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }

  intervalGeom.style(_extends({}, geomStyle));

  (0, _label2.default)(intervalGeom, config, yAxisKey, null, 'barLabel');
}

function drawLine(chart, config) {
  var yAxisKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';

  var lineGeom = null;
  var lineWidth = config.lineWidth;

  var geomStyle = config.lineGeomStyle || {};
  if (lineWidth !== undefined) {
    geomStyle.lineWidth = lineWidth;
  }

  // 区域、堆叠、平滑曲线
  var lineShape = config.spline ? 'smooth' : 'line';
  var areaShape = config.spline ? 'smooth' : 'area';

  var stack = config.stack || config.dodgeStack;

  if (config.area && stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape).active(false);
    lineGeom = chart.lineStack().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style(_extends({
      lineJoin: 'round'
    }, geomStyle));
  } else if (config.area && !stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.lineColors).shape(areaShape).active(false);
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style(_extends({
      lineJoin: 'round'
    }, geomStyle));
  } else {
    lineGeom = chart.line().position(['x', yAxisKey]).color('type', config.lineColors).shape(lineShape).style(_extends({
      lineJoin: 'round'
    }, geomStyle));
  }

  (0, _label2.default)(lineGeom, config, yAxisKey, null, 'lineLabel');

  // 曲线默认点
  if (config.symbol && config.area && stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.lineColors).shape('circle').size(3).active(false);
  }
}

function viewGuide(config, lineView, rawLineData, barView, rawBarData) {
  var guide = config.guide;

  if (!guide) {
    return;
  }

  var guideLine = guide.line,
      guideArea = guide.area,
      guideFilter = guide.filter,
      other = _objectWithoutProperties(guide, ['line', 'area', 'filter']);

  if (guideLine) {
    if (Array.isArray(guideLine)) {
      guideLine.forEach(function (line) {
        (0, _guide.drawGuideLine)(getGuideView(config, line, lineView, rawLineData, barView, rawBarData), line);
      });
    } else {
      (0, _guide.drawGuideLine)(getGuideView(config, guideLine, lineView, rawLineData, barView, rawBarData), guideLine);
    }
  }

  if (guideArea) {
    if (Array.isArray(guideArea)) {
      guideArea.forEach(function (area) {
        (0, _guide.drawGuideArea)(getGuideView(config, area, lineView, rawLineData, barView, rawBarData), area);
      });
    } else {
      (0, _guide.drawGuideArea)(getGuideView(config, guideArea, lineView, rawLineData, barView, rawBarData), guideArea);
    }
  }

  if (guideFilter) {
    if (Array.isArray(guideFilter)) {
      guideFilter.forEach(function (filter) {
        (0, _guide.drawGuideFilter)(getGuideView(config, filter, lineView, rawLineData, barView, rawBarData), filter);
      });
    } else {
      (0, _guide.drawGuideFilter)(getGuideView(config, guideFilter, lineView, rawLineData, barView, rawBarData), guideFilter);
    }
  }

  if (!guideLine && !guideArea && !guideFilter && Object.keys(other).length > 0) {
    console.warn('guide 定义异常，请使用 guide.line 或 guide.area');
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