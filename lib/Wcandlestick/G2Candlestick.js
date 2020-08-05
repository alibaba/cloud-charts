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

require('./G2Candlestick.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// function parseCandlestickItem(oneData) {
//   const { name: dataName, visible, ...groupExtra } = oneData;
//
//   return oneData.data.map(([date, { start, end, max, min, ...extra }]) => ({
//     x: date,
//     y: [start, end, max, min],
//     start,
//     end,
//     max,
//     min,
//     trend: start <= end ? 'up' : 'down',
//     extra,
//     groupExtra,
//     visible,
//     type: dataName,
//   }));
// }
//
// function computeData(data) {
//   if (!data) {
//     return [];
//   }
//   if (!Array.isArray(data)) {
//     data = [data];
//   }
//   const newData = [];
//
//   data.forEach(oneData => {
//     if (!oneData || !Array.isArray(oneData.data)) {
//       return;
//     }
//
//     const { name: dataName, visible, ...groupExtra } = oneData;
//
//     oneData.data.forEach(([date, { start, end, max, min, ...extra }]) => {
//       newData.push({
//         x: date,
//         y: [start, end, max, min],
//         start,
//         end,
//         max,
//         min,
//         trend: start <= end ? 'up' : 'down',
//         extra,
//         groupExtra,
//         visible,
//         type: dataName,
//       });
//     });
//   });
//
//   return newData;
// }

function computeDataType(data) {
  if (Array.isArray(data)) {
    data.forEach(function (d) {
      if (Array.isArray(d.y)) {
        var _d$y = d.y,
            start = _d$y[0],
            end = _d$y[1],
            max = _d$y[2],
            min = _d$y[3];

        d.trend = start <= end ? 'up' : 'down';
      }
    });
  }
  return data;
}

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Candlestick', {
  // convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: [_index2.default.widgetsColorRed, _index2.default.widgetsColorGreen],
      padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'time',
        mask: 'YYYY-MM-DD',
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
        // align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        showTitle: true,
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
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
        type: 'time'
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      },
      trend: {
        type: 'cat'
      }
    };

    (0, _rectAutoTickCount2.default)(chart, config, defs, false);

    chart.source(computeDataType(data), defs);

    // 设置单个Y轴
    _rectYAxis2.default.call(this, chart, config);

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    // 设置图例
    _rectLegend2.default.call(this, chart, config, {
      // useHtml: false,
    }, true, 'trend');
    chart.legend('x', false);
    chart.legend('y', false);

    _legendFilter2.default.call(this, chart, config);

    // tooltip

    var _ref = config.tooltip || {},
        showTitle = _ref.showTitle,
        showColon = _ref.showColon;

    _rectTooltip2.default.call(this, chart, config, {
      showTitle: true,
      crosshairs: {
        type: 'rect'
      },
      itemTpl: '<div>\n            ' + (showTitle ? '<div style="margin:10px 0;"><span style="background-color:{color};width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{group}</div>' : '') + '\n            <div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelStart}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{start}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelEnd}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{end}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMax}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{max}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMin}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{min}</span></div>\n          </div>'
    });

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    drawCandle(chart, config, config.colors);

    chart.render();
  },
  changeData: function changeData(chart, data) {
    chart.changeData(computeDataType(data));
  }
}));


function drawCandle(chart, config, colors) {
  var size = config.size;

  var geom = null;

  // 分组
  geom = chart.schema().position(['x', 'y']).shape('candle').color('trend', function (trend) {
    var colorUp = colors[0],
        colorDown = colors[1];

    return trend === 'up' ? colorUp : colorDown;
  })
  // .tooltip('type*start*end*max*min', (group, start, end, max, min) => {
  .tooltip('y*type', function (y, group) {
    var _ref2 = config.tooltip || {},
        _ref2$labelAlias = _ref2.labelAlias,
        labelAlias = _ref2$labelAlias === undefined ? {} : _ref2$labelAlias;

    var labelStart = labelAlias.start,
        labelEnd = labelAlias.end,
        labelMax = labelAlias.max,
        labelMin = labelAlias.min;
    var start = y[0],
        end = y[1],
        max = y[2],
        min = y[3];


    return {
      group: group,
      start: start,
      end: end,
      max: max,
      min: min,
      labelStart: labelStart || 'start',
      labelEnd: labelEnd || 'end',
      labelMax: labelMax || 'max',
      labelMin: labelMin || 'min'
    };
  });

  if (size) {
    var _geom;

    var sizeConfig = (0, _geomSize2.default)(size, 20, 'y', 'x*y*type*extra');
    (_geom = geom).size.apply(_geom, sizeConfig);
  }
}