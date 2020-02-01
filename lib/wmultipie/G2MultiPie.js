'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dataSet = require('@antv/data-set');

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _index2 = _interopRequireDefault(_index);

var _g2Theme = require('../common/g2Theme');

var _common = require('../common/common');

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _G2Pie = require('../wpie/G2Pie');

var _G2Pie2 = _interopRequireDefault(_G2Pie);

require('./G2MultiPie.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParentList(node) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var parentNode = node.parent;
  // 需要存储根节点，所以一直到 parentNode===null（此时在根节点上）
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

function computeData(data) {
  var dv = null;
  if (this.dataView) {
    dv = this.dataView;
    dv.source(data, {
      type: 'hierarchy'
    });
  } else {
    dv = new _dataSet.DataView();
    this.dataView = dv;

    dv.source(data, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.partition' // 根据树形数据生成相邻层次图 Adjacency Diagram 布局
    });
  }

  var source = [];

  // 记录最大深度
  var maxDepth = 0;
  dv.getAllNodes().forEach(function (node) {
    if (node.depth > maxDepth) {
      maxDepth = node.depth;
    }
    if (node.depth === 0) {
      // 父节点不展示
      return;
    }
    // var obj = {};
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
  });

  // 挂载转换后的数据
  this.data = source;

  return {
    source: source,
    maxDepth: maxDepth
  };
}

var radiusMap = {
  2: -0.05,
  3: -0.07
};

function getInnerRadius(maxDepth, innerRadius) {
  if (innerRadius) {
    return innerRadius;
  }
  return radiusMap[maxDepth] || 0;
}

exports.default = _extends({}, _G2Pie2.default, {
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index2.default.category_12,
      padding: [20, 20, 20, 20],
      legend: {
        // position: 'right',
        nameFormatter: null, // 可以强制覆盖，手动设置label
        valueFormatter: null
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null
      },
      innerRadius: null, // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8, // 饼图半径大小，初始化时可用
      drawPadding: [10, 10, 10, 10]
    };
  },
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = (0, _merge2.default)({}, this.defaultConfig, userConfig);

    var _computeData$call = computeData.call(this, data),
        source = _computeData$call.source,
        maxDepth = _computeData$call.maxDepth;

    chart.source(source);

    // if (config.cycle) {
    //   thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    // }

    chart.coord('polar', {
      innerRadius: getInnerRadius(maxDepth, config.innerRadius) // 用于空心部分的半径设置
    });

    chart.axis(false);

    var drawPadding = (0, _G2Pie.getDrawPadding)(config.drawPadding, config.label, this.defaultConfig.drawPadding);

    _rectLegend2.default.call(this, chart, config, {
      autoCollapse: false,
      position: 'right',
      itemTpl: function itemTpl(value, itemColor, checked, index) {
        var _ref = config.legend || {},
            nameFormatter = _ref.nameFormatter,
            valueFormatter = _ref.valueFormatter,
            _ref$showData = _ref.showData,
            showData = _ref$showData === undefined ? true : _ref$showData;

        var item = _this.data && _this.data[index] || {};
        var rootNode = item.parent[0];
        // 根节点的value就是全量值
        var percent = (0, _common.numberDecimal)(item.value / rootNode.value, 4);

        var result = nameFormatter ? nameFormatter(value, _extends({
          percent: percent,
          itemColor: itemColor,
          checked: checked
        }, item), index) : value;

        if (showData) {
          var number = valueFormatter ? valueFormatter(item.value, _extends({
            percent: percent,
            itemColor: itemColor,
            checked: checked
          }, item), index) : item.value;
          return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span>' + ('<span class="g2-legend-value">' + number + '</span></li>');
        }

        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span></li>';
      },
      'g2-legend': _extends({}, _g2Theme.legendHtmlContainer, {
        position: 'static',
        // inline flex items 不能使用百分比的margin/padding，设置为固定大小
        marginLeft: Math.max((0, _common.pxToNumber)(_index2.default.s5) - drawPadding[1], 0) + 'px'
      }),
      'g2-legend-list-item': _extends({}, _g2Theme.legendHtmlListItem, {
        marginRight: 0
      })
    }, true);

    // tooltip
    if (config.tooltip) {
      var tooltipCfg = {
        showTitle: false,
        // crosshairs: {},
        itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + ('<span class="g2-tooltip-item-name">{name}</span>' + (config.tooltip.showColon !== false ? ':' : '') + '<span class="g2-tooltip-item-value">{value}</span></li>')
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', function (ev) {
          ev.items.forEach(function (item, index) {
            var pointData = item.point._origin;
            var rootNode = pointData.parent[0];
            var percent = (0, _common.numberDecimal)(item.value / rootNode.value, 4);

            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(item.value, _extends({
                percent: percent
              }, pointData), index, ev.items);
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(item.name, _extends({
                percent: percent
              }, pointData), index, ev.items);
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    chart.polygon().position('x*y').color('name', config.colors).tooltip('name*value*rawValue*depth', function (name, value) {
      return {
        name: name,
        value: value
      };
    });

    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    var _computeData$call2 = computeData.call(this, data),
        source = _computeData$call2.source;

    chart.changeData(source);
  }
});
module.exports = exports['default'];