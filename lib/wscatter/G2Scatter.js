'use strict';

// 引入所需要的库和样式

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import g2Factory from '../common/g2Factory';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import autoTimeMask from '../common/autoTimeMask';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import rectTooltip from '../common/rectTooltip';
import label from '../common/label';
import guide from '../common/guide';
import getGeomSizeConfig from '../common/geomSize';

var setSource = function setSource(chart, config, data) {};

export default /*#__PURE__*/g2Factory('G2Scatter', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      padding: ['auto', 'auto', 'auto', 'auto'],
      colors: themes.category_12,
      xAxis: {
        type: 'linear',
        mask: 'auto',
        autoRotate: false
      },
      yAxis: {
        min: 0
      },
      size: 4,
      jitter: false,
      tooltip: true,
      legend: true,
      label: false
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var preConfig = {};
    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat'
      };
    }
    var newConfig = merge({}, this.defaultConfig, preConfig, config);

    return _extends({}, props, {
      padding: defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;
    var colors = config.colors,
        jitter = config.jitter,
        size = config.size,
        geomStyle = config.geomStyle;


    var defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: config.jitter ? 'cat' : 'linear'
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    defs.y = propertyAssign(propertyMap.yAxis, {
      type: 'linear',
      tickCount: 5
    }, config.yAxis);

    autoTimeMask(defs, this.rawData);

    rectAutoTickCount(chart, config, defs, false);

    chart.source(data, defs);

    // 设置X轴
    var xAxis = {};

    if (config.jitter) {
      xAxis.grid = {
        align: 'center', // 网格顶点从两个刻度中间开始
        lineStyle: {
          stroke: themes['widgets-axis-grid'],
          lineWidth: 1
          // lineDash: [3, 3]
        }
      };
    }

    // 扰动点图不能打开垂直网格线
    if (config.grid && !config.jitter) {
      xAxis.grid = {
        lineStyle: {
          stroke: themes['widgets-axis-grid'],
          lineWidth: 1
        }
      };
    }

    rectXAxis.call(this, chart, config, xAxis);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    rectTooltip.call(this, chart, config, {
      crosshairs: null
    });

    rectLegend.call(this, chart, config, null, false, 'type');

    legendFilter.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    var geom = chart.point().color('type', colors).position('x*y').shape('circle').style('x*y*type*extra', geomStyle || {}).active(false);

    if (jitter) {
      geom.adjust('jitter');
    }

    label(geom, config);

    if (size) {
      var sizeConfig = getGeomSizeConfig(size, 4, 'y', 'x*y*type*extra');
      geom.size.apply(geom, sizeConfig);
      chart.legend('x', false);
      chart.legend('y', false);
      chart.legend('extra', false);
    }

    chart.render();
  }
});