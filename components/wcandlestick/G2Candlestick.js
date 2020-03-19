'use strict';

import g2Factory from '../common/g2Factory';
import merge from '../common/merge';
import themes from '../theme/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import getGeomSizeConfig from '../common/geomSize';
import './G2Candlestick.scss';

export default /*#__PURE__*/ g2Factory('G2Candlestick', {
  getDefaultConfig() {
    return {
      colors: [themes.widgetsColorRed, themes.widgetsColorGreen],
      padding: [28, 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'time',
        mask: 'YYYY-MM-DD',
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
      padding: defaultPadding(
        props.padding || config.padding,
        newConfig,
        ...this.defaultConfig.padding
      ),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    // 设置数据度量
    const defs = {
      x: propertyAssign(
        propertyMap.xAxis,
        {
          type: 'linear',
        },
        config.xAxis
      ),
      y: propertyAssign(
        propertyMap.yAxis,
        {
          type: 'linear',
          tickCount: 5,
        },
        config.yAxis
      ),
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
    rectTooltip.call(
      this,
      chart,
      { ...config, isCandlestick: true },
      {
        crosshairs: {
          type: 'rect',
        },
      }
    );

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawCandle(chart, config, config.colors);

    chart.render();
  },
});

function drawCandle(chart, config, colors, field = 'type') {
  const { size } = config;
  let geom = null;

  // 分组
  geom = chart
    .schema()
    .position(['x', 'y'])
    .shape('candle')
    .color('trend', val => {
      const [colorUp, colorDown] = colors;
      return val === 'up' ? colorUp : colorDown;
    })
    .tooltip('type*start*end*max*min', (group, start, end, max, min) => {
      const { labelAlias = {} } = config.tooltip;
      const {
        start: labelStart,
        end: labelEnd,
        max: labelMax,
        min: labelMin,
      } = labelAlias;

      return {
        group,
        start,
        end,
        max,
        min,
        labelStart: labelStart || 'start',
        labelEnd: labelEnd || 'end',
        labelMax: labelMax || 'max',
        labelMin: labelMin || 'min',
      };
    });

  if (size) {
    const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
    geom.size(...sizeConfig);
  }
}
