'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dataSet = require('@antv/data-set');

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

require('./G2Sankey.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var config = props.config;
    // TODO 处理padding

    return _extends({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding
    });
  },
  init: function init(chart, userConfig, data) {
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
module.exports = exports['default'];