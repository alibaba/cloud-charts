'use strict';
import { View } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/transform/hierarchy/treemap';

import { Chart, Types, BaseChartConfig, ChartData, Colors } from '../common/types';
import Base from '../common/Base';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import { XAxisConfig } from '../common/rectXAxis';
import { YAxisConfig } from '../common/rectYAxis';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import guide, { GuideConfig } from '../common/guide';
import { LabelConfig } from '../common/label';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';

import './index.scss';

// 3.x代码
export interface WtreemapConfig extends BaseChartConfig {
  colors?: Colors;
  xAxis?: Types.ScaleOption & XAxisConfig | false,
  yAxis?: Types.ScaleOption & YAxisConfig | false,
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  guide?: GuideConfig;
  label?: LabelConfig | boolean;
  geomStyle?: GeomStyleConfig;
  polar?: boolean;
  innerRadius?: number;
}

export class Treemap extends Base<WtreemapConfig> {
  chartName = 'G2Treemap';
  convertData = false;

  getDefaultConfig(): WtreemapConfig {
    return {
      colors: themes.category_12,
      xAxis: {
        // type: "cat",
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false,
        // 坐标轴粒度
        // tickInterval: 1,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      legend: {
        align: "left",
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      label: true,
      innerRadius: 0,
      polar: false,
      // 区块的 border 样式，包含 lineWidth lineDash stroke 等属性
      geomStyle: {
        lineWidth: 1,
        stroke: themes['widgets-color-background'],
      },
    };
  }
  init(chart: Chart, config: WtreemapConfig, data: any) {
    const defs: Record<string, Types.ScaleOption> = {
      x: propertyAssign(propertyMap.axis, {
        nice: true,
      }, config.xAxis),
      y: propertyAssign(propertyMap.axis, {
        nice: true,
      }, config.yAxis)
    };

    const dataView = processDataView(data);
    const nodes = parseDataView(dataView);

    chart.scale(defs);

    chart.data(nodes);

    // 设置图例
    rectLegend(this, chart, config, null, false, "type");

    // tooltip
    rectTooltip(
      this,
      chart,
      config,
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
      },
      null,
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
      },
    );

    chart.axis(false);
    chart.legend(false);

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    if (nodes.some((x) => x.brand)) {
      drawNestedTreemap(chart, config);
    } else {
      drawTreemap(chart, config);
    }
  }
  changeData(chart: Chart, config: WtreemapConfig, data: any) {
    const dataView = processDataView(data);
    const nodes = parseDataView(dataView);

    chart && chart.changeData(nodes);
  }
}

// 数据分箱
function processDataView(data: ChartData) {
  const dv = new View().source(resetParentValue(data), { type: 'hierarchy' });
  dv.transform({
    field: 'value',
    type: 'hierarchy.treemap',
    tile: 'treemapResquarify',
    as: ['x', 'y'],
  });

  return dv;
}

// 将 DataSet 处理后的结果转换为 G2 接受的数据
function parseDataView(dv: any) {
  const nodes = [];

  for (const node of dv.getAllNodes()) {
    if (node.data.name === 'root') {
      continue;
    }

    const eachNode = {
      name: node.data.name,
      x: node.x,
      y: node.y,
      value: getNodeValue(node),
      depth: node.depth,
      brand: node.data.brand
    };

    if (!node.data.brand && node.parent) {
      eachNode.brand = node.parent.data.brand;
    } else {
      eachNode.brand = node.data.brand;
    }

    nodes.push(eachNode);
  }

  return nodes;
}

// 简单矩形树图
function drawTreemap(chart: Chart, config: WtreemapConfig, field = 'name') {
  const { colors } = config;
  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart.coordinate('polar', {
      innerRadius: config.innerRadius || 0,
    });
  } else {
    chart.coordinate();
  }

  chart.scale({
    x: { nice: true },
    y: { nice: true },
  });

  // label 自定义配置项待传入，TODO
  const geom = chart
    .polygon()
    .position('x*y')
    .color(field, colors)
    .tooltip('name*value', (name, count) => ({ name, value: count, title: name }))
    .label(
      'name', {
        offset: 0,
        style: {
          textBaseline: 'middle',
        },
      }
    );

  geomStyle(geom, config.geomStyle);

  chart.interaction('element-active');
}

