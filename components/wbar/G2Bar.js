'use strict';

import Brush from '@antv/g2-brush';
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
import label from '../common/label';
import ResetButton from '../common/ResetButton';
import getGeomSizeConfig from "../common/geomSize";
import './G2Bar.scss';

export default {
  getDefaultConfig() {
    return {
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
      column: true,
      dodgeStack: false,
      stack: false,
      stackReverse: true,
      marginRatio: 0,
      grid: false,
      zoom: false,
      facet: false,
      size: null,
      label: false,
      polar: false,
      innerRadius: 0,
      histogram: false,
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
    if (!config.histogram) {
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
          sync: true,
        },
        facet: {
          sync: true,
        },
      };

      rectAutoTickCount(chart, config, defs, !config.column);

      chart.source(data, defs);
    } else {
      const { tickInterval = 1 } = config.histogram;
      chart.source(data, {
        x: { tickInterval }
      });
    }

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
      crosshairs: config.polar ? undefined : {},
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 设置坐标系：极坐标/直角坐标
    const chartCoord = config.polar
      ? chart.coord('polar', {
        innerRadius: config.innerRadius || 0,
      })
      : chart.coord();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    // chart.point().position('name*0').color('name').shape('circle');
    // chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
    // chart.point().position('name*value').color('name').shape('circle');

    if (config.facet) {
      const facetConfig = typeof config.facet === 'object' ? config.facet : {
        type: 'mirror',
        transpose: false,
        padding: [20, 0, 20, 0],
      };
      const self = this;
      chart.facet(facetConfig.type, {
        fields: ['facet'],
        transpose: facetConfig.transpose,
        padding: facetConfig.padding,
        rowTitle: {
          offsetX: 15,
          style: {
            fontSize: themes['widgets-font-size-1'],
            textAlign: 'center',
            rotate: 90,
            fill: themes['widgets-axis-label'],
          },
        },
        eachView(view, facet) {
          let yAxisCustomConfig = null;

          // 为 labelFormatter 的第二个参数添加分面信息
          if (config.yAxis && config.yAxis.visible !== false) {
            const { labelFormatter } = config.yAxis || {};
            if (labelFormatter) {
              yAxisCustomConfig = {
                label: {
                  formatter: (...args) => {
                    args[1] = Object.assign({
                      facet: facet.colValue || facet.rowValue,
                    }, args[1]);
                    return labelFormatter(...args);
                  },
                },
              };
            }
          }

          rectYAxis.call(self, view, config, 'y', yAxisCustomConfig);

          drawBar(view, config, config.colors, 'type*facet');
        },
      });
    } else {
      drawBar(chart, config, config.colors);
    }

    // if (config.stack) {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'stack',
    //     reverseOrder: !config.stackReverse, // 层叠顺序倒序
    //   }]);
    // } else {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'dodge',
    //     marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    //   }]);
    // }

    chart.render();

    // 拖拽缩放
    if (config.zoom) {
      const button = new ResetButton(chart, this.language);
      this.resetButton = button;

      this.brush = new Brush({
        canvas: chart.get('canvas'),
        chart,
        type: 'X',
        onBrushstart(startPoint) {
          chart.hideTooltip();
          chart.emit('zoom:start', startPoint);
        },
        onBrushmove: () => {
          chart.hideTooltip();
          button.show(this.language);
        },
        onBrushend: (ev) => {
          this.brush.container.clear(); // clear the brush
          const { type } = this.brush;
          const { xScale } = this.brush;
          const { yScale } = this.brush;
          // filter data
          if (type === 'X') {
            xScale && chart.filter(xScale.field, val => {
              return ev[xScale.field].indexOf(val) > -1;
            });
          } else if (type === 'Y') {
            yScale && chart.filter(yScale.field, val => {
              return ev[yScale.field].indexOf(val) > -1;
            });
          } else {
            xScale && chart.filter(xScale.field, val => {
              return ev[xScale.field].indexOf(val) > -1;
            });
            yScale && chart.filter(yScale.field, val => {
              return ev[yScale.field].indexOf(val) > -1;
            });
          }
          chart.repaint();

          chart.emit('zoom:end', ev);
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

function drawBar(chart, config, colors, field = 'type') {
  const { stack, stackReverse, marginRatio, dodgeStack, size, histogram } = config;
  let geom;

  if (histogram) {
    geom = chart.intervalStack().position('x*y').color(field);
  } else {
    geom = chart.interval().position(['x', 'y']);

    if (dodgeStack) {
      geom = geom.color(field, colors).adjust([
        {
          type: 'dodge',
          marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
          dodgeBy: 'dodge',
        },
        {
          type: 'stack',
          reverseOrder: !stackReverse, // 层叠顺序倒序
        },
      ]);
    } else if (stack) {
      // 堆叠
      geom = geom.color(field, colors).adjust([{
        type: 'stack',
        reverseOrder: !stackReverse, // 层叠顺序倒序
      }]);
    } else {
      // 分组
      geom = geom.color(field, colors).adjust([{
        type: 'dodge',
        marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      }]);
    }
  }
  
  if (size) {
    const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*facet*extra');
    geom.size(...sizeConfig);
  }

  label(geom, config);
}
