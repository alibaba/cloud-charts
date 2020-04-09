'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import autoTimeMask from '../common/autoTimeMask';
import legendFilter from '../common/legendFilter';
import rectTooltip from '../common/rectTooltip';
import guide from '../common/guide';
import drawLine from '../common/drawLine';

export default /*#__PURE__*/errorWrap(g2Factory('G2MiniLine', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: [0, 0, 0, 0],
      xAxis: {
        type: 'time', // 默认为线性
        mask: 'auto', // 上述type为time时，此字段生效
        categories: null,
        max: null,
        min: null
      },
      yAxis: {
        max: null,
        min: null
      },
      tooltip: false,
      area: false,
      spline: false,
      symbol: false,
      label: false
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
      padding: props.padding || config.padding || this.defaultConfig.padding,
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    var defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
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
        tickCount: 5
      }, config.yAxis);
    }

    autoTimeMask(defs, this.rawData);

    chart.source(data, defs);

    chart.axis(false);

    chart.legend(false);

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawLine(chart, config);

    chart.render();
  }
}));