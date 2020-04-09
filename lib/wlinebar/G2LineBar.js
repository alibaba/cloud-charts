'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, getDataIndexColor, propertyMap, defaultPadding } from '../common/common';
import highchartsDataToG2Data from '../common/dataAdapter';
import { drawGuideArea, drawGuideLine, drawGuideFilter } from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import autoTimeMask from '../common/autoTimeMask';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label from '../common/label';
import './G2LineBar.scss';
import { legendHtmlContainer, legendHtmlListItem } from '../common/g2Theme';

export default /*#__PURE__*/errorWrap(g2Factory('G2LineBar', {
  convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      lineColors: themes.category_12.slice(1),
      barColors: themes.linear_10,
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

    var newConfig = merge({}, this.defaultConfig, config);
    // TODO 处理padding
    return _extends({}, props, {
      padding: defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
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

    var lineData = highchartsDataToG2Data(rawLineData, config);
    var barData = highchartsDataToG2Data(rawBarData, config);

    var defs = {
      x: propertyAssign(propertyMap.xAxis, {
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
        defs['y' + yIndex] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
        // 单轴时，必须同步度量，否则会两个度量叠加在一起
        sync: true
      }, config.yAxis);
    }

    autoTimeMask(defs, this.rawData);

    rectAutoTickCount(chart, config, defs, false);

    chart.scale(defs);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        var axisColor = getDataIndexColor(config.lineColors, rawLineData, yIndex) || getDataIndexColor(config.barColors, rawBarData, yIndex) || themes['widgets-axis-line'];
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

        rectYAxis.call(_this, chart, _extends({}, config, { yAxis: axis }), 'y' + yIndex, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      rectYAxis.call(this, chart, config);
    }

    // 设置图例
    var legendStyle = _extends({}, legendHtmlContainer, {
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
        legendStyle.marginLeft = themes['widgets-font-size-1'];
      } else if (align === 'left') {
        legendStyle.marginRight = themes['widgets-font-size-1'];
      } else if (align === 'center') {
        legendStyle.marginRight = themes['widgets-font-size-1'];
      } else {
        // 默认放到左边
        legendStyle.marginRight = themes['widgets-font-size-1'];
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
    rectLegend.call(this, chart, config, {
      'g2-legend': legendStyle
      // 'g2-legend-list-item': legendItemStyle,
    }, false, 'type');

    // tooltip
    rectTooltip.call(this, chart, config);

    // 正式开始绘图，创建两个不同的view
    var barView = chart.view();
    barView.source(barData);
    this.barView = barView;

    var lineView = chart.view();
    lineView.source(lineData);
    this.lineView = lineView;

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (asix, yIndex) {
        if (getDataIndexColor(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, 'y' + yIndex);
        }
        if (getDataIndexColor(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, 'y' + yIndex);
        }
      });
    } else {
      drawBar(barView, config);
      drawLine(lineView, config);
    }

    // 绘制辅助线，辅助背景区域
    viewGuide(config, lineView, rawLineData, barView, rawBarData);

    legendFilter.call(this, barView, config, 'rawBarData');
    legendFilter.call(this, lineView, config, 'rawLineData');

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

    var lineData = highchartsDataToG2Data(rawLineData, userConfig);
    var barData = highchartsDataToG2Data(rawBarData, userConfig);

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

  label(intervalGeom, config, yAxisKey, null, 'barLabel');
}

function drawLine(chart, config) {
  var yAxisKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';

  var lineGeom = null;
  var lineWidth = config.lineWidth;

  var geomStyle = {};
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

  label(lineGeom, config, yAxisKey, null, 'lineLabel');

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
        drawGuideLine(getGuideView(config, line, lineView, rawLineData, barView, rawBarData), line);
      });
    } else {
      drawGuideLine(getGuideView(config, guideLine, lineView, rawLineData, barView, rawBarData), guideLine);
    }
  }

  if (guideArea) {
    if (Array.isArray(guideArea)) {
      guideArea.forEach(function (area) {
        drawGuideArea(getGuideView(config, area, lineView, rawLineData, barView, rawBarData), area);
      });
    } else {
      drawGuideArea(getGuideView(config, guideArea, lineView, rawLineData, barView, rawBarData), guideArea);
    }
  }

  if (guideFilter) {
    if (Array.isArray(guideFilter)) {
      guideFilter.forEach(function (filter) {
        drawGuideFilter(getGuideView(config, filter, lineView, rawLineData, barView, rawBarData), filter);
      });
    } else {
      drawGuideFilter(getGuideView(config, guideFilter, lineView, rawLineData, barView, rawBarData), guideFilter);
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
    if (getDataIndexColor(config.barColors, rawBarData, yIndex)) {
      return barView;
    }
  }

  return lineView;
}