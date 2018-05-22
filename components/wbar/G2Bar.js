'use strict';

import Brush from '@antv/g2-brush';
import merge from '../utils/merge';
import { color } from '../theme/normal';
import { propertyAssign, propertyMap } from '../chartCommon/common';
import guide from '../chartCommon/guide';
import rectXAxis from '../chartCommon/rectXAxis';
import rectYAxis from '../chartCommon/rectYAxis';
import rectTooltip from '../chartCommon/rectTooltip';
import rectLegend from '../chartCommon/rectLegend';
import ResetButton from '../chartCommon/ResetButton';
import './G2Bar.scss';

const defaultConfig = {
  colors: color.category_12,
  padding: [40, 5, 32, 44],
  xAxis: {
    type: 'cat',
    labelFormatter: null, // 可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: null,
    min: null,
  },
  legend: {
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  column: true,
  stack: false,
  stackReverse: true,
  grid: false,
  zoom: false,
  // labels: false,
  polar: false,
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

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      },
    };

    chart.source(data, defs);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // if (config.polar) {
      // chart.coord('theta', {
      //   inner: 0.6
      // });
      //
      // chart.point().position('name*0').color('name').shape('circle');
      // chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
      // chart.point().position('name*value').color('name').shape('circle');
    // } else {
      // 横向柱状图
    if (!config.column) {
      chart.coord().transpose();
    }
      // 堆叠
    if (config.stack) {
      chart.interval().position('x*y').color('type', config.colors).adjust([{
        type: 'stack',
        reverseOrder: !config.stackReverse, // 层叠顺序倒序
      }]);
    } else {
      chart.interval().position('x*y').color('type', config.colors).adjust([{
        type: 'dodge',
        marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      }]);
    }
    // }

    chart.render();

    if (config.zoom) {
      const button = this.resetButton = new ResetButton(chart);

      this.brush = new Brush({
        canvas: chart.get('canvas'),
        chart,
        type: 'X',
        onBrushstart() {
          chart.hideTooltip();
        },
        onBrushmove() {
          chart.hideTooltip();
          button.show();
        }
      });
    }
  }
};
