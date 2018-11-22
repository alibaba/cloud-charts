'use strict';

// 引入所需要的库和样式

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _common = require('../common/common');

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

require('./G2Radar.scss');

var _drawLine = require('../common/drawLine');

var _drawLine2 = _interopRequireDefault(_drawLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [20, 20, 40, 20],
  colors: _index.color.category_12,
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
  label: false,
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
          fill: _index.color.widgetsAxisLabel,
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
        itemTpl: function itemTpl(value, itemColor, checked, index) {
          var item = _this.rawData && _this.rawData[index] || {};
          var result = config.legend.nameFormatter ? config.legend.nameFormatter(value, _extends({}, item, {
            itemColor: itemColor,
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

    var lineShape = config.spline ? 'smooth' : 'line';
    var areaShape = config.spline ? 'smooth' : 'area';

    (0, _drawLine2.default)(chart, config, lineShape, areaShape);

    chart.render();
  }
};
module.exports = exports['default'];