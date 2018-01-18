'use strict';

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

var _rectTooltip = require('../chartCommon/rectTooltip');

var _rectTooltip2 = _interopRequireDefault(_rectTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
  colors: _normal.color.category_12,
  padding: [0, 0, 0, 0],
  xAxis: {
    type: 'time', //默认为线性
    mask: 'YYYY-MM-DD HH:mm:ss', //上述type为time时，此字段生效
    categories: null,
    max: null,
    min: null
  },
  yAxis: {
    max: null,
    min: null
  },
  tooltip: false,
  area: false,
  spline: false,
  symbol: false
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
    return _extends({}, props, {
      padding: props.padding || config.padding || defaultConfig.padding,
      config: newConfig
    });
  },
  init: function init(chart, userConfig, data, rawData) {
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

    chart.axis(false);

    chart.legend(false);

    // tooltip
    _rectTooltip2.default.call(this, chart, config);

    // 绘制辅助线，辅助背景区域
    (0, _guide2.default)(chart, config);

    // 区域、堆叠、平滑曲线
    var lineShape = config.spline ? 'smooth' : 'line';
    var areaShape = config.spline ? 'smooth' : 'area';

    drawLine(chart, config, lineShape, areaShape);

    chart.render();

    // 自定义图例html
    // if (config.legend) {
    //   let chartNode = this.chartDom;
    //   chartNode.style.position = 'relative';
    //   let geom = chart.getGeoms()[0]; // 获取所有的图形
    //   let items = geom.getData(); // 获取图形对应的数据
    //   let stash = {};
    //
    //   let ulNode = document.createElement('ul');
    //   ulNode.classList.add('ac-line-legend');
    //   // ulNode.style.top = config.padding[0] + 'px';
    //   if(config.legend.align === 'right'){
    //     ulNode.style.right = config.padding[1] + 'px';
    //   }else{
    //     ulNode.style.left = 5 + 'px';
    //   }
    //   ulNode.innerHTML = '';
    //   for (let i = 0, l = items.length; i < l; i++) {
    //     let item = items[i];
    //     let itemData = item._origin;
    //     let color = item.color;
    //     let type = itemData[0].type;
    //     let name = itemData.name;
    //     let value = itemData.value;
    //
    //     let typeFormatter = config.legend.nameFormatter ? config.legend.nameFormatter(type, item, i) : type ;
    //
    //     let liHtml = '<li class="item" data-id="' + type + '"><i class="dot" style="background:' + color + ';"></i><span>' + typeFormatter + '</span></li>';
    //     ulNode.innerHTML += liHtml;
    //     chartNode.appendChild(ulNode);
    //
    //     stash[type] = {
    //       item: item,
    //       color: color,
    //       name: type,
    //       isChecked: true,
    //       index: i
    //     };
    //   }
    //   let dotDom = chartNode.getElementsByClassName('dot');
    //   Array.prototype.forEach.call(ulNode.querySelectorAll('li'), (item) => {
    //     item.addEventListener('click', (e) => {
    //       let node = getLegendNode(e.target);
    //       let type = node.getAttribute('data-id');
    //       g2LegendFilter(type, stash, Util, dotDom, chart);
    //     });
    //   });
    // }
  }
};


function drawLine(chart, config, lineShape, areaShape) {
  var yAxisKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'y';

  if (config.area && config.stack) {
    chart.areaStack().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.lineStack().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style({
      lineJoin: "round"
    });
  } else if (config.area && !config.stack) {
    chart.area().position(['x', yAxisKey]).color('type', config.colors).shape(areaShape).active(false);
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style({
      lineJoin: "round"
    });
  } else {
    chart.line().position(['x', yAxisKey]).color('type', config.colors).shape(lineShape).active(false).style({
      lineJoin: "round"
    });
  }
  // 曲线默认点
  if (config.symbol && config.area && config.stack) {
    chart.point().adjust('stack').position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  } else if (config.symbol) {
    chart.point().position(['x', yAxisKey]).color('type', config.colors).shape('circle').size(3).active(false);
  }
}

function getLegendNode(target) {
  if (target.tagName === 'LI') return target;else return target.parentNode;
}
module.exports = exports['default'];