'use strict';

import merge from '../utils/merge';
import { color } from '../theme/normal';
import { propertyAssign, propertyMap } from '../chartCommon/common';
import guide from '../chartCommon/guide';
import rectTooltip from '../chartCommon/rectTooltip';

const defaultConfig = {
  colors: color.category_12,
  padding: [0, 0, 0, 0],
  xAxis: {
    type: 'time', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为time时，此字段生效
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
  symbol:false,
  // dataConfig: {
  //   nameKey: 'name',
  //   valueKey: 'value',
  //   // valueKey: ['value1', 'value2'],
  //   typeKey: 'type'
  // }
};

export default {
  beforeInit(props) {
    const {config} = props;
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
      config: newConfig
    });
  },
  init(chart, userConfig, data, rawData) {
    const config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs['y' + yIndex] = propertyAssign(propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis);
    }

    chart.source(data, defs);

    chart.axis(false);

    chart.legend(false);

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 区域、堆叠、平滑曲线
    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    drawLine(chart, config, lineShape, areaShape);

    chart.render();
  }
};

function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style({
      lineJoin: 'round'
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style({
      lineJoin: 'round'
    });
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style({
      lineJoin: 'round'
    });
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  }
}
