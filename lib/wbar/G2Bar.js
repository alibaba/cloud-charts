'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _g2Brush = require('@antv/g2-brush');

var _g2Brush2 = _interopRequireDefault(_g2Brush);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../theme/index');

var _common = require('../common/common');

var _guide = require('../common/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectXAxis = require('../common/rectXAxis');

var _rectXAxis2 = _interopRequireDefault(_rectXAxis);

var _rectYAxis = require('../common/rectYAxis');

var _rectYAxis2 = _interopRequireDefault(_rectYAxis);

var _rectTooltip = require('../common/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

var _rectLegend = require('../common/rectLegend');

var _rectLegend2 = _interopRequireDefault(_rectLegend);

var _legendFilter = require('../common/legendFilter');

var _legendFilter2 = _interopRequireDefault(_legendFilter);

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

var _ResetButton = require('../common/ResetButton');

var _ResetButton2 = _interopRequireDefault(_ResetButton);

require('./G2Bar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  colors: _index.color.category_12,
  padding: [40, 5, 32, 44],
  xAxis: {
    type: 'cat',
    labelFormatter: null, // 可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: null,
    min: null
  },
  legend: {
    align: 'left',
    nameFormatter: null // 可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null
  },
  column: true,
  dodgeStack: false,
  stack: false,
  stackReverse: true,
  marginRatio: 0,
  grid: false,
  zoom: false,
  facet: false,
  size: null,
  label: false,
  polar: false
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var _this = this;

    var config = userConfig;

    // 设置数据度量
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'cat'
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat',
        sync: true
      },
      facet: {
        sync: true
      }
    };

    chart.source(data, defs);

    // 设置单个Y轴
    if (!config.facet) {
      _rectYAxis2.default.call(this, chart, config);
    }

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    // 设置图例
    _rectLegend2.default.call(this, chart, config);

    _legendFilter2.default.call(this, chart, config);

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

    // 横向柱状图
    if (!config.column) {
      chart.coord().transpose();
    }

    if (config.facet) {
      var facetConfig = _typeof(config.facet) === 'object' ? config.facet : {
        type: 'mirror',
        transpose: false,
        padding: [20, 0, 20, 0]
      };
      var self = this;
      chart.facet(facetConfig.type, {
        fields: ['facet'],
        transpose: facetConfig.transpose,
        padding: facetConfig.padding,
        rowTitle: {
          offsetX: 15,
          style: {
            fontSize: 12,
            textAlign: 'center',
            rotate: 90,
            fill: _index.color.widgetsAxisLabel
          }
        },
        eachView: function eachView(view, facet) {
          var yAxisCustomConfig = null;

          // 为 labelFormatter 的第二个参数添加分面信息
          if (config.yAxis && config.yAxis.visible !== false) {
            var _ref = config.yAxis || {},
                labelFormatter = _ref.labelFormatter;

            if (labelFormatter) {
              yAxisCustomConfig = {
                label: {
                  formatter: function formatter() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                      args[_key] = arguments[_key];
                    }

                    args[1] = _extends({
                      facet: facet.colValue || facet.rowValue
                    }, args[1]);
                    return labelFormatter.apply(undefined, args);
                  }
                }
              };
            }
          }

          _rectYAxis2.default.call(self, view, config, 'y', yAxisCustomConfig);

          drawBar(view, config, config.colors, 'type*facet');
        }
      });
    } else {
      drawBar(chart, config, config.colors);
    }

    // if (config.stack) {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'stack',
    //     reverseOrder: !config.stackReverse, // 层叠顺序倒序
    //   }]);
    // } else {
    //   chart.interval().position('x*y').color('type', config.colors).adjust([{
    //     type: 'dodge',
    //     marginRatio: 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    //   }]);
    // }

    chart.render();

    // 拖拽缩放
    if (config.zoom) {
      var button = new _ResetButton2.default(chart, this.language);
      this.resetButton = button;

      this.brush = new _g2Brush2.default({
        canvas: chart.get('canvas'),
        chart: chart,
        type: 'X',
        onBrushstart: function onBrushstart() {
          chart.hideTooltip();
        },

        onBrushmove: function onBrushmove() {
          chart.hideTooltip();
          button.show(_this.language);
        }
      });
    }
  },
  destroy: function destroy() {
    // 销毁时需要额外销毁缩放重置按钮
    if (this.brush) {
      this.brush.destroy();
    }
    if (this.resetButton) {
      this.resetButton.destroy();
    }
  }
};


function drawBar(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'type';
  var stack = config.stack,
      stackReverse = config.stackReverse,
      marginRatio = config.marginRatio,
      dodgeStack = config.dodgeStack,
      size = config.size;

  var geom = null;
  if (dodgeStack) {
    geom = chart.interval().position(['x', 'y']).color(field, colors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      dodgeBy: 'dodge'
    }, {
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序
    }]);
  } else if (stack) {
    // 堆叠
    geom = chart.interval().position(['x', 'y']).color(field, colors).adjust([{
      type: 'stack',
      reverseOrder: !stackReverse // 层叠顺序倒序
    }]);
  } else {
    // 分组
    geom = chart.interval().position(['x', 'y']).color(field, colors).adjust([{
      type: 'dodge',
      marginRatio: marginRatio || 0 // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
    }]);
  }

  // TODO 暂时没有更好的方案
  if (size) {
    var _geom;

    var sizeConfig = size || 20;
    if (Array.isArray(size)) {
      sizeConfig = ['y', size];
    } else if (_g2.default.Util.isFunction(size)) {
      sizeConfig = ['x*y*type*facet', size];
    } else if ((typeof size === 'undefined' ? 'undefined' : _typeof(size)) === 'object') {
      sizeConfig = [sizeConfig.field, sizeConfig.param];
    } else {
      sizeConfig = [size];
    }
    (_geom = geom).size.apply(_geom, sizeConfig);
  }

  (0, _label2.default)(geom, config);
}
module.exports = exports['default'];