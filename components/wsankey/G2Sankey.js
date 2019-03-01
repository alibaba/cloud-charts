'use strict';

import { DataSet } from '@antv/data-set';
import { color } from '../theme/index';
import merge from '../common/merge';
import './G2Sankey.scss';

const defaultConfig = {
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

export default {
  beforeInit(props) {
    const { config } = props;
    // TODO 处理padding
    return Object.assign({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
    });
  },
  init(chart, userConfig, data) {
    const config = merge({}, defaultConfig, userConfig);
    const ds = new DataSet();
    const dv = ds.createView().source(data, {
      type: 'graph',
      edges: d => d.links,
    });
    dv.transform({
      type: 'diagram.sankey',
    });

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
    edgeView.source(dv.edges);
    edgeView.edge()
      .position('x*y')
      .shape('arc')
      .color(color.widgetsSankeyEdge)
      .opacity(0.5)
      .tooltip('target*source*value', config.tooltip.nameFormatter);

    // node view
    const nodeView = chart.view();
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
          fill: color.widgetsSankeyNodeText,
          textAlign: 'start',
        },
        offset: 0,
        formatter: v => `    ${v}`,
      });
    }

    chart.render();
  },
};
