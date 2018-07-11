'use strict';

import Brush from '@antv/g2-brush';
import merge from '../common/merge';
import { color } from '../theme/index';
import { propertyAssign, propertyMap } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import ResetButton from '../common/ResetButton';
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
  dodgeStack: false,
  stack: false,
  stackReverse: true,
  marginRatio: 0,
  grid: false,
  zoom: false,
  facet: false,
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

    // 设置数据度量
    const defs = {
      x: propertyAssign(propertyMap.xAxis, {
        type: 'cat',
      }, config.xAxis),
      y: propertyAssign(propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat',
        sync: true
      },
      facet: {
        sync: true
      }
    };

    chart.source(data, defs);

    // 设置单个Y轴
    if (!config.facet) {
      rectYAxis.call(this, chart, config);
    }

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

    // 横向柱状图
    if (!config.column) {
      chart.coord().transpose();
    }

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
                      facet: facet.colValue || facet.rowValue
                    }, args[1]);
                    return labelFormatter(...args);
                  },
                }
              };
            }
          }

          rectYAxis.call(self, view, config, 'y', yAxisCustomConfig);

          drawBar(view, config, config.colors, 'type*facet');
        }
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

function drawBar(chart, config, colors, field = 'type') {
  if (config.dodgeStack) {
    chart.interval().position(['x', 'y']).color(field, colors).adjust([
      {
        type: 'dodge',
        marginRatio: config.marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
        dodgeBy: 'dodge'
      },
      {
        type: 'stack',
        reverseOrder: !config.stackReverse, // 层叠顺序倒序
      }
    ]);
  } else if (config.stack) {
    // 堆叠
    chart.interval().position(['x', 'y']).color(field, colors).adjust([{
      type: 'stack',
      reverseOrder: !config.stackReverse, // 层叠顺序倒序
    }]);
  } else {
    // 分组
    chart.interval().position(['x', 'y']).color(field, colors).adjust([{
      type: 'dodge',
      marginRatio: config.marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }
}
