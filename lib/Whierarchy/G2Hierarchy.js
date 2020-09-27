'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dataSet = require('@antv/data-set');

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

var _common = require('../common/common');

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

require('./G2Hierarchy.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Treemap', {
  convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index2.default.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      label: {
        offset: 0,
        textStyle: {
          fill: '#fff',
          shadowBlur: 2,
          shadowColor: 'rgba(0,0,0,0.6)'
        }
      },
      // label 文本展示的策略
      labelRender: function labelRender(depth, name, value, xRange, yRange) {
        // 根据矩形大小判断是否渲染 label
        if (xRange[1] - xRange[0] > 0.03 && yRange[1] - yRange[0] > 0.05) {
          return name;
        }
        return;
      },
      innerRadius: 0,
      polar: false,
      // 区块的 border 样式，包含 lineWidth lineDash stroke 等属性
      borderStyle: {}
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, this.defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    this.dataView = processDataView(config, data);
    var nodes = parseDataView(this.dataView);
    chart.source(nodes);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, { crosshairs: false });

    drawHierarchy(chart, config, config.colors);

    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    if (this.dataView) {
      this.dataView.source(data);
    }
  }
}));

// 数据分箱

function processDataView(config, data) {
  var dv = new _dataSet.View().source(data, { type: 'hierarchy' });
  dv.transform({
    type: 'hierarchy.partition'
  });

  return dv;
}

// 将 DataSet 处理后的结果转换为 G2 接受的数据
function parseDataView(dv) {
  var nodes = [];

  for (var _iterator = dv.getAllNodes(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var node = _ref;

    var eachNode = {
      name: node.data.name,
      value: node.value,
      depth: node.depth,
      x: node.x,
      y: node.y,
      path: getNodePath(node).join('/')
    };

    nodes.push(eachNode);
  }

  return nodes;
}

// 简单矩形树图
function drawHierarchy(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'name';

  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart.coord('polar', {
      innerRadius: config.innerRadius || 0
    });
  } else {
    chart.coord();
  }

  chart.axis(false);
  chart.legend(false);

  chart.polygon().position('x*y').color(field, colors).tooltip('name*value*path', function (name, value, path) {
    return {
      name: name,
      value: value,
      title: path
    };
  }).style(config.borderStyle).label('depth*name*value*x*y', function (depth, name, value, xs, ys) {
    return config.labelRender(depth, name, value, [Math.min.apply(Math, xs), Math.max.apply(Math, xs)], [Math.min.apply(Math, ys), Math.max.apply(Math, ys)]);
  }, config.label);
}

// 获取节点的路径
function getNodePath(n) {
  if (!n.parent) {
    return [n.data.name];
  }
  return [].concat(getNodePath(n.parent), [n.data.name]);
}