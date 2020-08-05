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

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

require('./G2Treemap.scss');

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
      // label 文本展现的策略
      labelRender: function labelRender(depth, brand, name, value, xRange, yRange) {
        // 只有第一级显示文本，矩形面积太小时不显示文本
        if (depth === 1 && xRange[1] - xRange[0] > 0.04 && yRange[1] - yRange[0] > 0.04) {
          return brand;
        }
        return;
      },
      innerRadius: 0,
      polar: false,
      // 区块的 border 样式，包含 lineWidth lineDash stroke 等属性
      geomStyle: {
        lineWidth: 1,
        stroke: _index2.default['widgets-color-background']
      }
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

    if (nodes.some(function (x) {
      return x.brand;
    })) {
      drawNestedTreemap(chart, config, config.colors);
    } else {
      drawTreemap(chart, config, config.colors);
    }

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
  var dv = new _dataSet.View().source(resetParentValue(data), { type: 'hierarchy' });
  dv.transform({
    field: 'value',
    type: 'hierarchy.treemap',
    tile: 'treemapResquarify',
    as: ['x', 'y']
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

    if (node.data.name === 'root') {
      continue;
    }

    var eachNode = {
      name: node.data.name,
      x: node.x,
      y: node.y,
      value: getNodeValue(node),
      depth: node.depth
    };

    if (!node.data.brand && node.parent) {
      eachNode.brand = node.parent.data.brand;
    } else {
      eachNode.brand = node.data.brand;
    }

    nodes.push(eachNode);
  }

  return nodes;
}

// 简单矩形树图
function drawTreemap(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'name';

  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart.coord('polar', {
      innerRadius: config.innerRadius || 0
    });
  } else {
    chart.coord();
  }

  chart.scale({
    x: { nice: true },
    y: { nice: true }
  });
  chart.axis(false);
  chart.legend(false);

  var geom = chart.polygon().position('x*y').color(field, colors).tooltip('name*value', function (name, count) {
    return { name: name, value: count, title: name };
  }).style(config.geomStyle);

  (0, _label2.default)(geom, config, 'name', null, null, true);
}

// 嵌套矩形树图
function drawNestedTreemap(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'brand';

  // 设置坐标系：极坐标/直角坐标
  if (config.polar) {
    chart.coord('polar', {
      innerRadius: config.innerRadius || 0
    }).reflect();
  } else {
    // 习惯性最小的在最下面
    chart.coord().scale(1, -1);
  }

  chart.scale({
    x: { nice: false },
    y: { nice: false }
  });
  chart.axis(false);
  chart.legend(false);

  chart.polygon().position('x*y').color(field, colors).tooltip('name*value*brand', function (name, value, brand) {
    return {
      name: name,
      value: value,
      title: brand
    };
  }).style(config.geomStyle).label('depth*brand*name*value*x*y', function (depth, brand, name, value, xs, ys) {
    return config.labelRender(depth, brand, name, value, [Math.min.apply(Math, xs), Math.max.apply(Math, xs)], [Math.min.apply(Math, ys), Math.max.apply(Math, ys)]);
  }, config.label);
}

// 此方法对原始数据进行处理，返回新的副本
function resetParentValue(_ref2) {
  var brand = _ref2.brand,
      name = _ref2.name,
      value = _ref2.value,
      children = _ref2.children;

  var result = { name: name, value: value };
  if (brand) {
    result.brand = brand;
  }
  if (children) {
    // DataView 会通过子节点累加 value 值，所以先置为 null
    result.value = null;
    result.children = children.map(resetParentValue);
  }
  return result;
}

// 计算当前节点 value
function getNodeValue(n) {
  if (n.data.value === null && n.children) {
    return n.children.map(getNodeValue).reduce(function (pre, cur) {
      return pre + cur;
    }, 0);
  }
  return n.data.value;
}