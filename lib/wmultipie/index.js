'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _view = require("@antv/data-set/lib/view");

require("@antv/data-set/lib/api/hierarchy");

require("@antv/data-set/lib/connector/hierarchy");

require("@antv/data-set/lib/transform/hierarchy/partition");

var _Base2 = _interopRequireDefault(require("../common/Base"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

require("./index.scss");

// import { getDrawPadding, G2PieBase } from '../Wpie/G2Pie';
// import errorWrap from '../common/errorWrap';
function getParentList(node, target) {
  if (target === void 0) {
    target = [];
  }

  var parentNode = node.parent; // 需要存储根节点，所以一直到 parentNode===null（此时在根节点上）

  if (!parentNode) {
    return target;
  }

  target.unshift({
    name: parentNode.data.name,
    value: parentNode.value,
    rawValue: parentNode.data.value,
    depth: parentNode.depth
  });
  return getParentList(parentNode, target);
}

function computeData(ctx, data) {
  var dv = null;

  if (ctx.dataView) {
    dv = ctx.dataView;
    dv.source(data, {
      type: 'hierarchy'
    });
  } else {
    dv = new _view.View();
    ctx.dataView = dv;
    dv.source(data, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.partition',
      // 根据树形数据生成相邻层次图 Adjacency Diagram 布局
      as: ['x', 'y']
    });
  }

  var source = [];
  dv.getAllNodes().forEach(function (node) {
    if (node.depth === 0) {
      // 父节点不展示
      return;
    } // var obj = {};
    // obj.name = node.data.name;
    // obj.rawValue = node.data.value;
    // obj.value = node.value;
    // obj.x = node.x;
    // obj.y = node.y;


    source.push({
      name: node.data.name,
      value: node.value,
      rawValue: node.data.value,
      depth: node.depth,
      parent: getParentList(node),
      x: node.x,
      y: node.y
    });
    return node;
  }); // 挂载转换后的数据

  ctx.data = source;
  return source;
}

var Wmultipie = /*#__PURE__*/function (_Base) {
  (0, _inheritsLoose2["default"])(Wmultipie, _Base);

  function Wmultipie() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Base.call.apply(_Base, [this].concat(args)) || this;
    _this.chartName = 'G2MultiPie';
    _this.convertData = false;
    _this.dataView = null;
    _this.data = [];
    return _this;
  }

  var _proto = Wmultipie.prototype;

  _proto.getDefaultConfig = function getDefaultConfig() {
    return {
      colors: _index["default"].category_12,
      padding: [20, 20, 20, 20],
      legend: {
        position: 'right',
        align: '',
        nameFormatter: null,
        // 可以强制覆盖，手动设置label
        valueFormatter: null
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      },
      cycle: false,
      innerRadius: 0.6,
      // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8 // 饼图半径大小，初始化时可用
      // drawPadding: [10, 10, 10, 10],

    };
  };

  _proto.init = function init(chart, config, data) {
    var source = computeData(this, data);
    chart.data(source);
    var thetaConfig = {
      radius: Math.max(Math.min(config.outerRadius, 1), 0.01)
    };

    if (config.cycle) {
      thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    }

    chart.coordinate('polar', thetaConfig);
    chart.axis(false);

    _rectLegend["default"].call(this, chart, config, {// position: 'right',
      // itemTpl: (value, itemColor, checked, index) => {
      //   const { nameFormatter, valueFormatter, showData = true } = config.legend || {};
      //
      //   const item = (this.data && this.data[index]) || {};
      //   const rootNode = item.parent[0];
      //   // 根节点的value就是全量值
      //   const percent = numberDecimal(item.value / rootNode.value, 4);
      //
      //   const result = nameFormatter ? nameFormatter(value, {
      //     percent,
      //     itemColor,
      //     checked,
      //     ...item,
      //   }, index) : value;
      //
      //   if (showData) {
      //     const number = valueFormatter ? valueFormatter(item.value, {
      //       percent,
      //       itemColor,
      //       checked,
      //       ...item,
      //     }, index) : item.value;
      //     return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //     '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //     '<span class="g2-legend-text">'}${result}</span>` + `<span class="g2-legend-value">${number}</span></li>`;
      //   }
      //
      //   return `${'<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      //   '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      //   '<span class="g2-legend-text">'}${result}</span></li>`;
      // },
      // 'g2-legend': {
      //   ...legendHtmlContainer,
      //   position: 'static',
      //   overflow: 'auto',
      //   // inline flex items 不能使用百分比的margin/padding，设置为固定大小
      //   marginLeft: `${Math.max(pxToNumber(themes['widgets-font-size-4']) - drawPadding[1], 0)}px`,
      // },
      // 'g2-legend-list-item': {
      //   ...legendHtmlListItem,
      //   marginRight: 0,
      // },
    }, true); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false,
      shared: false
    }, function (ev) {
      var items = ev.data.items;
      items.forEach(function (item, index) {
        if (typeof config.tooltip === 'boolean') {
          return;
        }

        var pointData = item.data;
        var rootNode = pointData.parent[0];
        var percent = (0, _common.numberDecimal)(item.value / rootNode.value, 4);

        if (config.tooltip.valueFormatter) {
          item.value = config.tooltip.valueFormatter(item.value, (0, _extends2["default"])({
            percent: percent
          }, pointData), index, ev.items);
        }

        if (config.tooltip.nameFormatter) {
          item.name = config.tooltip.nameFormatter(item.name, (0, _extends2["default"])({
            percent: percent
          }, pointData), index, ev.items);
        }
      });
    }, {
      showTitle: false,
      showMarkers: false,
      showCrosshairs: false,
      shared: false
    });

    chart.polygon().position('x*y').color('name', config.colors).tooltip('name*value*rawValue*depth', function (name, value) {
      return {
        name: name,
        value: value
      };
    }); // .style('name*value*rawValue*depth', {
    //   ...(config.geomStyle || {}),
    // });
  };

  _proto.changeData = function changeData(chart, config, data) {
    var source = computeData(this, data);
    chart.changeData(source);
  };

  return Wmultipie;
}(_Base2["default"]);

var _default = Wmultipie; // export default /*#__PURE__*/ errorWrap(g2Factory('G2MultiPie', Object.assign({}, G2PieBase, {
//   convertData: false,
//   getDefaultConfig() {
//     return {
//       colors: themes.category_12,
//       padding: [20, 20, 20, 20],
//       legend: {
//         // position: 'right',
//         nameFormatter: null, // 可以强制覆盖，手动设置label
//         valueFormatter: null,
//       },
//       tooltip: {
//         nameFormatter: null,
//         valueFormatter: null,
//       },
//       innerRadius: null, // 内环半径大小，仅cycle为true时可用
//       outerRadius: 0.8, // 饼图半径大小，初始化时可用
//       drawPadding: [10, 10, 10, 10],
//     };
//   },
//   init(chart, userConfig, data) {
//     const config = merge({}, this.defaultConfig, userConfig);
//
//     const { source, maxDepth } = computeData.call(this, data);
//
//     chart.source(source);
//
//     // if (config.cycle) {
//     //   thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
//     // }
//
//     chart.coord('polar', {
//       innerRadius: getInnerRadius(maxDepth, config.innerRadius), // 用于空心部分的半径设置
//     });
//
//     chart.axis(false);
//
//     const drawPadding = getDrawPadding(config.drawPadding, config.label, this.defaultConfig.drawPadding);
//
//
//
//     chart.render();
//   },
//   changeData(chart, config, data) {
//     const { source } = computeData.call(this, data);
//
//     chart.changeData(source);
//   },
// })));

exports["default"] = _default;