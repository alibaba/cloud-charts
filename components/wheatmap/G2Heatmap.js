'use strict';

import G2 from '@antv/g2';
import merge from '../common/merge';
import themes from '../theme/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label from '../common/label';
import './G2Heatmap.scss';

const defaultConfig = {
  colors: themes.category_12,
  padding: [28, 5, 24, 44],
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
    nameFormatter: null, // 可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  // grid: false,
  // label: false,
};

export default {
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: defaultPadding(props.padding || config.padding, newConfig, ...defaultConfig.padding),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    // 设置数据度量
    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'cat',
      }, config.yAxis),
      type: {
        type: 'cat',
        // sync: true,
      },
    };

    chart.source(data, defs);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config);
    chart.legend('x', false);
    chart.legend('y', false);

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      showTitle: false,
      crosshairs: null,
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    const geom = chart.polygon().position('x*y').color('type', config.colors).tooltip('x*y*extra', (x, y, extra) => {
      return {
        name: `${x} - ${y}`,
        value: (Array.isArray(extra) ? extra[0] : extra.value) || '-',
      };
    })
      .style({
        lineWidth: 1,
        stroke: themes['widgets-map-area-border'],
      });

    // label(geom, config, 'extra');

    chart.render();
  },
  // changeData(chart, config, data) {
  //   chart.changeData(data);
  // },
  // destroy() {
  // },
};

