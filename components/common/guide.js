'use strict';

import { getStatusColor } from './common';

/**
 * 绘制辅助标记通用函数
 *
 * @param {object} chart 图表实例
 * @param {object} config 图表配置项
 *
 * */
export default function (chart, config) {
  const { guide } = config;
  if (!guide || guide.visible === false) {
    return;
  }

  const { line: guideLine, area: guideArea, filter: guideFilter, ...other } = guide;

  if (guideLine) {
    if (Array.isArray(guideLine)) {
      guideLine.forEach((line) => {
        drawGuideLine(chart, line);
      });
    } else {
      drawGuideLine(chart, guideLine);
    }
  }

  if (guideArea) {
    if (Array.isArray(guideArea)) {
      guideArea.forEach((area) => {
        drawGuideArea(chart, area);
      });
    } else {
      drawGuideArea(chart, guideArea);
    }
  }

  if (guideFilter) {
    if (Array.isArray(guideFilter)) {
      guideFilter.forEach((filter) => {
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

export function drawGuideLine(chart, guideLine) {
  const { top = true, text = {}, status, axis, value, start, end } = guideLine;
  const {
    title, position: titlePosition, align: titleAlign, rotate: titleRotate, offsetX, offsetY, style = {},
  } = typeof text === 'object' ? text : { title: text };
  const color = getStatusColor(status);

  const guideConfig = {
    top,
    lineStyle: {
      stroke: color,
    },
    text: {
      content: title || '',
      position: titlePosition || 'start',
      autoRotate: titleRotate || false,
      style: {
        fill: color,
        textAlign: titleAlign || ((titlePosition || 'start') !== 'start' ? 'start' : 'end'),
        ...style,
      },
      offsetX,
      offsetY,
    },
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
          return { x: -0.5, [axis]: value };
        }
        return { x: 'min', [axis]: value };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        if (xScales.x && xScales.x.isCategory) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return { x: xScales.x.values.length - 0.5, [axis]: value };
        }
        return { x: 'max', [axis]: value };
      };
      guideConfig.text.offsetY = offsetY === 0 ? offsetY : (offsetY || 6);
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

export function drawGuideArea(chart, guideArea) {
  const { top = true, status, axis, value, start, end } = guideArea;
  const color = getStatusColor(status);

  const guideConfig = {
    top,
    style: {
      fill: color,
    },
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
          return { x: -0.5, [axis]: value[0] };
        }
        return { x: 'min', [axis]: value[0] };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        if (xScales.x && xScales.x.isCategory) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return { x: xScales.x.values.length - 0.5, [axis]: value[1] };
        }
        return { x: 'max', [axis]: value[1] };
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

export function drawGuideFilter(chart, guideFilter) {
  const { top = true, status, axis, value, start, end, apply } = guideFilter;
  const color = getStatusColor(status);

  const guideConfig = {
    top,
    color,
    apply,
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
          return { x: -0.5, [axis]: value[0] };
        }
        return { x: 'min', [axis]: value[0] };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales) {
        if (xScales.x && xScales.x.isCategory) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return { x: xScales.x.values.length - 0.5, [axis]: value[1] };
        }
        return { x: 'max', [axis]: value[1] };
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
