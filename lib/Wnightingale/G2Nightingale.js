'use strict';

// 引入所需要的库和样式

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

require('./G2Nightingale.css');

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Nightingale', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      padding: [20, 20, 20, 20],
      colors: _index2.default.category_12,
      cycle: false,
      innerRadius: 0.5, // 内环半径大小，仅cycle为true时可用
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
  },

  // 初始化前对props的预处理函数
  beforeInit: function beforeInit(props) {
    var config = props.config;
    // TODO 处理padding

    return _extends({}, props, {
      padding: props.padding || config.padding || this.defaultConfig.padding
    });
  },

  // 图表绘制主函数，必选
  init: function init(chart, userConfig, data) {
    var config = (0, _merge2.default)({}, this.defaultConfig, userConfig);
    chart.source(data);
    chart.coord('polar', {
      innerRadius: config.cycle ? Math.max(Math.min(config.innerRadius, 1), 0) : 0
    });

    // 设置图例
    _rectLegend2.default.call(this, chart, config, null, true);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

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

    var geomStyle = config.geomStyle || {};
    var geom = chart.interval().position('x*y').color('x', config.colors).style('x*y*extra', _extends({
      lineWidth: 1,
      stroke: _index2.default['widgets-color-background']
    }, geomStyle));

    (0, _label2.default)(geom, config, config.label.key || 'x', {
      offset: -15
    });

    chart.render();
  }
}));