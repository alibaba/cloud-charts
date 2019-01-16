'use strict';

import { DataView } from '@antv/data-set';
import merge from '../common/merge';
import { color, size } from '../theme/index';
import { numberDecimal } from '../common/common';
import rectLegend from '../common/rectLegend';
import G2Pie from '../wpie/G2Pie';
import './G2MultiPie.scss';

const defaultConfig = {
  colors: color.category_12,
  padding: [20, 20, 20, 20],
  legend: {
    // position: 'right',
    nameFormatter: null, // 可以强制覆盖，手动设置label
    valueFormatter: null
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null,
  },
  autoSort: true,
  cycle: false,
  innerRadius: 0.8, // 内环半径大小，仅cycle为true时可用
  outerRadius: 0.8, // 饼图半径大小，初始化时可用
};

export default Object.assign({}, G2Pie, {
  init(chart, config, data) {
    const dv = new DataView();
    dv.source(data, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.partition', // 根据树形数据生成相邻层次图 Adjacency Diagram 布局
    });

    const source = [];

    // 记录最大深度
    let maxDepth = 0;
    dv.getAllNodes().forEach(function(node) {
      if (node.depth > maxDepth) {
        maxDepth = node.depth;
      }
      if (node.depth === 0) {
        // 父节点不展示
        // return;
      }
      // var obj = {};
      // obj.name = node.data.name;
      // obj.rawValue = node.data.value;
      // obj.value = node.value;
      // obj.x = node.x;
      // obj.y = node.y;
      source.push({
        name: node.data.name,
        value: node.value,
        rawValue: node.data.value,
        x: node.x,
        y: node.y,
      });
      return node;
    });

    chart.source(source);

    chart.coord('polar', {
      innerRadius: 0, // 用于空心部分的半径设置
    });

    chart.axis(false);

    // rectLegend.call(this, chart, config, {
    //   autoCollapse: false,
    //   position: 'right',
    //   // itemTpl: (value, itemColor, checked, index) => {
    //   //   const { nameFormatter, valueFormatter, showData = true } = config.legend || {};
    //   //
    //   //   const item = (this.data && this.data[index]) || {};
    //   //   const raw = (this.rawData && this.rawData[0]) || {};
    //   //   const percent = numberDecimal(item.y / this.totalData, 4);
    //   //
    //   //   const result = nameFormatter ? nameFormatter(value, {
    //   //     ...raw,
    //   //     percent,
    //   //     itemColor,
    //   //     checked
    //   //   }, index) : value;
    //   //
    //   //   if (showData) {
    //   //     const number = valueFormatter ? valueFormatter(item.y, {
    //   //       ...raw,
    //   //       percent,
    //   //       itemColor,
    //   //       checked
    //   //     }, index) : item.y;
    //   //     return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
    //   //     '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
    //   //     '<span class="g2-legend-text">'}${result}</span>` + `<span class="g2-legend-value">${number}</span></li>`;
    //   //   }
    //   //
    //   //   return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
    //   //   '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
    //   //   '<span class="g2-legend-text">'}${result}</span></li>`;
    //   // },
    //   'g2-legend': {
    //     position: 'static',
    //     marginLeft: size.s5, // inline flex items 不能使用百分比的margin/padding，先改为固定大小
    //   },
    //   'g2-legend-list-item': {
    //     marginRight: 0
    //   },
    // }, true);

    // tooltip
    if (config.tooltip) {
      const tooltipCfg = {
        showTitle: false,
        // crosshairs: {},
      };
      chart.tooltip(tooltipCfg);
      // if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      //   chart.on('tooltip:change', (ev) => {
      //     const raw = (this.rawData && this.rawData[0]) || {};
      //
      //     ev.items.forEach((item, index) => {
      //       const percent = numberDecimal(item.value / this.totalData, 4);
      //
      //       if (config.tooltip.valueFormatter) {
      //         item.value = config.tooltip.valueFormatter(item.value, {
      //           ...raw,
      //           percent
      //         }, index, ev.items);
      //       }
      //       if (config.tooltip.nameFormatter) {
      //         item.name = config.tooltip.nameFormatter(item.name, {
      //           ...raw,
      //           percent
      //         }, index, ev.items);
      //       }
      //     });
      //   });
      // }
    } else {
      chart.tooltip(false);
    }

    chart.polygon()
      .position('x*y')
      .color('name');

    chart.render();
  },
});
