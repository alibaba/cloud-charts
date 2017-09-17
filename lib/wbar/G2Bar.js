'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require('../chartCommon/colors');

var _colors2 = _interopRequireDefault(_colors);

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _g = require('g2');

var _g2 = _interopRequireDefault(_g);

require('./index.scss');

var _common = require('../common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = _g2.default.Util;


var defaultConfig = {
  padding: [32, 5, 32, 45],
  xAxis: {
    labelFormatter: null //可以强制覆盖，手动设置label
  },
  yAxis: {
    labelFormatter: null, //可以强制覆盖，手动设置label
    max: null,
    min: null
    // bgArea: [], // TODO 辅助区域后期需要加上
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
  // clickable: false,
  // type: 'line',
  stack: false,
  grid: false,
  column: false,
  polar: false,
  max: null
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config,
        plotCfg = props.plotCfg;

    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },
  init: function init(chart, userConfig, data) {
    var config = (0, _merge2.default)({}, defaultConfig, userConfig);

    var defs = {
      type: {
        type: 'cat'
      },
      value: {
        max: config.yAxis.max, // 自定义最大值
        min: config.yAxis.min // 自定义最小值
      },
      count: {
        max: config.max
      }
    };

    chart.source(data, defs);

    var valueAxis = {
      title: null, // 不展示 xDim 对应坐标轴的标题
      line: {
        lineWidth: 0 // 设置线的宽度
      },
      tickLine: {
        lineWidth: 0
      },
      formatter: config.yAxis.labelFormatter,
      grid: {
        line: {
          stroke: '#DCDEE3',
          lineWidth: 1,
          lineDash: [4, 0]
        }
      },
      labels: {
        label: {
          fill: '#989898'
        }
      }
    };

    var nameAxis = {
      title: null, // 不展示 xDim 对应坐标轴的标题
      tickLine: {
        lineWidth: 0
      },
      line: {
        stroke: '#DCDEE3'
      },
      formatter: config.xAxis.labelFormatter,
      labels: {
        label: {
          fill: '#989898'
        }
      }
    };

    // 网格线
    if (config.grid) {
      valueAxis = (0, _merge2.default)({}, valueAxis, {
        line: {
          lineWidth: 1, // 设置线的宽度
          stroke: '#DCDEE3'
        }
      });
      nameAxis = (0, _merge2.default)({}, nameAxis, {
        grid: {
          line: {
            stroke: '#DCDEE3',
            lineWidth: 1,
            lineDash: [4, 0]
          }
        }
      });
    }
    chart.axis('value', valueAxis);
    chart.axis('name', nameAxis);

    if (config.polar) {
      chart.coord('theta', {
        inner: 0.6
      });

      chart.point().position('name*0').color('name').shape('circle');
      chart.interval().position('name*value').color('name').shape('line').size(8); // 线状柱状图
      chart.point().position('name*value').color('name').shape('circle');

      // for (let i = 0, l = data.length; i < l; i++) {
      //   let obj = data[i];
      //   chart.guide().text([obj.name, 0], obj.name, {
      //     textAlign: 'right'
      //   });
      // }
      // chart.guide().text([0, 0], 'Music', {
      //   textAlign: 'center',
      //   fontSize: 24,
      // });
    } else {
      // 横向柱状图
      if (config.column) {
        chart.coord('rect').transpose();
      }
      // 堆叠
      if (config.stack) {
        chart.intervalStack().position('name*value').color('type');
      } else {
        chart.intervalDodge().position('name*value').color('type');
      }
    }

    // tooltip
    if (config.tooltip) {
      var tooltipCfg = {
        custom: true,
        offset: 8,
        crosshairs: {
          type: 'y' // 启用水平方向的辅助线
        },
        crossLine: {
          stroke: '#dddddd',
          lineWidth: 1
        },
        padding: [12, 12, 12, 12],
        html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="ac-title"></h4><ul class="ac-list"></ul></div>',
        itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>'
      };
      chart.tooltip(true, tooltipCfg);
      if (config.tooltip.titleFormatter || config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltipchange', function (ev) {
          ev.items.forEach(function (item, i) {
            item.title = config.tooltip.titleFormatter ? config.tooltip.titleFormatter(item.title) : item.title;
            item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value, items, i, item) : item.value;
            item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name, items, i, item) : item.name;
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    // 设置图例
    chart.legend(false);

    chart.render();

    // 自定义图例html
    if (config.legend) {
      var id = chart._attrs.id;
      var chartNode = document.getElementById(id);
      chartNode.style.position = 'relative';
      var geom = chart.getAllGeoms()[0]; // 获取所有的图形
      var _items = geom.get('frames'); // 获取图形对应的数据
      var stash = {};

      var ulNode = document.createElement('ul');
      ulNode.classList.add('ac-bar-legend');
      // ulNode.style.top = config.padding[0] + 'px';
      if (config.legend.align === 'right') {
        ulNode.style.right = config.padding[1] + 'px';
      } else {
        ulNode.style.left = 5 + 'px';
      }
      ulNode.innerHTML = '';

      for (var i = 0, l = _items.length; i < l; i++) {
        var item = _items[i];
        var itemData = item.data[0];
        if (!itemData) {
          return;
        };
        var color = itemData.color;
        if (!itemData._origin) {
          return;
        }
        var type = itemData._origin.type;
        var name = itemData._origin.name;
        var value = itemData._origin.value;

        var typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type;

        var liHtml = '<li class="item" data-id="' + type + '"><i class="dot" style="background:' + color + ';"></i><span>' + typeFormatter + '</span></li>';
        ulNode.innerHTML += liHtml;
        chartNode.appendChild(ulNode);

        stash[type] = {
          item: item,
          color: color,
          name: type,
          isChecked: true,
          index: i
        };
      }
      var dotDom = chartNode.getElementsByClassName('dot');
      Array.prototype.forEach.call(ulNode.querySelectorAll('li'), function (item) {
        item.addEventListener('click', function (e) {
          var node = getLegendNode(e.target);
          var type = node.getAttribute('data-id');
          (0, _common.g2LegendFilter)(type, stash, Util, dotDom, chart);
        });
      });
    }
  }
};


function getLegendNode(target) {
  if (target.tagName === 'LI') return target;else return target.parentNode;
}
module.exports = exports['default'];