'use strict';

import { DataSet } from '@antv/data-set';
import g2Factory from '../common/g2Factory';
import themes from '../themes/index';
import merge from '../common/merge';
import './G2Sankey.scss';

function getEdges(d) {
  return d.links;
}

export default /*#__PURE__*/ g2Factory('G2Sankey', {
  convertData: false,
  getDefaultConfig() {
    return {
      padding: ['auto', 40, 'auto', 'auto'],
      legend: {
        align: 'left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null,
      },
      labels: true,
      // textStyle: {
      //   fill: '#545454',
      //   textAlign: 'start'
      // }
    };
  },
  beforeInit(props) {
    const { config } = props;
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || this.defaultConfig.padding,
    });
  },
  init(chart, userConfig, rawData) {
    const config = merge({}, this.defaultConfig, userConfig);
    const data = merge({}, rawData);
    const ds = new DataSet();
    const dv = ds.createView().source(data, {
      type: 'graph',
      edges: getEdges,
    });
    dv.transform({
      type: 'diagram.sankey',
    });

    this.sankeyDataView = dv;

    chart.legend(config.legend);
    chart.tooltip({
      showTitle: false,
    });
    chart.axis(false);
    chart.scale({
      x: { sync: true },
      y: { sync: true },
    });

    // edge view
    const edgeView = chart.view();
    this.edgeView = edgeView;
    edgeView.source(dv.edges);
    edgeView.edge()
      .position('x*y')
      .shape('arc')
      .color(themes['widgets-sankey-edge'])
      .opacity(0.5)
      .tooltip('target*source*value', config.tooltip.nameFormatter);

    // node view
    const nodeView = chart.view();
    this.nodeView = nodeView;
    nodeView.source(dv.nodes);

    const nodeGeom = nodeView.polygon()
      .position('x*y') // nodes数据的x、y由layout方法计算得出
      .color('name')
      .tooltip(false)
      .style({
        stroke: 'transparent',
      });

    if (config.labels) {
      nodeGeom.label('name', {
        textStyle: {
          fill: themes['widgets-sankey-node-text'],
          textAlign: 'start',
        },
        offset: 0,
        formatter: v => `    ${v}`,
      });
    }

    chart.render();
  },
  changeData(chart, newConfig, rawData) {
    if (this.sankeyDataView && this.nodeView && this.edgeView) {
      const data = merge({}, rawData);

      this.sankeyDataView.source(data, {
        type: 'graph',
        edges: getEdges,
      });
      this.edgeView.source(this.sankeyDataView.edges);
      this.nodeView.source(this.sankeyDataView.nodes);
      chart.render();
    }
  },
});
