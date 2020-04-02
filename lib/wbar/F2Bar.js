var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import f2Factory from '../common/f2Factory';
import { color } from '../themes/';
import { getPoint, generateUniqueId, setDomStyle, getTooltipId, getContainerId, getLegendId } from '../common/f2Utils';
import { xAxisConfig, yAxisConfig, legendConfig, tooltipConfig } from '../common/f2Defaults';
import merge from '../common/merge';

var colorMap = color.category_12;
var clientWidth = window.innerWidth;
var defaultLegendFormatter = function defaultLegendFormatter(d, titleStyle, valueStyle) {
  return '<span class="name" style="color: ' + titleStyle.fill + '; font-size: ' + titleStyle.fontSize + 'px; margin-right: 6px;">\n    ' + d.name + '\n  </span>\n  <span class="value" style="color: ' + valueStyle.fill + '; font-size: ' + valueStyle.fontSize + 'px;">\n    ' + (d.value ? d.value : '') + '\n  </span>';
};

var defaultConfig = {
  width: clientWidth,
  height: 160,
  padding: [10, 10, 10, 10],
  xAxis: {},
  yAxis: {
    min: 0
  },
  tooltip: tooltipConfig,
  legend: _extends({}, legendConfig, {
    show: true,
    position: 'top',
    formatter: defaultLegendFormatter
  }),
  colors: colorMap,

  autoSort: false
};

