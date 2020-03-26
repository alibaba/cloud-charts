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

export default /*#__PURE__*/g2Factory('G2Candlestick', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: [themes.widgetsColorRed, themes.widgetsColorGreen],
      padding: [28, 'auto', 'auto', 'auto'],
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
        align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
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
        type: 'linear'
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };

    rectAutoTickCount(chart, config, defs, false);

    chart.source(data, defs);

    // 设置单个Y轴
    if (!config.facet) {
      rectYAxis.call(this, chart, config);
    }

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config, null, false, 'type');

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, _extends({}, config, { isCandlestick: true }), {
      crosshairs: {
        type: 'rect'
      }
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawCandle(chart, config, config.colors);

    chart.render();
  }
});

function drawCandle(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'type';
  var size = config.size;

  var geom = null;

  // 分组
  geom = chart.schema().position(['x', 'y']).shape('candle').color('trend', function (val) {
    var colorUp = colors[0],
        colorDown = colors[1];

    return val === 'up' ? colorUp : colorDown;
  }).tooltip('type*start*end*max*min', function (group, start, end, max, min) {
    var _config$tooltip$label = config.tooltip.labelAlias,
        labelAlias = _config$tooltip$label === undefined ? {} : _config$tooltip$label;
    var labelStart = labelAlias.start,
        labelEnd = labelAlias.end,
        labelMax = labelAlias.max,
        labelMin = labelAlias.min;


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