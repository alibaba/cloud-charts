'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _guide = require('../chartCommon/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectTooltip = require('../chartCommon/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

require('./G2Bar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  colors: _normal.color.category_12,
  padding: [40, 5, 32, 44],
  xAxis: {
    type: 'cat',
    labelFormatter: null, //可以强制覆盖，手动设置label
    categories: null
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    max: null,
    min: null
  },
  legend: {
    align: 'left',
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null
  },
  column: true,
  stack: false,
  stackReverse: true,
  grid: false,
  // labels: false,
  polar: false
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data, rawData) {
    var _this = this;

    var config = userConfig;

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'cat'
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };

    chart.source(data, defs);

    var yAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        formatter: config.yAxis.labelFormatter
      }
    };

    var xAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        formatter: config.xAxis.labelFormatter
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: _normal.color.colorN13
          // lineWidth: 1,
          // lineDash: null
        }
        // TODO 双轴情况下，需要处理
        // hideFirstLine: true
      };
    }
    chart.axis('x', xAxis);
    chart.axis('y', yAxis);

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        position: 'top',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        autoPosition: false,
        itemTpl: function itemTpl(value, color, checked, index) {
          var item = _this.rawData && _this.rawData[index] || {};
          var result = config.legend.nameFormatter ? config.legend.nameFormatter(value, _extends({}, item, {
            color: color,
            checked: checked
          }), index) : value;
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">' + result + '</span></li>';
        },
        'g2-legend': _extends({
          top: _normal.size.s3
        }, config.legend.align === 'right' ? { right: 0 } : { left: 0 })
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // if (config.polar) {
    // chart.coord('theta', {
    //   inner: 0.6
    // });
    //
    // chart.point().position('name*0').color('name').shape('circle');
    // chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
    // chart.point().position('name*value').color('name').shape('circle');
    // } else {
    // 横向柱状图
    if (!config.column) {
      chart.coord().transpose();
    }
    // 堆叠
    if (config.stack) {
      chart.interval().position('x*y').color('type', config.colors).adjust([{
        type: 'stack',
        reverseOrder: !config.stackReverse // 层叠顺序倒序
      }]);
    } else {
      chart.interval().position('x*y').color('type', config.colors).adjust([{
        type: 'dodge',
        marginRatio: 0 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      }]);
    }
    // }

    chart.render();
  }
};
module.exports = exports['default'];