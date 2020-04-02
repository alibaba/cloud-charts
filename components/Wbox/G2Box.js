'use strict';

import g2Factory from '../common/g2Factory';
import merge from '../common/merge';
import themes from '../themes/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import getGeomSizeConfig from "../common/geomSize";
// import label from '../common/label';
import './G2Box.scss';

export default /*#__PURE__*/ g2Factory('G2Box', {
  getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
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
      dodge: true,
      marginRatio: 0,
      grid: false,
      // zoom: false,
      size: null,
      // label: false,
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
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat',
      },
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
    rectTooltip.call(this, chart, config, {
      crosshairs: {
        type: 'rect',
      },
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // // 横向柱状图
    // if (!config.column) {
    //   chart.coord().transpose();
    // }

    drawBox(chart, config, config.colors);

    chart.render();
  },
});

function drawBox(chart, config, colors, field = 'type') {
  const { dodge, marginRatio, size } = config;
  let geom = null;

  // 分组
  geom = chart.schema().position(['x', 'y']).shape('box').color(field, colors)
    .style(field, {
      lineWidth: 2,
    // fill: (type) => {
    //
    // }
    });

  if (dodge !== false) {
    geom.adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0.5, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }

  if (size) {
    const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
    geom.size(...sizeConfig);
  }

  // label(geom, config);
}
