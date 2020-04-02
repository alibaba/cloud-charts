'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import g2Factory from '../common/g2Factory';
import merge from '../common/merge';
import themes from '../theme/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import getGeomSizeConfig from '../common/geomSize';
import './G2Candlestick.scss';

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

export default /*#__PURE__*/g2Factory('G2Candlestick', {
  // convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: [themes.widgetsColorRed, themes.widgetsColorGreen],
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

    var newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    // 设置数据度量
    var defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'time'
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
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

    rectAutoTickCount(chart, config, defs, false);

    chart.source(computeDataType(data), defs);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config, {
      // useHtml: false,
    }, true, 'trend');
    chart.legend('x', false);
    chart.legend('y', false);

    legendFilter.call(this, chart, config);

    // tooltip

    var _ref = config.tooltip || {},
        showTitle = _ref.showTitle,
        showColon = _ref.showColon;

    rectTooltip.call(this, chart, config, {
      showTitle: true,
      crosshairs: {
        type: 'rect'
      },
      itemTpl: '<div>\n            ' + (showTitle ? '<div style="margin:10px 0;"><span style="background-color:{color};width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{group}</div>' : '') + '\n            <div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelStart}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{start}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelEnd}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{end}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMax}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{max}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMin}</span>' + (showColon ? ':' : '') + '<span class="g2-tooltip-item-value">{min}</span></div>\n          </div>'
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawCandle(chart, config, config.colors);

    chart.render();
  },
  changeData: function changeData(chart, data) {
    chart.changeData(computeDataType(data));
  }
});

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

    var sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
    (_geom = geom).size.apply(_geom, sizeConfig);
  }
}