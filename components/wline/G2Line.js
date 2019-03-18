'use strict';

import Brush from '@antv/g2-brush';
import merge from '../common/merge';
import { color } from '../theme/index';
import { propertyAssign, getDataIndexColor, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import ResetButton from '../common/ResetButton';
import drawLine from '../common/drawLine';
import './G2Line.scss';

const defaultConfig = {
  colors: color.category_12,
  areaColors: [],
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
    nameFormatter: null, // 可以强制覆盖，手动设置label
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
  label: false,
  // TODO
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

    // // TODO 处理padding
    // let defaultPaddingTop = defaultConfig.padding[0];
    // let defaultPaddingRight = defaultConfig.padding[1];
    // const defaultPaddingBottom = defaultConfig.padding[2];
    // const defaultPaddingLeft = defaultConfig.padding[3];
    // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
    //   defaultPaddingRight = 44;
    // }
    // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
    //   defaultPaddingTop = 16;
    // }
    return Object.assign({}, props, {
      // padding: props.padding || config.padding || [defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft],
      padding: defaultPadding(props.padding || config.padding, newConfig, ...defaultConfig.padding),
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

    chart.source(data, defs);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach((axis, yIndex) => {
        const yAxisConfig = {
          line: {
            stroke: getDataIndexColor(config.colors, this.rawData, yIndex) || color.widgetsAxisLine,
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

    legendFilter.call(this, chart, config);

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
      const button = new ResetButton(chart, this.language);
      this.resetButton = button;

      this.brush = new Brush({
        canvas: chart.get('canvas'),
        chart,
        type: 'X',
        onBrushstart() {
          chart.hideTooltip();
        },
        onBrushmove: () => {
          chart.hideTooltip();
          button.show(this.language);
        },
      });
    }
  },
  changeData(chart, config, data) {
    chart.changeData(data);

    // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
    if (config.zoom && this.brush) {
      this.brush.xScale = chart.getXScale();
      this.brush.yScale = chart.getYScales()[0];
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
  },
};
