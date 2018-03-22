'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g2Brush = require('@antv/g2-brush');

var _g2Brush2 = _interopRequireDefault(_g2Brush);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _guide = require('../chartCommon/guide');

var _guide2 = _interopRequireDefault(_guide);

var _rectTooltip = require('../chartCommon/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

require('./G2Line.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
  colors: _normal.color.category_12,
  padding: [40, 5, 32, 44],
  xAxis: {
    type: 'time', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为time时，此字段生效
    labelFormatter: null, //可以强制覆盖，手动设置label
    categories: null,
    autoRotate: false,
    max: null,
    min: null
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    max: null,
    min: null
  },
  legend: {
    align: 'left',
    nameFormatter: null //可以强制覆盖，手动设置label
  },
  tooltip: {
    titleFormatter: null,
    nameFormatter: null,
    valueFormatter: null
  },
  area: false,
  stack: false, //仅Area有效
  spline: false,
  grid: false,
  symbol: false
  // TODO
  // zoom: false,
  // labels: false,
  // mini: false,
  // dataConfig: {
  //   nameKey: 'name',
  //   valueKey: 'value',
  //   // valueKey: ['value1', 'value2'],
  //   typeKey: 'type'
  // }
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var newConfig = (0, _merge2.default)({}, defaultConfig, config);

    // TODO 处理padding
    var defaultPaddingTop = defaultConfig.padding[0];
    var defaultPaddingRight = defaultConfig.padding[1];
    var defaultPaddingBottom = defaultConfig.padding[2];
    var defaultPaddingLeft = defaultConfig.padding[3];
    if (defaultPaddingRight !== 'auto' && Array.isArray(newConfig.yAxis)) {
      defaultPaddingRight = 44;
    }
    if (defaultPaddingTop !== 'auto' && !newConfig.legend) {
      defaultPaddingTop = 16;
    }
    return _extends({}, props, {
      padding: props.padding || config.padding || [defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft],
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data, rawData) {
    var _this = this;

    var config = userConfig;

    if (config.xAxis && config.xAxis.type === 'datetime') {
      config.xAxis.type = 'time';
    }

    var defs = {
      x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
        type: 'time',
        // 折线图X轴的范围默认覆盖全部区域，保证没有空余
        range: [0, 1]
      }, config.xAxis),
      type: {
        type: 'cat'
      }
    };

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        defs['y' + yIndex] = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
          type: 'linear',
          tickCount: 5
        }, axis);
      });
    } else {
      defs.y = (0, _common.propertyAssign)(_common.propertyMap.yAxis, {
        type: 'linear',
        tickCount: 5
      }, config.yAxis);
    }

    chart.source(data, defs);

    var xAxis = {
      title: null, // 不展示坐标轴的标题
      label: {
        autoRotate: config.xAxis.autoRotate,
        formatter: config.xAxis.labelFormatter
      }
    };

    // 网格线
    if (config.grid) {
      xAxis.grid = {
        lineStyle: {
          stroke: _normal.color.colorN13,
          lineWidth: 1
          // lineDash: null
        }
        // hideFirstLine: true
      };
    }
    chart.axis('x', xAxis);

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (axis, yIndex) {
        var yAxis = {
          title: null, // 不展示坐标轴的标题
          line: {
            stroke: (0, _common.getDataIndexColor)(config.colors, _this.rawData, yIndex) || _normal.color.colorN16
          },
          label: {
            formatter: axis.labelFormatter
          }
        };
        if (yIndex !== 0) {
          yAxis.grid = null;
        }

        chart.axis('y' + yIndex, yAxis);
      });
    } else {
      var yAxis = {
        title: null, // 不展示坐标轴的标题
        label: {
          formatter: config.yAxis.labelFormatter
        }
      };

      chart.axis('y', yAxis);
    }

    // 设置图例
    if (config.legend) {
      chart.legend({
        useHtml: true,
        title: null,
        position: 'top',
        // 这个属性文档里没有，设置为false可以让图例不居中，再手动设置定位样式
        autoPosition: false,
        onHover: _common.noop,
        itemTpl: function itemTpl(value, color, checked, index) {
          var item = _this.rawData && _this.rawData[index] || {};
          var result = config.legend.nameFormatter ? config.legend.nameFormatter(value, _extends({}, item, {
            color: color,
            checked: checked
          }), index) : value;
          return '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">' + result + '</span></li>';
        },
        'g2-legend': _extends({
          top: _normal.size.s3
        }, config.legend.align === 'right' ? { right: 0 } : { left: 0 })
      });
    } else {
      chart.legend(false);
    }

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // 区域、堆叠、平滑曲线
    var lineShape = config.spline ? 'smooth' : 'line';
    var areaShape = config.spline ? 'smooth' : 'area';

    if (Array.isArray(config.yAxis)) {
      config.yAxis.forEach(function (asix, yIndex) {
        drawLine(chart, config, lineShape, areaShape, 'y' + yIndex);
      });
    } else {
      drawLine(chart, config, lineShape, areaShape);
    }

    chart.render();

    // G2 3.0 暂不支持框选模式
    if (config.zoom) {
      //   chart.setMode('select'); // 开启框选模式
      //   chart.select('rangeX'); // 选择框选交互形式

      var button = this.resetButton = new ResetButton(chart);

      this.brush = new _g2Brush2.default({
        canvas: chart.get('canvas'),
        chart: chart,
        type: 'X',
        onBrushstart: function onBrushstart() {
          chart.hideTooltip();
        },
        onBrushmove: function onBrushmove() {
          chart.hideTooltip();
          button.show();
        }
      });
    }
  },
  destroy: function destroy() {
    if (this.brush) {
      this.brush.destroy();
    }
    if (this.resetButton) {
      this.resetButton.destroy();
    }
  }
};


function drawLine(chart, config, lineShape, areaShape) {
  var yAxisKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'y';

  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).style({
      lineJoin: 'round'
    });
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  }
}

var ResetButton = function () {
  function ResetButton(chart) {
    _classCallCheck(this, ResetButton);

    this.chart = chart;
    this.isShow = false;
    this.dom = null;

    this.handleClick = this.handleClick.bind(this);
  }

  _createClass(ResetButton, [{
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      this.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      if (this.isShow) {
        return;
      }

      if (this.dom) {
        this.dom.style.display = 'block';
        this.isShow = true;
      } else {
        var chart = this.chart;
        var wrapper = chart.get('wrapperEl');
        var range = chart.get('plotRange');
        if (wrapper && range && range.tr) {
          this.dom = document.createElement('span');
          this.dom.innerText = '重置';
          this.dom.className = 'widgets-reset-button';
          this.dom.style.top = range.tr.y + 'px';
          this.dom.style.right = chart.get('width') - range.tr.x + 'px';
          wrapper.appendChild(this.dom);

          this.isShow = true;

          this.dom.addEventListener('click', this.handleClick);
        }
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.isShow && this.dom) {
        this.chart.get('options').filters = {};
        this.chart.repaint();
        this.dom.style.display = 'none';
        this.isShow = false;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.dom) {
        this.dom.removeEventListener('click', this.handleClick);
        this.dom.parentNode.removeChild(this.dom);
        this.dom = null;
      }
      this.chart = null;
    }
  }]);

  return ResetButton;
}();

module.exports = exports['default'];