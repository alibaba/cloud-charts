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

var _common = require('../common/common');

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _legendFilter = require('../common/legendFilter');

var _legendFilter2 = _interopRequireDefault(_legendFilter);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _drawLine = require('../common/drawLine');

var _drawLine2 = _interopRequireDefault(_drawLine);

require('./G2Radar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 对外暴露一个对象，除了init方法必选外，其余均为可选项，按组件需要选择性使用。
// 方法运行时的this指向图表实例，所以可以在this上挂载需要保留的数据。
exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Radar', {
  getDefaultConfig: function getDefaultConfig() {
    return {
      padding: [20, 20, 40, 20],
      colors: _index2.default.category_12,
      xAxis: {
        labelFormatter: null // 可以强制覆盖，手动设置label
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        // max: 100,
        min: 0
      },
      radius: 0.8,
      area: false,
      symbol: false,
      label: false,
      spline: false,
      // stack: false,
      legend: {
        position: 'bottom',
        align: 'center',
        nameFormatter: null
      },
      tooltip: {
        titleFormatter: null,
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

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        // type: 'cat',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
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

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config, {
      line: null,
      tickLine: null,
      grid: {
        lineStyle: {
          lineDash: null
        }
      }
    });
    // chart.axis('x', {
    //   label: {
    //     formatter: config.xAxis.labelFormatter,
    //   },
    //   line: null,
    //   tickLine: null,
    //   grid: {
    //     lineStyle: {
    //       lineDash: null,
    //     },
    //     // hideFirstLine: false
    //   },
    // });
    // 设置Y轴
    _rectYAxis2.default.call(this, chart, config, 'y', {
      label: {
        offset: 8,
        textStyle: {
          fill: _index2.default['widgets-axis-label'],
          textAlign: 'right' // 文本右对齐
        },
        formatter: config.yAxis.labelFormatter
        // 之前使用 htmlTemplate 是为了覆盖在line图形之上，和视觉确认后不需要这么做，直接使用默认 formatter 即可。
        // htmlTemplate(text, item, index) {
        //   if (config.yAxis.labelFormatter) {
        //     return config.yAxis.labelFormatter(text, item, index);
        //   }
        //   return `<span style="color: ${themes['widgets-axis-label']}">${text}</span>`;
        // }
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
    _rectLegend2.default.call(this, chart, config);

    _legendFilter2.default.call(this, chart, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      crosshairs: null
    });

    (0, _drawLine2.default)(chart, config);

    chart.render();
  }
}));