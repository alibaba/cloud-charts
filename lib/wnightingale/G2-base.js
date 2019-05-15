'use strict';

// 引入所需要的库和样式

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _index2 = _interopRequireDefault(_index);

require('./G2-base.scss');

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [20, 20, 40, 20],
  colors: _index2.default.category_12,
  label: {
    key: 'x'
  },
  legend: {
    position: 'bottom',
    align: 'center',
    nameFormatter: null
  },
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
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = (0, _merge2.default)({}, defaultConfig, userConfig);
    chart.source(data);
    chart.coord('polar');

    // 设置图例
    _rectLegend2.default.call(this, chart, config, {
      itemTpl: function itemTpl(value, itemColor, checked, index) {
        var item = _this.rawData && _this.rawData[index] || {};
        var result = config.legend.nameFormatter ? config.legend.nameFormatter(value, _extends({}, item, {
          itemColor: itemColor,
          checked: checked
        }), index) : value;
        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span></li>';
      }
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
            var raw = _this.rawData && _this.rawData[index] || {};

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

    if (config.axis) {
      chart.axis('x', {
        grid: {
          align: 'center',
          hideFirstLine: false,
          hideLastLine: false
        },
        label: {
          offset: 10,
          autoRotate: true,
          textStyle: {
            textAlign: 'center'
          }
        }
      });

      chart.axis('y', {
        tickLine: null,
        label: null,
        line: null
      });
    } else {
      chart.axis(false);
    }

    var geom = chart.interval().position('x*y').color('x', config.colors).style({
      lineWidth: 1,
      stroke: _index2.default['widgets-color-white']
    });

    (0, _label2.default)(geom, config, config.label.key, {
      offset: -15
    });

    chart.render();
  }
};
module.exports = exports['default'];