'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (chart, config) {
  var guide = config.guide;

  if (!guide || guide.visible === false) {
    return;
  }

  var guideLine = guide.line,
      guideArea = guide.area,
      guideFilter = guide.filter,
      other = _objectWithoutProperties(guide, ['line', 'area', 'filter']);

  if (guideLine) {
    if (Array.isArray(guideLine)) {
      guideLine.forEach(function (line) {
        drawGuideLine(chart, line);
      });
    } else {
      drawGuideLine(chart, guideLine);
    }
  }

  if (guideArea) {
    if (Array.isArray(guideArea)) {
      guideArea.forEach(function (area) {
        drawGuideArea(chart, area);
      });
    } else {
      drawGuideArea(chart, guideArea);
    }
  }

  if (guideFilter) {
    if (Array.isArray(guideFilter)) {
      guideFilter.forEach(function (filter) {
        drawGuideFilter(chart, filter);
      });
    } else {
      drawGuideFilter(chart, guideFilter);
    }
  }

  if (!guideLine && !guideArea && !guideFilter && Object.keys(other).length > 0) {
    console.warn('guide 定义异常，请使用 guide.line 或 guide.area');
  }
};

exports.drawGuideLine = drawGuideLine;
exports.drawGuideArea = drawGuideArea;
exports.drawGuideFilter = drawGuideFilter;

var _common = require('./common');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * 绘制辅助标记通用函数
 *
 * @param {object} chart 图表实例
 * @param {object} config 图表配置项
 *
 * */


function drawGuideLine(chart, guideLine) {
  var _guideLine$top = guideLine.top,
      top = _guideLine$top === undefined ? true : _guideLine$top,
      _guideLine$text = guideLine.text,
      text = _guideLine$text === undefined ? {} : _guideLine$text,
      status = guideLine.status,
      axis = guideLine.axis,
      value = guideLine.value,
      start = guideLine.start,
      end = guideLine.end,
      _guideLine$style = guideLine.style,
      style = _guideLine$style === undefined ? {} : _guideLine$style;

  var _ref = (typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object' ? text : { title: text },
      title = _ref.title,
      titlePosition = _ref.position,
      titleAlign = _ref.align,
      titleRotate = _ref.rotate,
      offsetX = _ref.offsetX,
      offsetY = _ref.offsetY,
      _ref$style = _ref.style,
      textStyle = _ref$style === undefined ? {} : _ref$style;

  var color = (0, _common.getStatusColor)(status);

  var guideConfig = {
    top: top,
    lineStyle: _extends({
      stroke: color
    }, style),
    text: {
      content: title || '',
      position: titlePosition || 'start',
      autoRotate: titleRotate || false,
      style: _extends({
        fill: color,
        textAlign: titleAlign || ((titlePosition || 'start') !== 'start' ? 'start' : 'end')
      }, textStyle),
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
        var _ref3;

        if (xScales.x && xScales.x.isCategory) {
          var _ref2;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref2 = { x: -0.5 }, _ref2[axis] = value, _ref2;
        }
        return _ref3 = { x: 'min' }, _ref3[axis] = value, _ref3;
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        var _ref5;

        if (xScales.x && xScales.x.isCategory) {
          var _ref4;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref4 = { x: xScales.x.values.length - 0.5 }, _ref4[axis] = value, _ref4;
        }
        return _ref5 = { x: 'max' }, _ref5[axis] = value, _ref5;
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
  var _guideArea$top = guideArea.top,
      top = _guideArea$top === undefined ? true : _guideArea$top,
      status = guideArea.status,
      axis = guideArea.axis,
      value = guideArea.value,
      start = guideArea.start,
      end = guideArea.end,
      _guideArea$style = guideArea.style,
      style = _guideArea$style === undefined ? {} : _guideArea$style;

  var color = (0, _common.getStatusColor)(status);

  var guideConfig = {
    top: top,
    style: _extends({
      fill: color
    }, style)
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
        var _ref7;

        if (xScales.x && xScales.x.isCategory) {
          var _ref6;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref6 = { x: -0.5 }, _ref6[axis] = value[0], _ref6;
        }
        return _ref7 = { x: 'min' }, _ref7[axis] = value[0], _ref7;
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        var _ref9;

        if (xScales.x && xScales.x.isCategory) {
          var _ref8;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref8 = { x: xScales.x.values.length - 0.5 }, _ref8[axis] = value[1], _ref8;
        }
        return _ref9 = { x: 'max' }, _ref9[axis] = value[1], _ref9;
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

function drawGuideFilter(chart, guideFilter) {
  var _guideFilter$top = guideFilter.top,
      top = _guideFilter$top === undefined ? true : _guideFilter$top,
      status = guideFilter.status,
      axis = guideFilter.axis,
      value = guideFilter.value,
      start = guideFilter.start,
      end = guideFilter.end,
      apply = guideFilter.apply;

  var color = (0, _common.getStatusColor)(status);

  var guideConfig = {
    top: top,
    color: color,
    apply: apply
  };

  if (axis && Array.isArray(value) && value.length > 1) {
    if (axis === 'x') {
      // y 轴是分类型数据的情况比较少，暂时不处理
      // guideConfig.start = [value[0], 'min'];
      guideConfig.start = function (xScales, yScales) {
        var x = value[0];
        var y = 'min';
        if (xScales.x && xScales.x.min === null) {
          x = 0;
        }
        if (yScales.y && yScales.y.min === null) {
          y = 0;
        }
        return [x, y];
      };
      // guideConfig.end = [value[1], 'max'];
      guideConfig.end = function (xScales, yScales) {
        var x = value[1];
        var y = 'max';
        if (xScales.x && xScales.x.min === null) {
          x = 0;
        }
        if (yScales.y && yScales.y.max === null) {
          y = 0;
        }
        return [x, y];
      };
    } else if (axis === 'y' || /y\d/.test(axis)) {
      // 形似 y0, y1 ...的axis，说明是多Y轴，多轴的情况下，start/end 必须返回原始数据格式才能正确匹配y轴度量
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.start = function (xScales) {
        var _ref12;

        if (xScales.x && xScales.x.isCategory) {
          var _ref10;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref10 = { x: -0.5 }, _ref10[axis] = value[0], _ref10;
        }
        if (xScales.x && xScales.x.min === null) {
          var _ref11;

          return _ref11 = { x: 0 }, _ref11[axis] = value[0], _ref11;
        }
        return _ref12 = { x: 'min' }, _ref12[axis] = value[0], _ref12;
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        var _ref15;

        if (xScales.x && xScales.x.isCategory) {
          var _ref13;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref13 = { x: xScales.x.values.length - 0.5 }, _ref13[axis] = value[1], _ref13;
        }
        if (xScales.x && xScales.x.max === null) {
          var _ref14;

          return _ref14 = { x: 0 }, _ref14[axis] = value[0], _ref14;
        }
        return _ref15 = { x: 'max' }, _ref15[axis] = value[1], _ref15;
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
    chart.guide().regionFilter(guideConfig);
  } else {
    console.warn('guide area 定义不全');
  }
}