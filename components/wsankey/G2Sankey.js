'use strict';

import merge from '../utils/merge';
import G2 from '@antv/g2';
import {DataSet} from '@antv/data-set';

const Util = G2.Util;
import './G2Sankey.scss';

let defaultConfig = {
  padding: [32, 5, 32, 45],
  legend: {
    align: 'left',
    nameFormatter: null, //可以强制覆盖，手动设置label
  },
  tooltip: {
    showTitle: false,
    formatter: null
  },
  textStyle: {
    fill: '#545454',
    textAlign: 'start'
  }
};

export default {
  beforeInit(props) {
    const {config, plotCfg} = props;
    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },
  init(chart, userConfig, data) {
    // console.log(chart, userConfig, data)
    const config = merge({}, defaultConfig, userConfig);
    const ds = new DataSet();
    const dv = ds.createView().source(data, {
      type: 'graph',
      edges: d => d.links
    });
    dv.transform({
      type: 'diagram.sankey'
    });

    chart.legend(config.legend);
    chart.tooltip(config.tooltip);
    chart.axis(false);
    chart.scale({
      x: {sync: true},
      y: {sync: true}
    });

    // edge view
    const edgeView = chart.view();
    edgeView.source(dv.edges);
    edgeView.edge()
      .position('x*y')
      .shape('arc')
      .color('#bbb')
      .opacity(0.6)
      .tooltip('target*source*value', config.tooltip.formatter);

    // node view
    const nodeView = chart.view();
    nodeView.source(dv.nodes);
    nodeView.polygon()
      .position('x*y') // nodes数据的x、y由layout方法计算得出
      .color('name')
      .label('name', {
        textStyle: config.textStyle,
        offset: 0,
        formatter: val => {
          return '  ' + val;
        }
      })
      .tooltip(false)
      .style({
        stroke: '#ccc'
      });
    chart.render();


  }
};

function getLegendNode(target) {
  if (target.tagName === 'LI') return target;
  else return target.parentNode;
}
