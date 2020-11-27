'use strict';

import { Chart, View, Types, G2Dependents, Status } from "./types";
import { getStatusColor, pxToNumber } from './common';
import themes from "../themes";
import { instanceOf } from 'prop-types';

export interface GuideConfig {
  visible?: boolean;
  line?: GuideLineConfig | GuideLineConfig[];
  area?: GuideAreaConfig | GuideAreaConfig[];
  filter?: GuideFilterConfig | GuideFilterConfig[];
}

/**
 * 绘制辅助标记通用函数
 *
 * @param {Chart} chart 图表实例
 * @param {object} config 图表配置项
 *
 * */
export default function (chart: Chart, config: { guide?: GuideConfig }) {
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

interface GuideLineTextConfig extends G2Dependents.LineAnnotationTextCfg {
  title: string,
  align?: 'start' | 'center' | 'end' | 'left' | 'right',
}

export interface GuideLineConfig {
  top?: boolean;
  status?: Status;
  axis?: 'x' | 'y' | 'y0' | 'y1';
  value?: number | string;
  start?: Types.AnnotationPosition;
  end?: Types.AnnotationPosition;
  style?: G2Dependents.ShapeAttrs;
  text?: string | GuideLineTextConfig;
}
export function drawGuideLine(chart: Chart | View, guideLine: GuideLineConfig) {
  const { top = true, text, status, axis, value, start, end, style = {} } = guideLine;
  const {
    title, position: titlePosition, align: titleAlign, style: textStyle = {}, offsetY = pxToNumber(themes['widgets-font-size-1'])/2, ...textConfig
  } = (typeof text === 'string' ? { title: text } : text) as GuideLineTextConfig;
  const color = getStatusColor(status);

  const guideConfig = {
    top,
    style: {
      stroke: color,
      ...style,
    },
    text: {
      content: title || '',
      position: titlePosition || 'start',
      style: {
        fill: color,
        textAlign: titleAlign || ((titlePosition || 'start') !== 'start' ? 'start' : 'end'),
        ...textStyle,
      },
      offsetY,
      ...textConfig,
    },
    // @ts-ignore
    start: undefined,
    // @ts-ignore
    end: undefined,
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
      guideConfig.start = function (xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>) {
        if (!Array.isArray(xScales) && ( xScales.isCategory || (xScales.x && xScales.x.isCategory))) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return { x: -0.5, [axis]: value };
        }
        return { x: 'min', [axis]: value };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>) {
        if (!Array.isArray(xScales)) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          if (xScales.x && xScales.x.isCategory) {
            return { x: xScales.x.values.length - 0.5, [axis]: value };
          }
          if (xScales.isCategory) {
            // @ts-ignore G2 的类型声明和实际传入不同，暂时忽略报错
            return { x: xScales.values.length - 0.5, [axis]: value };
          }
        }
        return { x: 'max', [axis]: value };
      };
      // guideConfig.text.offsetY = offsetY === 0 ? offsetY : (offsetY || 6);
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

export interface GuideAreaConfig {
  top?: boolean;
  status?: Status;
  axis?: 'x' | 'y' | 'y0' | 'y1';
  value?: [number | string, number | string];
  start?: Types.AnnotationPosition;
  end?: Types.AnnotationPosition;
  style?: G2Dependents.ShapeAttrs;
}
export function drawGuideArea(chart: Chart | View, guideArea: GuideAreaConfig) {
  const { top = true, status, axis, value, start, end, style = {} } = guideArea;
  const color = getStatusColor(status);

  const guideConfig = {
    top,
    style: {
      fill: color,
      ...style,
    },
    // @ts-ignore
    start: undefined,
    // @ts-ignore
    end: undefined,
  };

  if (axis && Array.isArray(value) && value.length > 1) {
    if (axis === 'x') {
      // y 轴是分类型数据的情况比较少，暂时不处理
      guideConfig.start = [value[0], 'min'];
      guideConfig.end = [value[1], 'max'];
    } else if (axis === 'y' || /y\d/.test(axis)) {
      // 形似 y0, y1 ...的axis，说明是多Y轴，多轴的情况下，start/end 必须返回原始数据格式才能正确匹配y轴度量
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.start = function (xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>) {
        if (!Array.isArray(xScales) && ( xScales.isCategory || (xScales.x && xScales.x.isCategory))) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return { x: -0.5, [axis]: value[0] };
        }
        return { x: 'min', [axis]: value[0] };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>) {
        if (!Array.isArray(xScales)) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          if (xScales.x && xScales.x.isCategory) {
            return { x: xScales.x.values.length - 0.5, [axis]: value[1] };
          }
          if (xScales.isCategory) {
            // @ts-ignore G2 的类型声明和实际传入不同，暂时忽略报错
            return { x: xScales.values.length - 0.5, [axis]: value[1] };
          }
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
    chart.annotation().region(guideConfig);
  } else {
    console.warn('guide area 定义不全');
  }
}

export interface GuideFilterConfig {
  top?: boolean;
  status?: Status;
  axis?: 'x' | 'y' | 'y0' | 'y1';
  value?: [number | string, number | string];
  start?: Types.AnnotationPosition;
  end?: Types.AnnotationPosition;
  apply?: string[];
  style?: G2Dependents.ShapeAttrs;
}
export function drawGuideFilter(chart: Chart | View, guideFilter: GuideFilterConfig) {
  const { top = true, status, axis, value, start, end, apply, style } = guideFilter;
  const color = getStatusColor(status);

  const guideConfig = {
    top,
    color,
    apply,
    style,
    // @ts-ignore
    start: undefined,
    // @ts-ignore
    end: undefined,
  };

  if (axis && Array.isArray(value) && value.length > 1) {
    if (axis === 'x') {
      // y 轴是分类型数据的情况比较少，暂时不处理
      guideConfig.start = [value[0], 'min'];
      guideConfig.end = [value[1], 'max'];
    } else if (axis === 'y' || /y\d/.test(axis)) {
      // 形似 y0, y1 ...的axis，说明是多Y轴，多轴的情况下，start/end 必须返回原始数据格式才能正确匹配y轴度量
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.start = function (xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>) {
        if (!Array.isArray(xScales) && ( xScales.isCategory || (xScales.x && xScales.x.isCategory))) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return { x: -0.5, [axis]: value[0] };
        }
        return { x: 'min', [axis]: value[0] };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>) {
        if (!Array.isArray(xScales)) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          if (xScales.x && xScales.x.isCategory) {
            return { x: xScales.x.values.length - 0.5, [axis]: value[1] };
          }
          if (xScales.isCategory) {
            // @ts-ignore G2 的类型声明和实际传入不同，暂时忽略报错
            return { x: xScales.values.length - 0.5, [axis]: value[1] };
          }
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
    chart.annotation().regionFilter(guideConfig);
  } else {
    console.warn('guide area 定义不全');
  }
}
