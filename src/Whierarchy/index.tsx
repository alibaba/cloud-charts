'use strict';
import { View } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/transform/hierarchy/treemap';
import { Chart, Types, BaseChartConfig } from '../common/types';
import Base from "../common/Base";
import { XAxisConfig } from '../common/rectXAxis';
import { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import { LegendConfig } from '../common/rectLegend';
import { GuideConfig } from '../common/guide';
import { LabelConfig } from "../common/label";

import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import './index.scss';

interface WhierarchyConfig extends BaseChartConfig {
  colors?: string[];
  xAxis?: Types.ScaleOption & XAxisConfig | boolean,
  yAxis?: Types.ScaleOption & YAxisConfig | boolean,
  legend?: LegendConfig | boolean,
  tooltip?: TooltipConfig | boolean,
  guide?: GuideConfig,
  label?: LabelConfig | boolean,
  polar: boolean,
  innerRadius?: number;
  borderStyle: any;
  labelRender: any;
}


export class Hierarchy extends Base<WhierarchyConfig> {
  // 原 g2Factory 的第一个参数，改为类的属性。
  chartName = 'G2Hierarchy';
  convertData: false;

  getDefaultConfig(): WhierarchyConfig {
    console.log(21)
    return {
      colors: themes.category_12,
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      label: {
        offset: 0,
        // textStyle: {
        //   fill: '#fff',
        //   shadowBlur: 2,
        //   shadowColor: 'rgba(0,0,0,0.6)',
        // },
      },
      // label 文本展示的策略
      labelRender: (depth: any, name: any, value: any, xRange: number[], yRange: number[]) => {
        // 根据矩形大小判断是否渲染 label
        if (xRange[1] - xRange[0] > 0.03 && yRange[1] - yRange[0] > 0.05) {
          return name;
        }
        return;
      },
      innerRadius: 0,
      polar: false,
      // 区块的 border 样式，包含 lineWidth lineDash stroke 等属性
      borderStyle: {},
    };
  }
  init(chart: Chart, config: WhierarchyConfig, data: any) {
    console.log(data)

    const dataView = processDataView(data);
    const nodes = parseDataView(dataView);
    chart.data(nodes);

    // tooltip
    rectTooltip.call(this, chart, config, { crosshairs: false });

    drawHierarchy(chart, config, config.colors);

    // chart.render();
  }
  changeData(chart: Chart, config: WhierarchyConfig, data: any) {
    const dataView = processDataView(data);
    if (dataView) {
      dataView.source(data);
    }
  }
  // Chart 内容，方法名称与入参和原来一致
}

const Whierarchy: typeof Hierarchy = errorWrap(Hierarchy);

export default Whierarchy;


// 将 DataSet 处理后的结果转换为 G2 接受的数据
function parseDataView(dv: any) {
  const nodes = [];

  for (const node of dv.getAllNodes()) {
    const eachNode = {
      name: node.data.name,
      value: node.value,
      depth: node.depth,
      x: node.x,
      y: node.y,
      path: getNodePath(node).join('/'),
    };

    nodes.push(eachNode);
  }

  return nodes;
}

// 简单矩形树图
function drawHierarchy(chart: Chart, config: WhierarchyConfig, colors: string | string[] | Types.ColorAttrCallback, field = 'name') {
  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart.coordinate('polar', {
      innerRadius: config.innerRadius || 0,
    });
  } else {
    chart.coordinate();
  }

  chart.axis(false);
  chart.legend(false);

  chart
    .polygon()
    .position('x*y')
    .color(field, colors)
    .tooltip('name*value*path', (name, value, path) => ({
      name,
      value,
      title: path,
    }))
    .style(config.borderStyle)
    .label(
      'depth*name*value*x*y',
      (depth, name, value, xs, ys) =>
        config.labelRender(
          depth,
          name,
          value,
          [Math.min(...xs), Math.max(...xs)],
          [Math.min(...ys), Math.max(...ys)],
        ),
      // config.label,
    );
}

// 数据分箱
function processDataView( data: any) {
  return new View().source(data, { type: 'hierarchy' }).transform({
    type: 'hierarchy.partition',
    as: ['x', 'y'],
  });
}

// 获取节点的路径
function getNodePath(n: any): any {
  if (!n.parent) {
    return [n.data.name];
  }
  return [...getNodePath(n.parent), n.data.name];
}
