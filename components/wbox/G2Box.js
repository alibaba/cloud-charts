'use strict';

import G2 from '@antv/g2';
import Brush from '@antv/g2-brush';
import merge from '../common/merge';
import { color } from '../theme/index';
import { propertyAssign, propertyMap, defaultPadding } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import label from '../common/label';
import ResetButton from '../common/ResetButton';
import './G2Box.scss';

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
    nameFormatter: null, // 可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null,
  },
  column: true,
  // dodgeStack: false,
  // stack: false,
  // stackReverse: true,
  // marginRatio: 0,
  grid: false,
  // zoom: false,
  // facet: false,
  size: null,
  // label: false,
  // polar: false,
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

    chart.source(data, defs);

    // 设置单个Y轴
    if (!config.facet) {
      rectYAxis.call(this, chart, config);
    }

    // 设置X轴
    rectXAxis.call(this, chart, config);

    // 设置图例
    rectLegend.call(this, chart, config);

    legendFilter.call(this, chart, config);

    // tooltip
    rectTooltip.call(this, chart, config, {
      crosshairs: {
        type: 'rect'
      },
    });

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    // 横向柱状图
    if (!config.column) {
      chart.coord().transpose();
    }

    // if (config.facet) {
    //   const facetConfig = typeof config.facet === 'object' ? config.facet : {
    //     type: 'mirror',
    //     transpose: false,
    //     padding: [20, 0, 20, 0],
    //   };
    //   const self = this;
    //   chart.facet(facetConfig.type, {
    //     fields: ['facet'],
    //     transpose: facetConfig.transpose,
    //     padding: facetConfig.padding,
    //     rowTitle: {
    //       offsetX: 15,
    //       style: {
    //         fontSize: 12,
    //         textAlign: 'center',
    //         rotate: 90,
    //         fill: color.widgetsAxisLabel,
    //       },
    //     },
    //     eachView(view, facet) {
    //       let yAxisCustomConfig = null;
    //
    //       // 为 labelFormatter 的第二个参数添加分面信息
    //       if (config.yAxis && config.yAxis.visible !== false) {
    //         const { labelFormatter } = config.yAxis || {};
    //         if (labelFormatter) {
    //           yAxisCustomConfig = {
    //             label: {
    //               formatter: (...args) => {
    //                 args[1] = Object.assign({
    //                   facet: facet.colValue || facet.rowValue,
    //                 }, args[1]);
    //                 return labelFormatter(...args);
    //               },
    //             },
    //           };
    //         }
    //       }
    //
    //       rectYAxis.call(self, view, config, 'y', yAxisCustomConfig);
    //
    //       drawBar(view, config, config.colors, 'type*facet');
    //     },
    //   });
    // } else {
      drawBar(chart, config, config.colors);
    // }

    chart.render();

    // 拖拽缩放
    // if (config.zoom) {
    //   const button = new ResetButton(chart, this.language);
    //   this.resetButton = button;
    //
    //   this.brush = new Brush({
    //     canvas: chart.get('canvas'),
    //     chart,
    //     type: 'X',
    //     onBrushstart() {
    //       chart.hideTooltip();
    //     },
    //     onBrushmove: () => {
    //       chart.hideTooltip();
    //       button.show(this.language);
    //     },
    //   });
    // }
  },
  changeData(chart, config, data) {
    chart.changeData(data);

    // 更新 brush 的 scale 实例，fix 数据更新后拖动缩放失效的问题。
    // if (config.zoom && this.brush) {
    //   this.brush.xScale = chart.getXScale();
    //   this.brush.yScale = chart.getYScales()[0];
    // }
  },
  destroy() {
    // 销毁时需要额外销毁缩放重置按钮
    // if (this.brush) {
    //   this.brush.destroy();
    // }
    // if (this.resetButton) {
    //   this.resetButton.destroy();
    // }
  },
};

function drawBar(chart, config, colors, field = 'type') {
  const { stack, stackReverse, marginRatio, dodgeStack, size } = config;
  let geom = null;
  // if (dodgeStack) {
  //   geom = chart.schema().position(['x', 'y']).color(field, colors).adjust([
  //     {
  //       type: 'dodge',
  //       marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
  //       dodgeBy: 'dodge',
  //     },
  //     {
  //       type: 'stack',
  //       reverseOrder: !stackReverse, // 层叠顺序倒序
  //     },
  //   ]);
  // } else if (stack) {
  //   // 堆叠
  //   geom = chart.schema().position(['x', 'y']).color(field, colors).adjust([{
  //     type: 'stack',
  //     reverseOrder: !stackReverse, // 层叠顺序倒序
  //   }]);
  // } else {
    // 分组
    geom = chart.schema().position(['x', 'y']).shape('box').color(field, colors).adjust([{
      type: 'dodge',
      // marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]).style(field, {
      lineWidth: 2,
      // fill: (type) => {
      //
      // }
    });
  // }

  // TODO 暂时没有更好的方案
  if (size) {
    let sizeConfig = size || 20;
    if (Array.isArray(size)) {
      sizeConfig = ['y', size];
    } else if (G2.Util.isFunction(size)) {
      sizeConfig = ['x*y*type*facet', size];
    } else if (typeof size === 'object') {
      sizeConfig = [sizeConfig.field, sizeConfig.param];
    } else {
      sizeConfig = [size];
    }
    geom.size(...sizeConfig);
  }

  // label(geom, config);
}