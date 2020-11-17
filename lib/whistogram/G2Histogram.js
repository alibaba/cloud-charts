'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _dataSet = require("@antv/data-set");

var _g2Factory = _interopRequireDefault(require("../common/g2Factory"));

var _errorWrap = _interopRequireDefault(require("../common/errorWrap"));

var _merge = _interopRequireDefault(require("../common/merge"));

var _index = _interopRequireDefault(require("../themes/index"));

var _common = require("../common/common");

var _guide = _interopRequireDefault(require("../common/guide"));

var _rectXAxis = _interopRequireDefault(require("../common/rectXAxis"));

var _rectYAxis = _interopRequireDefault(require("../common/rectYAxis"));

var _rectTooltip = _interopRequireDefault(require("../common/rectTooltip"));

var _rectLegend = _interopRequireDefault(require("../common/rectLegend"));

var _legendFilter = _interopRequireDefault(require("../common/legendFilter"));

var _label = _interopRequireDefault(require("../common/label"));

var _geomSize = _interopRequireDefault(require("../common/geomSize"));

require("./G2Histogram.scss");

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

var _default = /*#__PURE__*/(0, _errorWrap["default"])((0, _g2Factory["default"])('G2Histogram', {
  // convertData: false,
  getDefaultConfig: function getDefaultConfig() {
    return {
      colors: _index["default"].category_12,
      padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        // type: "cat",
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false // 坐标轴粒度
        // tickInterval: 1,

      },
      yAxis: {
        labelFormatter: null,
        // 可以强制覆盖，手动设置label
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
        binWidth: 1,
        // 分箱步长（会覆盖bins的配置）
        offset: 0
      },
      // 是否归一化
      normalize: false
    };
  },
  beforeInit: function beforeInit(props) {
    var config = props.config;
    var newConfig = (0, _merge["default"])({}, this.defaultConfig, config); // TODO 处理padding

    return Object.assign({}, props, {
      padding: _common.defaultPadding.apply(void 0, [props.padding || config.padding, newConfig].concat(this.defaultConfig.padding)),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data) {
    var config = userConfig; // 设置数据度量

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {// 折线图X轴的范围默认覆盖全部区域，保证没有空余
        // range: [0, 1],
      }, config.xAxis),
      y: (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear' // tickCount: 5,

      }, config.yAxis),
      type: {
        type: 'cat'
      }
    };
    var dataView = computerData(config, data);
    this.dataView = dataView;
    chart.source(dataView, defs); // 设置Y轴

    _rectYAxis["default"].call(this, chart, config); // 设置X轴


    _rectXAxis["default"].call(this, chart, config); // 设置图例


    _rectLegend["default"].call(this, chart, config, null, false, "type");

    _legendFilter["default"].call(this, chart, config); // tooltip


    _rectTooltip["default"].call(this, chart, config, {
      crosshairs: config.polar ? undefined : {}
    }); // 绘制辅助线，辅助背景区域


    (0, _guide["default"])(chart, config); // 设置坐标系：极坐标/直角坐标

    var chartCoord = config.polar ? chart.coord("polar", {
      innerRadius: config.innerRadius || 0
    }) : chart.coord(); // 横向柱状图

    if (!config.column) {
      chartCoord.transpose();
    }

    drawHist(chart, config, config.colors);
    chart.render();
  },
  changeData: function changeData(chart, config, data) {
    if (this.dataView) {
      this.dataView.source(data);
    } // chart.changeData(data);

  }
}));

exports["default"] = _default;

function drawHist(chart, config, colors, field) {
  if (field === void 0) {
    field = "type";
  }

  var size = config.size;
  var geomStyle = config.geomStyle || {};
  var geom = chart.intervalStack().position('x*y').color(field, colors);

  if (size) {
    var sizeConfig = (0, _geomSize["default"])(size, 20, "y", "x*y*type*extra");
    geom.size.apply(geom, sizeConfig);
  }

  geom.style('x*y*type*extra', (0, _extends2["default"])({}, geomStyle));
  (0, _label["default"])(geom, config);
}