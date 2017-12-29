'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _dataSet = require('@antv/data-set');

require('./G2Sankey.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = _g2.default.Util;


var defaultConfig = {
  padding: [32, 5, 32, 45],
  legend: {
    align: 'left',
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    showTitle: false,
    nameFormatter: null
  },
  textStyle: {
    fill: '#545454',
    textAlign: 'start'
  }
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config,
        plotCfg = props.plotCfg;

    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },
  init: function init(chart, userConfig, data) {
    // console.log(chart, userConfig, data)
    var config = (0, _merge2.default)({}, defaultConfig, userConfig);
    var ds = new _dataSet.DataSet();
    var dv = ds.createView().source(data, {
      type: 'graph',
      edges: function edges(d) {
        return d.links;
      }
    });
    dv.transform({
      type: 'diagram.sankey'
    });

    chart.legend(config.legend);
    chart.tooltip(config.tooltip);
    chart.axis(false);
    chart.scale({
      x: { sync: true },
      y: { sync: true }
    });

    // edge view
    var edgeView = chart.view();
    edgeView.source(dv.edges);
    edgeView.edge().position('x*y').shape('arc').color('#bbb').opacity(0.6).tooltip('target*source*value', config.tooltip.nameFormatter);

    // node view
    var nodeView = chart.view();
    nodeView.source(dv.nodes);
    nodeView.polygon().position('x*y') // nodes数据的x、y由layout方法计算得出
    .color('name').label('name', {
      textStyle: config.textStyle,
      offset: 0,
      formatter: function formatter(val) {
        return '  ' + val;
      }
    }).tooltip(false).style({
      stroke: '#ccc'
    });
    chart.render();
  }
};


function getLegendNode(target) {
  if (target.tagName === 'LI') return target;else return target.parentNode;
}
module.exports = exports['default'];