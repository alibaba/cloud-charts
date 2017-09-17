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
  legend: {
    position: 'right',
    nameFormatter: null, //可以强制覆盖，手动设置label
    valueFormatter: null
  },
  tooltip: {
    nameFormatter: null,
    valueFormatter: null
  },
  cycle: false,
  padding: [0, 0, 0, 0]
};

exports.default = {
  beforeInit: function beforeInit(props) {
    var config = props.config,
        plotCfg = props.plotCfg,
        height = props.height;

    plotCfg.margin = config.padding || defaultConfig.padding;
    return props;
  },
  init: function init(chart, userConfig, data) {
    var config = (0, _merge2.default)({}, defaultConfig, userConfig);

    var defs = {
      type: {
        type: 'cat'
      }
    };

    chart.source(data, defs);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    var thetaConfig = {
      radius: 0.6 // 设置饼图的大小
    };
    if (config.cycle) {
      thetaConfig = (0, _merge2.default)({}, thetaConfig, {
        inner: 0.66
      });
    }
    chart.coord('theta', thetaConfig);

    // position若直接使用value导致图例点击某项隐藏，余下展示不为值和不为1
    var Stat = _g2.default.Stat;

    //labelFormatter
    if (config.labelFormatter) {
      chart.intervalStack().position(Stat.summary.percent('value')).color('name').label('name*..percent', config.labelFormatter).selected(false);
    } else {
      chart.intervalStack().position(Stat.summary.percent('value')).color('name').selected(false);
    }

    chart.legend(false);

    // 设置提示
    // tooltip
    if (config.tooltip) {
      var tooltipCfg = {
        custom: true,
        offset: 8,
        padding: [12, 12, 12, 12],
        html: '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><ul class="ac-list"></ul></div>',
        itemTpl: '<li><i style="background-color:{color}"></i>{name}<span>{value}</span></li>'
      };
      chart.tooltip(true, tooltipCfg);
      if (config.tooltip.nameFormatter || config.tooltip.valueFormatter) {
        chart.on('tooltipchange', function (ev) {
          ev.items.forEach(function (item) {
            item.value = config.tooltip.valueFormatter ? config.tooltip.valueFormatter(item.value) : item.value;
            item.name = config.tooltip.nameFormatter ? config.tooltip.nameFormatter(item.name) : item.name;
          });
        });
      }
    } else {
      chart.tooltip(false);
    }

    chart.render();

    // 自定义图例html
    if (config.legend) {
      var id = chart._attrs.id;
      var chartNode = document.getElementById(id);
      chartNode.style.position = 'relative';
      var boxHeight = chartNode.offsetHeight - config.padding[0] - config.padding[2];
      var boxWidth = chartNode.offsetWidth - config.padding[1] - config.padding[3] - boxHeight * 0.6;
      var diameter = boxHeight < boxWidth ? boxHeight * 0.6 : boxWidth * 0.6;

      var geom = chart.getAllGeoms()[0]; // 获取所有的图形
      var items = geom.get('frames'); // 获取图形对应的数据
      var stash = {};

      var ulNode = document.createElement('ul');
      ulNode.classList.add('ac-pie-legend');
      ulNode.style.top = config.padding[0] + +diameter * 0.3 + 'px';
      ulNode.style.left = config.padding[3] + diameter + boxWidth * 0.55 + 'px';
      ulNode.style.height = diameter + 'px';
      // if(config.legend.align === 'right'){
      //   ulNode.style.right = config.padding[1] + 'px';
      // }else{
      //   ulNode.style.left = 5 + 'px';
      // }
      ulNode.innerHTML = '';

      for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
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

        var nameFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(name, item, i) : name;
        var valueFormatter = config.legend.valueFormatter ? config.legend.valueFormatter(value, item, i) : value;

        var liHtml = '<li class="item" data-id="' + name + '"><i class="dot" style="background:' + color + ';"></i><b>' + nameFormatter + '</b><span>' + valueFormatter + '</span></li>';
        ulNode.innerHTML += liHtml;
        chartNode.appendChild(ulNode);

        stash[name] = {
          item: item,
          color: color,
          name: name,
          isChecked: true,
          index: i
        };
      }
      var dotDom = chartNode.getElementsByClassName('dot');
      Array.prototype.forEach.call(ulNode.querySelectorAll('li'), function (item) {
        item.addEventListener('click', function (e) {
          var node = getLegendNode(e.target);
          var name = node.getAttribute('data-id');
          // filter(name);
          (0, _common.g2LegendFilter)(name, stash, Util, dotDom, chart, 'name');
        });
      });
      // function filter(name) {
      //   let obj = stash[name];
      //   let filterNames = [];
      //   obj.isChecked = obj.isChecked ? false : true;
      //   Util.each(stash, function (v) {
      //     if (v.isChecked) {
      //       dotDom[v.index].style.background = v.color;
      //       filterNames.push(v.name);
      //     } else {
      //       dotDom[v.index].style.background = '#999';
      //     }
      //   });
      //
      //   chart.filter('name', filterNames);
      //   chart.repaint();
      // }
    }
  }
};


function getLegendNode(target) {
  if (target.tagName === 'LI') return target;else return target.parentNode;
}
module.exports = exports['default'];