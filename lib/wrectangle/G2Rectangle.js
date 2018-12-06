'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dataSet = require('@antv/data-set');

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

var _label = require('../common/label');

var _label2 = _interopRequireDefault(_label);

require('./G2Rectangle.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  // 这里需要倒序排列
  colors: _index.color.order_10.slice().reverse(),
  padding: [40, 10, 32, 44],
  xAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    autoRotate: false,
    max: null,
    min: null
  },
  yAxis: {
    labelFormatter: null, // 可以强制覆盖，手动设置label
    max: null,
    min: null
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  },
  bin: {
    fields: ['x', 'y'],
    bins: [20, 10] // 两个方向上的分箱个数
    // binWidth: [ 10, 1000 ],    // 两个方向上的分箱步长（会覆盖bins的配置）
    // offset: [ 0, 0 ],

  },
  grid: false,
  label: false
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);

    // TODO 处理padding
    // let defaultPaddingTop = defaultConfig.padding[0];
    // let defaultPaddingRight = defaultConfig.padding[1];
    // const defaultPaddingBottom = defaultConfig.padding[2];
    // const defaultPaddingLeft = defaultConfig.padding[3];
    // if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
    //   defaultPaddingRight = 44;
    // }
    // if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
    //   defaultPaddingTop = 16;
    // }
    return _extends({}, props, {
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    var ds = new _dataSet.DataSet();
    var rectangleDataView = ds.createView('diamond').source(data).transform((0, _common.propertyAssign)(['fields', 'bins', 'binWidth', 'offset', 'sizeByCount'], {
      type: 'bin.rectangle'
    }, config.bin));

    this.rectangleDataView = rectangleDataView;

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };

    chart.source(rectangleDataView, defs);

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    // 设置单个Y轴
    _rectYAxis2.default.call(this, chart, config);

    // 设置图例
    chart.legend(false);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      showTitle: false,
      crosshairs: null
    });

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    var geom = chart.polygon().position('x*y').color('count', config.colors).tooltip('x*y*count', function (x, y, count) {
      return {
        // title: x,
        name: '数量',
        value: count
      };
    });

    (0, _label2.default)(geom, config, 'count', {
      offset: 0
    });

    chart.render();
  },
  changeData: function changeData(chart, newConfig, data) {
    if (this.rectangleDataView) {
      this.rectangleDataView.source(data);
    }
  }
};
module.exports = exports['default'];