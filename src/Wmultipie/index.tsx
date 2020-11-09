'use strict';

import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/api/hierarchy';
import '@antv/data-set/lib/connector/hierarchy';
import '@antv/data-set/lib/transform/hierarchy/partition'
import { Chart, Types, BaseChartConfig, ChartData } from '../common/types';
import Base from "../common/Base";
import themes from '../themes/index';
import { numberDecimal } from '../common/common';
// import { getDrawPadding, G2PieBase } from '../Wpie/G2Pie';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
// import errorWrap from '../common/errorWrap';
import './index.scss';

interface WmultipieConfig extends BaseChartConfig {
  colors?: string[];
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  autoSort?: boolean;
  cycle?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

function getParentList(node: Types.LooseObject, target: Types.LooseObject[] = []): Types.LooseObject[] {
  const parentNode = node.parent;
  // 需要存储根节点，所以一直到 parentNode===null（此时在根节点上）
  if (!parentNode) {
    return target;
  }

  target.unshift({
    name: parentNode.data.name,
    value: parentNode.value,
    rawValue: parentNode.data.value,
    depth: parentNode.depth,
  });

  return getParentList(parentNode, target);
}

function computeData(ctx: Wmultipie, data: ChartData) {
  let dv = null;
  if (ctx.dataView) {
    dv = ctx.dataView;
    dv.source(data, {
      type: 'hierarchy',
    });
  } else {
    dv = new DataView();
    ctx.dataView = dv;

    dv.source(data, {
      type: 'hierarchy',
    }).transform({
      type: 'hierarchy.partition', // 根据树形数据生成相邻层次图 Adjacency Diagram 布局
      as: ['x', 'y'],
    });
  }

  const source: Types.Data = [];

  // 记录最大深度
  let maxDepth = 0;
  dv.getAllNodes().forEach((node) => {
    if (node.depth > maxDepth) {
      maxDepth = node.depth;
    }
    if (node.depth === 0) {
      // 父节点不展示
      return;
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
      depth: node.depth,
      parent: getParentList(node),
      x: node.x,
      y: node.y,
    });
    return node;
  });

  // 挂载转换后的数据
  ctx.data = source;

  return {
    source,
    maxDepth,
  };
}

const radiusMap: { [depth: number]: number } = {
  2: 0,
  3: 0,
};

function getInnerRadius(maxDepth: number, innerRadius: number) {
  if (innerRadius) {
    return innerRadius;
  }
  return radiusMap[maxDepth] || 0;
}

class Wmultipie extends Base<WmultipieConfig> {
  chartName = 'G2MultiPie';

  convertData = false;

