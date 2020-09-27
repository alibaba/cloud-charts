'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dataSet = require('@antv/data-set');

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

require('./G2Sankey.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEdges(d) {
  return d.links;
}

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Sankey', {
  convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      padding: ['auto', 40, 'auto', 'auto'],
      legend: {
        align: 'left',
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        nameFormatter: null
      },
      labels: true
      // textStyle: {
      //   fill: '#545454',
      //   textAlign: 'start'
      // }
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;
    // TODO 处理padding

    return _extends({}, props, {
      padding: props.padding || config.padding || this.defaultConfig.padding
    });
  },
  init: function init(chart, userConfig, rawData) {
    var config = (0, _merge2.default)({}, this.defaultConfig, userConfig);
    var data = (0, _merge2.default)({}, rawData);
    var ds = new _dataSet.DataSet();
    var dv = ds.createView().source(data, {
      type: 'graph',
      edges: getEdges
    });
    dv.transform({
      type: 'diagram.sankey'
    });

    this.sankeyDataView = dv;

    chart.legend(config.legend);
    chart.tooltip({
      showTitle: false
    });
    chart.axis(false);
    chart.scale({
      x: { sync: true },
      y: { sync: true }
    });

    // edge view
    var edgeView = chart.view();
    this.edgeView = edgeView;
    edgeView.source(dv.edges);
    edgeView.edge().position('x*y').shape('arc').color(_index2.default['widgets-sankey-edge']).opacity(0.5).tooltip('target*source*value', config.tooltip.nameFormatter);

    // node view
    var nodeView = chart.view();
    this.nodeView = nodeView;
    nodeView.source(dv.nodes);

    var nodeGeom = nodeView.polygon().position('x*y') // nodes数据的x、y由layout方法计算得出
    .color('name').tooltip(false).style({
      stroke: 'transparent'
    });

    if (config.labels) {
      nodeGeom.label('name', {
        textStyle: {
          fill: _index2.default['widgets-sankey-node-text'],
          textAlign: 'start'
        },
        offset: 0,
        formatter: function formatter(v) {
          return '    ' + v;
        }
      });
    }

    chart.render();
  },
  changeData: function changeData(chart, newConfig, rawData) {
    if (this.sankeyDataView && this.nodeView && this.edgeView) {
      var data = (0, _merge2.default)({}, rawData);

      this.sankeyDataView.source(data, {
        type: 'graph',
        edges: getEdges
      });
      this.edgeView.source(this.sankeyDataView.edges);
      this.nodeView.source(this.sankeyDataView.nodes);
      chart.render();
    }
  }
}));