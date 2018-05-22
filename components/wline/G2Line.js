'use strict';

import Brush from '@antv/g2-brush';
import merge from '../utils/merge';
import { color } from '../theme/normal';
import { propertyAssign, getDataIndexColor, propertyMap } from '../chartCommon/common';
import guide from '../chartCommon/guide';
import rectXAxis from "../chartCommon/rectXAxis";
import rectYAxis from "../chartCommon/rectYAxis";
import rectTooltip from '../chartCommon/rectTooltip';
import rectLegend from '../chartCommon/rectLegend';
import ResetButton from '../chartCommon/ResetButton';
import './G2Line.scss';

const defaultConfig = {
  colors: color.category_12,
  padding: [40, 5, 32, 44],
  xAxis: {
    type: 'time', // 默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', // 上述type为time时，此字段生效
    labelFormatter: null, // 可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
    max: null,
    min: null,
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
  area: false,
  stack: false, // 仅Area有效
  spline: false,
  grid: false,
  symbol: false,
  zoom: false,
  // TODO
  // labels: false,
  // mini: false,
  // dataConfig: {
  //   nameKey: 'name',
  //   valueKey: 'value',
  //   // valueKey: ['value1', 'value2'],
  //   typeKey: 'type'
  // }
};

export default {
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, defaultConfig, config);

    // TODO 处理padding
    let defaultPaddingTop = defaultConfig.padding[0];
    let defaultPaddingRight = defaultConfig.padding[1];
    const defaultPaddingBottom = defaultConfig.padding[2];
    const defaultPaddingLeft = defaultConfig.padding[3];
    if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
      defaultPaddingRight = 44;
    }
    if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
      defaultPaddingTop = 16;
    }
    return Object.assign({}, props, {
      padding: props.padding || config.padding || [defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft],
      config: newConfig
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
        range: [0, 1]
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        defs[`y${yIndex}`] = propertyAssign(propertyMap.yAxis, {
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

    // 设置X轴
    rectXAxis.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const yAxisConfig = {
          line: {
            stroke: getDataIndexColor(config.colors, this.rawData, yIndex) || color.colorN16
          },
        };
        if (yIndex !== 0) {
          yAxisConfig.grid = null;
        }

        rectYAxis.call(this, chart, { ...config, yAxis: axis }, `y${yIndex}`, yAxisConfig);
      });
    } else {
      // 设置单个Y轴
      rectYAxis.call(this, chart, config);
    }

    // 设置图例
    rectLegend.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 区域、堆叠、平滑曲线
    const lineShape = config.spline ? 'smooth' : 'line';
    const areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((asix, yIndex) => {
        drawLine(chart, config, lineShape, areaShape, `y${yIndex}`);
      });
    } else {
      drawLine(chart, config, lineShape, areaShape);
    }

    chart.render();

    // 拖拽缩放
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
  },
  destroy() {
    // 销毁时需要额外销毁缩放重置按钮
    if (this.brush) {
      this.brush.destroy();
    }
    if (this.resetButton) {
      this.resetButton.destroy();
    }
  }
};

function drawLine(chart, config, lineShape, areaShape, yAxisKey = 'y') {
  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
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
