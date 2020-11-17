'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _dataSet = require("@antv/data-set");

var _g2Factory = _interopRequireDefault(require("../common/g2Factory"));

var _errorWrap = _interopRequireDefault(require("../common/errorWrap"));

var _merge = _interopRequireDefault(require("../common/merge"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

require("./G2Hierarchy.scss");

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _default = /*#__PURE__*/(0, _errorWrap["default"])((0, _g2Factory["default"])('G2Treemap', {
  convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index["default"].category_12,
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
    var newConfig = (0, _merge["default"])({}, this.defaultConfig, config); // TODO 处理padding

    return Object.assign({}, props, {
      padding: _common.defaultPadding.apply(void 0, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;
    this.dataView = processDataView(config, data);
    var nodes = parseDataView(this.dataView);
    chart.source(nodes); // tooltip

    _rectTooltip["default"].call(this, chart, config, {
      crosshairs: false
    });

    drawHierarchy(chart, config, config.colors);
    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    if (this.dataView) {
      this.dataView.source(data);
    }
  }
})); // 数据分箱


exports["default"] = _default;

function processDataView(config, data) {
  var dv = new _dataSet.View().source(data, {
    type: 'hierarchy'
  });
  dv.transform({
    type: 'hierarchy.partition'
  });
  return dv;
} // 将 DataSet 处理后的结果转换为 G2 接受的数据


function parseDataView(dv) {
  var nodes = [];

  for (var _iterator = _createForOfIteratorHelperLoose(dv.getAllNodes()), _step; !(_step = _iterator()).done;) {
    var node = _step.value;
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
} // 简单矩形树图


function drawHierarchy(chart, config, colors, field) {
  if (field === void 0) {
    field = 'name';
  }

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
} // 获取节点的路径


function getNodePath(n) {
  if (!n.parent) {
    return [n.data.name];
  }

  return [].concat(getNodePath(n.parent), [n.data.name]);
}