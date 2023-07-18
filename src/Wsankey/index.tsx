'use strict';
import { Chart, BaseChartConfig, View, Colors } from '../common/types';
import Base from '../common/Base';
import { DataSet } from '@antv/data-set/lib/data-set';
import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/transform/diagram/sankey';
import '@antv/data-set/lib/connector/graph';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import { LabelConfig } from '../common/label';
import themes from '../themes/index';
import errorWrap from '../common/errorWrap';
import './index.scss';

function getEdges(d: { links: any }) {
  return d.links;
}

interface WsankeyConfig extends BaseChartConfig {
  colors?: Colors;
  legend?: LegendConfig | false;
  tooltip?: TooltipConfig | false;
  // TODO 完善label逻辑
  labels?: LabelConfig | boolean;
}

export class Sankey extends Base<WsankeyConfig> {
  // 原 g2Factory 的第一个参数，改为类的属性。
  chartName = 'G2Sankey';

  convertData = false;
  private sankeyDataView: DataView;
  private edgeView: View;
  private nodeView: View;

  getDefaultConfig(): WsankeyConfig {
    return {
      colors: themes.category_20,
      legend: {
        align: 'left',
        position: 'top-left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null,
      },
      labels: true,
    };
  }
  init(chart: Chart, config: WsankeyConfig, data: any) {
    const ds = new DataSet();
    const dv = ds.createView().source(data, {
      type: 'graph',
      edges: getEdges,
    });
    dv.transform({
      type: 'diagram.sankey',
      nodeWidth: 0.008,
      nodePadding: 0.03,
      sort: (a, b) => {
        if (a.value > b.value) {
          return 0;
        } else if (a.value < b.value) {
          return -1;
        }
        return 0;
      },
    });

    this.sankeyDataView = dv;

    chart.axis(false);
    chart.scale({
      x: { sync: true },
      y: { sync: true },
      source: { sync: 'color' },
      name: { sync: 'color' },
    });

    rectTooltip(this, chart, config, {}, null, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false,
      shared: false,
    });

    // 为了颜色映射
    const edges = dv.edges.map((edge) => {
      return {
        source: edge.source.name,
        target: edge.target.name,
        name: edge.source.name,
        x: edge.x,
        y: edge.y,
        value: edge.value,
      };
    });

    const nodes = dv.nodes.map((node) => {
      return {
        x: node.x,
        y: node.y,
        name: node.name,
      };
    });

    // edge view
    const edgeView = chart.createView();
    this.edgeView = edgeView;
    edgeView.data(edges);
    edgeView
      .edge()
      .position('x*y')
      .shape('arc')
      .color('name', config.colors)
      // .color(themes['widgets-sankey-edge'])
      .tooltip('target*source*value', (target, source, value) => {
        if (typeof config.tooltip === 'boolean') {
          return null;
        } else {
          return (
            config.tooltip?.nameFormatter?.(target, source, value) || {
              name: source + ' to ' + target + '</span>',
              value,
            }
          );
        }
      })
      .style('source*target', () => {
        return {
          lineWidth: 0,
          opacity: 0.1,
        };
      });

    // node view
    const nodeView = chart.createView();
    this.nodeView = nodeView;
    nodeView.data(nodes);

    const nodeGeom = nodeView
      .polygon()
      .position('x*y') // nodes数据的x、y由layout方法计算得出
      .color('name', config.colors)
      .tooltip(false)
      .style({
        stroke: 'transparent',
      });

    if (config.labels) {
      nodeGeom.label('x*name', (x, name) => {
        console.log(x, name);
        const isLast = x[1] === 1;
        return {
          style: {
            fill: themes['widgets-sankey-node-text'],
            textAlign: isLast ? 'end' : 'start',
          },
          offsetX: isLast ? -12 : 12,
          content: name,
        };
      });
    }

    rectLegend(
      this,
      chart,
      {
        ...config,
        legend: {
          ...config.legend,
          marker: {
            style: {
              stroke: 'rgba(0,0,0,0)',
            },
          },
        },
      },
      {},
      false,
    );
    // chart.interaction('element-active');
  }

  changeData(chart: Chart, newConfig: WsankeyConfig, data: any) {
    if (this.sankeyDataView && this.nodeView && this.edgeView) {
      this.sankeyDataView.source(data, {
        type: 'graph',
        edges: getEdges,
      });
      this.edgeView.data(this.sankeyDataView.edges);
      this.nodeView.data(this.sankeyDataView.nodes);
      chart.render();
    }
  }
}

const Wsankey: typeof Sankey = errorWrap(Sankey);
export default Wsankey;
