'use strict';

// 引入所需要的库和样式

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _g = require('@antv/g2');

var _g2 = _interopRequireDefault(_g);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _normal = require('../theme/normal');

var _common = require('../chartCommon/common');

var _guide = require('../chartCommon/guide');

var _guide2 = _interopRequireDefault(_guide);

require('./G2Scatter.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 建议将默认配置放在外层，方便后续维护
var defaultConfig = {
  padding: [32, 5, 32, 45],
  colors: [],
  xAxis: {
    type: 'linear',
    mask: 'YYYY-MM-DD HH:mm:ss'
  },
  yAxis: {
    min: 0
  },
  tooltip: true,
  legend: true
};

var colorMap = ['#2889EC', '#F6A71F', '#EF5350', '#4AD051', '#8B73CC'];

var setAxis = function setAxis(chart, config) {
  var xFormator = config.xFormator;


  chart.axis('x', {
    // 格式化坐标轴的显示
    label: {
      autoRotate: false
    },
    textStyle: {
      textAlign: 'center', // 文本对齐方向，可取值为： start middle end
      fill: '#999', // 文本的颜色
      fontSize: '12' // 文本大小
    },
    formatter: xFormator
  });
  chart.axis('y', {
    tickLine: null,
    title: null,
    line: null,
    labels: {
      autoRotate: false,
      label: {
        textAlign: 'center',
        fill: '#333',
        fontSize: 12
      }
    },
    grid: {
      line: {
        stroke: '#F2F3F7',
        lineWidth: 1,
        lineDash: [1, 0]
      }
    },
    formatter: function formatter(value) {
      return xFormator ? xFormator(value) : value;
    }
  });
};

var setSource = function setSource(chart, config, data) {
  chart.source(data, { x: config.xAxis, y: config.yAxis });
};

var chartRender = function chartRender(chart, config) {
  var index = 0;
  var typeArr = [];

  chart.point().color('type', function (val) {
    var curIndex = void 0;
    if (!typeArr.includes(val)) {
      curIndex = typeArr.length;
      typeArr.push(val);
    } else {
      curIndex = typeArr.indexOf(val);
    }

    return colorMap[curIndex];
  }).position('x*y').size(4).shape('circle');

  chart.render();
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config;


    return _extends({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding
    });
  },
  init: function init(chart, userConfig, data, rawData) {
    var config = (0, _merge2.default)({}, defaultConfig, userConfig);
    setSource(chart, config, data);

    setAxis(chart, config);

    setToolTip(chart, config);

    setLegend(chart, config, rawData, this.chartDom);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    chartRender(chart, config);
  }
};


var setLegend = function setLegend(chart, config, rawData, chartNode) {
  if (config.legend) {
    chart.legend({
      useHtml: true,
      title: null,
      position: 'top',
      containerTpl: '<div class="g2-legend" style="position:absolute;top:0;right:60px;width:auto;">' + '<h4 class="g2-legend-title"></h4>' + '<ul class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></ul>' + '</div>',
      itemTpl: function itemTpl(value, color, checked, index) {
        var item = rawData && rawData[index] || {};
        var result = config.legend.nameFormatter ? config.legend.nameFormatter(value, _extends({}, item, {
          color: color,
          checked: checked
        }), index) : value;
        return '' + ('<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' + '<i class="g2-legend-marker" style="background-color:{color};"></i>' + '<span class="g2-legend-text">') + result + '</span></li>';
      },
      'g2-legend': {
        position: 'absolute',
        overflow: 'auto',
        fontFamily: _normal.fonts.fontFamilyBase,
        fontSize: _normal.fonts.fontSizeBaseCaption,
        lineHeight: _normal.fonts.fontSizeBaseCaption,
        color: _normal.color.colorText14,
        left: '20px',
        top: 0
      },
      'g2-legend-list': {},
      'g2-legend-list-item': {
        marginBottom: _normal.size.s3,
        marginRight: _normal.size.s3
      },
      'g2-legend-marker': {
        width: '6px',
        height: '6px',
        marginRight: _normal.size.s1
      }
    });

    _g2.default.DomUtil.requestAnimationFrame(function () {
      var legendDom = chartNode.querySelector('.g2-legend');
      if (config.legend.align === 'right') {
        legendDom && legendDom.classList.add('legend-align-right');
      } else {
        legendDom && legendDom.classList.add('legend-align-left');
      }
    });
  } else {
    chart.legend(false);
  }
};

var setToolTip = function setToolTip(chart, config) {
  if (config.tooltip) {
    var tooltipCfg = {
      // crosshairs 空对象不可省略，否则在混合图表中会没有crosshairs line
      crosshairs: null,
      custom: true,
      containerTpl: '<div class="g2-tooltip">' + '<p class="g2-tooltip-title">{name}</p>' + '<div class="g2-tooltip-list"></div>' + '</div>', // tooltip的外层模板
      itemTpl: '<div class="g2-tooltip-list-item"><span style="color:{color}"></span><span>{value}</span></div>', // 支持的字段 index,color,name,value
      'g2-tooltip': {
        position: 'absolute',
        visibility: 'hidden',
        border: '1px solid #efefef',
        backgroundColor: 'white',
        padding: '12px',
        transition: 'top 200ms,left 200ms',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#333'
      }, // 设置 tooltip 的 css 样式
      'g2-tooltip-title': {
        color: '#333',
        marginRight: '12px',
        fontSize: '12px'
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
          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(item.value, ev.items, index, item.point._origin);
          }
          if (config.tooltip.nameFormatter) {
            item.name = config.tooltip.nameFormatter(item.name, ev.items, index, item.point._origin);
          }
        });
      });
    }
  } else {
    chart.tooltip(false);
  }
};

var getLegendNode = function getLegendNode(target) {
  if (target.tagName === 'LI') return target;
  return target.parentNode;
};
module.exports = exports['default'];