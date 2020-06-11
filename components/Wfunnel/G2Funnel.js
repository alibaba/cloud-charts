'use strict';

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
  const { labelFormatter, offsetX = 0, offsetY = 0, top = true, style = {} } = config.percent;
  const positionY = config.align === 'center' ? 'median' : 'start';

  data.forEach((d, i) => {
    let content = `${numberDecimal(100 * d.y / data[0].y)}%`;
    if (labelFormatter) {
      content = labelFormatter(d.y / data[0].y, d, i);
    }
    const textConfig = {
      top,
      offsetX: percentOffsetX + offsetX,
      offsetY: percentOffsetY + offsetY,
      position: {
        x: d.x,
        y: positionY,
      },
      content,
      style: {
        fill: themes['widgets-label-text'],
        fontSize: pxToNumber(themes['widgets-font-size-1']),
        textAlign: 'center',
        shadowBlur: 2,
        shadowColor: 'rgba(255, 255, 255, .3)',
        ...style,
      },
    };

    chart.guide().text(textConfig);
  });
}

export default /*#__PURE__*/ errorWrap(g2Factory('G2Funnel', {
  getDefaultConfig() {
    return {
      colors: themes.order_10,
      padding: ['auto', 0, 'auto', 0],
      legend: {
        align: 'left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      // 主方向，从上到下(vertical)、从左到右(horizontal)
      direction: 'vertical',
      // 排列位置 start,center,end
      align: 'center',
      // 尖顶漏斗图
      pyramid: false,
      label: false,
      percent: false,
    };
  },
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: defaultPadding(props.padding || config.padding, newConfig, ...this.defaultConfig.padding),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    // 设置数据度量
    const defs = {
      type: {
        type: 'cat',
      },
    };

    chart.source(data, defs);

    // 漏斗图目前看没有轴
    chart.axis(false);

    // 设置图例
    rectLegend.call(this, chart, config, null, true);

    // tooltip
    rectTooltip.call(this, chart, config, {
      showTitle: false,
      crosshairs: null,
    });

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    const drawType = `${config.direction}-${config.align}`;
    let geom = null;
    const fontSize1 = pxToNumber(themes['widgets-font-size-1']);
    let percentOffsetX = 0;
    let percentOffsetY = 0;

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

    const funnelShape = (config.align === 'center' && config.pyramid) ? 'pyramid' : 'funnel';

    geom.position('x*y').shape(funnelShape).color('x', config.colors);

    label(geom, config, 'y', {
      offset: pxToNumber(themes['widgets-font-size-1']),
      labelLine: {
        lineWidth: 1,
        stroke: themes['widgets-axis-line'],
      },
    });

    const geomStyle = config.geomStyle || {};
    geom.style('x*y*type*extra', {
      ...geomStyle,
    });

    renderGuide(chart, config, data, percentOffsetX, percentOffsetY);

    chart.render();
  },
  changeData(chart, config, data) {
    chart.changeData(data);

    const drawType = `${config.direction}-${config.align}`;
    const fontSize1 = pxToNumber(themes['widgets-font-size-1']);
    let percentOffsetX = 0;
    let percentOffsetY = 0;

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
  },
}));
