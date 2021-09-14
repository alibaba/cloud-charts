'use strict';
import { Chart, BaseChartConfig, View, Colors } from '../common/types';
import Base from "../common/Base";
import { DataSet } from '@antv/data-set/lib/data-set';
import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/transform/diagram/sankey';
import '@antv/data-set/lib/connector/graph';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import { LabelConfig } from "../common/label";
import themes from '../themes/index';
import errorWrap from '../common/errorWrap';
import './index.scss';

function getEdges(d: { links: any; }) {
  return d.links;
}

interface WsankeyConfig extends BaseChartConfig {
  colors?: Colors;
  legend?: LegendConfig | false,
  tooltip?: TooltipConfig | false,
  // TODO 完善label逻辑
  labels?: LabelConfig | boolean,
}

export class Sankey extends Base<WsankeyConfig> {
  // 原 g2Factory 的第一个参数，改为类的属性。
  chartName = 'G2Sankey';

  convertData=  false;
  private sankeyDataView: DataView;
  private edgeView: View;
  private nodeView: View;

  getDefaultConfig(): WsankeyConfig {
    return {
      // padding: ['auto', 40, 'auto', 'auto'],
      colors: themes.category_12,
      legend: {
        align: 'center',
        position: 'bottom',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null
      },
      labels: true,
      // textStyle: {
      //   fill: '#545454',
      //   textAlign: 'start'
      // }
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
    });

    this.sankeyDataView = dv;

    // chart.legend(config.legend);
    // chart.tooltip({
    //   showTitle: false,
    // });
    rectTooltip(this, chart, config, {}, null, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false,
      shared: false,
    });

    rectLegend(this, chart, config, {}, false);

    chart.axis(false);
    chart.scale({
      x: { sync: true },
      y: { sync: true },
    });

    // edge view
    const edgeView = chart.createView();
    this.edgeView = edgeView;
    edgeView.data(dv.edges);
    edgeView.edge()
        .position('x*y')
        .shape('arc')
        .color(themes['widgets-sankey-edge'])
        // .opacity(0.5)
        .tooltip('target*source*value', (target, source, value) => {
          if (typeof config.tooltip === "boolean") {
            return  null
          } else {
            return config.tooltip?.nameFormatter?.(target, source, value) || {
              name: source.name + ' to ' + target.name + '</span>',
              value,
            }
          }
        });

    // node view
    const nodeView = chart.createView();
    this.nodeView = nodeView;
    nodeView.data(dv.nodes);

    const nodeGeom = nodeView.polygon()
      .position('x*y') // nodes数据的x、y由layout方法计算得出
      .color('name', config.colors)
      .tooltip(false)
      .style({
        stroke: 'transparent',
      });

    if (config.labels) {
      nodeGeom.label('name', ()=> ({
        textStyle: {
          fill: themes['widgets-sankey-node-text'],
          textAlign: 'start',
        },
        offset: 0,
        formatter: (v: any) => `    ${v}`,
      }));
    }

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
