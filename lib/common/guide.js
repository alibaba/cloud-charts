'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;
exports.drawGuideLine = drawGuideLine;
exports.drawGuideArea = drawGuideArea;
exports.drawGuideFilter = drawGuideFilter;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _common = require("./common");

var _themes = _interopRequireDefault(require("../themes"));

/**
 * 绘制辅助标记通用函数
 *
 * @param {Chart} chart 图表实例
 * @param {object} config 图表配置项
 *
 * */
function _default(chart, config) {
  var guide = config.guide;

  if (!guide || guide.visible === false) {
    return;
  }

  var guideLine = guide.line,
      guideArea = guide.area,
      guideFilter = guide.filter,
      other = (0, _objectWithoutPropertiesLoose2["default"])(guide, ["line", "area", "filter"]);

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
}

function drawGuideLine(chart, guideLine) {
  var _guideLine$top = guideLine.top,
      top = _guideLine$top === void 0 ? true : _guideLine$top,
      text = guideLine.text,
      status = guideLine.status,
      axis = guideLine.axis,
      value = guideLine.value,
      start = guideLine.start,
      end = guideLine.end,
      _guideLine$style = guideLine.style,
      style = _guideLine$style === void 0 ? {} : _guideLine$style;

  var _ref = typeof text === 'string' ? {
    title: text
  } : text,
      title = _ref.title,
      titlePosition = _ref.position,
      titleAlign = _ref.align,
      _ref$style = _ref.style,
      textStyle = _ref$style === void 0 ? {} : _ref$style,
      _ref$offsetY = _ref.offsetY,
      offsetY = _ref$offsetY === void 0 ? (0, _common.pxToNumber)(_themes["default"]['widgets-font-size-1']) / 2 : _ref$offsetY,
      textConfig = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["title", "position", "align", "style", "offsetY"]);

  var color = (0, _common.getStatusColor)(status);
  var guideConfig = {
    top: top,
    style: (0, _extends2["default"])({
      stroke: color
    }, style),
    text: (0, _extends2["default"])({
      content: title || '',
      position: titlePosition || 'start',
      style: (0, _extends2["default"])({
        fill: color,
        textAlign: titleAlign || ((titlePosition || 'start') !== 'start' ? 'start' : 'end')
      }, textStyle),
      offsetY: offsetY
    }, textConfig),
    // @ts-ignore
    start: undefined,
    // @ts-ignore
    end: undefined
  }; // 判断value时需要注意数字0是假值，但是是一个合理的guide value

  if (axis && (value || value === 0)) {
    if (axis === 'x') {
      // y 轴是分类型数据的情况比较少，暂时不处理
      guideConfig.start = [value, 'min'];
      guideConfig.end = [value, 'max']; // x 轴辅助线，修改position和textAlign默认值

      guideConfig.text.position = titlePosition || 'end';
      guideConfig.text.style.textAlign = titleAlign || 'center';
    } else if (axis === 'y' || /y\d/.test(axis)) {
      // 形似 y0, y1 ...的axis，说明是多Y轴，多轴的情况下，start/end 必须返回原始数据格式才能正确匹配y轴度量
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.start = function (xScales) {
        var _ref3;

        if (!Array.isArray(xScales) && xScales.x && xScales.x.isCategory) {
          var _ref2;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref2 = {
            x: -0.5
          }, _ref2[axis] = value, _ref2;
        }

        return _ref3 = {
          x: 'min'
        }, _ref3[axis] = value, _ref3;
      }; // 函数接受两个参数 xScales 和 yScales


      guideConfig.end = function (xScales) {
        var _ref5;

        if (!Array.isArray(xScales) && xScales.x && xScales.x.isCategory) {
          var _ref4;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref4 = {
            x: xScales.x.values.length - 0.5
          }, _ref4[axis] = value, _ref4;
        }

        return _ref5 = {
          x: 'max'
        }, _ref5[axis] = value, _ref5;
      }; // guideConfig.text.offsetY = offsetY === 0 ? offsetY : (offsetY || 6);

    }
  }

  if (start) {
    guideConfig.start = start;
  }

  if (end) {
    guideConfig.end = end;
  }

  if (guideConfig.start && guideConfig.end) {
    chart.annotation().line(guideConfig);
  } else {
    console.warn('guide line 定义不全');
  }
}

function drawGuideArea(chart, guideArea) {
  var _guideArea$top = guideArea.top,
      top = _guideArea$top === void 0 ? true : _guideArea$top,
      status = guideArea.status,
      axis = guideArea.axis,
      value = guideArea.value,
      start = guideArea.start,
      end = guideArea.end,
      _guideArea$style = guideArea.style,
      style = _guideArea$style === void 0 ? {} : _guideArea$style;
  var color = (0, _common.getStatusColor)(status);
  var guideConfig = {
    top: top,
    style: (0, _extends2["default"])({
      fill: color
    }, style),
    // @ts-ignore
    start: undefined,
    // @ts-ignore
    end: undefined
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

        if (!Array.isArray(xScales) && xScales.x && xScales.x.isCategory) {
          var _ref6;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref6 = {
            x: -0.5
          }, _ref6[axis] = value[0], _ref6;
        }

        return _ref7 = {
          x: 'min'
        }, _ref7[axis] = value[0], _ref7;
      }; // 函数接受两个参数 xScales 和 yScales


      guideConfig.end = function (xScales) {
        var _ref9;

        if (!Array.isArray(xScales) && xScales.x && xScales.x.isCategory) {
          var _ref8;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref8 = {
            x: xScales.x.values.length - 0.5
          }, _ref8[axis] = value[1], _ref8;
        }

        return _ref9 = {
          x: 'max'
        }, _ref9[axis] = value[1], _ref9;
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
    chart.annotation().region(guideConfig);
  } else {
    console.warn('guide area 定义不全');
  }
}

function drawGuideFilter(chart, guideFilter) {
  var _guideFilter$top = guideFilter.top,
      top = _guideFilter$top === void 0 ? true : _guideFilter$top,
      status = guideFilter.status,
      axis = guideFilter.axis,
      value = guideFilter.value,
      start = guideFilter.start,
      end = guideFilter.end,
      apply = guideFilter.apply,
      style = guideFilter.style;
  var color = (0, _common.getStatusColor)(status);
  var guideConfig = {
    top: top,
    color: color,
    apply: apply,
    style: style,
    // @ts-ignore
    start: undefined,
    // @ts-ignore
    end: undefined
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
        var _ref11;

        if (!Array.isArray(xScales) && xScales.x && xScales.x.isCategory) {
          var _ref10;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref10 = {
            x: -0.5
          }, _ref10[axis] = value[0], _ref10;
        }

        return _ref11 = {
          x: 'min'
        }, _ref11[axis] = value[0], _ref11;
      }; // 函数接受两个参数 xScales 和 yScales


      guideConfig.end = function (xScales) {
        var _ref13;

        if (!Array.isArray(xScales) && xScales.x && xScales.x.isCategory) {
          var _ref12;

          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return _ref12 = {
            x: xScales.x.values.length - 0.5
          }, _ref12[axis] = value[1], _ref12;
        }

        return _ref13 = {
          x: 'max'
        }, _ref13[axis] = value[1], _ref13;
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
    chart.annotation().regionFilter(guideConfig);
  } else {
    console.warn('guide area 定义不全');
  }
}