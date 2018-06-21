'use strict';

import Brush from '@antv/g2-brush';
import merge from '../common/merge';
import { color } from '../theme/normal';
import { propertyAssign, propertyMap } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import './G2Funnel.scss';

const defaultConfig = {
  colors: color.order_10,
  padding: [40, 20, 20, 20],
  // xAxis: {
  //   type: 'cat',
  //   labelFormatter: null, // 可以强制覆盖，手动设置label
  //   categories: null,
  //   autoRotate: false,
  // },
  // yAxis: {
  //   labelFormatter: null, // 可以强制覆盖，手动设置label
  //   max: null,
  //   min: null,
  // },
  legend: {
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  // 主方向，从上到下(vertical)、从左到右(horizontal)
  direction: 'vertical',
  // 排列位置 start,center,end
  align: 'center',
};

export default {
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    // 设置数据度量
    const defs = {
      // x: propertyAssign(propertyMap.xAxis, {
      //   type: 'cat',
      // }, config.xAxis),
      // y: propertyAssign(propertyMap.yAxis, {
      //   type: 'linear',
      //   tickCount: 5
      // }, config.yAxis),
      type: {
        type: 'cat',
        // sync: true
      }
    };

    chart.source(data, defs);

    // 漏斗图目前看没有轴
    chart.axis(false);

    // // 设置单个Y轴
    // rectYAxis.call(this, chart, config);
    //
    // // 设置X轴
    // rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      crosshairs: null
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 根据传入的 direction 和 align 设置坐标系，并绘制图形
    const drawType = `${config.direction}-${config.align}`;
    // 默认图形
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
      case 'horizontal-bottom':
      default:
        geom = chart.interval();
    }

    geom.position('x*y').shape('funnel').color('x', config.colors);

    chart.render();
  },
  // destroy() {
  //   // 销毁时需要额外销毁缩放重置按钮
  //   if (this.brush) {
  //     this.brush.destroy();
  //   }
  //   if (this.resetButton) {
  //     this.resetButton.destroy();
  //   }
  // }
};
