'use strict';
import { Chart, BaseChartConfig } from '../common/types';
import Base from "../common/Base";

import { DataSet } from '@antv/data-set/lib/data-set';
// import '@antv/data-set/lib/connector/graph';
// import '@antv/data-set/lib/connector/graph';
// import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/transform/diagram/sankey';
import '@antv/data-set/lib/connector/graph';

// import '@antv/data-set/lib/api/hierarchy';
// import '@antv/data-set/lib/connector/hierarchy';
// import '@antv/data-set/lib/diagram/sankey'
// import errorWrap from '../common/errorWrap';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import { GuideConfig } from '../common/guide';
import { LabelConfig } from "../common/label";

// import merge from '../Util';
import themes from '../themes/index';
// import merge from '../common/merge';

import './index.scss';

function getEdges(d: { links: any; }) {
  return d.links;
}

interface WsankeyConfig extends BaseChartConfig {
  colors?: string[];
  legend?: LegendConfig | false,
  tooltip?: TooltipConfig | false,
  guide?: GuideConfig,
  labels?: LabelConfig | boolean,
  // 剩余部分自行定义
}

export default class Wsankey extends Base<WsankeyConfig> {
  // 原 g2Factory 的第一个参数，改为类的属性。
  chartName = 'G2Sankey';

  convertData=  false;
  private sankeyDataView: any;
  private edgeView: any;
  private nodeView: any;

  getDefaultConfig():WsankeyConfig {
    return {
      // padding: ['auto', 40, 'auto', 'auto'],
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
  // beforeInit(props) {
  //   const { config } = props;
  //   // TODO 处理padding
  //   return Object.assign({}, props, {
  //     padding: props.padding || config.padding || this.defaultConfig.padding,
  //   });
  // },
  init(chart: Chart, userConfig: WsankeyConfig, rawData: any) {
    const config = userConfig;
    const data = rawData;
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
    rectTooltip.call(this, chart, config, {}, null, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false,
      shared: false,
    });

    rectLegend.call(this, chart, config);

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
    const nodeView = chart.view();
    this.nodeView = nodeView;
    nodeView.data(dv.nodes);

    const nodeGeom = nodeView.polygon()
      .position('x*y') // nodes数据的x、y由layout方法计算得出
      .color('name')
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

    chart.render();
  }
  
  changeData(chart: Chart, newConfig: WsankeyConfig, rawData: any) {
    if (this.sankeyDataView && this.nodeView && this.edgeView) {
      const data = rawData;

      this.sankeyDataView.source(data, {
        type: 'graph',
        edges: getEdges,
      });
      this.edgeView.source(this.sankeyDataView.edges);
      this.nodeView.source(this.sankeyDataView.nodes);
      chart.render();
    }
  }
};
