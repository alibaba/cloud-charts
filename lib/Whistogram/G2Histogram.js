'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dataSet = require('@antv/data-set');

var _g2Factory = require('../common/g2Factory');

var _g2Factory2 = _interopRequireDefault(_g2Factory);

var _errorWrap = require('../common/errorWrap');

var _errorWrap2 = _interopRequireDefault(_errorWrap);

var _merge = require('../common/merge');

var _merge2 = _interopRequireDefault(_merge);

var _index = require('../themes/index');

var _index2 = _interopRequireDefault(_index);

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

var _geomSize = require('../common/geomSize');

var _geomSize2 = _interopRequireDefault(_geomSize);

require('./G2Histogram.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function computerData(config, data) {
  var _config$bin = config.bin,
      bins = _config$bin.bins,
      binWidth = _config$bin.binWidth,
      offset = _config$bin.offset;


  var dv = new _dataSet.View().source(data);
  dv.transform({
    type: 'bin.histogram',
    field: 'x',
    bins: bins,
    binWidth: binWidth,
    offset: offset,
    groupBy: ['type', 'visible'],
    as: ['x', 'y']
  });

  if (config.normalize) {
    var total = dv.rows.reduce(function (acc, cur) {
      return acc + cur.y;
    }, 0);
    dv.transform({
      type: 'map',
      callback: function callback(row) {
        row.y = row.y / total;
        return row;
      }
    });
  }

  return dv;
}

exports.default = /*#__PURE__*/(0, _errorWrap2.default)((0, _g2Factory2.default)('G2Histogram', {
  // convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index2.default.category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        // type: "cat",
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false
        // 坐标轴粒度
        // tickInterval: 1,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null
      },
      legend: {
        align: "left",
        nameFormatter: null // 可以强制覆盖，手动设置label
      },
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null
      },
      column: true,
      grid: false,
      size: null,
      label: false,
      innerRadius: 0,
      // 分箱粒度
      bin: {
        // bins: 10, // 分箱个数
        binWidth: 1, // 分箱步长（会覆盖bins的配置）
        offset: 0
      },
      // 是否归一化
      normalize: false
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, this.defaultConfig, config);

    // TODO 处理padding
    return _extends({}, props, {
      padding: _common.defaultPadding.apply(undefined, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig;

    // 设置数据度量
    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear'
        // tickCount: 5,
      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };

    var dataView = computerData(config, data);
    this.dataView = dataView;

    chart.source(dataView, defs);

    // 设置Y轴
    _rectYAxis2.default.call(this, chart, config);

    // 设置X轴
    _rectXAxis2.default.call(this, chart, config);

    // 设置图例
    _rectLegend2.default.call(this, chart, config, null, false, "type");

    _legendFilter2.default.call(this, chart, config);

    // tooltip
    _rectTooltip2.default.call(this, chart, config, {
      crosshairs: config.polar ? undefined : {}
    });

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // 设置坐标系：极坐标/直角坐标
    var chartCoord = config.polar ? chart.coord("polar", {
      innerRadius: config.innerRadius || 0
    }) : chart.coord();

    // 横向柱状图
    if (!config.column) {
      chartCoord.transpose();
    }

    drawHist(chart, config, config.colors);

    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    if (this.dataView) {
      this.dataView.source(data);
    }
    // chart.changeData(data);
  }
}));


function drawHist(chart, config, colors) {
  var field = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "type";
  var size = config.size;

  var geomStyle = config.geomStyle || {};
  var geom = chart.intervalStack().position('x*y').color(field, colors);

  if (size) {
    var sizeConfig = (0, _geomSize2.default)(size, 20, "y", "x*y*type*extra");
    geom.size.apply(geom, sizeConfig);
  }

  geom.style('x*y*type*extra', _extends({}, geomStyle));

  (0, _label2.default)(geom, config);
}