// 嵌套矩形树图
function drawNestedTreemap(chart: Chart, config: WtreemapConfig, field = 'brand') {
  const { colors } = config;
  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart
      .coordinate('polar', {
        innerRadius: config.innerRadius || 0,
      })
      .reflect('y');
  } else {
    // 习惯性最小的在最下面
    chart.coordinate().scale(1, -1);
  }

  chart.scale({
    x: { nice: false },
    y: { nice: false },
  });

  const geom = chart
    .polygon()
    .position('x*y')
    .color(field, colors)
    .tooltip('name*value*brand', (name, value, brand) => ({
      name,
      value,
      title: brand,
    }))
    .label(
      'depth*brand*name*value*x*y',
      (depth, brand, value) => {
        if (depth === 1 && value) {
          // 只有第一级显示文本，数值太小时不显示文本
          return {
            content: brand,
          };
        }
        return { content: null };
      },
      {
        offset: 0,
        style: {
          textBaseline: 'middle',
          fill: '#000',
          shadowBlur: 10,
          shadowColor: '#fff',
        },
      }
    );

  geomStyle(geom, config.geomStyle);
}

// 此方法对原始数据进行处理，返回新的副本
function resetParentValue(data: any) {
  const { brand, name, value, children } = data;
  const result = { name, value, brand, children };
  if (brand) {
    result.brand = brand;
  }
  if (children) {
    // DataView 会通过子节点累加 value 值，所以先置为 null
    result.value = null;
    result.children = children.map(resetParentValue);
  }
  return result;
}

// 计算当前节点 value
function getNodeValue(n: any) {
  if (n.data.value === null && n.children) {
    return n.children.map(getNodeValue).reduce((pre: any, cur: any) => pre + cur, 0);
  }
  return n.data.value;
}

const Wtreemap: typeof Treemap = errorWrap(Treemap);

export default Wtreemap;
// export default /*#__PURE__*/ errorWrap(
//   g2Factory('G2Treemap', {
//     convertData: false,
//     getDefaultConfig() {
//       return {
//         colors: themes.category_12,
//         padding: ['auto', 'auto', 'auto', 'auto'],
//         tooltip: {
//           titleFormatter: null,
//           nameFormatter: null,
//           valueFormatter: null,
//         },
//         label: {
//           offset: 0,
//           textStyle: {
//             fill: '#fff',
//             shadowBlur: 2,
//             shadowColor: 'rgba(0,0,0,0.6)',
//           },
//         },
//         // label 文本展现的策略
//         labelRender: (depth, brand, name, value, xRange, yRange) => {
//           // 只有第一级显示文本，矩形面积太小时不显示文本
//           if (depth === 1 && xRange[1] - xRange[0] > 0.04 && yRange[1] - yRange[0] > 0.04) {
//             return brand;
//           }
//           return;
//         },
//         innerRadius: 0,
//         polar: false,
//         // 区块的 border 样式，包含 lineWidth lineDash stroke 等属性
//         geomStyle: {
//           lineWidth: 1,
//           stroke: themes['widgets-color-background'],
//         },
//       };
//     },
//     beforeInit(props) {
//       const { config } = props;
//       const newConfig = merge({}, this.defaultConfig, config);

//       // TODO 处理padding
//       return Object.assign({}, props, {
//         padding: defaultPadding(
//           props.padding || config.padding,
//           newConfig,
//           ...this.defaultConfig.padding,
//         ),
//         config: newConfig,
//       });
//     },
//     init(chart, userConfig, data) {
//       const config = userConfig;

//       this.dataView = processDataView(config, data);
//       const nodes = parseDataView(this.dataView);
//       chart.source(nodes);

//       // tooltip
//       rectTooltip(this, chart, config, { crosshairs: false });

//       if (nodes.some((x) => x.brand)) {
//         drawNestedTreemap(chart, config, config.colors);
//       } else {
//         drawTreemap(chart, config, config.colors);
//       }

//       chart.render();
//     },
//     changeData(chart, config, data) {
//       if (this.dataView) {
//         this.dataView.source(data);
//       }
//     },
//   }),
// );
