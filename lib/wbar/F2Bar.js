'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _f2Factory = require('../common/f2Factory');

var _f2Factory2 = _interopRequireDefault(_f2Factory);

var _theme = require('../theme/');

var _f2Utils = require('../common/f2Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colorMap = _theme.color.category_12;
var clientWidth = window.innerWidth;
var defaultLegendFormatter = function defaultLegendFormatter(d) {
  return '<span class="name" style="color: ' + _theme.color.widgetsTooltipTitle + '; margin-right: 6px;">\n    ' + d.name + '\n  </span>\n  <span class="value" style="color: ' + _theme.color.widgetsTooltipText + '">\n    ' + (d.value ? d.value : '') + '\n  </span>';
};

var defaultConfig = {
  width: clientWidth,
  height: 160,
  padding: [10, 10, 10, 10],
  xAxis: {},
  yAxis: {
    min: 0
  },
  tooltip: true,
  legend: { show: true, dir: 'top' },
  colors: colorMap,

  autoSort: false
};

var barConfig = {
  tooltipId: (0, _f2Utils.generateUniqueId)('bar'),

  beforeInit: function beforeInit(props) {
    var newProps = _extends({}, props);
    var newConfig = _extends({}, defaultConfig, props.config);

    if (typeof newConfig.legend === 'undefined' || typeof newConfig.legend === 'boolean') {
      newConfig.legend = {};
    }

    if (newConfig.legend) {
      var _newConfig$legend = newConfig.legend,
          _newConfig$legend$dir = _newConfig$legend.dir,
          dir = _newConfig$legend$dir === undefined ? 'top' : _newConfig$legend$dir,
          _newConfig$legend$sho = _newConfig$legend.show,
          show = _newConfig$legend$sho === undefined ? true : _newConfig$legend$sho,
          _newConfig$legend$for = _newConfig$legend.formatter,
          formatter = _newConfig$legend$for === undefined ? defaultLegendFormatter : _newConfig$legend$for;


      newConfig.legend.dir = dir;
      newConfig.legend.show = show;
      newConfig.legend.formatter = formatter;
    }

    newProps.config = newConfig;
    return newProps;
  },
  init: function init(chart, userConfig, data) {
    var type = userConfig.type,
        showTop = userConfig.showTop;


    if (userConfig.autoSort) {
      data.sort(function (a, b) {
        return b.y - a.y;
      });
    }
    chart.source(data, {
      y: {
        tickCount: 5
      }
    });

    chart.axis('x', {
      label: {
        fontSize: 10
      },
      // x轴文字和轴间距5px
      labelOffset: 5,
      grid: null
    });

    chart.axis('y', {
      label: {
        fontSize: 10
      }
    });

    if (type === 'cascade') {
      chart.interval().position('x*y').color('type').adjust('stack');
    } else if (type === 'dodge') {
      chart.interval().position('x*y').color('type').adjust('dodge');
    } else {
      chart.interval().position('x*y').color('type');
    }

    if (showTop && type !== 'cascade' && type !== 'dodge') {
      data.forEach(function (obj) {
        var offsetY = -20;
        chart.guide().html([obj.x, obj.y], '<div style=\'color: ' + _theme.color.widgetsColorBlue + ';font-size: 10px\'><span>' + obj.y + '</span></div>', {
          align: 'bc',
          offset: [0, offsetY]
        });
      });
    }

    chart.render();
  },
  chartTouchStart: function chartTouchStart(e, chart, config, canvas, resultData, originData, elem, self) {
    self.inMove = true;
    self.currentCanvasData = null;

    var x = e.touches ? e.touches[0].clientX : e.clientX;
    var y = e.touches ? e.touches[0].clientY : e.clientY;
    var point = (0, _f2Utils.getPoint)(canvas, x, y);
    // 根据画布坐标获取对应数据集
    var data = chart.getSnapRecords(point);
    self.currentCanvasData = data;
    // 画辅助线
    self.drawGuideLine(data, elem, canvas, config);

    self.drawTopContent(data, canvas, config, self);
  },
  chartTouchMove: function chartTouchMove(e, chart, config, canvas, resultData, originData, elem, self) {
    // 只有在移动的时候才计算
    if (self.inMove) {
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      var y = e.touches ? e.touches[0].clientY : e.clientY;

      var point = (0, _f2Utils.getPoint)(canvas, x, y);
      // 根据画布坐标获取对应数据集
      var data = chart.getSnapRecords(point);
      if (data && self.currentCanvasData) {
        if (data[0].x === self.currentCanvasData[0].x && data[0].y === self.currentCanvasData[0].y) {
          // 如果还在原来的数据上则什么都不做
          return;
        }
        // 如果发现当前的点和之前的不一样，则重新画辅助线和tooltip
        self.removeGuideLine(elem);
        self.currentCanvasData = data;
        self.drawGuideLine(data, elem, canvas, config);
        self.drawTopContent(data, canvas, config, self);
      }
    }
  },
  chartTouchEnd: function chartTouchEnd(e, chart, config, canvas, resultData, originData, elem, self) {
    self.inMove = false;
    self.removeGuideLine(elem);
    self.removeTopContent(self, elem);
  },
  drawTopContent: function drawTopContent(data, canvas, config, self) {
    if (!config.tooltip) {
      return;
    }
    var dataArr = [];
    var x = data[0]._origin.x;
    data.forEach(function (i) {
      dataArr.push({
        color: i.color,
        name: i._origin.type,
        value: i._origin.y
      });
    });

    var topContentStr = '<div class="top-content" style="display: flex; flex-wrap: wrap; WebkitUserSelect: none;flex-direction: column; width: ' + clientWidth + 'px; padding: 8px 12px; font-size: 12px; line-height: 1.2 ">';

    topContentStr += '<div style="color: #000">' + x + '</div>';
    topContentStr += '<div style="display: flex; flex-direction: row;flex-wrap: wrap;">';

    dataArr.forEach(function (i) {
      var dotColor = i.color;
      if (colorMap.indexOf(dotColor) >= 0) {
        dotColor = colorMap[colorMap.indexOf(dotColor)];
      }
      topContentStr += '<div style="margin-right: 30px; margin-top: 12px; white-space: nowrap"><span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: #fff;border: 1px solid ' + dotColor + '"><span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:' + dotColor + '"></span></span><span class="name" style="color: ' + _theme.color.widgetsTooltipTitle + '; margin-right: 6px;">' + i.name + '</span><span class="value" style="color: ' + _theme.color.widgetsTooltipText + '">' + (i.value !== null ? i.value : '') + '</span></div>';
    });
    topContentStr += '</div></div>';

    var topContentDiv = document.querySelector('#' + self.tooltipId);
    if (!topContentDiv) {
      topContentDiv = document.createElement('div');
      topContentDiv.id = self.tooltipId;
      (0, _f2Utils.setDomStyle)(topContentDiv, {
        backgroundColor: _theme.color.widgetsTooltipBackground,
        position: 'absolute',
        top: -100,
        left: 0,
        borderStyle: 'solid',
        borderColor: _theme.color.widgetsTooltipCrossLine,
        borderWidth: '1px 0 1px',
        padding: 8,
        boxSizing: 'border-box',
        width: clientWidth + 'px',
        overflow: 'hidden'
      });
      document.body.appendChild(topContentDiv);
    }

    topContentDiv.innerHTML = topContentStr;

    (0, _f2Utils.setDomStyle)(topContentDiv, {
      top: canvas.getClientRects()[0].top + window.scrollY - topContentDiv.getClientRects()[0].height + config.padding[0] + 'px'
    });
  },
  removeTopContent: function removeTopContent(self, elem) {
    var parentContainer = document.querySelector('#aismcontainer-' + elem.chartId);
    // 如果有辅助线，则清除
    var tipLines = parentContainer.querySelector('.tipLine');
    if (tipLines) {
      for (var j = 0; j < tipLines.length; j++) {
        if (tipLines[j]) parentContainer.removeChild(tipLines[j]);
      }
    }
    var tooltip = document.querySelector('#' + self.tooltipId);
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  },
  drawGuideLine: function drawGuideLine(data, elem, canvas, config) {
    var tooltipType = config.tooltipType,
        type = config.type;

    var container = document.querySelector('#aismcontainer-' + elem.chartId);
    // 构造图例的数据
    var legendData = data.concat([]);
    legendData.map(function (d) {
      d.name = d._origin.type;
      d.value = d._origin.y;
    });

    var resultArr = [];
    data.forEach(function (i) {
      resultArr.push({
        color: i.color,
        name: i._origin.type,
        value: i._origin.y
      });
    });
    elem.renderLegend(config.legend.dir, resultArr);

    if (tooltipType === 'simple') {
      // 简单模式的辅助线
      var _data$ = data[0],
          tipLineX = _data$.x,
          tipLineY = _data$.y;

      // x轴方向的tipline

      var xTipLine = document.createElement('div');
      xTipLine.className = 'tipLine';
      xTipLine.style.borderColor = '#ccc';
      xTipLine.style.borderWidth = '1px 0 0';
      xTipLine.style.borderStyle = 'dashed';
      xTipLine.style.position = 'absolute';
      xTipLine.style.left = config.padding[3] + 'px';
      xTipLine.style.top = tipLineY + 'px';
      xTipLine.style.height = 0;
      xTipLine.style.width = canvas.getClientRects()[0].width - config.padding[1] - config.padding[3] + 'px';
      container.appendChild(xTipLine);

      // y轴方向的tipline
      var tipLine = document.createElement('div');
      tipLine.className = 'tipLine';
      tipLine.style.borderColor = '#ccc';
      tipLine.style.width = 0;
      tipLine.style.borderWidth = '0 1px 0 0 ';
      tipLine.style.borderStyle = 'dashed';
      tipLine.style.position = 'absolute';
      tipLine.style.left = tipLineX - 0.5 + 'px';
      tipLine.style.top = 10 + 'px';
      tipLine.style.height = tipLineY + config.padding[0] + 10 + 'px';
      container.appendChild(tipLine);
    } else if (type === 'cascade') {
      // 如果是复杂的tooltip， 只需要画y轴方向的tipline
      var _tipLineX = data[0].x;

      var lastData = data[data.length - 1];
      var _tipLineY = lastData.y[lastData.y.length - 1];
      var _tipLine = document.createElement('div');
      _tipLine.className = 'tipLine';
      _tipLine.style.borderColor = '#ccc';
      _tipLine.style.width = 0;
      _tipLine.style.borderWidth = '0 1px 0 0 ';
      _tipLine.style.borderStyle = 'dashed';
      _tipLine.style.position = 'absolute';
      _tipLine.style.left = _tipLineX - 0.5 + 'px';
      _tipLine.style.top = 10 + 'px';
      _tipLine.style.height = _tipLineY + config.padding[0] + 'px';
      container.appendChild(_tipLine);
    } else if (type === 'dodge') {
      // 如果两个柱的图，寻找中间的y坐标， 只需要画y轴方向的tipline
      var tipLineX1 = data[0].x;
      var tipLineX2 = data[1].x;

      var _lastData = data[data.length - 1];
      var _tipLineY2 = _lastData.y;
      var _tipLine2 = document.createElement('div');
      _tipLine2.className = 'tipLine';
      _tipLine2.style.borderColor = '#ccc';
      _tipLine2.style.width = 0;
      _tipLine2.style.borderWidth = '0 1px 0 0 ';
      _tipLine2.style.borderStyle = 'dashed';
      _tipLine2.style.position = 'absolute';
      _tipLine2.style.left = (tipLineX1 - 0.5) / 2 + (tipLineX2 - 0.5) / 2 + 'px';
      _tipLine2.style.top = 10 + 'px';
      _tipLine2.style.height = _tipLineY2 + config.padding[0] + 'px';
      container.appendChild(_tipLine2);
    }
  },


  // 清除辅助线
  removeGuideLine: function removeGuideLine(elem) {
    var container = document.querySelector('#aismcontainer-' + elem.chartId);
    var tipLines = container.querySelectorAll('.tipLine');
    tipLines.forEach(function (t) {
      container.removeChild(t);
    });

    var topContain = container.querySelector('.topContain');
    if (topContain) {
      container.removeChild(topContain);
    }
  }
};

exports.default = (0, _f2Factory2.default)('f2Bar', barConfig);
module.exports = exports['default'];