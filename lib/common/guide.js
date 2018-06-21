'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (chart, config) {
  var guide = config.guide;
  if (!guide) {
    return;
  }

  if (guide.line) {
    if (Array.isArray(guide.line)) {
      guide.line.forEach(function (line) {
        drawGuideLine(chart, line);
      });
    } else {
      drawGuideLine(chart, guide.line);
    }
  }

  if (guide.area) {
    if (Array.isArray(guide.area)) {
      guide.area.forEach(function (area) {
        drawGuideArea(chart, area);
      });
    } else {
      drawGuideArea(chart, guide.area);
    }
  }
};

exports.drawGuideLine = drawGuideLine;
exports.drawGuideArea = drawGuideArea;

var _common = require('./common');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function drawGuideLine(chart, guideLine) {
  var top = guideLine.top,
      _guideLine$text = guideLine.text,
      text = _guideLine$text === undefined ? {} : _guideLine$text,
      status = guideLine.status,
      axis = guideLine.axis,
      value = guideLine.value,
      start = guideLine.start,
      end = guideLine.end;
  var title = text.title,
      titlePosition = text.position,
      titleAlign = text.align,
      titleRotate = text.rotate,
      offsetX = text.offsetX,
      offsetY = text.offsetY;

  var color = (0, _common.getStatusColor)(status);

  var guideConfig = {
    top: top || true,
    lineStyle: {
      stroke: color
    },
    text: {
      content: title || '',
      position: titlePosition || 'start',
      autoRotate: titleRotate || false,
      style: {
        fill: color,
        textAlign: titleAlign || ((titlePosition || 'start') !== 'start' ? 'start' : 'end')
      },
      offsetX: offsetX,
      offsetY: offsetY
    }
  };

  // 判断value时需要注意数字0是假值，但是是一个合理的guide value
  if (axis && (value || value === 0)) {
    if (axis === 'x') {
      // y 轴是分类型数据的情况比较少，暂时不处理
      guideConfig.start = [value, 'min'];
      guideConfig.end = [value, 'max'];
      // x 轴辅助线，修改position和textAlign默认值
      guideConfig.text.position = titlePosition || 'end';
      guideConfig.text.style.textAlign = titleAlign || 'center';
    } else if (axis === 'y' || /y\d/.test(axis)) {
      // 形似 y0, y1 ...的axis，说明是多Y轴，多轴的情况下，start/end 必须返回原始数据格式才能正确匹配y轴度量
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.start = function (xScales) {
        if (xScales.x && xScales.x.isCategory) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _defineProperty({ x: -0.5 }, axis, value);
        }
        return _defineProperty({ x: 'min' }, axis, value);
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        if (xScales.x && xScales.x.isCategory) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _defineProperty({ x: xScales.x.values.length - 0.5 }, axis, value);
        }
        return _defineProperty({ x: 'max' }, axis, value);
      };
      guideConfig.text.offsetY = offsetY === 0 ? offsetY : offsetY || 6;
    }
  }
  if (start) {
    guideConfig.start = start;
  }
  if (end) {
    guideConfig.end = end;
  }

  if (guideConfig.start && guideConfig.end) {
    chart.guide().line(guideConfig);
  } else {
    console.warn('guide line 定义不全');
  }
}

function drawGuideArea(chart, guideArea) {
  var top = guideArea.top,
      status = guideArea.status,
      axis = guideArea.axis,
      value = guideArea.value,
      start = guideArea.start,
      end = guideArea.end;

  var color = (0, _common.getStatusColor)(status);

  var guideConfig = {
    top: top || true,
    style: {
      fill: color
    }
  };

  if (axis && Array.isArray(value) && value.length > 1) {
    if (axis === 'x') {
      // y 轴是分类型数据的情况比较少，暂时不处理
      guideConfig.start = [value[0], 'min'];
      guideConfig.end = [value[1], 'max'];
    } else if (axis === 'y' || /y\d/.test(axis)) {
      // 形似 y0, y1 ...的axis，说明是多Y轴，多轴的情况下，start/end 必须返回原始数据格式才能正确匹配y轴度量
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.start = function (xScales) {
        if (xScales.x && xScales.x.isCategory) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _defineProperty({ x: -0.5 }, axis, value[0]);
        }
        return _defineProperty({ x: 'min' }, axis, value[0]);
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        if (xScales.x && xScales.x.isCategory) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _defineProperty({ x: xScales.x.values.length - 0.5 }, axis, value[1]);
        }
        return _defineProperty({ x: 'max' }, axis, value[1]);
      };
    }
  }
  if (start) {
    guideConfig.start = start;
  }
  if (end) {
    guideConfig.end = end;
  }

  if (guideConfig.start && guideConfig.end) {
    chart.guide().region(guideConfig);
  } else {
    console.warn('guide area 定义不全');
  }
}