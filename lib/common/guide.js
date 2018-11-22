'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 绘制辅助标记通用函数
 *
 * @param {object} chart 图表实例
 * @param {object} config 图表配置项
 * 
 * */


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
      offsetY = text.offsetY,
      _text$style = text.style,
      style = _text$style === undefined ? {} : _text$style;

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
      style: _extends({
        fill: color,
        textAlign: titleAlign || ((titlePosition || 'start') !== 'start' ? 'start' : 'end')
      }, style),
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
        var _ref2;

        if (xScales.x && xScales.x.isCategory) {
          var _ref;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref = { x: -0.5 }, _ref[axis] = value, _ref;
        }
        return _ref2 = { x: 'min' }, _ref2[axis] = value, _ref2;
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        var _ref4;

        if (xScales.x && xScales.x.isCategory) {
          var _ref3;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref3 = { x: xScales.x.values.length - 0.5 }, _ref3[axis] = value, _ref3;
        }
        return _ref4 = { x: 'max' }, _ref4[axis] = value, _ref4;
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
        var _ref6;

        if (xScales.x && xScales.x.isCategory) {
          var _ref5;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref5 = { x: -0.5 }, _ref5[axis] = value[0], _ref5;
        }
        return _ref6 = { x: 'min' }, _ref6[axis] = value[0], _ref6;
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        var _ref8;

        if (xScales.x && xScales.x.isCategory) {
          var _ref7;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref7 = { x: xScales.x.values.length - 0.5 }, _ref7[axis] = value[1], _ref7;
        }
        return _ref8 = { x: 'max' }, _ref8[axis] = value[1], _ref8;
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