var barConfig = {
  tooltipId: generateUniqueId('bar'),

  beforeInit: function beforeInit(props) {
    var newProps = _extends({}, props);
    var newConfig = merge({}, defaultConfig, props.config);

    newProps.config = newConfig;
    return newProps;
  },
  init: function init(chart, userConfig, data) {
    var type = userConfig.type,
        showTop = userConfig.showTop;


    chart.source(data, {
      y: {
        tickCount: 5
      }
    });

    if (userConfig.xAxis.show === false) {
      chart.axis('x', false);
    } else {
      chart.axis('x', _extends({}, xAxisConfig, userConfig.xAxis));
    }

    if (userConfig.yAxis.show === false) {
      chart.axis('y', false);
    } else {
      chart.axis('y', _extends({}, yAxisConfig, userConfig.yAxis));
    }

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
        chart.guide().html([obj.x, obj.y], '<div style=\'color: ' + color.widgetsColorBlue + ';font-size: 10px\'><span>' + obj.y + '</span></div>', {
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
    var point = getPoint(canvas, x, y);
    // 根据画布坐标获取对应数据集
    var data = chart.getSnapRecords(point);
    self.currentCanvasData = data;
    // 画辅助线
    self.drawGuideLine(data, elem, canvas, config);

    self.renderTooltip(data, canvas, config, self, elem);
  },
  chartTouchMove: function chartTouchMove(e, chart, config, canvas, resultData, originData, elem, self) {
    // 只有在移动的时候才计算
    if (self.inMove) {
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      var y = e.touches ? e.touches[0].clientY : e.clientY;

      var point = getPoint(canvas, x, y);
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
        self.renderTooltip(data, canvas, config, self, elem);
      }
    }
  },
  chartTouchEnd: function chartTouchEnd(e, chart, config, canvas, resultData, originData, elem, self) {
    self.inMove = false;
    self.removeGuideLine(elem);
    self.removeTooltip(self, elem);
  },
  renderTooltip: function renderTooltip(data, canvas, config, self, elem) {
    if (config.tooltip === false) {
      return null;
    }
    var _config$legend = config.legend,
        titleStyle = _config$legend.titleStyle,
        valueStyle = _config$legend.valueStyle;

    var dataArr = [];
    var x = data[0]._origin.x;

    var tooltipId = getTooltipId(elem.chartId);
    data.forEach(function (i) {
      dataArr.push({
        color: i.color,
        name: i._origin.type,
        value: i._origin.y
      });
    });

    var topContentStr = '<div class="top-content" style="display: flex; flex-wrap: wrap; WebkitUserSelect: none;flex-direction: column; width: ' + clientWidth + 'px; padding: 8px 12px; font-size: 12px; line-height: 1.2 ">';

    topContentStr += '<div style="color: ' + valueStyle.fill + '">' + x + '</div>';
    topContentStr += '<div style="display: flex; flex-direction: row;flex-wrap: wrap;">';

    dataArr.forEach(function (i) {
      var dotColor = i.color;
      if (colorMap.indexOf(dotColor) >= 0) {
        dotColor = colorMap[colorMap.indexOf(dotColor)];
      }
      topContentStr += '<div style="margin-right: 30px; margin-top: 12px; white-space: nowrap"><span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: transparent;border: 1px solid ' + dotColor + '"><span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:' + dotColor + '"></span></span><span class="name" style="color: ' + titleStyle.fill + '; margin-right: 6px;">' + i.name + '</span><span class="value" style="color: ' + valueStyle.fill + '">' + (i.value !== null ? i.value : '') + '</span></div>';
    });
    topContentStr += '</div></div>';

    var topContentDiv = document.querySelector('#' + tooltipId);
    if (!topContentDiv) {
      topContentDiv = document.createElement('div');
      topContentDiv.id = tooltipId;
      setDomStyle(topContentDiv, {
        backgroundColor: config.tooltip.background.fill,
        position: 'absolute',
        top: 0,
        left: 0,
        borderStyle: config.tooltip.border.style,
        borderColor: config.tooltip.border.color,
        borderWidth: config.tooltip.border.width,
        padding: 8,
        boxSizing: 'border-box',
        width: clientWidth + 'px',
        overflow: 'hidden'
      });
      var parentContainer = document.getElementById(getContainerId(elem.chartId));
      parentContainer.appendChild(topContentDiv);
    }

    topContentDiv.innerHTML = topContentStr;
  },
  removeTooltip: function removeTooltip(self, elem) {
    var parentContainer = document.querySelector('#' + getContainerId(elem.chartId));
    // 如果有辅助线，则清除
    var tipLines = parentContainer.querySelector('.tipLine');
    if (tipLines) {
      for (var j = 0; j < tipLines.length; j++) {
        if (tipLines[j]) parentContainer.removeChild(tipLines[j]);
      }
    }
    var tooltip = document.querySelector('#' + getTooltipId(elem.chartId));
    if (tooltip) {
      parentContainer.removeChild(tooltip);
    }
  },
  drawGuideLine: function drawGuideLine(data, elem, canvas, config) {
    var tooltipType = config.tooltipType,
        type = config.type;

    var container = document.querySelector('#' + getContainerId(elem.chartId));
    var legendContainer = document.querySelector('#' + getLegendId(elem.chartId));
    var legendHeight = legendContainer.getClientRects()[0].height;
    var dirTop = config.legend.position === 'top';
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
    elem.renderLegend(resultArr);

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
      xTipLine.style.top = dirTop ? tipLineY + legendHeight + 'px' : tipLineY + 'px';
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
      tipLine.style.bottom = 16 + config.padding[0] + 'px';
      tipLine.style.height = container.querySelector('canvas').getClientRects()[0].height - config.padding[0] - config.padding[2] + 'px';
      container.appendChild(tipLine);
    } else if (type === 'cascade') {
      // 如果是复杂的tooltip， 只需要画y轴方向的tipline
      var _tipLineX = data[0].x;

      var _tipLine = document.createElement('div');
      _tipLine.className = 'tipLine';
      _tipLine.style.borderColor = '#ccc';
      _tipLine.style.width = 0;
      _tipLine.style.borderWidth = '0 1px 0 0 ';
      _tipLine.style.borderStyle = 'dashed';
      _tipLine.style.position = 'absolute';
      _tipLine.style.left = _tipLineX - 0.5 + 'px';
      _tipLine.style.bottom = 16 + config.padding[0] + 'px';
      _tipLine.style.height = container.querySelector('canvas').getClientRects()[0].height - config.padding[0] - config.padding[2] + 'px';
      container.appendChild(_tipLine);
    } else if (type === 'dodge') {
      // 如果两个柱的图，寻找中间的y坐标， 只需要画y轴方向的tipline
      var tipLineX1 = data[0].x;
      var tipLineX2 = data[1].x;

      var lastData = data[data.length - 1];
      var _tipLineY = lastData.y;
      var _tipLine2 = document.createElement('div');
      _tipLine2.className = 'tipLine';
      _tipLine2.style.borderColor = '#ccc';
      _tipLine2.style.width = 0;
      _tipLine2.style.borderWidth = '0 1px 0 0 ';
      _tipLine2.style.borderStyle = 'dashed';
      _tipLine2.style.position = 'absolute';
      _tipLine2.style.left = (tipLineX1 - 0.5) / 2 + (tipLineX2 - 0.5) / 2 + 'px';
      _tipLine2.style.top = 10 + 'px';
      _tipLine2.style.height = _tipLineY + config.padding[0] + 'px';
      container.appendChild(_tipLine2);
    }
  },


  // 清除辅助线
  removeGuideLine: function removeGuideLine(elem) {
    var container = document.querySelector('#' + getContainerId(elem.chartId));
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

export default f2Factory('f2Bar', barConfig);