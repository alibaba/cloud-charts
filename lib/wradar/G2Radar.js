'use strict';

// 引入所需要的库和样式

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _rectTooltip = require('../chartCommon/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

require('./G2Radar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [20, 20, 40, 20],
  colors: _normal.color.category_12,
  xAxis: {
    labelFormatter: null // 可以强制覆盖，手动设置label
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: 100,
    min: 0
  },
  radius: 0.8,
  area: false,
  symbol: false,
  // stack: false,
  legend: {
    nameFormatter: null,
    offsetX: 0,
    offsetY: 0
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null
  }
};

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
exports.default = {
  // 初始化前对props的预处理函数
  beforeInit: function beforeInit(props) {
    var config = props.config;
    // TODO 处理padding

    return _extends({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding
    });
  },

  // 图表绘制主函数，必选
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = (0, _merge2.default)({}, defaultConfig, userConfig);

    var defs = {
      type: {
        type: 'cat'
      }
    };

    defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
      type: 'linear',
      tickCount: 5
    }, config.yAxis);

    chart.source(data, defs);

    chart.coord('polar', {
      radius: config.radius
    });

    chart.axis('x', {
      label: {
        formatter: config.xAxis.labelFormatter
      },
      line: null,
      tickLine: null,
      grid: {
        lineStyle: {
          lineDash: null
        }
        //hideFirstLine: false
      }
    });
    chart.axis('y', {
      label: {
        offset: 8,
        textStyle: {
          textAlign: 'right' // 文本右对齐
        },
        htmlTemplate: function htmlTemplate(text, item, index) {
          if (config.yAxis.labelFormatter) {
            return config.yAxis.labelFormatter(text, item, index);
          }
          return text;
        }
      },
      line: null,
      tickLine: null,
      grid: {
        type: 'polygon',
        lineStyle: {
          lineDash: null
        }
      }
    });

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        offsetX: config.legend.offsetX || 0,
        offsetY: config.legend.offsetY || 0,
        position: 'bottom',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        // autoPosition: false,
        onHover: _common.noop,
        itemTpl: function itemTpl(value, color, checked, index) {
          var item = _this.rawData && _this.rawData[index] || {};
          var result = config.legend.nameFormatter ? config.legend.nameFormatter(value, _extends({}, item, {
            color: color,
            checked: checked
          }), index) : value;
          return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span></li>';
        }
        // 'g2-legend': Object.assign({
        //   top: size.s3,
        // }, config.legend.align === 'right' ? { right: 0 } : { left: 0 }),
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      crosshairs: null
    });

    if (config.area && config.stack) {
      chart.areaStack().position('x*y').color('type', config.colors).active(false);
      chart.lineStack().position('x*y').color('type', config.colors).style({
        lineJoin: 'round'
      });
    } else if (config.area && !config.stack) {
      chart.area().position('x*y').color('type', config.colors).active(false);
      chart.line().position('x*y').color('type', config.colors).style({
        lineJoin: 'round'
      });
    } else {
      chart.line().position('x*y').color('type', config.colors).style({
        lineJoin: 'round'
      });
    }
    // 曲线默认点
    if (config.symbol && config.area && config.stack) {
      chart.point().adjust('stack').position('x*y').color('type', config.colors).shape('circle').size(3).active(false);
    } else if (config.symbol) {
      chart.point().position('x*y').color('type', config.colors).shape('circle').size(3).active(false);
    }

    chart.render();
  }
};
module.exports = exports['default'];