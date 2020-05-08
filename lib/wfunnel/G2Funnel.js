'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import merge from '../common/merge';
import themes from '../themes/index';
import guide from '../common/guide';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import './G2Funnel.scss';
import { defaultPadding, pxToNumber, numberDecimal } from '../common/common';
import label from "../common/label";

function renderGuide(chart, config, data, percentOffsetX, percentOffsetY) {
  chart.guide().clear(true);

  // 绘制辅助线，辅助背景区域
  guide(chart, config);

  // 中间标签文本
  if (!config.percent || config.percent.visible === false) {
    return;
  }
  var _config$percent = config.percent,
      labelFormatter = _config$percent.labelFormatter,
      _config$percent$offse = _config$percent.offsetX,
      offsetX = _config$percent$offse === undefined ? 0 : _config$percent$offse,
      _config$percent$offse2 = _config$percent.offsetY,
      offsetY = _config$percent$offse2 === undefined ? 0 : _config$percent$offse2,
      _config$percent$top = _config$percent.top,
      top = _config$percent$top === undefined ? true : _config$percent$top,
      _config$percent$style = _config$percent.style,
      style = _config$percent$style === undefined ? {} : _config$percent$style;

  var positionY = config.align === 'center' ? 'median' : 'start';

  data.forEach(function (d, i) {
    var content = numberDecimal(100 * d.y / data[0].y) + '%';
    if (labelFormatter) {
      content = labelFormatter(d.y / data[0].y, d, i);
    }
    var textConfig = {
      top: top,
      offsetX: percentOffsetX + offsetX,
      offsetY: percentOffsetY + offsetY,
      position: {
        x: d.x,
        y: positionY
      },
      content: content,
      style: _extends({
        fill: themes['widgets-label-text'],
        fontSize: pxToNumber(themes['widgets-font-size-1']),
        textAlign: 'center',
        shadowBlur: 2,
        shadowColor: 'rgba(255, 255, 255, .3)'
      }, style)
    };

    chart.guide().text(textConfig);
  });
}

export default /*#__PURE__*/errorWrap(g2Factory('G2Funnel', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: themes.order_10,
      padding: ['auto', 0, 'auto', 0],
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
      pyramid: false,
      label: false,
      percent: false
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

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    var drawType = config.direction + '-' + config.align;
    var geom = null;
    var fontSize1 = pxToNumber(themes['widgets-font-size-1']);
    var percentOffsetX = 0;
    var percentOffsetY = 0;

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.interval();
        percentOffsetX = 3 * fontSize1;
        break;
      case 'vertical-center':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.intervalSymmetric();
        break;
      case 'vertical-right':
      case 'vertical-end':
        chart.coord('rect').transpose().scale(-1, -1);
        geom = chart.interval();
        percentOffsetX = -3 * fontSize1;
        break;
      case 'horizontal-top':
      case 'horizontal-start':
        chart.coord('rect').reflect('y');
        geom = chart.interval();
        percentOffsetY = 3 * fontSize1;
        break;
      case 'horizontal-center':
        geom = chart.intervalSymmetric();
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同
      default:
        geom = chart.interval();
        percentOffsetY = -3 * fontSize1;
    }

    var funnelShape = config.align === 'center' && config.pyramid ? 'pyramid' : 'funnel';

    geom.position('x*y').shape(funnelShape).color('x', config.colors);

    label(geom, config, 'y', {
      offset: pxToNumber(themes['widgets-font-size-1']),
      labelLine: {
        lineWidth: 1,
        stroke: themes['widgets-axis-line']
      }
    });

    renderGuide(chart, config, data, percentOffsetX, percentOffsetY);

    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    chart.changeData(data);

    var drawType = config.direction + '-' + config.align;
    var fontSize1 = pxToNumber(themes['widgets-font-size-1']);
    var percentOffsetX = 0;
    var percentOffsetY = 0;

    switch (drawType) {
      case 'vertical-left':
      case 'vertical-start':
        percentOffsetX = 3 * fontSize1;
        break;
      case 'vertical-center':
        break;
      case 'vertical-right':
      case 'vertical-end':
        percentOffsetX = -3 * fontSize1;
        break;
      case 'horizontal-top':
      case 'horizontal-start':
        percentOffsetY = 3 * fontSize1;
        break;
      case 'horizontal-center':
        break;
      // case 'horizontal-bottom':
      // case 'horizontal-end':
      // 和 default 时相同
      default:
        percentOffsetY = -3 * fontSize1;
    }
    renderGuide(chart, config, data, percentOffsetX, percentOffsetY);
  }
}));