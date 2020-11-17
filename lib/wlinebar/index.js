'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _marker = require("@antv/g2/esm/util/marker");

var _g = require("@antv/g2");

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _dataAdapter = _interopRequireDefault(require("../common/dataAdapter"));

var _guide = require("../common/guide");

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _autoTimeMask = _interopRequireDefault(require("../common/autoTimeMask"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _label = _interopRequireDefault(require("../common/label"));

require("./index.scss");

// import { getMappingValue } from "@antv/g2/esm/util/attr";
// import errorWrap from '../common/errorWrap';
function getLegendItems(lineData, barData, lineGeom, barGeom, config) {
  var result = [];
  var reMap = {};
  var lineColors = config.lineColors,
      barColors = config.barColors;

  function getItems(data, geom, shapeType, colors, style) {
    data.forEach(function (d, i) {
      var name = d.name,
          visible = d.visible;

      if (reMap[name]) {
        return;
      } else {
        reMap[name] = true;
      }

      var marker;
      var shapeFactory = (0, _g.getShapeFactory)(geom.shapeType);

      if (shapeFactory) {
        marker = shapeFactory.getMarker(shapeType, {
          color: colors[i % colors.length],
          isInPolar: false
        });
        var symbol = marker.symbol; // @ts-ignore

        if (typeof symbol === 'string' && _marker.MarkerSymbols[symbol]) {
          // @ts-ignore
          marker.symbol = _marker.MarkerSymbols[symbol];
        }
      }

      if (style) {
        Object.assign(marker.style, style);
      }

      result.push({
        id: name,
        name: name,
        value: name,
        marker: marker,
        unchecked: visible === false
      });
    });
  }

  getItems(barData, barGeom, 'point', barColors);
  var area = config.area,
      spline = config.spline;
  var lineShapeType = 'line';
  var lineStyle = {};

  if (area) {
    lineShapeType = 'area';
  }

  if (spline) {
    lineShapeType = 'smooth';
  }

  if (!area && spline) {
    lineStyle.fill = null;
  }

  getItems(lineData, lineGeom, lineShapeType, lineColors, lineStyle); // lineData.forEach((d, i) => {
  //   const { name, visible } = d;
  //   if (reMap[name]) {
  //     return;
  //   }
  //   let marker;
  //   const shapeFactory = getShapeFactory(lineGeom.shapeType);
  //   if (shapeFactory) {
  //     marker = shapeFactory.getMarker('point', {
  //       color: lineColors[i % lineColors.length],
  //       isInPolar: false,
  //     });
  //     // lineGeom.getShapeMarker
  //
  //     const symbol = marker.symbol;
  //     // @ts-ignore
  //     if (typeof symbol === 'string' && MarkerSymbols[symbol]) {
  //       // @ts-ignore
  //       marker.symbol = MarkerSymbols[symbol];
  //     }
  //   }
  //
  //   result.push({
  //     id: name,
  //     name,
  //     value: name,
  //     marker,
  //     unchecked: visible === false,
  //   });
  //   reMap[name] = true;
  // });
  // barData.forEach((d, i) => {
  //   const { name, visible } = d;
  //   if (reMap[name]) {
  //     return;
  //   }
  //   let marker;
  //   const shapeFactory = getShapeFactory(barGeom.shapeType);
  //   if (shapeFactory) {
  //     marker = shapeFactory.getMarker('point', {
  //       color: barColors[i % barColors.length],
  //       isInPolar: false,
  //     });
  //
  //     const symbol = marker.symbol;
  //     // @ts-ignore
  //     if (typeof symbol === 'string' && MarkerSymbols[symbol]) {
  //       // @ts-ignore
  //       marker.symbol = MarkerSymbols[symbol];
  //     }
  //   }
  //
  //   result.push({
  //     id: name,
  //     name,
  //     value: name,
  //     marker,
  //     unchecked: visible === false,
  //   });
  //   reMap[name] = true;
  // });

  return result;
}

var Wlinebar = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wlinebar, _Base);

  function Wlinebar() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2LineBar';
    _this.convertData = false;
    _this.rawLineData = [];
    _this.lineView = void 0;
    _this.rawBarData = [];
    _this.barView = void 0;
    return _this;
  }

  var _proto = Wlinebar.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      lineColors: _index["default"].category_12.slice(1),
      barColors: _index["default"].linear_10,
      // padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'timeCat',
        // 默认为线性
        mask: 'YYYY-MM-DD HH:mm:ss',
        // 上述type为time时，此字段生效
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        categories: null,
        // autoRotate: false,
        max: null,
        min: null
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
      area: false,
      dodgeStack: false,
      stack: false,
      // 仅Area有效
      stackReverse: true,
      marginRatio: 0,
      spline: false,
      grid: false,
      symbol: false,
      // lineLabel: undefined,
      // barLabel: undefined,
      label: false // TODO
      // zoom: false,
      // mini: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }

    };
  };

  _proto.beforeInit = function beforeInit(props) {
    return (0, _extends2["default"])({
      syncViewPadding: true
    }, props);
  };

  _proto.init = function init(chart, config, data) {
    var _this2 = this;

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
    var lineData = (0, _dataAdapter["default"])(rawLineData, config, {// type: 'lineType',
    });
    var barData = (0, _dataAdapter["default"])(rawBarData, config, {// type: 'barType',
    });
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'cat' // fix 更新数据时x轴无法清除数据
        // sync: 'x',

      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        defs["y" + yIndex] = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
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

    (0, _autoTimeMask["default"])(defs, this.rawData);
    chart.scale(defs); // 设置X轴

    _rectXAxis["default"].call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        var axisColor = (0, _common.getDataIndexColor)(config.lineColors, rawLineData, yIndex) || (0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex) || _index["default"]['widgets-axis-line'];

        var yAxisConfig = {
          line: {
            style: {
              stroke: axisColor
            }
          }
        };

        if (yIndex !== 0) {
          yAxisConfig.grid = null; // 因为是多个view组成的图表，所以这里需要移动位置

          yAxisConfig.position = 'right';
        }

        _rectYAxis["default"].call(_this2, chart, (0, _extends2["default"])({}, config, {
          yAxis: axis
        }), "y" + yIndex, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      _rectYAxis["default"].call(this, chart, config);
    } // 设置图例
    // const legendStyle = {
    //   ...legendHtmlContainer,
    //   display: 'inline-block',
    //   position: 'relative',
    // };
    // // const legendItemStyle = {
    // //   ...legendHtmlListItem,
    // // };
    // if (config.legend !== false) {
    //   const { position, align } = config.legend || {};
    //
    //   // if (position === 'top') {
    //   //   legendStyle.top = themes['widgets-font-size-1'];
    //   // }
    //
    //   if (align === 'right') {
    //     legendStyle.marginLeft = themes['widgets-font-size-1'];
    //   } else if (align === 'left') {
    //     legendStyle.marginRight = themes['widgets-font-size-1'];
    //   } else if (align === 'center') {
    //     legendStyle.marginRight = themes['widgets-font-size-1'];
    //   } else {
    //     // 默认放到左边
    //     legendStyle.marginRight = themes['widgets-font-size-1'];
    //   }
    //
    //   if (position === 'bottom') {
    //     legendStyle.top = '100%';
    //     legendStyle.transform = 'translate(0, -100%)';
    //     legendStyle.overflow = 'visible';
    //     legendStyle.verticalAlign = 'top';
    //
    //     // legendItemStyle.marginBottom = 0;
    //     // legendItemStyle.marginTop = themes['widgets-font-size-1'];
    //   }
    // }
    // tooltip


    _rectTooltip["default"].call(this, chart, config); // 正式开始绘图，创建两个不同的view


    var barView = chart.createView();
    barView.data(barData);
    this.barView = barView;
    var lineView = chart.createView();
    lineView.data(lineData);
    this.lineView = lineView; // 关闭一个View的X轴，避免重叠字体变粗

    lineView.axis('x', false);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (asix, yIndex) {
        if ((0, _common.getDataIndexColor)(config.barColors, rawBarData, yIndex)) {
          drawBar(barView, config, "y" + yIndex, 'type');
        }

        if ((0, _common.getDataIndexColor)(config.lineColors, rawLineData, yIndex)) {
          drawLine(lineView, config, "y" + yIndex, 'type');
        }
      });
    } else {
      // 单Y轴时同时关闭一个View的Y轴，避免重叠字体变粗
      lineView.axis('y', false);
      drawBar(barView, config, 'y', 'type');
      drawLine(lineView, config, 'y', 'type');
    } // 绘制辅助线，辅助背景区域


    viewGuide(config, lineView, rawLineData, barView, rawBarData);

    _legendFilter["default"].call(this, barView, config, 'rawBarData');

    _legendFilter["default"].call(this, lineView, config, 'rawLineData');

    _rectLegend["default"].call(this, chart, config, {
      items: getLegendItems(rawLineData, rawBarData, lineView.geometries[0], barView.geometries[0], config)
    }, false); // chart.on('afterrender', () => {
    //   // chart.getLegendAttributes()
    //   // console.log('getLegendAttributes', barView.geometries[0].getAttribute('shape'));
    //   // console.log('getLegendAttributes', lineView.geometries[0].getAttribute('shape'));
    //   lineView.geometries.forEach((geom) => {
    //     const shapeAttr = geom.getAttribute('shape');
    //
    //     const shape = getMappingValue(shapeAttr, '机房3', 'point');
    //     let marker = geom.getShapeMarker(shape, {
    //       color: 'red',
    //       isInPolar: false,
    //     });
    //
    //     console.log(marker);
    //   })
    //   // console.log(getLegendItems(rawLineData, rawBarData, lineView.geometries[0], barView.geometries[0], config));
    //
    //   // console.log(chart.getController('legend'));
    // })

  };

  _proto.changeData = function changeData(chart, config, data) {
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
    var lineData = (0, _dataAdapter["default"])(rawLineData, config, {// type: 'lineType',
    });
    var barData = (0, _dataAdapter["default"])(rawBarData, config, {// type: 'barType',
    });
    this.barView && this.barView.changeData(barData);
    this.lineView && this.lineView.changeData(lineData);

    if (this.barView && this.lineView) {
      var legend = chart.getController('legend');
      var legendCos = legend.getComponents(); // 图例项可见，更新图例项

      if (legend.visible && legendCos.length > 0) {
        var newItems = getLegendItems(rawLineData, rawBarData, this.lineView.geometries[0], this.barView.geometries[0], config);
        chart.legend({
          items: newItems
        });
      }
    } // 更新数据后再次render，保证 padding 能正确计算。


    chart.render(true);
  };

  return Wlinebar;
}(_Base2["default"]);

