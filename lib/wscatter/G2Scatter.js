'use strict';

// 引入所需要的库和样式

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _guide = require('../chartCommon/guide');

var _guide2 = _interopRequireDefault(_guide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [40, 5, 32, 44],
  colors: _normal.color.category_12,
  xAxis: {
    type: 'linear',
    mask: 'YYYY-MM-DD HH:mm:ss',
    autoRotate: false
  },
  yAxis: {
    min: 0
  },
  jitter: false,
  tooltip: true,
  legend: true
};
var colorMap = _normal.color.category_12;
var setAxis = function setAxis(chart, config) {
  var xAxis = {
    title: null, // 不展示坐标轴的标题
    label: {
      autoRotate: config.xAxis.autoRotate,
      formatter: config.xAxis.labelFormatter
    }
  };

  if (config.jitter) {
    xAxis.grid = {
      align: 'center', // 网格顶点从两个刻度中间开始
      lineStyle: {
        stroke: _normal.color.colorN13,
        lineWidth: 1
        // lineDash: [3, 3]
      }
    };
  }

  // 扰动点图不能打开垂直网格线
  if (config.grid && !config.jitter) {
    xAxis.grid = {
      lineStyle: {
        stroke: _normal.color.colorN13,
        lineWidth: 1
      }
    };
  }

  chart.axis('x', xAxis);

  chart.axis('y', {
    title: null,
    label: {
      formatter: config.yAxis.labelFormatter
    }
  });
};

var setSource = function setSource(chart, config, data) {
  var defs = {
    x: (0, _common.propertyAssign)(_common.propertyMap.xAxis, {
      type: config.jitter ? 'cat' : 'linear'
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
};

var chartRender = function chartRender(chart, config) {
  var typeArr = [];

  var geom = chart.point().color('type', function (val) {
    var curIndex = void 0;
    if (!typeArr.includes(val)) {
      curIndex = typeArr.length;
      typeArr.push(val);
    } else {
      curIndex = typeArr.indexOf(val);
    }

    return colorMap[curIndex];
  }).position('x*y').size(4).shape('circle').active(false);

  if (config.jitter) {
    geom.adjust('jitter');
  }

  chart.render();
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;

    var preConfig = {};
    if (config.jitter) {
      preConfig.xAxis = {
        type: 'cat'
      };
    }
    var newConfig = (0, _merge2.default)({}, defaultConfig, preConfig, config);

    return _extends({}, props, {
      padding: props.padding || config.padding || (newConfig.legend ? defaultConfig.padding : [16, 5, 32, 44]),
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data, rawData) {
    var config = userConfig;
    setSource(chart, config, data);

    setAxis(chart, config);

    setToolTip.call(this, chart, config);

    setLegend.call(this, chart, config, this.chartDom);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    chartRender(chart, config);
  }
};


var setLegend = function setLegend(chart, config, chartNode) {
  var _this = this;

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
        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span></li>';
      },
      'g2-legend': _extends({
        top: _normal.size.s3
      }, config.legend.align === 'right' ? { right: 0 } : { left: 0 })
    });
  } else {
    chart.legend(false);
  }
};

var setToolTip = function setToolTip(chart, config) {
  var _this2 = this;

  if (config.tooltip) {
    var tooltipCfg = {
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: null,
      custom: true,
      containerTpl: '<div class="g2-tooltip">' + '<p class="g2-tooltip-title">{name}</p>' + '<div class="g2-tooltip-list"></div>' + '</div>', // tooltip的外层模板
      itemTpl: '<div class="g2-tooltip-list-item"><span style="color:{color}"></span><span>{value}</span></div>', // 支持的字段 index,color,name,value
      'g2-tooltip': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: _normal.color.colorN24
      }, // 设置 tooltip 的 css 样式
      'g2-tooltip-title': {
        color: _normal.color.colorN24,
        marginRight: _normal.size.s3,
        marginTop: 0,
        fontSize: _normal.size.s3
      },
      'g2-tooltip-list-item': {
        marginTop: 0
      }
    };
    chart.tooltip(tooltipCfg);
    if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
      chart.on('tooltip:change', function (ev) {
        if (config.tooltip.titleFormatter) {
          ev.items[0].title = config.tooltip.titleFormatter(ev.items[0].title, ev.items);
        }

        ev.items.forEach(function (item, index) {
          var raw = _this2.rawData && _this2.rawData[index] || {};

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, raw, index, ev.items);
          }
          // if (config.tooltip.nameFormatter) {
          //   item.name = config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin);
          // }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
};
module.exports = exports['default'];