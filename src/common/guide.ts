'use strict';

import { Chart, View, Types, G2Dependents, Status } from './types';
import { getStatusColor, pxToNumber } from './common';
import themes from '../themes';
import { warn } from './log';

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
        drawGuideLine(chart, line, config);
      });
    } else {
      drawGuideLine(chart, guideLine, config);
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
        drawGuideFilter(chart, filter, config);
      });
    } else {
      drawGuideFilter(chart, guideFilter, config);
    }
  }

  if (!guideLine && !guideArea && !guideFilter && Object.keys(other).length > 0) {
    warn('config.guide', '配置异常，请使用 guide.line、guide.area、guide.filter');
  }
}

// 计算 scale 排除 range 后的最大最小值
function getMinValue(scale: G2Dependents.Scale) {
  return scale.min - scale.range[0] * (scale.max - scale.min) / (scale.range[1] - scale.range[0]);
}
function getMaxValue(scale: G2Dependents.Scale) {
  return scale.min + (1 - scale.range[0]) * (scale.max - scale.min) / (scale.range[1] - scale.range[0]);
}

interface GuideLineTextConfig extends Omit<G2Dependents.LineAnnotationTextCfg, 'content'> {
  title: string | number;
  align?: 'start' | 'center' | 'end' | 'left' | 'right';
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
export function drawGuideLine(chart: Chart | View, guideLine: GuideLineConfig, config?: any) {
  const { top = true, text, status, axis, value, start, end, style = {} } = guideLine;
  const rawText = text || '';
  const {
    title,
    position: titlePosition,
    align: titleAlign,
    style: textStyle = {},
    offsetY,
    offsetX,
    ...textConfig
  } = (typeof rawText === 'string' ? { title: rawText } : rawText) as GuideLineTextConfig;
  const color = getStatusColor(status);

  // 更新处理文本位置
  let defaultOffsetY = pxToNumber(themes['widgets-font-size-1']);
  let defaultOffsetX = 0;

  console.log(offsetY)
  warn('config.guide', '辅助线暂时不支持柱图镜面和横向的时候开启渐变');
  if (offsetY !== undefined) {
    defaultOffsetY = offsetY;
    // 不是镜面和横向的时候
  } else if (!config?.facet || config?.column !== false) {
    if (axis === 'y') {
      defaultOffsetY = -(pxToNumber(themes['widgets-font-size-1']) / 2);
    }
  }

  if (offsetX !== undefined) {
    defaultOffsetX = offsetX;
  }

  const guideConfig = {
    top,
    style: {
      stroke: color,
      // 默认为虚线
      lineDash: [4, 4],
      ...style,
    },
    text: {
      content: title || '',
      position: titlePosition || 'start',
      style: {
        fill: color,
        textAlign: titleAlign || ((titlePosition || 'start') === 'start' ? 'start' : 'end'),
        ...textStyle,
      },
      // X 轴时关闭自动旋转
      autoRotate: axis !== 'x',
      offsetY: defaultOffsetY,
      offsetX: defaultOffsetX,
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
      guideConfig.text.offsetY = offsetY || 0;
    } else if (axis === 'y' || /y\d/.test(axis)) {
      // 形似 y0, y1 ...的axis，说明是多Y轴，多轴的情况下，start/end 必须返回原始数据格式才能正确匹配y轴度量
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.start = function (
        xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>,
      ) {
        if (!Array.isArray(xScales) && (xScales.isCategory || (xScales.x && xScales.x.isCategory))) {
          // @ts-ignore 如果x轴是分类型数据，计算 range 外的最小值以铺满绘图区域
          return { x: getMinValue(xScales.x || xScales), [axis]: value };
        }
        console.log(1111, axis, value)
        return { x: 'min', [axis]: value };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (
        xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>,
      ) {
        if (!Array.isArray(xScales)) {
          // 如果x轴是分类型数据，计算 range 外的最大值以铺满绘图区域
          if (xScales.x && xScales.x.isCategory) {
            return { x: getMaxValue(xScales.x), [axis]: value };
          }
          if (xScales.isCategory) {
            // @ts-ignore G2 的类型声明和实际传入不同，暂时忽略报错
            return { x: getMaxValue(xScales), [axis]: value };
          }
        }
        return { x: 'max', [axis]: value };
      };
    }
  }
  if (start) {
    guideConfig.start = start;
  }
  if (end) {
    guideConfig.end = end;
  }

  // 横向柱图，修改默认值
  if (config?.column == false) {
    if (axis === 'x') {
      guideConfig.text.offsetY = offsetY || -(pxToNumber(themes['widgets-font-size-1']) / 2);
      guideConfig.text.style.textAlign = titleAlign || 'end';
    } else {
      guideConfig.text.autoRotate = false;
      guideConfig.text.position = titlePosition || 'end';
      guideConfig.text.offsetY = offsetY || -(pxToNumber(themes['widgets-font-size-1']) / 2);
      guideConfig.text.style.textAlign = titleAlign || 'center';
    }
  }

  if (guideConfig.start && guideConfig.end) {
    chart.annotation().line(guideConfig);
  } else {
    warn('config.guide', 'line 定义不全');
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
      guideConfig.start = function (
        xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>,
      ) {
        if (!Array.isArray(xScales) && (xScales.isCategory || (xScales.x && xScales.x.isCategory))) {
          // @ts-ignore 如果x轴是分类型数据，计算 range 外的最小值以铺满绘图区域
          return { x: getMinValue(xScales.x || xScales), [axis]: value[0] };
        }
        return { x: 'min', [axis]: value[0] };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (
        xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>,
      ) {
        if (!Array.isArray(xScales)) {
          // 如果x轴是分类型数据，计算 range 外的最大值以铺满绘图区域
          if (xScales.x && xScales.x.isCategory) {
            return { x: getMaxValue(xScales.x), [axis]: value[1] };
          }
          if (xScales.isCategory) {
            // @ts-ignore G2 的类型声明和实际传入不同，暂时忽略报错
            return { x: getMaxValue(xScales), [axis]: value[1] };
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
    warn('config.guide', 'area 定义不全');
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
  useGradient?: boolean;
}
export function drawGuideFilter(chart: Chart | View, guideFilter: GuideFilterConfig, config?: any) {
  const {
    top = true,
    status,
    axis,
    value,
    start,
    end,
    apply,
    style,
    useGradient = false,
  } = guideFilter;
  const color = getStatusColor(status);

  let guideColor = color;

  // 如果镜面或横向不处理
  if (!!config?.facet || config?.column === false) {
    guideColor = color;
  } else if (axis === 'y' && useGradient) {
    // TODO 考虑方向
    guideColor = `l(90) 0:${color} 1:${color}00`;
  }

  const guideConfig = {
    top,
    color: guideColor,
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
      guideConfig.start = function (
        xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>,
      ) {
        if (
          !Array.isArray(xScales) &&
          (xScales.isCategory || (xScales.x && xScales.x.isCategory))
        ) {
          // 如果x轴是分类型数据，使用[-0.5, length - 0.5]的索引值来让辅助线铺满绘图区域
          return { x: -0.5, [axis]: value[0] };
        }
        return { x: 'min', [axis]: value[0] };
      };
      // 函数接受两个参数 xScales 和 yScales
      guideConfig.end = function (
        xScales: G2Dependents.Scale[] | Record<string, G2Dependents.Scale>,
      ) {
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
    warn('config.guide', 'filter 定义不全');
  }
}
