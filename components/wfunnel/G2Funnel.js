'use strict';

import merge from '../common/merge';
import themes from '../theme/index';
import guide from '../common/guide';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import './G2Funnel.scss';
import { defaultPadding } from '../common/common';

export default {
  getDefaultConfig() {
    return {
      colors: themes.order_10,
      padding: [28, 0, 0, 0],
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

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    const drawType = `${config.direction}-${config.align}`;
    let geom = null;

    switch (drawType) {
      case 'vertical-left':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.interval();
        break;
      case 'vertical-center':
        chart.coord('rect').transpose().scale(1, -1);
        geom = chart.intervalSymmetric();
        break;
      case 'vertical-right':
        chart.coord('rect').transpose().scale(-1, -1);
        geom = chart.interval();
        break;
      case 'horizontal-top':
        chart.coord('rect').reflect('y');
        geom = chart.interval();
        break;
      case 'horizontal-center':
        geom = chart.intervalSymmetric();
        break;
      // case 'horizontal-bottom':
        // 和 default 时相同
      default:
        geom = chart.interval();
    }

    const funnelShape = (config.align === 'center' && config.pyramid) ? 'pyramid' : 'funnel';

    geom.position('x*y').shape(funnelShape).color('x', config.colors);

    chart.render();
  },
};
