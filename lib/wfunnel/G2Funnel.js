'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import merge from '../common/merge';
import themes from '../theme/index';
import guide from '../common/guide';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import './G2Funnel.scss';
import { defaultPadding } from '../common/common';

export default {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: themes.order_10,
      padding: [28, 0, 0, 0],
      legend: {
        align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      },
      // 主方向，从上到下(vertical)、从左到右(horizontal)
      direction: 'vertical',
      // 排列位置 start,center,end
      align: 'center',
      // 尖顶漏斗图
      pyramid: false
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
      type: {
        type: 'cat'
      }
    };

    chart.source(data, defs);

    // 漏斗图目前看没有轴
    chart.axis(false);

    // 设置图例
    rectLegend.call(this, chart, config, null, true);

    // tooltip
    rectTooltip.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    var drawType = config.direction + '-' + config.align;
    var geom = null;

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.interval();
        break;
      case 'vertical-center':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.intervalSymmetric();
        break;
      case 'vertical-right':
      case 'vertical-end':
        chart.coord('rect').transpose().scale(-1, -1);
        geom = chart.interval();
        break;
      case 'horizontal-top':
      case 'horizontal-start':
        chart.coord('rect').reflect('y');
        geom = chart.interval();
        break;
      case 'horizontal-center':
        geom = chart.intervalSymmetric();
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同
      default:
        geom = chart.interval();
    }

    var funnelShape = config.align === 'center' && config.pyramid ? 'pyramid' : 'funnel';

    geom.position('x*y').shape(funnelShape).color('x', config.colors);

    chart.render();
  }
};