'use strict';

import g2Factory from '../common/g2Factory';
import merge from '../common/merge';
import themes from '../theme/index';
import { propertyAssign, propertyMap } from '../common/common';
import autoTimeMask from '../common/autoTimeMask';
import legendFilter from '../common/legendFilter';
import rectTooltip from '../common/rectTooltip';
import guide from '../common/guide';
import drawLine from '../common/drawLine';

export default /*#__PURE__*/ g2Factory('G2MiniLine', {
  getDefaultConfig() {
    return {
      colors: themes.category_12,
      padding: [0, 0, 0, 0],
      xAxis: {
        type: 'time', // 默认为线性
        mask: 'auto', // 上述type为time时，此字段生效
        categories: null,
        max: null,
        min: null,
      },
      yAxis: {
        max: null,
        min: null,
      },
      tooltip: false,
      area: false,
      spline: false,
      symbol: false,
      label: false,
      // dataConfig: {
      //   nameKey: 'name',
      //   valueKey: 'value',
      //   // valueKey: ['value1', 'value2'],
      //   typeKey: 'type'
      // }
    };
  },
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || this.defaultConfig.padding,
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1],
      }, config.xAxis),
      type: {
        type: 'cat',
      },
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5,
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5,
      }, config.yAxis);
    }

    autoTimeMask(defs, this.rawData);

    chart.source(data, defs);

    chart.axis(false);

    chart.legend(false);

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawLine(chart, config);

    chart.render();
  },
});