var _default = Wlinebar;
exports["default"] = _default;

function drawBar(chart, config, yAxisKey, legendKey) {
  if (yAxisKey === void 0) {
    yAxisKey = 'y';
  }

  if (legendKey === void 0) {
    legendKey = 'type';
  }

  var stack = config.stack,
      stackReverse = config.stackReverse,
      marginRatio = config.marginRatio,
      dodgeStack = config.dodgeStack;
  var geomStyle = config.barGeomStyle || {};
  var intervalGeom = null;

  if (dodgeStack) {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color(legendKey, config.barColors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0,
      // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      dodgeBy: 'dodge'
    }, {
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序

    }]);
  } else if (stack) {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color(legendKey, config.barColors).adjust([{
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序

    }]);
  } else {
    intervalGeom = chart.interval().position(['x', yAxisKey]).color(legendKey, config.barColors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距

    }]);
  }

  intervalGeom.style((0, _extends2["default"])({}, geomStyle));
  (0, _label["default"])(intervalGeom, config, yAxisKey, null, 'barLabel');
  return intervalGeom;
}

function drawLine(chart, config, yAxisKey, legendKey) {
  if (yAxisKey === void 0) {
    yAxisKey = 'y';
  }

  if (legendKey === void 0) {
    legendKey = 'type';
  }

  var lineGeom = null;
  var lineWidth = config.lineWidth;
  var geomStyle = config.lineGeomStyle || {};

  if (lineWidth !== undefined) {
    geomStyle.lineWidth = lineWidth;
  } // 区域、堆叠、平滑曲线


  var lineShape = config.spline ? 'smooth' : 'line';
  var areaShape = config.spline ? 'smooth' : 'area';
  var stack = config.stack || config.dodgeStack;

  if (config.area && stack) {
    chart.area().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape(areaShape).adjust('stack');
    lineGeom = chart.line().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape(lineShape).adjust('stack'); // .style({
    //   lineJoin: 'round',
    //   ...geomStyle,
    // });
  } else if (config.area && !stack) {
    chart.area().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape(areaShape);
    lineGeom = chart.line().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape(lineShape); // .style({
    //   lineJoin: 'round',
    //   ...geomStyle,
    // });
  } else {
    lineGeom = chart.line().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape(lineShape); // .style({
    //   lineJoin: 'round',
    //   ...geomStyle,
    // });
  }

  (0, _label["default"])(lineGeom, config, yAxisKey, null, 'lineLabel'); // 曲线默认点

  if (config.symbol && config.area && stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color(legendKey, config.lineColors).shape('circle').size(3); // .active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color(legendKey, config.lineColors).shape('circle').size(3); // .active(false);
  }

  return lineGeom;
}

function viewGuide(config, lineView, rawLineData, barView, rawBarData) {
  var guide = config.guide;

  if (!guide) {
    return;
  }

  var guideLine = guide.line,
      guideArea = guide.area,
      guideFilter = guide.filter,
      other = (0, _objectWithoutPropertiesLoose2["default"])(guide, ["line", "area", "filter"]);

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
      value = guide.value; // 如果用户指定了绘制目标，直接使用

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