'use strict';

// 引入所需要的库和样式

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

require('./G2-base.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [20, 20, 20, 20],
  colors: _normal.color.category_12,
  tooltip: {
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
  init: function init(chart, userConfig, data, rawData) {
    var config = (0, _merge2.default)({}, defaultConfig, userConfig);
    chart.source(data);
    chart.coord('polar');
    chart.axis(false);

    // tooltip
    if (config.tooltip) {
      var tooltipCfg = {
        showTitle: false
        // crosshairs: {},
      };
      chart.tooltip(tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltip:change', function (ev) {
          ev.items.forEach(function (item, index) {
            var raw = rawData && rawData[index] || {};

            if (config.tooltip.valueFormatter) {
              item.value = config.tooltip.valueFormatter(item.value, raw, index, ev.items);
            }
            if (config.tooltip.nameFormatter) {
              item.name = config.tooltip.nameFormatter(item.name, raw, index, ev.items);
            }
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    chart.interval().position('x*y').color('x', config.colors).label('x', {
      offset: -15
    }).style({
      lineWidth: 1,
      stroke: _normal.color.widgetsColorWhite
    });

    chart.render();
  }
};
module.exports = exports['default'];