  getDefaultConfig(): WmultipieConfig {
    return {
      colors: themes.category_12,
      padding: [20, 20, 20, 20],
      legend: {
        position: 'right',
        align: '',
        nameFormatter: null, // 可以强制覆盖，手动设置label
        valueFormatter: null,
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      cycle: true,
      innerRadius: 0, // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8, // 饼图半径大小，初始化时可用
      // drawPadding: [10, 10, 10, 10],
    };
  }

  dataView: DataView = null;

  data: Types.Data = [];

  init(chart: Chart, config: WmultipieConfig, data: ChartData) {
    const { source, maxDepth } = computeData(this, data);

    chart.data(source);

    // const thetaConfig: Types.CoordinateCfg = {
    //   radius: Math.max(Math.min(config.outerRadius, 1), 0.01),
    // };
    // if (config.cycle) {
    //   thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    // }

    chart.coordinate('polar', {
      radius: Math.max(Math.min(config.outerRadius, 1), 0.01),
      innerRadius: getInnerRadius(maxDepth, config.innerRadius), // 用于空心部分的半径设置
    });


    chart.axis(false);

    rectLegend.call(this, chart, config, {
      // position: 'right',
      // itemTpl: (value, itemColor, checked, index) => {
      //   const { nameFormatter, valueFormatter, showData = true } = config.legend || {};
      //
      //   const item = (this.data && this.data[index]) || {};
      //   const rootNode = item.parent[0];
      //   // 根节点的value就是全量值
      //   const percent = numberDecimal(item.value / rootNode.value, 4);
      //
      //   const result = nameFormatter ? nameFormatter(value, {
      //     percent,
      //     itemColor,
      //     checked,
      //     ...item,
      //   }, index) : value;
      //
      //   if (showData) {
      //     const number = valueFormatter ? valueFormatter(item.value, {
      //       percent,
      //       itemColor,
      //       checked,
      //       ...item,
      //     }, index) : item.value;
      //     return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //     '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //     '<span class="g2-legend-text">'}${result}</span>` + `<span class="g2-legend-value">${number}</span></li>`;
      //   }
      //
      //   return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //   '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //   '<span class="g2-legend-text">'}${result}</span></li>`;
      // },
      // 'g2-legend': {
      //   ...legendHtmlContainer,
      //   position: 'static',
      //   overflow: 'auto',
      //   // inline flex items 不能使用百分比的margin/padding，设置为固定大小
      //   marginLeft: `${Math.max(pxToNumber(themes['widgets-font-size-4']) - drawPadding[1], 0)}px`,
      // },
      // 'g2-legend-list-item': {
      //   ...legendHtmlListItem,
      //   marginRight: 0,
      // },
    }, true);

    // tooltip
    rectTooltip.call(
      this,
      chart,
      config,
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
        shared: false,
      },
      (ev: any) => {
        const { items } = ev.data;
        items.forEach((item: any, index: number) => {
          if (typeof config.tooltip === 'boolean') {
            return;
          }

          const pointData = item.data;
          const rootNode = pointData.parent[0];
          const percent = numberDecimal(item.value / rootNode.value, 4);

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, {
              percent,
              ...pointData,
            }, index, ev.items);
          }
          if (config.tooltip.nameFormatter) {
            item.name = config.tooltip.nameFormatter(item.name, {
              percent,
              ...pointData,
            }, index, ev.items);
          }
        });
      },
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
        shared: false,
      }
    );

    chart.polygon()
      .position('x*y')
      .color('name', config.colors)
      .tooltip('name*value*rawValue*depth', (name, value) => {
        return {
          name,
          value,
        };
      })
      // .style('name*value*rawValue*depth', {
      //   ...(config.geomStyle || {}),
      // });
  }

  changeData(chart: Chart, config: WmultipieConfig, data: ChartData) {
    const { source } = computeData(this, data);

    chart.changeData(source);
  }
}

export default Wmultipie;

// export default /*#__PURE__*/ errorWrap(g2Factory('G2MultiPie', Object.assign({}, G2PieBase, {
//   convertData: false,
//   getDefaultConfig() {
//     return {
//       colors: themes.category_12,
//       padding: [20, 20, 20, 20],
//       legend: {
//         // position: 'right',
//         nameFormatter: null, // 可以强制覆盖，手动设置label
//         valueFormatter: null,
//       },
//       tooltip: {
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//       innerRadius: null, // 内环半径大小，仅cycle为true时可用
//       outerRadius: 0.8, // 饼图半径大小，初始化时可用
//       drawPadding: [10, 10, 10, 10],
//     };
//   },
//   init(chart, userConfig, data) {
//     const config = merge({}, this.defaultConfig, userConfig);
//
//     const { source, maxDepth } = computeData.call(this, data);
//
//     chart.source(source);
//
//     // if (config.cycle) {
//     //   thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
//     // }
//
//     chart.coord('polar', {
//       innerRadius: getInnerRadius(maxDepth, config.innerRadius), // 用于空心部分的半径设置
//     });
//
//     chart.axis(false);
//
//     const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);
//
//
//
//     chart.render();
//   },
//   changeData(chart, config, data) {
//     const { source } = computeData.call(this, data);
//
//     chart.changeData(source);
//   },
// })));
